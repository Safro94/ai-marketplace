'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { toast } from '../ui/toast'

interface Props {
  isCreator: boolean
}

export const HeaderDropdown: FC<Props> = ({ isCreator }) => {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.image || ''} alt={user.name || ''} />

            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>

            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard()}>Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.account()}>Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.purchases()}>Purchases</Link>
        </DropdownMenuItem>

        {isCreator && (
          <DropdownMenuItem asChild>
            <Link href={ROUTES.creatorDashboard()}>Creator Dashboard</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess() {
                  router.push(ROUTES.home())
                },
                onError(context) {
                  toast.error('Error', {
                    description: context.error.message,
                  })
                },
              },
            })
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
