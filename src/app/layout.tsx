import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Singhaclean Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  userScalable: false,
  initialScale: 1,
}

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
