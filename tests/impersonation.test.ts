import { describe, it, expect } from 'vitest'
import { effectiveRole } from '@/lib/impersonation'
import type { Session } from 'next-auth'

function makeSession(overrides: Partial<Session>): Session {
  return {
    userId: 'god-1',
    role: 'GOD',
    mustChangePassword: false,
    impersonating: null,
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    ...overrides,
  } as Session
}

describe('effectiveRole', () => {
  it('returns the impersonated role when impersonating is set', () => {
    const session = makeSession({
      role: 'GOD',
      impersonating: { userId: 'u-1', email: 'exec@example.com', role: 'PREMIUM' },
    })
    expect(effectiveRole(session)).toBe('PREMIUM')
  })

  it('returns the real role when not impersonating', () => {
    const session = makeSession({ role: 'GOD', impersonating: null })
    expect(effectiveRole(session)).toBe('GOD')
  })

  it('returns null for a missing session', () => {
    expect(effectiveRole(null)).toBe(null)
    expect(effectiveRole(undefined)).toBe(null)
  })

  it('falls back to the real role for a non-GOD session with no impersonation', () => {
    const session = makeSession({ role: 'EXECUTIVE', impersonating: null })
    expect(effectiveRole(session)).toBe('EXECUTIVE')
  })
})
