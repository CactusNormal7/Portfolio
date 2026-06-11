import { usePrisma } from '../utils/prisma'
import { requireAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  return usePrisma().message.findMany({ orderBy: { id: 'desc' } })
})
