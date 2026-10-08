import { Prisma, PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export function usePrisma (): PrismaClient {
  if (!prisma) {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database is not configured: set DATABASE_URL and DIRECT_URL in .env (Supabase Dashboard → Connect → ORMs → Prisma)'
      })
    }
    prisma = new PrismaClient()
  }
  return prisma
}

// Turns "can't reach the database" into a clean 503 with a one-line log
// instead of a full stack trace on every request. Other errors are rethrown.
export function handleDbError (err: unknown): never {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error(`[db] Database unreachable: ${err.message.trim().split('\n').pop()}`)
    throw createError({ statusCode: 503, statusMessage: 'Database unavailable' })
  }
  throw err
}
