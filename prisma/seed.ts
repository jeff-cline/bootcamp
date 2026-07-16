import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

const GOD_EMAILS = ['jeff.cline@me.com', 'krystalore@thecrewscoach.com']

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
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
