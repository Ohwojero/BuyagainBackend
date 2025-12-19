import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:121212@localhost:5432/devdb',
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
})
