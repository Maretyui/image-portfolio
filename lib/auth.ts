import { cookies } from 'next/headers'
import { verifySessionToken } from './session'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')
  if (!sessionCookie) return null
  return verifySessionToken(sessionCookie.value)
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
