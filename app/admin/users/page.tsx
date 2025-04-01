import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.adminUsers()}`)
  }

  // Check if user is an admin
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile?.isAdmin) {
    redirect('/?error=unauthorized')
  }

  // Get all users with their profiles
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage users and their permissions</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!users.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8 text-muted-foreground'
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={user.image || ''}
                            alt={user.name || ''}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className='font-medium'>
                            {user.name || 'Unnamed User'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      {user.profile?.isAdmin ? (
                        <Badge variant='default'>Admin</Badge>
                      ) : user.profile?.isCreator ? (
                        <Badge variant='outline'>Creator</Badge>
                      ) : (
                        <Badge variant='secondary'>User</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>

                    <TableCell>
                      <Button asChild size='sm'>
                        <Link href={`${ROUTES.adminUsers()}/${user.id}`}>
                          View
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
