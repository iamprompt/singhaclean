import '@/styles/globals.css'

import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Singhaclean Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
