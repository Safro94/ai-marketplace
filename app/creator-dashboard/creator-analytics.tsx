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
import { toast } from '@/components/ui/toast'
import { useEffect, useState } from 'react'
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

export default function CreatorAnalytics() {
  const [salesData, setSalesData] = useState([])
  const [visitsData, setVisitsData] = useState([])
  const [assetPerformance, setAssetPerformance] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        // Fetch sales data
        const salesResponse = await fetch('/api/creator/analytics/sales')
        if (salesResponse.ok) {
          const salesData = await salesResponse.json()
          setSalesData(salesData)
        }

        // Fetch visits data
        const visitsResponse = await fetch('/api/creator/analytics/visits')
        if (visitsResponse.ok) {
          const visitsData = await visitsResponse.json()
          setVisitsData(visitsData)
        }

        // Fetch asset performance data
        const assetsResponse = await fetch('/api/creator/analytics/assets')
        if (assetsResponse.ok) {
          const assetsData = await assetsResponse.json()
          setAssetPerformance(assetsData)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)

        toast.error('Error', {
          description: 'Failed to load analytics data. Please try again later.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // If data is loading or empty, show placeholder data
  const placeholderSalesData = [
    { date: '2024-03-01', sales: 0, revenue: 0 },
    { date: '2024-03-07', sales: 0, revenue: 0 },
    { date: '2024-03-14', sales: 0, revenue: 0 },
  ]

  const placeholderVisitsData = [
    { date: '2024-03-01', visits: 0 },
    { date: '2024-03-07', visits: 0 },
    { date: '2024-03-14', visits: 0 },
  ]

  const placeholderAssetData = [{ name: 'No assets yet', sales: 0, revenue: 0 }]

  const displaySalesData =
    salesData.length > 0 ? salesData : placeholderSalesData
  const displayVisitsData =
    visitsData.length > 0 ? visitsData : placeholderVisitsData
  const displayAssetData =
    assetPerformance.length > 0 ? assetPerformance : placeholderAssetData

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
              {isLoading ? (
                <div className='h-[300px] flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                </div>
              ) : (
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
                      data={displaySalesData}
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
              )}
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
              {isLoading ? (
                <div className='h-[300px] flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                </div>
              ) : (
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
                      data={displayVisitsData}
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
              )}
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
              {isLoading ? (
                <div className='h-[300px] flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                </div>
              ) : (
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
                      data={displayAssetData}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
