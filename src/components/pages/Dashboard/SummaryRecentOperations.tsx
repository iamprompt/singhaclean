import { Fan, WashingMachine } from 'lucide-react'
import { ComponentProps } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MachineType } from '@/const/machine'
import { useGetSummaryStats } from '@/hooks/stats'
import { cn, formatDate, formatNumber } from '@/lib/utils'

type SummaryRecentOperationsProps = ComponentProps<typeof Card>

export const SummaryRecentOperations = ({
  className,
  ...props
}: SummaryRecentOperationsProps) => {
  const { data, isLoading } = useGetSummaryStats()

  if (isLoading) {
    return (
      <Card className={className} {...props}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="grid gap-8">
          {Array.from({ length: 5 }).map((item: any, i: number) => {
            return (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="hidden h-9 w-9 sm:flex items-center justify-center bg-slate-100 rounded-full" />
                <div className="grid gap-1">
                  <Skeleton className="h-[14px] w-20" />
                  <Skeleton className="h-[16px] w-32" />
                </div>
                <div className="ml-auto font-medium">
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>รายการทำงานล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {data.logs.slice(0, 5).map((item: any, i: number) => {
          const Icon =
            item.machine_type === MachineType.WASHER ? WashingMachine : Fan

          return (
            <div key={i} className="flex items-center gap-4">
              <div
                className={cn(
                  'hidden h-9 w-9 sm:flex items-center justify-center bg-slate-100 p-2 rounded-full',
                  item.status.startsWith('OK') && 'bg-green-100',
                  item.status.startsWith('ER') && 'bg-red-100',
                )}
              >
                <Icon />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{`เครื่องที่ ${item.machine_no}`}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {formatDate(item.start_at, 'DD MMM BBBB HH:mm น.')}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {formatNumber(item.total, { currency: true })}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
