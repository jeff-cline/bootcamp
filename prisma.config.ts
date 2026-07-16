import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Prisma 7 moved the datasource connection URL out of schema.prisma and into
// this config file (used by the CLI for migrate/studio/etc). The runtime
// PrismaClient gets its own connection via a driver adapter — see src/lib/db.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
