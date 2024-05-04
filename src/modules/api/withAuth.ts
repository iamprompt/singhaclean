import { NextRequest } from 'next/server'

import { lucia } from '@/lib/auth'

import { AppError } from './appError'

export const withAuth =
  (
    handler: (
      req: NextRequest,
      options: Record<string, any>,
    ) => Promise<Response> | Response,
  ) =>
  async (req: NextRequest, options: Record<string, any> = {}) => {
    const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
      throw new AppError(401, 'Unauthorized')
    }
    const { user, session } = await lucia.validateSession(sessionId)
    return await handler(req, { ...options, user, session })
  }
