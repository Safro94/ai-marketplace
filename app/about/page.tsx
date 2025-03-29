import { cn } from '@/lib/utils'
import Image from 'next/image'

export const metadata = {
  title: 'About Us | AI Assets Marketplace',
  description:
    'Learn about the AI Assets Marketplace, our mission, and the team behind it.',
}

export default function AboutPage() {
  return (
    <div className='py-12'>
      <Section
        title="Welcome to the world's marketplace for AI"
        description='AI Assets Marketplace is the premier platform for buying and selling high-quality AI assets, models, and tools. We connect creators with users to accelerate AI innovation. Discover more than 5 million quality AI resources created by people in over 190 countries around the world. Join forces with talented creators to make your projects stand out.'
        src='/about-us.svg'
      />

      <Section
        reverse
        title='Our Mission'
        description='Our mission is to democratize access to AI by creating a thriving ecosystem where creators can monetize their work and users can find the tools they need to build the future.'
        src='/our-mission.svg'
        className='bg-primary/20'
      />

      <Section
        title='Our Story'
        description='Founded in 2025, AI Assets Marketplace was born from the recognition that AI development was becoming increasingly accessible, yet there was no dedicated platform for creators to share and monetize their work. We set out to build a marketplace that would support the growing community of AI creators and provide users with access to high-quality assets.'
      />
    </div>
  )
}

const Section = ({
  title,
  description,
  src,
  reverse,
  className,
}: {
  title: string
  description: string
  src?: string
  reverse?: boolean
  className?: string
}) => (
  <section
    className={cn(
      'flex flex-col lg:flex-row min-h-[70vh] items-center py-8',
      className,
    )}
  >
    <div
      className={cn(
        'flex lg:flex-1 flex-col gap-4 px-12',
        reverse ? 'order-2' : 'order-1',
      )}
    >
      <h1 className='text-5xl font-bold mb-6'>{title}</h1>
      <p className='lead text-lg'>{description}</p>
    </div>

    {src && (
      <div className={cn('lg:flex-1', reverse ? 'order-1' : 'order-2')}>
        <Image
          src={src}
          alt='Image'
          width={800}
          height={800}
          objectFit='cover'
        />
      </div>
    )}
  </section>
)
