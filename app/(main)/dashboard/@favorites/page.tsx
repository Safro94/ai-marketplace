import { Asset } from '@/components/asset'
import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardFavoritesByProfileId } from '@/data-access/favorites'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { Star } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function Favorites() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const favorites = await getDashboardFavoritesByProfileId(profile.id)

  return (
    <Card>
      {!!favorites.length ? (
        <CardContent className='py-6'>
          <div className='grid  md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {favorites.map((favorite) => {
              return <Asset key={favorite.id} {...favorite.asset} />
            })}
          </div>
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
