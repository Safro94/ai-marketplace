import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/session'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const { user } = await validateSession()

  // Get user profile
  const profile = await getUserProfile(user.id)
  if (!profile) redirect(ROUTES.home())

  // Get notifications
  const notifications = await prisma.notification.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // Mark all as read
  await prisma.notification.updateMany({
    where: {
      profileId: profile.id,
      read: false,
    },
    data: { read: true },
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'ERROR':
        return '❌'
      case 'WARNING':
        return '⚠️'
      case 'INFO':
      default:
        return 'ℹ️'
    }
  }

  return (
    <PageContainer>
      <BreadcrumbNavigation
        items={[
          { text: 'Home', link: ROUTES.home() },
          {
            text: 'Notifications',
          },
        ]}
      />
      <h1 className='text-3xl font-bold'>Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your latest updates and alerts</CardDescription>
        </CardHeader>

        <CardContent>
          {!notifications.length ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                You don&apos;t have any notifications yet.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className='flex gap-3'>
                    <div className='text-2xl'>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className='flex-1'>
                      <div className='font-medium text-lg'>
                        {notification.title}
                      </div>

                      <div className='text-muted-foreground'>
                        {notification.message}
                      </div>

                      <div className='text-sm text-muted-foreground mt-2'>
                        {format(new Date(notification.createdAt), "PPP 'at' p")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
