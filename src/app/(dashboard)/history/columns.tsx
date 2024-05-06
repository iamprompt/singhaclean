'use client'

import { ColumnDef } from '@tanstack/react-table'

import dayjs from '@/lib/dayjs'
import { formatDate, formatNumber } from '@/lib/utils'

export type MachineLog = {
  id: string
  machine_no: number
  machine_type: 'washer' | 'dryer'
  qr: number
  banknotes: number
  coins: number
  total: number
  start_at: string
  finish_at: string
  duration: number
  status: `ER${number}` | `OK${number}`
}

export const columns: ColumnDef<MachineLog>[] = [
  {
    accessorKey: 'machine_type',
    header: 'ประเภท',
    cell: (cell) => {
      return cell.getValue() === 'washer' ? 'ซัก' : 'อบ'
    },
  },
  {
    accessorKey: 'machine_no',
    header: 'หมายเลขเครื่อง',
  },
  {
    id: 'payment',
    header: 'การชำระเงิน',
    columns: [
      {
        accessorKey: 'banknotes',
        header: 'ธนบัตร',
        cell: (cell) => {
          return formatNumber(cell.getValue() || 0, { currency: true })
        },
      },
      {
        accessorKey: 'coins',
        header: 'เหรียญ',
        cell: (cell) => {
          return formatNumber(cell.getValue() || 0, { currency: true })
        },
      },
      {
        accessorKey: 'qr',
        header: 'พร้อมเพย์',
        cell: (cell) => {
          return formatNumber(cell.getValue() || 0, { currency: true })
        },
      },
      {
        accessorKey: 'total',
        header: 'รวมเงิน',
        cell: (cell) => {
          return formatNumber(cell.getValue() || 0, { currency: true })
        },
      },
    ],
  },
  {
    id: 'time',
    header: 'เวลา',
    columns: [
      {
        accessorKey: 'start_at',
        header: 'เริ่ม',
        cell: (cell) => {
          return formatDate(cell.getValue(), 'DD/MM/BB HH:mm น.')
        },
      },
      {
        accessorKey: 'finish_at',
        header: 'เสร็จสิ้น',
        cell: (cell) => {
          return formatDate(cell.getValue(), 'DD/MM/BB HH:mm น.')
        },
      },
      {
        accessorKey: 'duration',
        header: 'ระยะเวลา',
        cell: (cell) => {
          return dayjs
            .duration(cell.getValue(), 'minutes')
            .toJSON()
            .replace('PT', '')
            .split(/(\d+)/)
            .filter(Boolean)
            .map((part) =>
              part === 'M' ? ' นาที' : part === 'H' ? ' ชั่วโมง' : part,
            )
            .join(' ')
        },
      },
    ],
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
  },
]
