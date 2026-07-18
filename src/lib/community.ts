import { Pool } from 'pg'
import { randomUUID } from 'crypto'
import { computeBadges, type Badge } from '@/lib/badges'

// The Beyond Limits Community tab IS HYghLights — same shared account, same
// social data. This reads/writes HYghLights' own Postgres database directly
// (both apps live on the same server), so a highlight posted or a high-five
// given here shows up in HYghLights instantly, and vice-versa.
const g = globalThis as unknown as { hyghlightsPool?: Pool }
const pool =
  g.hyghlightsPool ?? new Pool({ connectionString: process.env.HYGHLIGHTS_DATABASE_URL, max: 3 })
if (process.env.NODE_ENV !== 'production') g.hyghlightsPool = pool

const REACTION_TYPES = ['HIGHFIVE', 'BALLOON', 'DANCEPARTY'] as const
type ReactionType = (typeof REACTION_TYPES)[number]

export type FeedItem = {
  id: string
  author: string
  isMine: boolean
  category: string
  text: string
  createdAt: string
  counts: Record<string, number>
  mine: string[]
}

function dayStart(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}
function daysBetween(a: Date, b: Date): number {
  return Math.round((dayStart(b).getTime() - dayStart(a).getTime()) / 86_400_000)
}

async function getFeed(userId: string, limit = 50): Promise<FeedItem[]> {
  const hs = (
    await pool.query(
      `SELECT h.id, h."userId", h.email, h.category, h.text, h."createdAt",
              COALESCE(p."displayName", split_part(h.email, '@', 1)) AS author
       FROM "Highlight" h
       LEFT JOIN "Profile" p ON p."userId" = h."userId"
       ORDER BY h."createdAt" DESC LIMIT $1`,
      [limit],
    )
  ).rows
  const ids = hs.map((h) => h.id)
  const rs = ids.length
    ? (await pool.query(`SELECT "highlightId", type, "fromUserId" FROM "Reaction" WHERE "highlightId" = ANY($1)`, [ids])).rows
    : []
  const byH: Record<string, Array<{ type: string; fromUserId: string }>> = {}
  for (const r of rs) (byH[r.highlightId] ??= []).push(r)

  return hs.map((h) => {
    const counts: Record<string, number> = { HIGHFIVE: 0, BALLOON: 0, DANCEPARTY: 0 }
    const mine: string[] = []
    for (const r of byH[h.id] ?? []) {
      if (counts[r.type] === undefined) continue
      counts[r.type]++
      if (r.fromUserId === userId) mine.push(r.type)
    }
    return {
      id: h.id,
      author: h.author,
      isMine: h.userId === userId,
      category: h.category,
      text: h.text,
      createdAt: new Date(h.createdAt).toISOString(),
      counts,
      mine,
    }
  })
}

export async function getCommunity(userId: string): Promise<{
  streak: number
  longest: number
  total: number
  badges: Badge[]
  feed: FeedItem[]
}> {
  const prof = (await pool.query(`SELECT "currentStreak", "longestStreak" FROM "Profile" WHERE "userId" = $1`, [userId])).rows[0]
  const total = Number((await pool.query(`SELECT count(*) c FROM "Highlight" WHERE "userId" = $1`, [userId])).rows[0].c)
  const distinct = Number((await pool.query(`SELECT count(DISTINCT category) c FROM "Highlight" WHERE "userId" = $1`, [userId])).rows[0].c)
  const streak = prof?.currentStreak ?? 0
  const longest = prof?.longestStreak ?? 0
  const badges = computeBadges({ currentStreak: streak, longestStreak: longest, total, distinctCategories: distinct })
  const feed = await getFeed(userId)
  return { streak, longest, total, badges, feed }
}

export async function postHighlight(userId: string, email: string, category: string, text: string) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    let prof = (await client.query(`SELECT "currentStreak", "longestStreak", "lastEntryDate" FROM "Profile" WHERE "userId" = $1 FOR UPDATE`, [userId])).rows[0]
    if (!prof) {
      await client.query(`INSERT INTO "Profile" (id, "userId", email) VALUES ($1, $2, $3)`, [`blc_${randomUUID()}`, userId, email])
      prof = { currentStreak: 0, longestStreak: 0, lastEntryDate: null }
    }
    const today = dayStart()
    let current = prof.currentStreak
    if (!prof.lastEntryDate) current = 1
    else {
      const gap = daysBetween(new Date(prof.lastEntryDate), today)
      if (gap === 0) current = Math.max(current, 1)
      else if (gap === 1) current = current + 1
      else current = 1
    }
    const longest = Math.max(prof.longestStreak, current)
    await client.query(
      `INSERT INTO "Highlight" (id, "userId", email, "entryDate", category, text, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, now())`,
      [`blh_${randomUUID()}`, userId, email, today, category, text],
    )
    await client.query(`UPDATE "Profile" SET "currentStreak" = $1, "longestStreak" = $2, "lastEntryDate" = $3, "updatedAt" = now() WHERE "userId" = $4`, [current, longest, today, userId])
    await client.query('COMMIT')
    return { currentStreak: current }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function toggleReaction(userId: string, email: string, highlightId: string, type: string) {
  if (!(REACTION_TYPES as readonly string[]).includes(type)) throw new Error('bad reaction')
  const ex = (await pool.query(`SELECT id FROM "Reaction" WHERE "highlightId" = $1 AND "fromUserId" = $2 AND type = $3`, [highlightId, userId, type])).rows[0]
  if (ex) {
    await pool.query(`DELETE FROM "Reaction" WHERE id = $1`, [ex.id])
    return { on: false }
  }
  await pool.query(`INSERT INTO "Reaction" (id, "highlightId", "fromUserId", "fromEmail", type, "createdAt") VALUES ($1, $2, $3, $4, $5, now())`, [`blr_${randomUUID()}`, highlightId, userId, email, type as ReactionType])
  return { on: true }
}
