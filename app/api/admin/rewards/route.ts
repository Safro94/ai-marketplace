import { processMonthlyRewards } from '@/scripts/process-monthly-rewards'
import { NextRequest, NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../../utils'

export async function POST(request: NextRequest) {
  await validateRouteProfilePermissions({
    checkAdminOrCreator: true,
  })

  try {
    const forceProcess = request.nextUrl.searchParams.get('force') === 'true'

    if (forceProcess) {
      await processMonthlyRewards(true)
      console.info('Manually triggered monthly rewards processing completed')

      return NextResponse.json({
        success: true,
        message: 'Rewards processing completed successfully',
      })
    } else {
      // Run the normal process which will only execute on the last day of the month
      await processMonthlyRewards()

      return NextResponse.json({
        success: true,
        message:
          'Rewards processing check completed. Processing will only occur on the last day of the month unless forced.',
      })
    }
  } catch (error) {
    console.error('Error updating asset status:', error)
    return NextResponse.json(
      { error: 'Failed to process rewards' },
      { status: error instanceof Error ? (error.cause as number) : 500 },
    )
  }
}
