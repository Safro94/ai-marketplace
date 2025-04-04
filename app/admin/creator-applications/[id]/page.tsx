import { PageContainer } from '@/components/page-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { validateAdminProfile } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ElementType, ReactNode } from 'react'
import { ApplicationReviewForm } from '../../application-review-form'

export default async function CreatorApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await validateAdminProfile(ROUTES.adminCreatorApplications())

  // Get the application
  const application = await prisma.creatorApplication.findUnique({
    where: { id: (await params).id },
    include: {
      creatorProfile: {
        include: {
          profile: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!application) notFound()

  return (
    <PageContainer>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Creator Application
        </h1>

        <Button variant='outline' asChild>
          <Link href={ROUTES.adminCreatorApplications()}>
            Back to Applications
          </Link>
        </Button>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Submitted{' '}
                {formatDistanceToNow(new Date(application.submittedAt), {
                  addSuffix: true,
                })}
              </CardDescription>

              <Badge
                className='absolute top-4 right-4'
                variant={
                  application.status === ApplicationStatus.APPROVED
                    ? 'success'
                    : application.status === ApplicationStatus.REJECTED
                      ? 'destructive'
                      : 'outline'
                }
              >
                {application.status}
              </Badge>
            </CardHeader>

            <CardContent className='space-y-6'>
              <div className='grid  md:grid-cols-2 gap-4'>
                {[
                  {
                    title: 'Full Name',
                    description: application.fullName,
                  },
                  {
                    title: 'Email',
                    description: application.email,
                  },
                  {
                    title: 'Expertise',
                    description: application.expertise,
                  },
                  {
                    title: 'Experience',
                    description: application.experience,
                  },
                ].map(({ title, description }) => (
                  <Item key={title} title={title} description={description} />
                ))}

                {application.website && (
                  <Item title='Website'>
                    <a
                      href={application.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary underline'
                    >
                      {application.website}
                    </a>
                  </Item>
                )}

                {application.portfolio && (
                  <Item title='Portfolio'>
                    <a
                      href={application.portfolio}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary underline'
                    >
                      {application.portfolio}
                    </a>
                  </Item>
                )}
              </div>

              <Item title='Bio' as='div' description={application.bio} />
              <Item
                title='Asset Types'
                as='div'
                description={application.assetTypes}
              />

              {application.status !== ApplicationStatus.PENDING && (
                <Item
                  title='Review Notes'
                  as='div'
                  description={
                    application.reviewNotes || 'No review notes provided.'
                  }
                />
              )}
            </CardContent>
          </Card>

          {application.status === ApplicationStatus.PENDING && (
            <ApplicationReviewForm applicationId={application.id} />
          )}
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <Item
                title='Name'
                description={application.creatorProfile.profile.user.name}
              />

              <Item
                title='Email'
                description={application.creatorProfile.profile.user.email}
              />

              <Item
                title='Member Since'
                description={format(
                  new Date(application.creatorProfile.profile.user.createdAt),
                  'PPP',
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0 h-4 w-4 rounded-full bg-primary mt-1 mr-3'></div>
                <div>
                  <p className='font-medium'>Application Submitted</p>
                  <p className='text-sm text-muted-foreground'>
                    {format(new Date(application.submittedAt), 'PPP p')}
                  </p>
                </div>
              </div>

              {application.reviewedAt && (
                <div className='flex items-start'>
                  <div
                    className={`flex-shrink-0 h-4 w-4 rounded-full mt-1 mr-3 ${
                      application.status === ApplicationStatus.APPROVED
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />

                  <div>
                    <p className='font-medium'>
                      Application{' '}
                      {application.status === ApplicationStatus.APPROVED
                        ? 'Approved'
                        : 'Rejected'}
                    </p>

                    <p className='text-sm text-muted-foreground'>
                      {format(new Date(application.reviewedAt), 'PPP p')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

const Item = ({
  title,
  description,
  children,
  as: Tag = 'p',
}: {
  title: string
  description?: string
  children?: ReactNode
  as?: ElementType
}) => {
  const className =
    Tag === 'div' ? 'p-4 bg-muted rounded-md whitespace-pre-wrap' : 'mt-1'

  return (
    <div key={title}>
      <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>

      <Tag className={className}>{children ?? description}</Tag>
    </div>
  )
}
