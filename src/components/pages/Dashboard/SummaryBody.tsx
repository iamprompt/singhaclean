'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { SummaryAnalyticsChart } from './SummaryAnalyticsChart'
import { SummaryCards } from './SummaryCards'
import { SummaryRecentOperations } from './SummaryRecentOperations'

export const SummaryBody = () => {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data, status } = await axios.get('/api/stats/summary')

      if (status !== 200) {
        throw new Error('Failed to fetch summary data')
      }

      return data
    },
  })

  console.log('data', data)

  return (
    <>
      <SummaryCards data={data} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <SummaryAnalyticsChart className="lg:col-span-2 w-full" />
        <SummaryRecentOperations data={data?.logs} />
      </div>
    </>
  )
}
