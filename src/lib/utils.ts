import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import dayjs from './dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatNumberOptions = {
  locale?: string
  currency?: boolean
}
export function formatNumber(
  num: number,
  { locale, currency }: FormatNumberOptions = {},
) {
  const options: Intl.NumberFormatOptions = {}

  currency && Object.assign(options, { style: 'currency', currency: 'THB' })

  return new Intl.NumberFormat(locale || 'th', options).format(num)
}

export function formatDate(
  date: string | Date,
  format: string = 'DD MMM BBBB',
) {
  return dayjs(date).format(format)
}
