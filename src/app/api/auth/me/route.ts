import { cookies } from 'next/headers'

import { withDB } from '@/db'
import { lucia } from '@/lib/auth'
import { AppError } from '@/modules/api/appError'

export const dynamic = 'force-dynamic'

export const GET = withDB(async (req) => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    throw new AppError(401, 'Unauthorized')
  }

  const { user, session } = await lucia.validateSession(sessionId)
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch (error) {}

  return Response.json(user)
})
