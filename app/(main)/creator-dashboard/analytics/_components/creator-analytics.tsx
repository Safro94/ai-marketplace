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
import { API_ROUTES } from '@/lib/constants'
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
  const [isLoading, setIsLoading] = useState(true)

  const [data, setData] = useState({
    sales: [],
    assets: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)

      const requests = [
        {
          type: 'sales',
          promise: fetch(API_ROUTES.creatorsAnalyticsSales(), {
            cache: 'force-cache',
            next: {
              revalidate: 3600,
            },
          }),
        },
        {
          type: 'assets',
          promise: fetch(API_ROUTES.creatorsAnalyticsAssets(), {
            cache: 'force-cache',
            next: {
              revalidate: 3600,
            },
          }),
        },
      ]

      try {
        const responses = await Promise.allSettled(
          requests.map((req) => req.promise),
        )

        for await (const [index, value] of responses.entries()) {
          const requestType = requests[index].type

          if (value.status === 'fulfilled') {
            if (!value.value.ok) {
              toast.error('Error', {
                description: `There was an error while fetching your ${requestType[index]} analytics.`,
              })
            } else {
              const response = await value.value.json()

              setData((prevState) => ({
                ...prevState,
                [requestType]: response,
              }))
            }
          } else if (value.status === 'rejected') {
            console.error(value.reason)

            toast.error('Error', {
              description: `There was an error while fetching your ${requestType} analytics`,
            })
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='sales'>
        <TabsList className='mb-4'>
          <TabsTrigger value='sales'>Sales & Revenue</TabsTrigger>
          <TabsTrigger value='assets'>Asset Performance</TabsTrigger>
        </TabsList>

        <TabsContent value='sales'>
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue</CardTitle>
              <CardDescription>
                Track your sales and revenue over time. The data gets updated
                every hour.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <Loader />
              ) : (
                <ChartContainer
                  className='h-[400px]'
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
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={data.sales}
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
                        yAxisId='left'
                        name='Sales'
                        stroke='var(--color-sales)'
                        strokeWidth={2}
                      />
                      <Line
                        type='monotone'
                        dataKey='revenue'
                        yAxisId='right'
                        name='Revenue ($)'
                        stroke='var(--color-revenue)'
                        strokeWidth={2}
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
                Compare performance across your assets. The data gets updated
                every hour.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <Loader />
              ) : (
                <ChartContainer
                  className='h-[400px]'
                  config={{
                    sales: {
                      label: 'Sales',
                      color: 'hsl(var(--chart-1))',
                    },
                    revenue: {
                      label: 'Revenue ($)',
                      color: 'hsl(var(--chart-2))',
                    },
                    uniqueViews: {
                      label: 'Unique views',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={data.assets}
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
                        yAxisId='left'
                        name='Sales'
                        fill='var(--color-sales)'
                      />
                      <Bar
                        dataKey='revenue'
                        yAxisId='right'
                        name='Revenue ($)'
                        fill='var(--color-revenue)'
                      />
                      <Bar
                        dataKey='uniqueViews'
                        yAxisId='right'
                        name='Unique Views'
                        fill='var(--color-uniqueViews)'
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

const Loader = () => (
  <div className='h-[300px] flex items-center justify-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
  </div>
)
