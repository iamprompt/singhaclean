'use client'

import { LogHistory } from '@/components/pages/LogHistory'
import { CardDescription, CardTitle } from '@/components/ui/card'

const Page = () => {
  return (
    <main className="flex flex-col flex-1 p-4 md:p-8">
      <div className="flex flex-col space-y-1.5 mb-4">
        <CardTitle>ประวัติการใช้งาน</CardTitle>
        <CardDescription>การใช้งานของร้านสะดวกซัก</CardDescription>
      </div>
      <LogHistory />
    </main>
  )
}

export default Page
