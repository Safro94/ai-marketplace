import { updateProfile } from '@/data-access/profile'
import { CACHE_KEYS } from '@/lib/constants'
import { userAccountSchema } from '@/lib/schemas'
import { getServerSession } from '@/lib/session'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate the request body
    const validationResult = userAccountSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.format() },
        { status: 400 },
      )
    }

    // Update the user profile
    const updatedProfile = await updateProfile({
      where: { userId: session.user.id },
      data: {
        bio: body.bio,
        website: body.website,
        githubHandle: body.githubHandle,
        twitterHandle: body.twitterHandle,
        updatedAt: new Date(),
        user: {
          update: {
            name: body.name,
          },
        },
      },
    })

    revalidateTag(CACHE_KEYS.profile(updatedProfile.userId))

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 },
    )
  }
}
