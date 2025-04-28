import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardFavoritesByProfileId } from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import { FavoritesList } from './_components/favorites-list'

export default async function Favorites() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const favorites = await getDashboardFavoritesByProfileId({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <Card>
      {!!favorites.length ? (
        <CardContent className='py-6'>
          <FavoritesList favorites={favorites} />
        </CardContent>
      ) : (
        <NotFound
          title='No favorites yet'
          description="You haven't added any assets to your favorites yet. Browse the marketplace and save assets you're interested in."
          icon={Star}
          btnLink={ROUTES.explore()}
          btnText='Browse Marketplace'
        />
      )}
    </Card>
  )
}
