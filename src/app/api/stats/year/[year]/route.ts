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
    console.log('params', params.year)

    const date = dayjs(params.year, 'YYYY', true)
    if (!date.isValid()) {
      throw new AppError(400, 'Invalid date')
    }

    const data = await MachineHistory.aggregate<MachineStats>(
      MachineHistoryLogPipeline({
        groupBy: 'year',
        startDate: date.startOf('year').toDate(),
        endDate: date.endOf('year').toDate(),
        includeLogs: true,
      }),
    )

    return Response.json(data)
  }),
)
