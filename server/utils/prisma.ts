import { PrismaClient } from '@prisma/client'

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
