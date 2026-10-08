import { usePrisma, handleDbError } from '../utils/prisma'

const LIMITS = { name: 100, email: 200, message: 5000 }

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Honeypot filled → almost certainly a bot. Pretend it worked, store nothing.
  if (String(body?.website ?? '').trim()) {
    return { ok: true }
  }

  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    throw createError({ statusCode: 400, statusMessage: 'Message is too long' })
  }

  await usePrisma().message.create({ data: { name, email, body: message } }).catch(handleDbError)
  return { ok: true }
})
