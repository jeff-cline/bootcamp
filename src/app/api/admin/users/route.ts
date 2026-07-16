import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'
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

// List + create users. GOD and ADMIN can both manage the roster, but only
// GOD may create a GOD or ADMIN account — ADMINs can't mint their own peers
// or promote themselves to GOD.
export async function GET() {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: USER_SELECT,
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ users })
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).optional(),
  role: z.enum(ROLES as [string, ...string[]]),
  tempPassword: z.string().min(8, 'Temp password must be at least 8 characters.'),
})

export async function POST(req: Request) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const json = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    )
  }
  const { email, name, role, tempPassword } = parsed.data

  if ((role === 'GOD' || role === 'ADMIN') && !isGod(session.role)) {
    return NextResponse.json(
      { error: 'Only a GOD account can create GOD or ADMIN users.' },
      { status: 403 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    return NextResponse.json({ error: 'A user with that email already exists.' }, { status: 409 })
  }

  const passwordHash = await hashPassword(tempPassword)
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      role,
      passwordHash,
      mustChangePassword: true,
    },
    select: USER_SELECT,
  })

  await logActivity(session.userId, 'USER_CREATED', `${user.email} (${user.role})`)

  return NextResponse.json({ user }, { status: 201 })
}
