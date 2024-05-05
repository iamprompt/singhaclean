import { PipelineStage } from 'mongoose'

type MachineHistoryLogPipelineOptions = {
  startDate?: Date
  endDate?: Date
  groupBy?: 'day' | 'month' | 'year'
  isSummary?: boolean
  includeLogs?: boolean | number
}

export const MachineHistoryLogPipeline = ({
  startDate,
  endDate,
  groupBy = 'day',
  isSummary = false,
  includeLogs = false,
}: MachineHistoryLogPipelineOptions = {}): PipelineStage[] => {
  const dateToStringFormat = {
    day: '%Y-%m-%d',
    month: '%Y-%m',
    year: '%Y',
  }[groupBy]

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
      $lookup: {
        from: 'machines',
        localField: 'machine',
        foreignField: '_id',
        as: 'machine',
      },
    },
    { $unwind: { path: '$machine', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: isSummary
          ? ''
          : {
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
        ...(!isSummary && { date: '$_id' }),
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
              dryer: 0,
              washer: 0,
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
              dryer: {
                $add: [
                  '$$value.dryer',
                  { $cond: [{ $eq: ['$$this.machine.type', 'dryer'] }, 1, 0] },
                ],
              },
              washer: {
                $add: [
                  '$$value.washer',
                  { $cond: [{ $eq: ['$$this.machine.type', 'washer'] }, 1, 0] },
                ],
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
        ...(!isSummary && { [groupBy]: '$date' }),
        stats: {
          success: '$meta.success',
          error: '$meta.error',
          total: '$meta.total',
          washer: '$meta.washer',
          dryer: '$meta.dryer',
        },
        payment: {
          qr: '$meta.qr',
          banknotes: '$meta.banknotes',
          coins: '$meta.coins',
          total: '$meta.total_payment',
        },
        ...(includeLogs && {
          logs: {
            $reduce: {
              input:
                typeof includeLogs === 'number'
                  ? { $slice: ['$logs', includeLogs] }
                  : '$logs',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  [
                    {
                      id: '$$this._id',
                      machine_no: '$$this.machine.machine_no',
                      machine_type: '$$this.machine.type',
                      qr: '$$this.qr',
                      banknotes: '$$this.banknotes',
                      coins: '$$this.coins',
                      total: '$$this.total',
                      start_at: '$$this.start_at',
                      finish_at: '$$this.finish_at',
                      duration: '$$this.duration',
                      status: '$$this.status',
                    },
                  ],
                ],
              },
            },
          },
        }),
      },
    },
  ]
}
