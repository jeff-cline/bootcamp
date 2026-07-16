// The database (SQLite, temp local dev) has no native enum support, so
// `User.role` is a plain validated string column (see prisma/schema.prisma).
// This file is the single source of truth for the Role type + helpers, kept
// portable so a real Postgres enum can be reintroduced later without
// touching app code — do NOT import `Role` from `@prisma/client`.

export type Role = 'GOD' | 'ADMIN' | 'EXECUTIVE' | 'PREMIUM' | 'SECRET' | 'CORPORATE'

export const ROLES: Role[] = ['GOD', 'ADMIN', 'EXECUTIVE', 'PREMIUM', 'SECRET', 'CORPORATE']

export const isRole = (value: string): value is Role => (ROLES as string[]).includes(value)

export const isAdminRole = (r: Role): boolean => r === 'GOD' || r === 'ADMIN'

export const isGod = (r: Role): boolean => r === 'GOD'

export const TIER_LABEL: Record<Role, string> = {
  GOD: 'God',
  ADMIN: 'Admin',
  EXECUTIVE: 'Executive',
  PREMIUM: 'Premium',
  SECRET: 'Secret',
  CORPORATE: 'Corporate',
}
