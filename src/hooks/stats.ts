import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useGetSummaryStats = () => {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data, status } = await axios.get('/api/stats/summary')

      if (status !== 200) {
        throw new Error('Failed to fetch summary data')
      }

      return data
    },
  })
}

export const useGetDailyStats = () => {
  return useQuery({
    queryKey: ['daily-stats'],
    queryFn: async () => {
      const { data, status } = await axios.get('/api/stats/day')

      if (status !== 200) {
        throw new Error('Failed to fetch daily stats')
      }

      return data
    },
  })
}
