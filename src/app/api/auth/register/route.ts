import { cookies } from 'next/headers'
import { z } from 'zod'

import { withDB } from '@/db'
import { User } from '@/db/models/user'
import { lucia } from '@/lib/auth'
import { AppError } from '@/modules/api/appError'

export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const POST = withDB(async (req) => {
  const { email, password } = schema.parse(await req.json())

  // Check if email is already in use
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError(409, 'Email already in use')
  }

  // Create user
  const user = await User.create({ email, password })

  // Create session
  const session = await lucia.createSession(user._id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return Response.json({ success: true })
})
