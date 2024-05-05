import { cookies } from 'next/headers'

import { withDB } from '@/db'
import { lucia } from '@/lib/auth'
import { withAuth } from '@/modules/api/withAuth'

export const dynamic = 'force-dynamic'

export const GET = withDB(
  withAuth(async () => {
    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return Response.json({ success: true })
  }),
)
