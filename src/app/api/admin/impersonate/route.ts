import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole, getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity'
import { isRole } from '@/lib/roles'

const bodySchema = z.object({ userId: z.string().min(1) })

// Impersonation is GOD-only, and it's never a real login as the target —
// it just stamps { userId, email, role } onto the acting GOD's own JWT
// (via the client's useSession().update() call after this responds) so the
// rest of the app can render as that tier through effectiveRole().
export async function POST(req: Request) {
  const session = await requireRole(['GOD'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const json = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'A userId is required.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id: parsed.data.userId } })
  if (!target || !target.isActive || !isRole(target.role)) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  if (target.id === session.userId) {
    return NextResponse.json({ error: 'You cannot impersonate yourself.' }, { status: 400 })
  }

  await logActivity(session.userId, 'IMPERSONATE_START', target.email)

  return NextResponse.json({
    impersonating: { userId: target.id, email: target.email, role: target.role },
  })
}

export async function DELETE() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  if (session.impersonating) {
    await logActivity(session.userId, 'IMPERSONATE_STOP', session.impersonating.email)
  }

  return NextResponse.json({ impersonating: null })
}
