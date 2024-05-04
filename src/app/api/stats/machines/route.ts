import { MachineHistory } from '@/db/models'

export const dynamic = 'force-dynamic'

export const GET = async (req: Request) => {
  const data = await MachineHistory.aggregate([
    { $group: { _id: '$machine', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'machines',
        localField: '_id',
        foreignField: '_id',
        as: 'machine',
      },
    },
    { $unwind: { path: '$machine', preserveNullAndEmptyArrays: true } },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ['$machine', { count: '$count' }] },
      },
    },
  ])

  return Response.json(data)
}
