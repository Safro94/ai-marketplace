import { logger } from '@/lib/logger'
import cron from 'node-cron'
import { processMonthlyRewards } from './process-monthly-rewards'

/**
 * Set up a cron job to run the monthly rewards processing
 * This will run at 11:59 PM on the last day of each month
 */
function setupCronJob() {
  // Schedule the job to run at 11:59 PM every day
  // The job itself checks if it's the last day of the month
  cron.schedule('59 23 * * *', async () => {
    logger.info('Running scheduled monthly rewards processing check')

    try {
      await processMonthlyRewards()
    } catch (error) {
      logger.error('Error in scheduled monthly rewards processing:', error)
    }
  })

  logger.info('Monthly rewards processing cron job has been scheduled')
}

// If this script is run directly
if (require.main === module) {
  setupCronJob()
  logger.info(
    'Cron job setup complete. Keeping process alive for scheduled execution.',
  )

  // Keep the process alive
  process.stdin.resume()
}

export { setupCronJob }
