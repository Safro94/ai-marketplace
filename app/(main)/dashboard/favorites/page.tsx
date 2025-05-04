import { NotFound } from '@/components/not-found'
import { DashboardPageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardFavoritesByProfileId } from '@/data-access/favorites'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { Star } from 'lucide-react'
import { getCachedProfileData } from '../utils'
import { FavoritesList } from './_components/favorites-list'

export default async function Favorites() {
  const { profile } = await getCachedProfileData()

  const favorites = await getDashboardFavoritesByProfileId({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <DashboardPageContainer title='Favorites'>
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
    </DashboardPageContainer>
  )
}
