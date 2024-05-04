import { withDB } from '@/db'
import { MachineHistory } from '@/db/models'
import { MachineHistoryLogPipeline } from '@/db/pipelines'

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

export const GET = withDB(async () => {
  const data = await MachineHistory.aggregate<MachineStats>(
    MachineHistoryLogPipeline({ groupBy: 'year' }),
  )

  return Response.json(data)
})
