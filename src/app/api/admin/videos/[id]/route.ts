import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity'
import { parseYouTubeId } from '@/lib/youtube'

const patchSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  youtubeUrl: z.string().trim().min(1).optional(),
  isLive: z.boolean().optional(),
})

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.video.findUnique({ where: { id } })
  if (!target) {
    return NextResponse.json({ error: 'Video not found.' }, { status: 404 })
  }

  const json = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    )
  }
  const { title, description, youtubeUrl, isLive } = parsed.data

  let youtubeId: string | undefined
  if (youtubeUrl !== undefined) {
    const parsedId = parseYouTubeId(youtubeUrl)
    if (!parsedId) {
      return NextResponse.json(
        { error: 'Could not parse a YouTube video id from that URL.' },
        { status: 400 }
      )
    }
    youtubeId = parsedId
  }

  const data = {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(youtubeId !== undefined ? { youtubeId } : {}),
    ...(isLive !== undefined ? { isLive } : {}),
  }

  // Only one video may be live at a time: setting this one live unsets
  // every other live video in the same transaction.
  const video = await prisma.$transaction(async (tx) => {
    if (isLive === true) {
      await tx.video.updateMany({
        where: { isLive: true, id: { not: id } },
        data: { isLive: false },
      })
    }
    return tx.video.update({ where: { id }, data })
  })

  const changes: string[] = []
  if (title !== undefined) changes.push('title')
  if (description !== undefined) changes.push('description')
  if (youtubeId !== undefined) changes.push(`youtubeId→${youtubeId}`)
  if (isLive !== undefined) changes.push(`isLive→${isLive}`)
  await logActivity(session.userId, 'VIDEO_UPDATED', `${video.title}: ${changes.join(', ')}`)

  return NextResponse.json({ video })
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireRole(['GOD', 'ADMIN'])
  if (!session) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.video.findUnique({ where: { id } })
  if (!target) {
    return NextResponse.json({ error: 'Video not found.' }, { status: 404 })
  }

  await prisma.video.delete({ where: { id } })

  await logActivity(session.userId, 'VIDEO_DELETED', target.title)

  return NextResponse.json({ ok: true })
}
