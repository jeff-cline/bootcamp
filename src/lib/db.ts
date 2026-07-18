import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Prisma 7: the runtime client connects via an explicit driver adapter.
// This app runs on the shared Neon Postgres database but is ISOLATED to the
// `beyondlimits` schema — the adapter's `schema` option qualifies every
// generated query with it, so bootcamp can never read or write another
// project's tables in `public`.
//
// DATABASE_URL is Neon's POOLED (pgbouncer) connection string — correct for
// serverless. Migrations use the DIRECT connection instead (see prisma.config.ts).
const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg({ connectionString: url }, { schema: 'beyondlimits' })

const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = g.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
