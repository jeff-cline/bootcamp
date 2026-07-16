import type { Session } from 'next-auth'
import type { Role } from '@/lib/roles'

// The role a session should be treated as for gating/UI purposes: the
// impersonated role when a GOD is "viewing as" another user, else the
// session's real role. Never mutates the underlying real role — GOD-only
// actions (like the admin user management API) must keep checking
// `session.role`, not this.
export function effectiveRole(session: Session | null | undefined): Role | null {
  if (!session) return null
  if (session.impersonating) return session.impersonating.role
  return session.role
}
