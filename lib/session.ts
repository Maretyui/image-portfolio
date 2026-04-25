const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function bufToBase64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuf(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

async function getHmacKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET env var must be set and at least 32 chars')
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage
  )
}

export async function createSessionToken(adminId: number): Promise<string> {
  const payload = bufToBase64url(
    new TextEncoder().encode(JSON.stringify({ adminId, exp: Date.now() + SESSION_DURATION_MS }))
  )
  const key = await getHmacKey(['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${bufToBase64url(sig)}`
}

export async function verifySessionToken(token: string): Promise<{ adminId: number } | null> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return null
    const payload = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const key = await getHmacKey(['verify'])
    const valid = await crypto.subtle.verify(
      'HMAC', key, base64urlToBuf(sig), new TextEncoder().encode(payload)
    )
    if (!valid) return null
    const data = JSON.parse(new TextDecoder().decode(base64urlToBuf(payload))) as unknown
    if (
      typeof data !== 'object' || data === null ||
      typeof (data as Record<string, unknown>).exp !== 'number' ||
      typeof (data as Record<string, unknown>).adminId !== 'number'
    ) return null
    const { adminId, exp } = data as { adminId: number; exp: number }
    if (exp < Date.now()) return null
    return { adminId }
  } catch {
    return null
  }
}
