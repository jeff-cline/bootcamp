import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Role } from '@/lib/roles'

export const getSession = () => getServerSession(authOptions)

// Server-side guard for API routes: resolves the session and checks the
// REAL role (never the impersonated one — impersonation is for viewing the
// product as another tier, it must never grant elevated access). Returns
// the session on success, or null if unauthenticated/unauthorized so the
// caller can respond with 401/403.
export async function requireRole(roles: Role[]): Promise<Session | null> {
  const session = await getSession()
  if (!session?.userId) return null
  if (!roles.includes(session.role)) return null
  return session
}
