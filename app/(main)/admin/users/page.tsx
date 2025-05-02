import { PageContainer } from '@/components/page-container'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { getUserProfiles } from '@/data-access/users'
import { ROUTES } from '@/lib/constants'
import { validateAdminProfile } from '@/lib/permissions'
import { Role } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { DeleteUserButton } from './_components/delete-user-button'

export default async function UsersPage() {
  await validateAdminProfile(ROUTES.adminUsers())

  const users = await getUserProfiles()

  return (
    <PageContainer>
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
                        <Avatar
                          className='h-8 w-8'
                          src={user.image}
                          alt={user.name}
                          fallback={user.name?.charAt(0).toUpperCase() || 'U'}
                        />

                        <div>
                          <p className='font-medium'>
                            {user.name || 'Unnamed User'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      {user.profile?.role === Role.ADMIN ? (
                        <Badge variant='default'>Admin</Badge>
                      ) : user.profile?.role === Role.CREATOR ? (
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

                    {user.profile && (
                      <TableCell>
                        <DeleteUserButton
                          profile={user.profile}
                          isBanned={user.banned}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
