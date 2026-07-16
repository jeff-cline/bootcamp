import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// Prisma 7: the runtime client no longer reads the datasource URL from
// schema.prisma — it connects via an explicit driver adapter. SQLite here
// is a TEMP local dev database; swap this file's adapter (and the
// datasource provider in prisma/schema.prisma) when moving to Postgres.
const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaBetterSqlite3({ url })

const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = g.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
