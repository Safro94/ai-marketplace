import { SUPPORT_EMAIL } from './constants'

// Base SEO configuration
export const siteConfig = {
  name: 'AIAssetHub',
  url: 'https://www.aiassethub.pro',
  ogImage: '/og-image.jpg',
  description: 'Discover and purchase high-quality AI assets for your projects',
  links: {
    twitter: 'https://x.com/AIAssetHub',
    linkedin: 'https://www.linkedin.com/company/aiassethub',
  },
  creator: `@aiassethub`,
  keywords: [
    'AI market hub',
    'AI assets',
    'AI marketplace',
    'AI tools',
    'AI workflow automation',
    'AI templates',
    'AI solutions',
    'AI Artwork',
    'AI Images',
    'AI Products',
    'AI generated art',
    'AI artwork marketplace',
    'AI image prompts',
    'AI prompt marketplace',
    'Midjourney prompts',
    'prompt engineering',
    'custom GPTs',
    'Buy AI prompts',
    'AI marketing tools',
    'AI art generator',
  ],
  authors: [
    {
      name: `AIAssetHub Team`,
      url: 'https://www.aiassethub.pro',
    },
  ],
}

// Generate structured data for the marketplace
export function generateProductJsonLd(product: {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  creator: {
    name: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: `asset-${product.id}`,
    mpn: `aiassethub-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'AIAssetHub',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.aiassethub.pro/assets/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    category: product.category,
    author: {
      '@type': 'Person',
      name: product.creator.name,
    },
  }
}

// Generate structured data for the organization
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIAssetHub',
    url: 'https://www.aiassethub.pro',
    logo: `https://www.aiassethub.pro/images/logo.png`,
    sameAs: [
      `https://x.com/AIAssetHub`,
      `https://linkedin.com/company/aiassethub`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SUPPORT_EMAIL,
      availableLanguage: 'English',
    },
  }
}

// Generate structured data for FAQs
export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
