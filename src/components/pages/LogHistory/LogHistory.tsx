import { PaginationState } from '@tanstack/react-table'
import { File, ListFilter, PlusCircle } from 'lucide-react'
import { Fragment, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetLogHistory } from '@/hooks/logHistory'

import { columns } from './columns'
import { LogHistoryTable } from './LogHistoryTable'

export const LogHistory = () => {
  const [filteredStatus, setFilteredStatus] = useState<string>('all')
  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const { data = { docs: [] } } = useGetLogHistory({
    page: pageIndex + 1,
    limit: pageSize,
    status: filteredStatus,
  })

  return (
    <Fragment>
      <div className="flex items-center py-4">
        <Tabs
          value={filteredStatus}
          onValueChange={(value) => {
            setFilteredStatus(value)
            setPaginationState({ pageIndex: 0, pageSize })
          }}
        >
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="success">สำเร็จ</TabsTrigger>
            <TabsTrigger value="error">ผิดพลาด</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <div>
        <LogHistoryTable
          columns={columns}
          data={data.docs}
          setPaginationState={setPaginationState}
          pagination={{ pageIndex, pageSize }}
          totalPages={data.totalPages}
        />
      </div>
    </Fragment>
  )
}
