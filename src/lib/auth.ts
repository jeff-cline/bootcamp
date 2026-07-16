import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { logActivity } from '@/lib/activity'
import { isRole, type Role } from '@/lib/roles'

type AppUser = NextAuthUser & {
  role: Role
  mustChangePassword: boolean
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email).toLowerCase().trim()
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.isActive) return null
        if (!isRole(user.role)) return null

        const valid = await verifyPassword(String(credentials.password), user.passwordHash)
        if (!valid) return null

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        await logActivity(user.id, 'LOGIN')

        const appUser: AppUser = {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        }
        return appUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const appUser = user as AppUser
        token.userId = appUser.id as string
        token.role = appUser.role
        token.mustChangePassword = appUser.mustChangePassword
        if (token.impersonating === undefined) token.impersonating = null
      }

      // Triggered via useSession().update() — e.g. right after the forced
      // change-password flow clears mustChangePassword in the DB, so the
      // JWT (which otherwise only refreshes on next login) reflects it too.
      if (trigger === 'update' && token.userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.userId } })
        if (dbUser && isRole(dbUser.role)) {
          token.role = dbUser.role
          token.mustChangePassword = dbUser.mustChangePassword
        }

        // Impersonation ("view as"): the client calls useSession().update()
        // with { impersonating: {...} | null } after POST/DELETE
        // /api/admin/impersonate to stamp or clear the "view as" state on
        // this GOD's own JWT. It's never a real login as the target user.
        if (session && typeof session === 'object' && 'impersonating' in session) {
          const data = session as { impersonating: JWT['impersonating'] }
          token.impersonating = data.impersonating ?? null
        }
      }

      return token
    },
    async session({ session, token }) {
      session.userId = token.userId
      session.role = token.role
      session.mustChangePassword = token.mustChangePassword
      session.impersonating = token.impersonating ?? null
      return session
    },
  },
}
