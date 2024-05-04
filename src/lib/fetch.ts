export const clientFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  'use client'
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
