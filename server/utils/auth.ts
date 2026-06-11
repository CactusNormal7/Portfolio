import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'admin_session'

export function adminToken (): string {
  const config = useRuntimeConfig()
  return createHash('sha256')
    .update(`${config.adminPassword}::portfolio-session`)
    .digest('hex')
}

export function isAdmin (event: H3Event): boolean {
  return getCookie(event, SESSION_COOKIE) === adminToken()
}

export function requireAdmin (event: H3Event): void {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
