import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity'
import { ROLES, isGod } from '@/lib/roles'

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  mustChangePassword: true,
  createdAt: true,
  lastLoginAt: true,
} as const

const patchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.enum(ROLES as [string, ...string[]]).optional(),
  isActive: z.boolean().optional(),
})

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const json = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    )
  }
  const { name, role, isActive } = parsed.data

  // Only GOD may touch a GOD/ADMIN account, or promote anyone to GOD/ADMIN.
  const targetIsElevated = target.role === 'GOD' || target.role === 'ADMIN'
  const newRoleIsElevated = role === 'GOD' || role === 'ADMIN'
  if (!isGod(session.role) && (targetIsElevated || newRoleIsElevated)) {
    return NextResponse.json(
      { error: 'Only a GOD account can edit GOD or ADMIN users.' },
      { status: 403 }
    )
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
    select: USER_SELECT,
  })

  const changes: string[] = []
  if (name !== undefined) changes.push('name')
  if (role !== undefined) changes.push(`role→${role}`)
  if (isActive !== undefined) changes.push(`isActive→${isActive}`)
  await logActivity(session.userId, 'USER_UPDATED', `${user.email}: ${changes.join(', ')}`)

  return NextResponse.json({ user })
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const targetIsElevated = target.role === 'GOD' || target.role === 'ADMIN'
  if (!isGod(session.role) && targetIsElevated) {
    return NextResponse.json(
      { error: 'Only a GOD account can deactivate a GOD or ADMIN user.' },
      { status: 403 }
    )
  }

  if (target.id === session.userId) {
    return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: USER_SELECT,
  })

  await logActivity(session.userId, 'USER_DEACTIVATED', user.email)

  return NextResponse.json({ user })
}
