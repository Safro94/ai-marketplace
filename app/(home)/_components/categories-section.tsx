import { CategoryShowcase } from './category-showcase'

export const CategoriesSection = () => {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Browse by Category
          </h2>

          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Explore our curated categories of AI assets designed for specific
            use cases
          </p>
        </div>

        <CategoryShowcase />
      </div>
    </section>
  )
}
