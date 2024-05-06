import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseGetLogHistoryOptions = {
  page: number
  limit: number
  status?: string
}

export const useGetLogHistory = ({
  page,
  limit,
  status: filteredStatus,
}: UseGetLogHistoryOptions) => {
  return useQuery({
    queryKey: ['log-history', { page, limit, filteredStatus }],
    queryFn: async () => {
      const { data, status } = await axios.get('/api/history', {
        params: {
          page,
          limit,
          ...(filteredStatus &&
            filteredStatus !== 'all' && { status: filteredStatus }),
        },
      })

      if (status !== 200) {
        throw new Error('Failed to fetch log history data')
      }

      return data
    },
    placeholderData: keepPreviousData,
  })
}
