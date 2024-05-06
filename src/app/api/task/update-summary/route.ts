import { load } from 'cheerio'
import { Types } from 'mongoose'
import { z } from 'zod'

import { withDB } from '@/db'
import { Machine, MachineHistory } from '@/db/models'
import { IWasherInstance } from '@/lib/axios'
import dayjs from '@/lib/dayjs'

export const dynamic = 'force-dynamic'

const schema = z.object({
  machine_no: z.coerce.number().int(),
  price: z.coerce.number().int(),
  banknotes: z.coerce.number(),
  coins: z.coerce.number(),
  qr: z.coerce.number(),
  total: z.coerce.number(),
  start_at: z.string().transform((v) => {
    const day = dayjs(v, 'DD-MM-YY (HH:mm)')
    return day.isValid() ? day.toDate() : null
  }),
  finish_at: z.string().transform((v) => {
    const day = dayjs(v, 'DD-MM-YY (HH:mm)')
    return day.isValid() ? day.toDate() : null
  }),
  duration: z.coerce.number().int(),
  status: z.string(),
})

export const GET = withDB(async (req) => {
  const { data } = await IWasherInstance.get('/bill_show04.php', {
    params: {
      fr_date: '2022-07-01',
      hhF: '00',
      iiF: '00',
      ssF: '00',
    },
  })

  const $ = load(data)

  const rows = new Map<number, Array<string>>()
  $('table:nth-child(7) > tbody > tr').each((i, el) => {
    // Skip the first row (Header row)
    if (i === 0) return

    const row: Array<string> = []
    const columns = $(el).find('td')
    columns.each((j, column) => {
      row.push($(column).text().trim())
    })
    rows.set(i, row)
  })

  const result: Array<z.infer<typeof schema>> = []
  const machinesMap = new Map<number, string>()

  for (const [, value] of rows) {
    const [
      _no,
      _username,
      machineNo,
      price,
      banknotes,
      coins,
      qr,
      total,
      startAt,
      finishAt,
      duration,
      status,
    ] = value

    const parsed = schema.safeParse({
      machine_no: machineNo,
      price,
      banknotes,
      coins,
      qr,
      total,
      start_at: startAt,
      finish_at: finishAt,
      duration,
      status,
    })

    if (!parsed.success) {
      console.error(parsed.error)
      return Response.json(
        { error: 'Failed to parse the data' },
        { status: 500 },
      )
    }

    if (!machinesMap.has(parsed.data.machine_no)) {
      const machine = await Machine.findOneAndUpdate(
        { machine_no: parsed.data.machine_no },
        { machine_no: parsed.data.machine_no },
        { upsert: true, new: true },
      )

      machinesMap.set(parsed.data.machine_no, machine?.id ?? null)
    }

    result.push(parsed.data)
  }

  const reversed = result.reverse()

  try {
    await MachineHistory.bulkWrite(
      reversed.map(({ machine_no, ...data }, index) => {
        const machineId = new Types.ObjectId(machinesMap.get(machine_no))

        return {
          updateOne: {
            filter: {
              // no: index + 1,
              machine: machineId,
              start_at: data.start_at,
            },
            update: {
              $set: {
                ...data,
                no: index + 1,
                machine: machineId,
              },
            },
            upsert: true,
          },
        }
      }),
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Failed to update the database' },
      { status: 500 },
    )
  }

  return Response.json({ data: result })
})
