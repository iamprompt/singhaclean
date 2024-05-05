import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Banknote, Coins, DollarSign, History, QrCode } from 'lucide-react'

import { formatNumber } from '@/lib/utils'

import { SummaryCardItem } from './SummaryCardItem'

export const SummaryCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data, status } = await axios.get('/api/stats/summary')

      if (status !== 200) {
        throw new Error('Failed to fetch summary data')
      }

      return data
    },
  })

  return (
    <div className="grid gap-4 md:grid-cols-12">
      <SummaryCardItem
        loading={isLoading}
        className="md:col-span-6 lg:col-span-6"
        icon={History}
        title="การใช้งาน"
        value={`${formatNumber(data?.stats.total)} ครั้ง`}
      />
      <SummaryCardItem
        loading={isLoading}
        className="md:col-span-6 lg:col-span-6"
        icon={DollarSign}
        title="ยอดเงินรวม"
        value={formatNumber(data?.payment.total, { currency: true })}
      />
      <SummaryCardItem
        loading={isLoading}
        className="md:col-span-4"
        icon={Banknote}
        title="ธนบัตร"
        value={formatNumber(data?.payment.banknotes, { currency: true })}
      />
      <SummaryCardItem
        loading={isLoading}
        className="md:col-span-4"
        icon={Coins}
        title="เหรียญ"
        value={formatNumber(data?.payment.coins, { currency: true })}
      />

      <SummaryCardItem
        loading={isLoading}
        className="md:col-span-4"
        icon={QrCode}
        title="พร้อมเพย์"
        value={formatNumber(data?.payment.qr, { currency: true })}
      />
    </div>
  )
}
