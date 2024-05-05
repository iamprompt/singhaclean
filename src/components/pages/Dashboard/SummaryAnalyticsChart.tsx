'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ComponentProps, useMemo } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetDailyStats } from '@/hooks/stats'
import { formatDate } from '@/lib/utils'

type SummaryAnalyticsChartProps = {} & ComponentProps<typeof Card>

const data = [
  {
    date: '2021-09-01',
    dryer: 10,
    washer: 20,
  },
  {
    date: '2021-09-02',
    dryer: 10,
    washer: 20,
  },
  {
    date: '2021-09-03',
    dryer: 10,
    washer: 20,
  },
  {
    date: '2021-09-04',
    dryer: 10,
    washer: 20,
  },
  {
    date: '2021-09-05',
    dryer: 10,
    washer: 20,
  },
  {
    date: '2021-09-06',
    dryer: 10,
    washer: 20,
  },
]

export const SummaryAnalyticsChart = ({
  className,
  ...props
}: SummaryAnalyticsChartProps) => {
  const { data, isLoading } = useGetDailyStats()

  const formatData = useMemo<
    Array<{
      date: string
      washer: number
      dryer: number
    }>
  >(() => {
    return (
      data?.slice(0, 7).map((item: any) => ({
        date: item.day,
        washer: item.stats.washer || 0,
        dryer: item.stats.dryer || 0,
      })) || []
    ).reverse()
  }, [data])

  if (isLoading) {
    return (
      <Card className={className} {...props}>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-52" />
          </div>
          <Skeleton className="ml-auto h-9 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className} {...props}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>สถิติการทำงาน 7 วันล่าสุด</CardTitle>
          <CardDescription>
            ยอดการใช้งานเครื่องซักผ้าและเครื่องอบผ้า
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            เพิ่มเติม
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {formatData && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={formatData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis
                stroke="#888888"
                width={30}
                fontSize={12}
                tickLine={false}
                axisLine={true}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="washer" stackId="a" fill="#8884d8" />
              <Bar dataKey="dryer" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

const CustomTooltip = ({
  payload,
  label,
}: TooltipProps<string | number, string>) => {
  const payloadData = payload?.[0]?.payload

  return (
    <div className="bg-white text-sm overflow-hidden rounded-lg shadow-xl">
      <div className="px-2 py-1 font-bold border-b">{formatDate(label)}</div>
      <div className="px-2 py-1">
        <div>
          <span className="font-bold">ซัก:</span> {payloadData?.washer} ครั้ง
        </div>
        <div>
          <span className="font-bold">อบ:</span> {payloadData?.dryer} ครั้ง
        </div>
      </div>
    </div>
  )
}
