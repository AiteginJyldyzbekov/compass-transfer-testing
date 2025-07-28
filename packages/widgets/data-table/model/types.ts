export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export interface TableConfig {
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableSelection?: boolean
} 