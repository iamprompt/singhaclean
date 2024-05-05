import { Fan, WashingMachine } from 'lucide-react'
import { ComponentProps } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MachineType } from '@/const/machine'
import { formatDate, formatNumber } from '@/lib/utils'

type SummaryRecentOperationsProps = {
  data: any
} & ComponentProps<typeof Card>

export const SummaryRecentOperations = ({
  data,
  className,
  ...props
}: SummaryRecentOperationsProps) => {
  if (!data) return null

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>รายการทำงานล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {data.slice(0, 5).map((item: any, i: number) => {
          const Icon =
            item.machine_type === MachineType.WASHER ? WashingMachine : Fan

          return (
            <div key={i} className="flex items-center gap-4">
              <div className="hidden h-9 w-9 sm:flex items-center justify-center bg-slate-100 p-2 rounded-full">
                <Icon />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{`เครื่องที่ ${item.machine_no}`}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
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
