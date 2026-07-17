import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity'
import { parseYouTubeId } from '@/lib/youtube'

// List + create videos. GOD and ADMIN can both manage the vault.
export async function GET() {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const videos = await prisma.video.findMany({ orderBy: { publishedAt: 'desc' } })

  return NextResponse.json({ videos })
}

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim().min(1).optional(),
  youtubeUrl: z.string().trim().min(1, 'YouTube URL is required.'),
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
  const { title, description, youtubeUrl } = parsed.data

  const youtubeId = parseYouTubeId(youtubeUrl)
  if (!youtubeId) {
    return NextResponse.json({ error: 'Could not parse a YouTube video id from that URL.' }, { status: 400 })
  }

  const video = await prisma.video.create({
    data: {
      title,
      description,
      youtubeId,
      publishedAt: new Date(),
    },
  })

  await logActivity(session.userId, 'VIDEO_CREATED', `${video.title} (${video.youtubeId})`)

  return NextResponse.json({ video }, { status: 201 })
}
