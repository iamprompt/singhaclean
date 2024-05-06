'use client'

import { CircleUser, Menu, WashingMachine } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavItems } from '@/const/nav'
import { cn } from '@/lib/utils'
import { logout } from '@/modules/auth'

type HeaderItemProps = {
  href: string
  label: string
  exact?: boolean
}

const HeaderItem = ({ href, label, exact }: HeaderItemProps) => {
  const pathname = usePathname()

  const isActive = useMemo(() => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }, [pathname, href, exact])

  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground transition-colors hover:text-foreground',
        isActive && 'text-foreground font-bold',
      )}
    >
      {label}
    </Link>
  )
}

export const HeaderNav = () => {
  const { replace } = useRouter()

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background z-50 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <WashingMachine className="h-6 w-6" />
          <span className="sr-only">สิงห์คลีน: ร้านสะดวกซัก</span>
        </Link>
        {NavItems.map((item) => (
          <HeaderItem key={`desktop-nav-${item.id}`} {...item} />
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <WashingMachine className="h-6 w-6" />
              <span className="sr-only">สิงห์คลีน: ร้านสะดวกซัก</span>
            </Link>
            {NavItems.map((item) => (
              <HeaderItem key={`mobile-nav-${item.id}`} {...item} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                await logout()
                replace('/auth/login')
              }}
            >
              ลงชื่อออก
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
