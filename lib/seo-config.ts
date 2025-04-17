import { APP_DATA, SUPPORT_EMAIL } from './constants'

// Base SEO configuration
export const siteConfig = {
  name: APP_DATA.name,
  url: APP_DATA.url,
  ogImage: '/images/og-image.jpg',
  description: 'Discover and purchase high-quality AI assets for your projects',
  links: {
    twitter: `https://twitter.com/${APP_DATA.lowercaseName}`,
    github: `https://github.com/${APP_DATA.lowercaseName}`,
  },
  creator: `@${APP_DATA.lowercaseName}`,
  keywords: [
    'AI hub',
    'AI market hub',
    'AI assets',
    'prompt engineering',
    'custom GPTs',
    'AI marketplace',
    'AI tools',
    'AI workflows',
    'AI templates',
    'AI solutions',
  ],
  authors: [
    {
      name: `${APP_DATA.name} Team`,
      url: APP_DATA.url,
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
    mpn: `${APP_DATA.lowercaseName}-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: APP_DATA.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${APP_DATA.url}/assets/${product.id}`,
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
    name: APP_DATA.name,
    url: APP_DATA.url,
    logo: `${APP_DATA.url}/images/logo.png`,
    sameAs: [
      `https://twitter.com/${APP_DATA.lowercaseName}`,
      `https://github.com/${APP_DATA.lowercaseName}`,
      `https://linkedin.com/company/${APP_DATA.lowercaseName}`,
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
