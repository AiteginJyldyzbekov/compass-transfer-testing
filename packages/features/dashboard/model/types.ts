export interface MetricCard {
  title: string
  value: string | number
  trend: {
    direction: 'up' | 'down'
    percentage: string
    description: string
  }
  footer: {
    description: string
    period: string
  }
}

export interface DashboardMetrics {
  revenue: MetricCard
  customers: MetricCard
  accounts: MetricCard
  growth: MetricCard
} 