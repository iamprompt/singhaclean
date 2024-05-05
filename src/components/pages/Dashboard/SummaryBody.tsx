'use client'

import { SummaryAnalyticsChart } from './SummaryAnalyticsChart'
import { SummaryCards } from './SummaryCards'
import { SummaryRecentOperations } from './SummaryRecentOperations'

export const SummaryBody = () => {
  return (
    <>
      <SummaryCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <SummaryAnalyticsChart className="lg:col-span-2 w-full" />
        <SummaryRecentOperations />
      </div>
    </>
  )
}
