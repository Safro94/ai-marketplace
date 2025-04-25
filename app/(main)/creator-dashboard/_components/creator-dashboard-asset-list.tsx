'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { CreatorDashboardAssetWithAnalytics } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { AssetStatus } from '@prisma/client'
import { format } from 'date-fns'
import {
  AlertCircle,
  Eye,
  MoreHorizontal,
  Pencil,
  Star,
  Trash,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  assets: CreatorDashboardAssetWithAnalytics[]
}

export const CreatorDashboardAssetsList: FC<Props> = ({ assets }) => {
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteAssetId) return

    try {
      setIsDeleting(true)

      const response = await fetch(API_ROUTES.asset(deleteAssetId), {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }

      toast.success('Asset deleted', {
        description: 'The asset has been successfully deleted.',
      })

      // Refresh the page
      router.refresh()
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete asset. Please try again.',
      })
    } finally {
      setIsDeleting(false)
      setDeleteAssetId(null)
    }
  }

  if (!assets.length) {
    return (
      <div className='text-center py-12 border rounded-lg'>
        <AlertCircle className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
        <h3 className='font-medium mb-1'>No assets found</h3>
        <p className='text-sm text-muted-foreground'>
          You don&apos;t have any assets in this category yet.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {assets.map((asset) => (
        <Card key={asset.id}>
          <CardContent className='p-4'>
            <div className='flex flex-col items-center justify-center gap-2 md:flex-row space-x-4'>
              <div className='relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0'>
                {asset.featuredImage ? (
                  <Image
                    src={asset.featuredImage || '/placeholder.svg'}
                    alt={asset.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='bg-muted h-full w-full flex items-center justify-center'>
                    <AlertCircle className='h-6 w-6 text-muted-foreground' />
                  </div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <h3 className='font-medium text-center truncate whitespace-normal md:text-start'>
                  {asset.title}
                </h3>

                <div className='flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-muted-foreground'>
                  <div className='flex items-center'>
                    <Eye className='h-4 w-4 mr-1' />
                    {asset.assetAnalytics?.views || 0}
                  </div>

                  <div className='flex items-center'>
                    {formatCurrency(asset.totalSales)}
                  </div>

                  <div className='flex items-center'>
                    <Star className='h-4 w-4 mr-1 fill-yellow-400 text-yellow-400' />
                    {asset.averageRating.toFixed(1)}({asset.totalReviews})
                  </div>

                  <div>{format(new Date(asset.createdAt), 'MMM d, yyyy')}</div>
                </div>

                {asset.status === 'REJECTED' && asset.moderationNotes && (
                  <div className='mt-2 text-sm text-red-600'>
                    <span className='font-medium'>Rejection reason:</span>{' '}
                    {asset.moderationNotes}
                  </div>
                )}
              </div>

              <StatusBadge status={asset.status} />

              <div className='flex items-center space-x-2'>
                <Button variant='outline' size='sm' asChild>
                  <Link href={ROUTES.assetsDetail(asset.id)}>View</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.creatorDashboardAssetEdit(asset.id)}>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className='text-red-600 focus:text-red-600'
                      onClick={() => setDeleteAssetId(asset.id)}
                    >
                      <Trash className='h-4 w-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog
        open={!!deleteAssetId}
        onOpenChange={(open) => !open && setDeleteAssetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset and remove it from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case AssetStatus.PUBLISHED:
      return (
        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
          Published
        </Badge>
      )
    case AssetStatus.PENDING_REVIEW:
      return (
        <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
          Pending Review
        </Badge>
      )
    case AssetStatus.REJECTED:
      return (
        <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
          Rejected
        </Badge>
      )
    case AssetStatus.DRAFT:
      return (
        <Badge className='bg-gray-100 text-gray-800 hover:bg-gray-100'>
          Draft
        </Badge>
      )
    default:
      return <Badge variant='outline'>{status}</Badge>
  }
}
