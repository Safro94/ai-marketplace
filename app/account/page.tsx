import { PageContainer } from '@/components/page-container'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/db/permissions'
import { getUserProfile } from '@/lib/db/users'
import { validateSession } from '@/lib/session'
import { Role } from '@prisma/client'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserProfileForm } from './user-profile-form'

enum TabsEnum {
  PROFILE = 'profile',
  PREFERENCES = 'preferences',
  NOTIFICATIONS = 'notifications',
}

export const metadata: Metadata = {
  title: 'Account Settings | AIAssets Marketplace',
  description: 'Manage your account settings and profile information',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountPage() {
  const { user } = await validateSession(ROUTES.account())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(ROUTES.home())
  }

  // Get user's notifications
  // const notifications = await prisma.notification.findMany({
  //   where: { userId: profile.id },
  //   orderBy: { createdAt: 'desc' },
  //   take: 5,
  // })

  return (
    <PageContainer>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Account Settings
        </h1>
        <p className='text-muted-foreground'>
          Manage your account settings and profile information
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-1'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              <div className='flex flex-col items-center space-y-3'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src={user.image || ''} alt={user.name || ''} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className='text-center'>
                  <h3 className='font-medium text-lg'>{user.name}</h3>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Account Type
                  </span>

                  <span className='text-sm font-medium'>
                    {profile.role === Role.ADMIN
                      ? 'Admin'
                      : profile.role === Role.CREATOR
                        ? 'Creator'
                        : 'User'}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Member Since
                  </span>

                  <span className='text-sm font-medium'>
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className='pt-2'>
                {isAdminOrCreator(profile) ? (
                  <Button className='w-full' asChild>
                    <Link href={ROUTES.creatorDashboard()}>
                      Creator Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button className='w-full' asChild>
                    <Link href={ROUTES.creatorsApply()}>Become a Creator</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2'>
          <Tabs defaultValue={TabsEnum.PROFILE}>
            <TabsList className='mb-6'>
              <TabsTrigger value={TabsEnum.PROFILE}>Profile</TabsTrigger>
              {/* <TabsTrigger value={TabsEnum.NOTIFICATIONS}>
                  Notifications
                </TabsTrigger> */}
            </TabsList>

            <TabsContent value={TabsEnum.PROFILE}>
              <UserProfileForm
                initialData={{
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  website: profile.website,
                  githubHandle: profile.githubHandle,
                  twitterHandle: profile.twitterHandle,
                  bio: profile.bio,
                }}
              />
            </TabsContent>

            {/* <TabsContent value={TabsEnum.NOTIFICATIONS}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Your recent notifications</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {notifications && notifications.length > 0 ? (
                      <div className='space-y-4'>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className='flex items-start space-x-4 p-4 border rounded-md'
                          >
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                notification.type === 'SUCCESS'
                                  ? 'bg-green-500'
                                  : notification.type === 'ERROR'
                                    ? 'bg-red-500'
                                    : notification.type === 'WARNING'
                                      ? 'bg-yellow-500'
                                      : 'bg-blue-500'
                              }`}
                            />
                            <div className='flex-1'>
                              <h4 className='font-medium'>
                                {notification.title}
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                {notification.message}
                              </p>
                              <p className='text-xs text-muted-foreground mt-1'>
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-center py-8 text-muted-foreground'>
                        You have no notifications
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </PageContainer>
  )
}
