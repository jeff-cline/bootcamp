import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { isRole } from '@/lib/roles'
import UsersTable from './UsersTable'

export default async function AdminUsersPage() {
  // Layout already guards GOD/ADMIN-only + redirects unauthenticated users;
  // session is guaranteed here.
  const session = await getSession()

  const rawUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      mustChangePassword: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  // `role` is a validated-string column (see prisma/schema.prisma), not a
  // real Prisma enum — narrow it to the app's Role union for the client.
  const users = rawUsers.map((u) => ({
    ...u,
    role: isRole(u.role) ? u.role : ('EXECUTIVE' as const),
  }))

  const currentUserRole = isRole(session!.role) ? session!.role : 'EXECUTIVE'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">User management</h1>
        <p className="text-gray-600 mt-1">Create accounts, change roles, and view as another tier.</p>
      </div>
      <UsersTable
        initialUsers={users}
        currentUserId={session!.userId}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
