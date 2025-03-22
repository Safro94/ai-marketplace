// Base SEO configuration
export const siteConfig = {
  name: "AIAssets Marketplace",
  url: "https://aiassets-marketplace.com",
  ogImage: "/images/og-image.jpg",
  description: "Discover and purchase high-quality AI assets for your projects",
  links: {
    twitter: "https://twitter.com/aiassets",
    github: "https://github.com/aiassets",
  },
  creator: "@aiassets",
  keywords: [
    "AI assets",
    "prompt engineering",
    "custom GPTs",
    "AI marketplace",
    "AI tools",
    "AI workflows",
    "AI templates",
    "AI solutions",
  ],
  authors: [
    {
      name: "AIAssets Team",
      url: "https://aiassets-marketplace.com",
    },
  ],
}

// Generate structured data for the marketplace
export function generateProductJsonLd(product: {
  id: number
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
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    sku: `asset-${product.id}`,
    mpn: `aiassets-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "AIAssets",
    },
    offers: {
      "@type": "Offer",
      url: `https://aiassets-marketplace.com/assets/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    category: product.category,
    author: {
      "@type": "Person",
      name: product.creator.name,
    },
  }
}

// Generate structured data for the organization
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AIAssets Marketplace",
    url: "https://aiassets-marketplace.com",
    logo: "https://aiassets-marketplace.com/images/logo.png",
    sameAs: ["https://twitter.com/aiassets", "https://github.com/aiassets", "https://linkedin.com/company/aiassets"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-555-5555",
      contactType: "customer service",
      email: "support@aiassets-marketplace.com",
      availableLanguage: "English",
    },
  }
}

// Generate structured data for FAQs
export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

