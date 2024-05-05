import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SummaryCardItemProps = {
  title: string
  value: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >

  className?: string
}

export const SummaryCardItem = ({
  title,
  value,
  icon: Icon,
  className,
}: SummaryCardItemProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
