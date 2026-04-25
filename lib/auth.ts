import { cookies } from 'next/headers'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )
    return session
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}
