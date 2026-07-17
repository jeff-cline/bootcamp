'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ROLES, TIER_LABEL, isGod, type Role } from '@/lib/roles'

type AdminUser = {
  id: string
  email: string
  name: string | null
  role: Role
  isActive: boolean
  mustChangePassword: boolean
  createdAt: string | Date
  lastLoginAt: string | Date | null
}

function fmt(d: string | Date | null) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function UsersTable({
  initialUsers,
  currentUserId,
  currentUserRole,
}: {
  initialUsers: AdminUser[]
  currentUserId: string
  currentUserRole: Role
}) {
  const { update } = useSession()
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const isActorGod = isGod(currentUserRole)

  function canEdit(target: AdminUser) {
    if (isActorGod) return true
    return target.role !== 'GOD' && target.role !== 'ADMIN'
  }

  async function refresh() {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const body = await res.json()
      setUsers(body.users)
    }
  }

  async function handleRoleChange(user: AdminUser, role: Role) {
    setError(null)
    setBusyId(user.id)
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Could not update role.')
    } else {
      await refresh()
    }
    setBusyId(null)
  }

  async function handleToggleActive(user: AdminUser) {
    setError(null)
    setBusyId(user.id)
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: user.isActive ? 'DELETE' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: user.isActive ? undefined : JSON.stringify({ isActive: true }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Could not update status.')
    } else {
      await refresh()
    }
    setBusyId(null)
  }

  async function handleViewAs(user: AdminUser) {
    setError(null)
    setBusyId(user.id)
    const res = await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(body.error ?? 'Could not start impersonation.')
      setBusyId(null)
      return
    }
    await update({ impersonating: body.impersonating })
    // Hard navigation — see ImpersonationBanner / change-password fix notes:
    // router.push() doesn't reliably re-run gated server components right
    // after a useSession().update() in this app.
    window.location.assign('/dashboard')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{users.length} users</p>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-5 py-2.5 rounded-full shadow hover:scale-[1.02] transition-transform text-sm"
        >
          + Create user
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-bold">Email</th>
                <th className="text-left px-5 py-3 font-bold">Name</th>
                <th className="text-left px-5 py-3 font-bold">Role</th>
                <th className="text-left px-5 py-3 font-bold">Status</th>
                <th className="text-left px-5 py-3 font-bold">Last login</th>
                <th className="text-right px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const editable = canEdit(user)
                const isSelf = user.id === currentUserId
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-[#F4F1EC]/60 transition-colors ${!user.isActive ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {user.email}
                      {user.mustChangePassword && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-[#0D9488] bg-[#34c5c5]/15 rounded-full px-2 py-0.5">
                          force-change
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{user.name ?? '—'}</td>
                    <td className="px-5 py-3">
                      <select
                        value={user.role}
                        disabled={!editable || busyId === user.id}
                        onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                        className="rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {TIER_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{fmt(user.lastLoginAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={!editable || busyId === user.id || isSelf}
                          onClick={() => handleViewAs(user)}
                          className="text-xs font-bold text-[#0D9488] hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                          View as
                        </button>
                        <button
                          type="button"
                          disabled={!editable || busyId === user.id || isSelf}
                          onClick={() => handleToggleActive(user)}
                          className="text-xs font-bold text-gray-500 hover:text-red-600 disabled:opacity-40"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateUserModal
          canCreateElevated={isActorGod}
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false)
            await refresh()
          }}
        />
      )}
    </div>
  )
}

function CreateUserModal({
  canCreateElevated,
  onClose,
  onCreated,
}: {
  canCreateElevated: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('EXECUTIVE')
  const [tempPassword, setTempPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const availableRoles = ROLES.filter((r) => canCreateElevated || (r !== 'GOD' && r !== 'ADMIN'))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: name || undefined, role, tempPassword }),
    })
    const body = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) {
      setError(body.error ?? 'Could not create user.')
      return
    }
    onCreated()
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-full max-w-md">
        <h2 className="text-xl font-black text-gray-800 mb-1">Create user</h2>
        <p className="text-sm text-gray-500 mb-6">They&apos;ll be forced to change this temp password on first login.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {TIER_LABEL[r]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Temp password</label>
            <input
              type="text"
              required
              minLength={8}
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-gray-500 px-4 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A849] to-[#e07800] text-white font-bold px-6 py-2.5 rounded-full shadow disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
