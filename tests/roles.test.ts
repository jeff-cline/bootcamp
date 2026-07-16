import { describe, it, expect } from 'vitest'
import { isAdminRole, isGod, isRole, ROLES, TIER_LABEL } from '@/lib/roles'

describe('roles', () => {
  it('admin roles', () => {
    expect(isAdminRole('GOD')).toBe(true)
    expect(isAdminRole('ADMIN')).toBe(true)
    expect(isAdminRole('PREMIUM')).toBe(false)
  })

  it('god', () => {
    expect(isGod('GOD')).toBe(true)
    expect(isGod('ADMIN')).toBe(false)
  })

  it('validates role strings', () => {
    expect(isRole('PREMIUM')).toBe(true)
    expect(isRole('NOT_A_ROLE')).toBe(false)
  })

  it('has a label for every role', () => {
    for (const r of ROLES) {
      expect(TIER_LABEL[r]).toBeTruthy()
    }
  })
})
