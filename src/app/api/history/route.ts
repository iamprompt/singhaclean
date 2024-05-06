import { z } from 'zod'

import { withDB } from '@/db'
import { MachineHistory } from '@/db/models'
import { withAuth } from '@/modules/api/withAuth'

export const dynamic = 'force-dynamic'

export const GET = withDB(
  withAuth(async (req) => {
    const searchParams = req.nextUrl.searchParams
    const page = z.coerce
      .number()
      .default(1)
      .parse(searchParams.get('page') || '1')
    const limit = z.coerce
      .number()
      .default(10)
      .parse(searchParams.get('limit') || '10')
    const status = z
      .enum(['success', 'error'])
      .nullable()
      .parse(searchParams.get('status'))

    const data = await MachineHistory.aggregatePaginate(
      MachineHistory.aggregate([
        ...(status
          ? [
              {
                $match: {
                  status: { $regex: status === 'success' ? /^OK/ : /^ER/ },
                },
              },
            ]
          : []),
        { $sort: { start_at: -1 } },
        {
          $lookup: {
            from: 'machines',
            localField: 'machine',
            foreignField: '_id',
            as: 'machine',
          },
        },
        { $unwind: '$machine' },
        {
          $project: {
            _id: 0,
            id: '$_id',
            machine_no: '$machine.machine_no',
            machine_type: '$machine.type',
            start_at: '$start_at',
            finish_at: '$finish_at',
            duration: '$duration',
            status: '$status',
            qr: '$qr',
            banknotes: '$banknotes',
            coins: '$coins',
            total: '$total',
          },
        },
      ]),
      { page, limit },
    )

    return Response.json(data)
  }),
)
