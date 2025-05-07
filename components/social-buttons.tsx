'use client'

import { useValidateCaptcha } from '@/hooks/use-validate-captcha'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { OAuthProviders } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FC, useTransition } from 'react'
import { GithubIcon, GoogleIcon } from './icons'
import { Button } from './ui/button'
import { toast } from './ui/toast'

export const SocialButtons: FC<{ sign: 'in' | 'up' }> = ({ sign }) => {
  const { validateCaptcha } = useValidateCaptcha()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      {Object.values(OAuthProviders).map((provider) => {
        const icon = {
          google: { icon: GoogleIcon, bgColor: '#FFF', textColor: '#000' },
          github: { icon: GithubIcon, bgColor: '#444', textColor: '#FFF' },
        }

        const Icon = icon[provider].icon

        return (
          <Button
            key={provider}
            className={cn(
              'h-[55px] font-bold',
              provider === OAuthProviders.GOOGLE && 'hover:!bg-slate-100',
              provider === OAuthProviders.GITHUB && 'hover:!bg-black',
            )}
            variant='outline'
            type='button'
            disabled={isPending}
            style={{
              background: icon[provider].bgColor,
              color: icon[provider].textColor,
            }}
            onClick={async () => {
              await validateCaptcha()

              startTransition(async () => {
                await authClient.signIn.social({
                  provider,
                  callbackURL: ROUTES.home(),
                  fetchOptions: {
                    onError(context) {
                      toast.error('Error', {
                        description: context.error.message,
                      })
                    },
                  },
                })
              })
            }}
          >
            <Icon
              className='mr-2 h-4 w-4'
              style={{
                fill: icon[provider].textColor,
              }}
            />
            Sign {sign} with {provider}
          </Button>
        )
      })}
    </>
  )
}
