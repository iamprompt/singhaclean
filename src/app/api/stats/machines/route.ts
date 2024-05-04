import { withDB } from '@/db'
import { MachineHistory } from '@/db/models'

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
  const data = await MachineHistory.aggregate<MachineStats>([
    {
      $group: {
        _id: { machine_id: '$machine', code: '$status' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'machines',
        localField: '_id.machine_id',
        foreignField: '_id',
        as: 'machine',
      },
    },
    { $unwind: { path: '$machine', preserveNullAndEmptyArrays: true } },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$machine', { count: '$count', code: '$_id.code' }],
        },
      },
    },
    { $sort: { code: 1 } },
    {
      $group: {
        _id: '$_id',
        root: { $first: '$$ROOT' },
        success: {
          $sum: {
            $cond: [
              { $regexMatch: { input: '$code', regex: /^OK/ } },
              '$count',
              0,
            ],
          },
        },
        error: {
          $sum: {
            $cond: [
              { $regexMatch: { input: '$code', regex: /^ER/ } },
              '$count',
              0,
            ],
          },
        },
        logs: { $push: { code: '$code', count: '$count' } },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: {
            id: '$_id',
            machine_no: '$root.machine_no',
            type: '$root.type',
            status: '$root.status',
            rates: { success: '$success', error: '$error' },
            logs: '$logs',
          },
        },
      },
    },
    { $sort: { machine_no: 1 } },
  ])

  return Response.json(data)
})
