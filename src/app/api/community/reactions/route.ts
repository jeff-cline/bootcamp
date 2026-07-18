import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { toggleReaction } from '@/lib/community'

const schema = z.object({
  highlightId: z.string().min(1),
  type: z.enum(['HIGHFIVE', 'BALLOON', 'DANCEPARTY']),
})

export async function POST(req: Request) {
  const session = await getSession()
  const email = session?.user?.email
  if (!session?.userId || !email) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid reaction.' }, { status: 400 })

  const result = await toggleReaction(session.userId, email, parsed.data.highlightId, parsed.data.type)
  return NextResponse.json(result)
}
