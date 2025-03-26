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
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { ApplicationStatus } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CreatorApplicationsPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(
      `${ROUTES.login()}?callbackUrl=${ROUTES.adminCreatorApplications()}`,
    )
  }

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile?.isAdmin) {
    redirect('/?error=unauthorized')
  }

  // Get all creator applications
  const applications = await prisma.creatorApplication.findMany({
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
    <div>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>
        Creator Applications
      </h1>

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
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8 text-muted-foreground'
                  >
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
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
                          href={`/admin/creator-applications/${application.id}`}
                        >
                          Review
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
