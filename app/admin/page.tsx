import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  BarChart,
  CheckCircle,
  ShoppingBag,
  Users,
  XCircle,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Dashboard | AIAssets Marketplace',
  description: 'Manage the AIAssets marketplace',
  robots: {
    index: false,
    follow: false,
  },
}

// Mock data for pending assets
const PENDING_ASSETS = [
  {
    id: 101,
    title: 'Customer Support AI Workflow',
    description:
      'Automated workflow for handling customer inquiries and support tickets.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'AI Workflows',
    creator: {
      name: 'Alex Rivera',
      id: 3,
    },
    submittedDate: '2024-03-18',
  },
  {
    id: 102,
    title: 'E-commerce Product Description Generator',
    description:
      'AI system for creating compelling product descriptions that convert.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Content Templates',
    creator: {
      name: 'Jessica Kim',
      id: 4,
    },
    submittedDate: '2024-03-17',
  },
]

export default async function AdminDashboardPage() {
  return (
    <div className='container py-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h1>
          <p className='text-muted-foreground'>
            Manage the AIAssets marketplace
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <AlertTriangle className='h-4 w-4 text-amber-500 mr-2' />
              <div className='text-2xl font-bold'>{PENDING_ASSETS.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <Users className='h-4 w-4 text-muted-foreground mr-2' />
              <div className='text-2xl font-bold'>124</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <ShoppingBag className='h-4 w-4 text-muted-foreground mr-2' />
              <div className='text-2xl font-bold'>$4,289</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='pending'>
        <TabsList className='mb-6'>
          <TabsTrigger value='pending'>Pending Review</TabsTrigger>
          <TabsTrigger value='users'>Users</TabsTrigger>
          <TabsTrigger value='sales'>Sales</TabsTrigger>
          <TabsTrigger value='reports'>Reports</TabsTrigger>
        </TabsList>

        <TabsContent value='pending'>
          {PENDING_ASSETS.length > 0 ? (
            <div className='space-y-6'>
              {PENDING_ASSETS.map((asset) => (
                <Card key={asset.id}>
                  <div className='flex flex-col md:flex-row'>
                    <div className='relative w-full md:w-48 h-48'>
                      <Image
                        src={asset.image || '/placeholder.svg'}
                        alt={asset.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 p-6'>
                      <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
                        <div>
                          <Badge variant='secondary' className='mb-2'>
                            {asset.category}
                          </Badge>
                          <h3 className='text-xl font-semibold mb-2'>
                            {asset.title}
                          </h3>
                          <p className='text-muted-foreground mb-4'>
                            {asset.description}
                          </p>
                          <p className='text-sm'>
                            By{' '}
                            <span className='font-medium'>
                              {asset.creator.name}
                            </span>{' '}
                            • Submitted on {asset.submittedDate}
                          </p>
                        </div>
                        <div className='flex space-x-2 mt-4 md:mt-0'>
                          <Button variant='outline' asChild>
                            <Link href={`/admin/assets/${asset.id}`}>
                              Review Details
                            </Link>
                          </Button>
                          <Button variant='destructive' size='icon'>
                            <XCircle className='h-4 w-4' />
                          </Button>
                          <Button variant='default' size='icon'>
                            <CheckCircle className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <CheckCircle className='h-12 w-12 text-green-500 mb-4' />
                <h3 className='text-lg font-medium mb-2'>No pending reviews</h3>
                <p className='text-muted-foreground max-w-md'>
                  All asset submissions have been reviewed. Check back later for
                  new submissions.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='users'>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <Users className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>
                  User management coming soon
                </h3>
                <p className='text-muted-foreground max-w-md'>
                  This feature is currently under development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sales'>
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Track marketplace sales and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <BarChart className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>
                  Sales analytics coming soon
                </h3>
                <p className='text-muted-foreground max-w-md'>
                  This feature is currently under development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reports'>
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                View marketplace performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <BarChart className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>
                  Reports coming soon
                </h3>
                <p className='text-muted-foreground max-w-md'>
                  This feature is currently under development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
