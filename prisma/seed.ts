import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

const GOD_EMAILS = ['jeff.cline@me.com', 'krystalore@thecrewscoach.com']

// Well-known PUBLIC YouTube ids so the vault isn't empty for a demo.
const SAMPLE_VIDEOS = [
  {
    title: 'Beyond Limits — Live Now: Just Do It',
    description: 'Tune in live for a shot of pure motivation before today’s session.',
    youtubeId: 'ZXsQAXx_ao0', // Shia LaBeouf "Just Do It" motivational speech
    isLive: true,
  },
  {
    title: '30-Minute Full Body HIIT (No Equipment)',
    description: 'Follow along at your own pace — full-body conditioning, all levels welcome.',
    youtubeId: 'ml6cT4AZdqI', // "30-Minute HIIT Cardio Workout" — SELF
    isLive: false,
  },
  {
    title: 'Mindset Monday: Why Do We Fall',
    description: 'A short mindset video on getting back up when training gets hard.',
    youtubeId: 'mgmVOuLgFB0', // "Why Do We Fall" — Mateusz M
    isLive: false,
  },
]

async function main() {
  const temp = process.env.SEED_TEMP_PASSWORD
  if (!temp) throw new Error('SEED_TEMP_PASSWORD not set')

  const hash = await hashPassword(temp)

  for (const email of GOD_EMAILS) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        role: 'GOD',
        passwordHash: hash,
        mustChangePassword: true,
        name: email.split('@')[0],
      },
    })
  }

  console.log(`Seeded ${GOD_EMAILS.length} GOD accounts (must change password on first login)`)

  for (const v of SAMPLE_VIDEOS) {
    const existing = await prisma.video.findFirst({ where: { youtubeId: v.youtubeId } })
    if (existing) {
      await prisma.video.update({ where: { id: existing.id }, data: v })
    } else {
      await prisma.video.create({ data: v })
    }
  }

  console.log(`Seeded ${SAMPLE_VIDEOS.length} sample videos`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
