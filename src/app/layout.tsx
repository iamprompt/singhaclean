import '@/styles/globals.css'

import type { Metadata } from 'next'
import { ReactNode } from 'react'

import { Providers } from './providers'

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
