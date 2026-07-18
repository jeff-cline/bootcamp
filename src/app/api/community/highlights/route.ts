import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { postHighlight } from '@/lib/community'
import { CATEGORIES } from '@/lib/categories'

const KEYS = CATEGORIES.map((c) => c.key) as [string, ...string[]]
const schema = z.object({ category: z.enum(KEYS), text: z.string().min(1).max(4000) })

export async function POST(req: Request) {
  const session = await getSession()
  const email = session?.user?.email
  if (!session?.userId || !email) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Pick a category and write your HYghLight.' }, { status: 400 })

  const result = await postHighlight(session.userId, email, parsed.data.category, parsed.data.text)
  return NextResponse.json(result)
}
