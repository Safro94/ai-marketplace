'use client'

import { ROUTES } from '@/lib/constants'
import { Share } from 'lucide-react'
import {
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'next-share'
import { FC, useState } from 'react'
import { CopyToClipboard } from './copy-to-clipboard'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const SOCIAL_MEDIA_POST_TEXT = 'Checkout my new AI product'

export const ShareButton: FC<{ assetId: string }> = ({ assetId }) => {
  const [isOpen, setIsOpen] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}${ROUTES.assetsDetail(assetId)}`
      : ''

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className='w-6 h-6 md:h-10 md:w-10 z-50 bg-white rounded-full group'
            onClick={(e) => {
              e.preventDefault()
              e.nativeEvent.stopImmediatePropagation()

              setIsOpen(true)
            }}
          >
            <Share className='w-4 h-4 text-black group-hover:text-primary' />
            <span className='sr-only'>Share button</span>
          </Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center space-x-2'>
            <div className='grid flex-1 gap-2'>
              <Label htmlFor='link' className='sr-only'>
                Link
              </Label>

              <Input readOnly id='link' defaultValue={url} />
            </div>

            <CopyToClipboard url={url} />
          </div>

          <div className='flex gap-2 items-center'>
            <RedditShareButton url={url} title={SOCIAL_MEDIA_POST_TEXT}>
              <RedditIcon size={32} round />
            </RedditShareButton>

            <LinkedinShareButton url={url} title={SOCIAL_MEDIA_POST_TEXT}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton
              url={url}
              title={SOCIAL_MEDIA_POST_TEXT}
              separator=':: '
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
