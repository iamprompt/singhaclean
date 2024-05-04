import { withDB } from '@/db'
import { MachineHistory } from '@/db/models'
import { MachineHistoryLogPipeline } from '@/db/pipelines'
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
  withAuth(async () => {
    const data = await MachineHistory.aggregate<MachineStats>(
      MachineHistoryLogPipeline({ groupBy: 'month' }),
    )

    return Response.json(data)
  }),
)
