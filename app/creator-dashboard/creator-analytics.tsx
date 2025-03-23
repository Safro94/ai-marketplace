'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

// Mock data for analytics
const SALES_DATA = [
  { date: '2024-03-01', sales: 2, revenue: 158 },
  { date: '2024-03-02', sales: 1, revenue: 79 },
  { date: '2024-03-03', sales: 0, revenue: 0 },
  { date: '2024-03-04', sales: 3, revenue: 237 },
  { date: '2024-03-05', sales: 2, revenue: 158 },
  { date: '2024-03-06', sales: 1, revenue: 79 },
  { date: '2024-03-07', sales: 4, revenue: 316 },
  { date: '2024-03-08', sales: 2, revenue: 158 },
  { date: '2024-03-09', sales: 3, revenue: 237 },
  { date: '2024-03-10', sales: 5, revenue: 395 },
  { date: '2024-03-11', sales: 2, revenue: 158 },
  { date: '2024-03-12', sales: 1, revenue: 79 },
  { date: '2024-03-13', sales: 0, revenue: 0 },
  { date: '2024-03-14', sales: 3, revenue: 237 },
]

const VISITS_DATA = [
  { date: '2024-03-01', visits: 45 },
  { date: '2024-03-02', visits: 38 },
  { date: '2024-03-03', visits: 52 },
  { date: '2024-03-04', visits: 78 },
  { date: '2024-03-05', visits: 63 },
  { date: '2024-03-06', visits: 42 },
  { date: '2024-03-07', visits: 85 },
  { date: '2024-03-08', visits: 59 },
  { date: '2024-03-09', visits: 67 },
  { date: '2024-03-10', visits: 92 },
  { date: '2024-03-11', visits: 73 },
  { date: '2024-03-12', visits: 54 },
  { date: '2024-03-13', visits: 49 },
  { date: '2024-03-14', visits: 68 },
]

const ASSET_PERFORMANCE = [
  { name: 'Advanced SEO Content Generation System', sales: 12, revenue: 948 },
  { name: 'Financial Advisor GPT', sales: 8, revenue: 792 },
  { name: 'Marketing Campaign Planner', sales: 6, revenue: 774 },
  { name: 'Social Media Content Calendar', sales: 3, revenue: 207 },
]

export default function CreatorAnalytics() {
  return (
    <div className='space-y-6'>
      <Tabs defaultValue='sales'>
        <TabsList className='mb-4'>
          <TabsTrigger value='sales'>Sales & Revenue</TabsTrigger>
          <TabsTrigger value='visits'>Visits & Engagement</TabsTrigger>
          <TabsTrigger value='assets'>Asset Performance</TabsTrigger>
        </TabsList>

        <TabsContent value='sales'>
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue</CardTitle>
              <CardDescription>
                Track your sales and revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Sales',
                    color: 'hsl(var(--chart-1))',
                  },
                  revenue: {
                    label: 'Revenue ($)',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={SALES_DATA}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='sales'
                      stroke='var(--color-sales)'
                      yAxisId='left'
                      name='Sales'
                    />
                    <Line
                      type='monotone'
                      dataKey='revenue'
                      stroke='var(--color-revenue)'
                      yAxisId='right'
                      name='Revenue ($)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='visits'>
          <Card>
            <CardHeader>
              <CardTitle>Visits & Engagement</CardTitle>
              <CardDescription>
                Track visits to your asset pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  visits: {
                    label: 'Page Visits',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={VISITS_DATA}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='visits'
                      stroke='var(--color-visits)'
                      name='Page Visits'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='assets'>
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>
                Compare performance across your assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Sales',
                    color: 'hsl(var(--chart-1))',
                  },
                  revenue: {
                    label: 'Revenue ($)',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={ASSET_PERFORMANCE}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='name'
                      tickFormatter={(value) =>
                        value.length > 20
                          ? `${value.substring(0, 20)}...`
                          : value
                      }
                    />
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey='sales'
                      fill='var(--color-sales)'
                      yAxisId='left'
                      name='Sales'
                    />
                    <Bar
                      dataKey='revenue'
                      fill='var(--color-revenue)'
                      yAxisId='right'
                      name='Revenue ($)'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
