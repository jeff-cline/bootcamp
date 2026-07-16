import type { Role } from '@/lib/roles'

export type Impersonating = { userId: string; email: string; role: Role } | null

declare module 'next-auth' {
  interface Session {
    userId: string
    role: Role
    mustChangePassword: boolean
    impersonating: Impersonating
  }

  interface User {
    role: Role
    mustChangePassword: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: Role
    mustChangePassword: boolean
    impersonating: Impersonating
  }
}
