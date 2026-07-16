import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/password'
import { logActivity } from '@/lib/activity'

const bodySchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(10, 'New password must be at least 10 characters.'),
})

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    )
  }
  const { currentPassword, newPassword } = parsed.data

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user || !user.isActive) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  // Only require + verify the current password once the forced first-login
  // change is already done — the forced flow trusts the just-established session.
  if (!user.mustChangePassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 })
    }
    const valid = await verifyPassword(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }
  }

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, mustChangePassword: false },
  })

  await logActivity(user.id, 'PASSWORD_CHANGED')

  return NextResponse.json({ ok: true })
}
