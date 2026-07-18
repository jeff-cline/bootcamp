import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Prisma 7 reads the datasource connection URL for CLI operations
// (migrate / studio / introspect) from here. The runtime PrismaClient gets
// its own connection via the pg driver adapter — see src/lib/db.ts.
//
// Migrations use DIRECT_URL: Neon's NON-POOLED endpoint (pgbouncer can't run
// DDL / advisory locks) with `?schema=beyondlimits`, which scopes every
// migration — and the _prisma_migrations history table — to our isolated
// schema on the shared database. Other apps' tables in `public` are untouched.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
