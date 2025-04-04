'use client'

import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { OAuthProviders } from '@/lib/types'
import { TwitterIcon } from 'lucide-react'
import { FC, useState } from 'react'
import { GithubIcon, GoogleIcon } from './icons'
import { Button } from './ui/button'
import { toast } from './ui/toast'

export const SocialButtons: FC<{ sign: 'in' | 'up' }> = ({ sign }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      {Object.values(OAuthProviders).map((provider) => {
        const icon = {
          google: GoogleIcon,
          github: GithubIcon,
          twitter: TwitterIcon,
        }

        const Icon = icon[provider]

        return (
          <Button
            key={provider}
            variant='outline'
            type='button'
            disabled={isLoading}
            onClick={async () => {
              await authClient.signIn.social({
                provider,
                callbackURL: ROUTES.home(),
                fetchOptions: {
                  onRequest: () => {
                    setIsLoading(true)
                  },
                  onResponse() {
                    setIsLoading(false)
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
            <Icon className='mr-2 h-4 w-4' />
            Sign {sign} with {provider}
          </Button>
        )
      })}
    </>
  )
}
