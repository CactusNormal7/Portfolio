import { usePrisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }

  await usePrisma().message.create({ data: { name, email, body: message } })
  return { ok: true }
})
