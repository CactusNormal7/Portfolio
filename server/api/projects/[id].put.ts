import { Prisma } from '@prisma/client'
import { usePrisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  try {
    await usePrisma().project.update({
      where: { id },
      data: {
        title: String(body.title).trim(),
        description: String(body.description ?? ''),
        tags: String(body.tags ?? ''),
        year: String(body.year ?? ''),
        link: String(body.link ?? ''),
        image: String(body.image ?? ''),
        position: Number(body.position ?? 0)
      }
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
    throw err
  }
  return { ok: true }
})
