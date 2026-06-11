import { usePrisma } from '../utils/prisma'
import { requireAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const project = await usePrisma().project.create({
    data: {
      title: String(body.title).trim(),
      description: String(body.description ?? ''),
      tags: String(body.tags ?? ''),
      year: String(body.year ?? ''),
      link: String(body.link ?? ''),
      image: String(body.image ?? ''),
      position: Number(body.position ?? 0)
    },
    select: { id: true }
  })

  return { id: project.id }
})
