'use client'

import { useState } from 'react'

type ActivityRow = {
  id: string
  action: string
  detail: string | null
  createdAt: string | Date
  user: { id: string; email: string; name: string | null }
}

type UserOption = { id: string; email: string }

function fmt(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })
}

export default function ActivityFeed({
  initialActivity,
  users,
}: {
  initialActivity: ActivityRow[]
  users: UserOption[]
}) {
  const [activity, setActivity] = useState<ActivityRow[]>(initialActivity)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFilter(nextUserId: string) {
    setUserId(nextUserId)
    setLoading(true)
    const url = nextUserId
      ? `/api/admin/activity?userId=${encodeURIComponent(nextUserId)}`
      : '/api/admin/activity'
    const res = await fetch(url)
    if (res.ok) {
      const body = await res.json()
      setActivity(body.activity)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-gray-800">Activity</h2>
        <select
          value={userId}
          onChange={(e) => handleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#34c5c5] focus:border-transparent"
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-bold">When</th>
                <th className="text-left px-5 py-3 font-bold">User</th>
                <th className="text-left px-5 py-3 font-bold">Action</th>
                <th className="text-left px-5 py-3 font-bold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && activity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                    No activity yet.
                  </td>
                </tr>
              )}
              {!loading &&
                activity.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F4F1EC]/60 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{fmt(row.createdAt)}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {row.user.email}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-[#34c5c5]/15 rounded-full px-2 py-1">
                        {row.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{row.detail ?? '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
