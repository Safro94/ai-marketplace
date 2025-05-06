import type { Metadata } from 'next'
import { ManualRewardsProcessing } from './_components/manual-rewards-processing'

export const metadata: Metadata = {
  title: 'Rewards Processing | Admin Dashboard',
  description: 'Manage and process affiliate rewards',
}

export default function RewardsProcessingPage() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Rewards Processing</h1>
      <div className='grid gap-6'>
        <ManualRewardsProcessing />
      </div>
    </div>
  )
}
