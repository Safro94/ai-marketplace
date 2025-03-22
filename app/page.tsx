import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import FeaturedAssets from "@/components/featured-assets"
import CategoryShowcase from "@/components/category-showcase"
import TestimonialSection from "@/components/testimonial-section"
import CreatorCTA from "@/components/creator-cta"

export const metadata: Metadata = {
  title: "Premium AI Assets Marketplace | Buy and Sell AI Tools and Templates",
  description:
    "Discover high-quality AI prompt systems, custom GPTs, and specialized tools created by experts. The leading marketplace for AI assets.",
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="hero-gradient absolute inset-0 z-0 opacity-20"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 font-medium">
                Just Launched
              </span>
              <span className="mx-2 h-0.5 w-0.5 rounded-full bg-border"></span>
              <span className="text-xs">Discover our AI asset marketplace</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              The marketplace for premium{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
                AI assets
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover high-quality AI prompt systems, custom GPTs, and specialized tools created by experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/explore">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/creators">Become a Creator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Assets</h2>
              <p className="text-muted-foreground mt-1">Handpicked premium assets from our marketplace</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" asChild>
              <Link href="/explore">
                View all assets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedAssets />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore our curated categories of AI assets designed for specific use cases
            </p>
          </div>
          <CategoryShowcase />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose AIAssets</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We're building the premier marketplace for high-quality AI assets
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 border border-border/50 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium mb-2">Curated Quality</h3>
              <p className="text-muted-foreground">
                Every asset is reviewed for quality and effectiveness before being listed on our marketplace.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border/50 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Access</h3>
              <p className="text-muted-foreground">
                Get immediate access to your purchased assets and start implementing them in your projects.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border/50 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">
                Our platform ensures secure payments and protects both buyers and creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Creator CTA */}
      <CreatorCTA />
    </div>
  )
}

