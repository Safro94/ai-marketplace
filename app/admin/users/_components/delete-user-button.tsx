'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { authClient } from '@/lib/auth-client'
import { Profile } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  isBanned: boolean | null
  profile: Profile
}

export const DeleteUserButton: FC<Props> = ({ profile, isBanned }) => {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async () => {
    const { error } = await authClient.admin.banUser({
      userId: profile.userId,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('User banned successfully')
    setIsDialogOpen(false)
    router.refresh()
  }

  return (
    <>
      {isBanned ? (
        <Badge variant='outline'>Banned</Badge>
      ) : (
        <>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => setIsDialogOpen((prevState) => !prevState)}
          >
            Ban user
          </Button>

          <AlertDialog
            open={isDialogOpen}
            onOpenChange={(open) => !open && setIsDialogOpen(false)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  )
}
