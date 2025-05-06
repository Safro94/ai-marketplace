'use client'

import { signUserOut } from '@/actions/sign-out'
import { Avatar } from '@/components/ui/avatar'
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
import { ROUTES } from '@/lib/constants'
import { User } from 'better-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { toast } from '../ui/toast'

interface Props {
  isCreator: boolean
  user: User
}

export const HeaderDropdown: FC<Props> = ({ isCreator, user }) => {
  const router = useRouter()
  const { refetch } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar
            className='h-8 w-8'
            src={user.image}
            alt={user.name}
            fallback={user.name?.charAt(0).toUpperCase()}
          />
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
            const { error } = await signUserOut()

            if (error) {
              toast.error('Error', {
                description: 'There was an error while signing you out.',
              })
              return
            }

            refetch()
            router.push(ROUTES.home())
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
