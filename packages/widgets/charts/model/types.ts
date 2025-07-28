export interface ChartDataPoint {
  date: string
  desktop: number
  mobile: number
}

export type TimeRange = "7d" | "30d" | "90d"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
} 