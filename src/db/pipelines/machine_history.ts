import { PipelineStage } from 'mongoose'

type MachineHistoryLogPipelineOptions = {
  startDate?: Date
  endDate?: Date
  groupBy?: 'day' | 'month' | 'year'
  includeLogs?: boolean
}

export const MachineHistoryLogPipeline = ({
  startDate,
  endDate,
  groupBy = 'day',
  includeLogs = false,
}: MachineHistoryLogPipelineOptions = {}): PipelineStage[] => {
  const dateToStringFormat = {
    day: '%Y-%m-%d',
    month: '%Y-%m',
    year: '%Y',
  }[groupBy]

  console.log('startDate', startDate)
  console.log('endDate', endDate)

  return [
    ...(startDate || endDate
      ? [
          {
            $match: {
              $and: [
                ...(startDate
                  ? [{ $expr: { $gte: ['$start_at', startDate] } }]
                  : []),
                ...(endDate
                  ? [{ $expr: { $lte: ['$start_at', endDate] } }]
                  : []),
              ],
            },
          },
        ]
      : []),
    { $sort: { start_at: -1 } },
    {
      $group: {
        _id: {
          $dateToString: {
            date: '$start_at',
            format: dateToStringFormat,
            timezone: 'Asia/Bangkok',
          },
        },
        logs: { $push: '$$ROOT' },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        meta: {
          $reduce: {
            input: '$logs',
            initialValue: {
              success: 0,
              error: 0,
              total: 0,
              qr: 0,
              banknotes: 0,
              coins: 0,
              total_payment: 0,
            },
            in: {
              success: {
                $add: [
                  '$$value.success',
                  {
                    $cond: [
                      { $regexMatch: { input: '$$this.status', regex: /^OK/ } },
                      1,
                      0,
                    ],
                  },
                ],
              },
              error: {
                $add: [
                  '$$value.error',
                  {
                    $cond: [
                      { $regexMatch: { input: '$$this.status', regex: /^ER/ } },
                      1,
                      0,
                    ],
                  },
                ],
              },
              total: { $add: ['$$value.total', 1] },
              qr: { $add: ['$$value.qr', '$$this.qr'] },
              banknotes: { $add: ['$$value.banknotes', '$$this.banknotes'] },
              coins: { $add: ['$$value.coins', '$$this.coins'] },
              total_payment: {
                $add: ['$$value.total_payment', '$$this.total'],
              },
            },
          },
        },
        logs: '$logs',
      },
    },
    { $sort: { date: -1 } },
    {
      $project: {
        [groupBy]: '$date',
        stats: {
          success: '$meta.success',
          error: '$meta.error',
          total: '$meta.total',
        },
        payment: {
          qr: '$meta.qr',
          banknotes: '$meta.banknotes',
          coins: '$meta.coins',
          total: '$meta.total_payment',
        },
        ...(includeLogs && { logs: '$logs' }),
      },
    },
  ]
}