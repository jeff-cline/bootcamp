import { prisma } from '@/lib/db'
import { ROLES, TIER_LABEL, isRole } from '@/lib/roles'
import ActivityFeed from './ActivityFeed'

export default async function AdminHomePage() {
  const [totalUsers, activeUsers, roleCounts, initialActivity, allUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.user.findMany({
      select: { id: true, email: true },
      orderBy: { email: 'asc' },
    }),
  ])

  const countByRole = Object.fromEntries(ROLES.map((r) => [r, 0])) as Record<string, number>
  for (const row of roleCounts) {
    if (isRole(row.role)) countByRole[row.role] = row._count.role
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">Admin dashboard</h1>
        <p className="text-gray-600 mt-1">Roster health and recent activity across the platform.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <KpiTile label="Total users" value={totalUsers} />
        <KpiTile label="Active" value={activeUsers} />
        {ROLES.map((r) => (
          <KpiTile key={r} label={TIER_LABEL[r]} value={countByRole[r] ?? 0} />
        ))}
      </div>

      <ActivityFeed initialActivity={initialActivity} users={allUsers} />
    </div>
  )
}

function KpiTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
    </div>
  )
}
