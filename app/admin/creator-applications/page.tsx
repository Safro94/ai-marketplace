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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/lib/constants'
import { validateAdminProfile } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { AllCaughtUp } from '../all-caught-up'

export default async function CreatorApplicationsPage() {
  await validateAdminProfile(ROUTES.adminCreatorApplications())

  // Get all creator applications
  const applications = await prisma.creatorApplication.findMany({
    where: {
      status: ApplicationStatus.PENDING,
    },
    include: {
      creatorProfile: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      submittedAt: 'desc',
    },
  })

  return (
    <PageContainer>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>
        Creator Applications
      </h1>
      {!applications.length ? (
        <AllCaughtUp />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>

            <CardDescription>
              Review and manage creator applications
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className='font-medium'>
                      {application.fullName}
                    </TableCell>

                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.expertise}</TableCell>

                    <TableCell>
                      <Badge
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
                    </TableCell>

                    <TableCell>
                      {formatDistanceToNow(new Date(application.submittedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>

                    <TableCell>
                      <Button asChild size='sm'>
                        <Link
                          href={`${ROUTES.adminCreatorApplications()}/${application.id}`}
                        >
                          Review
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
