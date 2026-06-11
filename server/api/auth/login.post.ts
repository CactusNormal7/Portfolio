import { adminToken, SESSION_COOKIE } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event)
  const config = useRuntimeConfig()

  if (!password || password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  setCookie(event, SESSION_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return { ok: true }
})
