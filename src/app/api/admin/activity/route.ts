import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/db'

const DEFAULT_LIMIT = 100
const MAX_LIMIT = 500

// Recent ActivityLog rows, newest first, joined with the acting user's
// email. Optional ?userId= filters to one user; ?limit= caps the page size
// (default 100, capped at 500).
export async function GET(req: Request) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || undefined
  const limitParam = Number(searchParams.get('limit'))
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(limitParam, MAX_LIMIT)
    : DEFAULT_LIMIT

  const activity = await prisma.activityLog.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  })

  return NextResponse.json({ activity })
}
