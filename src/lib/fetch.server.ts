'use server'

import { cookies } from 'next/headers'

export const serverFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const cookieEntries = cookies()

  const fullUrl = new URL(url, process.env.NEXT_PUBLIC_URL)

  const response = await fetch(fullUrl.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieEntries.toString(),
      ...options?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
