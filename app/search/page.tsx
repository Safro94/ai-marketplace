import type { Metadata } from 'next'
import { AssetGrid } from '../explore/(grid)/asset-grid'
import { AssetFilters } from '../explore/asset-filters'
import { SearchBar } from './search-bar'

interface SearchPageProps {
  searchParams: { q?: string }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || ''
  return {
    title: query
      ? `Search results for "${query}" | AIAssets Marketplace`
      : 'Search | AIAssets Marketplace',
    description: query
      ? `Browse search results for "${query}" on AIAssets Marketplace`
      : 'Search for AI assets, tools, and templates on AIAssets Marketplace',
    robots: {
      index: false,
    },
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  return (
    <div className='container py-8'>
      <div className='mb-8'>
        <SearchBar className='max-w-2xl mx-auto mb-6' />

        {query && (
          <h1 className='text-3xl font-bold tracking-tight mb-2 text-center'>
            Search results for &quot;{query}&quot;
          </h1>
        )}
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters />
        </aside>
        <main className='flex-1'>
          <AssetGrid />
        </main>
      </div>
    </div>
  )
}
