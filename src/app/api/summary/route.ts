import { read, utils } from 'xlsx'
import { z } from 'zod'

import { IWASHER_BASE_URL, SummaryExportHeaders } from '@/const/iwasher'
import dayjs from '@/lib/dayjs'
import { serialDateTimeToISOString } from '@/lib/excel'

const schema = z.object({
  [SummaryExportHeaders.NO]: z.number().int(),
  [SummaryExportHeaders.USERNAME]: z.string(),
  [SummaryExportHeaders.MACHINE_NO]: z
    .number()
    .int()
    .transform((v) => (v < 0 ? v * -1 : v)),
  [SummaryExportHeaders.PRICE]: z.number().int(),
  [SummaryExportHeaders.BANKNOTES]: z.number().int(),
  [SummaryExportHeaders.COINS]: z.number().int(),
  [SummaryExportHeaders.QR]: z.number().int(),
  [SummaryExportHeaders.TOTAL]: z.number().int(),
  [SummaryExportHeaders.START_AT]: z
    .string()
    .or(z.number())
    .transform((v) => {
      if (typeof v === 'number') {
        return serialDateTimeToISOString(v)
      }
      return dayjs(v, 'DD-MM-YY HH:mm').toISOString()
    })
    .transform((v) => new Date(v)),
  [SummaryExportHeaders.FINISH_AT]: z
    .string()
    .or(z.number())
    .transform((v) => {
      if (typeof v === 'number') {
        return serialDateTimeToISOString(v)
      }
      return dayjs(v, 'DD-MM-YY HH:mm').toISOString()
    })
    .transform((v) => new Date(v)),
  [SummaryExportHeaders.DURATION]: z.number(),
  [SummaryExportHeaders.STATUS]: z.string(),
})

const schemaTransformed = schema.transform((v) => ({
  [SummaryExportHeaders.MACHINE_NO]: v[SummaryExportHeaders.MACHINE_NO],
  [SummaryExportHeaders.PRICE]: v[SummaryExportHeaders.PRICE],
  [SummaryExportHeaders.BANKNOTES]: v[SummaryExportHeaders.BANKNOTES],
  [SummaryExportHeaders.COINS]: v[SummaryExportHeaders.COINS],
  [SummaryExportHeaders.QR]: v[SummaryExportHeaders.QR],
  [SummaryExportHeaders.TOTAL]: v[SummaryExportHeaders.TOTAL],
  [SummaryExportHeaders.START_AT]: v[SummaryExportHeaders.START_AT],
  [SummaryExportHeaders.FINISH_AT]: v[SummaryExportHeaders.FINISH_AT],
  [SummaryExportHeaders.DURATION]: v[SummaryExportHeaders.DURATION],
  [SummaryExportHeaders.STATUS]: v[SummaryExportHeaders.STATUS],
}))

export const GET = async (req: Request) => {
  const authHeader = req.headers.get('Authorization')
  const [, authBase64] = authHeader?.split(' ') ?? [undefined, undefined]

  const [userId, userPassword] = !!authBase64
    ? Buffer.from(authBase64, 'base64').toString().split(':')
    : [process.env.IWASHER_USERNAME, process.env.IWASHER_PASSWORD]

  const exportUrl = new URL('/php_excel1.php', IWASHER_BASE_URL)

  const searchParams = new URL(req.url).searchParams
  const fromParam = searchParams.get('from') ?? null
  const toParam = searchParams.get('to') ?? null
  const pageParam = searchParams.get('page') ?? '0'
  const pageSizeParam = searchParams.get('page_size') ?? '10'

  const page = Number(pageParam)
  const pageSize = Number(pageSizeParam)
  const offset = (page - 1) * pageSize

  const dateFrom = dayjs(fromParam).isValid()
    ? dayjs(fromParam)
    : dayjs('2022-06-30T17:00:00.000Z').startOf('day')
  const dateTo = dayjs(toParam).isValid()
    ? dayjs(toParam)
    : dayjs().endOf('day')

  const formattedDateFrom = dateFrom
    .tz('Asia/Bangkok')
    .format('YY-MM-DD HH:mm:ss')
  const formattedDateTo = dateTo.tz('Asia/Bangkok').format('YY-MM-DD HH:mm:ss')

  exportUrl.searchParams.set('id', userId)
  exportUrl.searchParams.set('fr', formattedDateFrom)
  exportUrl.searchParams.set('to', formattedDateTo)

  const cookies = [
    { name: 'u_n', value: userId },
    { name: 'u_p', value: userPassword },
  ]

  const arrayBuffer = await fetch(exportUrl.toString(), {
    headers: {
      Cookie: cookies.map(({ name, value }) => `${name}=${value}`).join('; '),
    },
    cache: 'no-store',
  }).then((res) => res.arrayBuffer())

  const workbook = read(arrayBuffer, { type: 'buffer' })

  const sheetJSON = utils.sheet_to_json<
    Record<keyof z.infer<typeof schema>, string | number>
  >(workbook.Sheets[workbook.SheetNames[0]], {
    header: Object.values(SummaryExportHeaders),
    raw: true,
    rawNumbers: true,
  })

  const sheet = sheetJSON.slice(1).map((row) => {
    try {
      return schemaTransformed.parse(row)
    } catch (error) {
      throw new Error(`Row ${row[SummaryExportHeaders.NO]}: ${error}`)
    }
  })

  const summary = sheet.reduce(
    (acc, row) => {
      acc[SummaryExportHeaders.BANKNOTES] += row[SummaryExportHeaders.BANKNOTES]
      acc[SummaryExportHeaders.COINS] += row[SummaryExportHeaders.COINS]
      acc[SummaryExportHeaders.QR] += row[SummaryExportHeaders.QR]
      acc[SummaryExportHeaders.TOTAL] += row[SummaryExportHeaders.TOTAL]
      acc.errors += /^ER/.test(row[SummaryExportHeaders.STATUS]) ? 1 : 0

      return acc
    },
    {
      [SummaryExportHeaders.BANKNOTES]: 0,
      [SummaryExportHeaders.COINS]: 0,
      [SummaryExportHeaders.QR]: 0,
      [SummaryExportHeaders.TOTAL]: 0,
      errors: 0,
      transactions: sheet.length,
    },
  )

  const isFullResult = offset < 0
  const rowToSkip = offset >= 0 ? offset : 0

  const transactions = isFullResult
    ? sheet
    : sheet.slice(rowToSkip, offset + pageSize)
  const meta = {
    page,
    pageSize,
    total: sheet.length,
    totalPages: Math.ceil(sheet.length / pageSize),
  }

  return Response.json({
    summary,
    transactions,
    ...(isFullResult ? {} : { meta }),
  })
}
