import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Check, DollarSign, BarChart, Shield } from "lucide-react"
import CreatorFAQ from "@/components/creator-faq"

export const metadata: Metadata = {
  title: "Become a Creator | Sell Your AI Assets",
  description:
    "Join our marketplace as a creator and sell your AI assets to professionals worldwide. Turn your expertise into a sustainable revenue stream.",
  alternates: {
    canonical: "/creators",
  },
  openGraph: {
    title: "Become a Creator | Sell Your AI Assets",
    description:
      "Join our marketplace as a creator and sell your AI assets to professionals worldwide. Turn your expertise into a sustainable revenue stream.",
    url: "/creators",
  },
}

export default function CreatorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="hero-gradient absolute inset-0 z-0 opacity-20"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Share your AI expertise with the world</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join our marketplace as a creator and turn your AI assets into a sustainable revenue stream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/creators/apply">
                  Apply as Creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#benefits">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Why Sell on AIAssets?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Join a growing community of AI creators and reach customers worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-medium mb-2">Competitive Commission</h3>
                <p className="text-muted-foreground">
                  Keep 85% of your sales with our industry-leading commission structure.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-medium mb-2">Powerful Analytics</h3>
                <p className="text-muted-foreground">
                  Track your sales, customer engagement, and performance with detailed analytics.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure Platform</h3>
                <p className="text-muted-foreground">
                  We handle payments, delivery, and customer support so you can focus on creation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Start selling your AI assets in just a few simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 relative">
                <span className="text-lg font-bold">1</span>
                <div className="absolute hidden md:block h-1 bg-secondary w-full right-0 top-1/2 -z-10 translate-x-1/2"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Apply</h3>
              <p className="text-sm text-muted-foreground">
                Submit your application to become a creator on our platform.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 relative">
                <span className="text-lg font-bold">2</span>
                <div className="absolute hidden md:block h-1 bg-secondary w-full right-0 top-1/2 -z-10 translate-x-1/2"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Create</h3>
              <p className="text-sm text-muted-foreground">
                Upload your AI assets and set your pricing and licensing terms.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4 relative">
                <span className="text-lg font-bold">3</span>
                <div className="absolute hidden md:block h-1 bg-secondary w-full right-0 top-1/2 -z-10 translate-x-1/2"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Publish</h3>
              <p className="text-sm text-muted-foreground">
                After review, your assets will be published on our marketplace.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-lg font-bold">4</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Earn</h3>
              <p className="text-sm text-muted-foreground">Start earning revenue as customers purchase your assets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Types */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Who Can Become a Creator?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We welcome creators from various backgrounds with expertise in AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-6 border border-border/50">
              <h3 className="text-xl font-medium mb-4">AI Prompt Engineers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Create and sell advanced prompt engineering systems</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Share specialized prompt frameworks for different use cases</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Offer industry-specific prompt collections</span>
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border/50">
              <h3 className="text-xl font-medium mb-4">Custom GPT Creators</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Sell specialized GPTs for specific industries or tasks</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Create AI agents with unique capabilities</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Develop multi-agent systems for complex workflows</span>
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border/50">
              <h3 className="text-xl font-medium mb-4">AI Workflow Developers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Create automation workflows connecting AI tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Develop integration templates for business processes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Build end-to-end solutions for specific use cases</span>
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 border border-border/50">
              <h3 className="text-xl font-medium mb-4">Industry Experts</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Share domain-specific AI solutions for your industry</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Create specialized templates for professional workflows</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Develop AI assets that solve industry-specific challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Everything you need to know about selling on AIAssets
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <CreatorFAQ />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Share Your AI Assets?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our growing community of creators and start earning from your AI expertise.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link href="/creators/apply">
                  Apply as Creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

