import { ReactNode } from 'react'

import { HeaderNav } from '@/components/common/HeaderNav'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HeaderNav />
      {children}
    </>
  )
}

export default DashboardLayout
