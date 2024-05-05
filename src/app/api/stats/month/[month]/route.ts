import { withDB } from '@/db'
import { MachineHistory } from '@/db/models'
import { MachineHistoryLogPipeline } from '@/db/pipelines'
import dayjs from '@/lib/dayjs'
import { AppError } from '@/modules/api/appError'
import { withAuth } from '@/modules/api/withAuth'

export const dynamic = 'force-dynamic'

type MachineStats = {
  id: string
  machine_no: number
  type: string
  status: string
  rates: {
    success: number
    error: number
  }
  logs: Array<{ code: string; count: number }>
}

export const GET = withDB(
  withAuth(async (req, { params }) => {
    console.log('params', params.month)

    const date = dayjs(params.month, 'YYYY-MM', true)
    if (!date.isValid()) {
      throw new AppError(400, 'Invalid month format')
    }

    const [data] = await MachineHistory.aggregate<MachineStats>(
      MachineHistoryLogPipeline({
        groupBy: 'month',
        startDate: date.startOf('month').toDate(),
        endDate: date.endOf('month').toDate(),
        includeLogs: true,
      }),
    )

    return Response.json(data)
  }),
)
