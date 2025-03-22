import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import AssetReviews from "@/components/asset-reviews"
import RelatedAssets from "@/components/related-assets"
import PurchaseOptions from "@/components/purchase-options"
import Script from "next/script"
import { generateProductJsonLd } from "@/lib/seo-config"

// Mock data for a single asset
const getAsset = (id: string) => {
  const assetId = Number.parseInt(id)

  // This would be a database query in a real application
  const asset = {
    id: assetId,
    title: "Advanced SEO Content Generation System",
    description:
      "A comprehensive prompt system for creating SEO-optimized content that ranks well in search engines and drives organic traffic to your website.",
    longDescription: `
      <p>The Advanced SEO Content Generation System is a complete framework designed to help content creators, marketers, and SEO professionals create highly optimized content that ranks well in search engines.</p>
      
      <h3>What's Included:</h3>
      <ul>
        <li>Master prompt framework for SEO-optimized blog posts</li>
        <li>Keyword research and integration prompts</li>
        <li>Title and meta description optimization system</li>
        <li>Content structure templates for different content types</li>
        <li>On-page SEO checklist and implementation guide</li>
        <li>Semantic SEO enhancement prompts</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Create SEO-optimized content in half the time</li>
        <li>Improve your search engine rankings</li>
        <li>Drive more organic traffic to your website</li>
        <li>Ensure your content meets search intent</li>
        <li>Maintain a consistent content quality standard</li>
      </ul>
      
      <h3>Who This Is For:</h3>
      <p>Content creators, digital marketers, SEO professionals, and business owners who want to improve their organic search visibility and create content that ranks.</p>
    `,
    price: 79,
    category: "Prompt Engineering",
    useCase: "Content Creation",
    image: "/placeholder.svg?height=600&width=800",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    creator: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      username: "sarahjohnson",
      bio: "SEO specialist and content strategist with 8+ years of experience helping businesses rank higher in search engines.",
    },
    rating: 4.9,
    reviews: 124,
    features: [
      "Complete prompt system with 20+ templates",
      "Detailed implementation guide",
      "Regular updates as SEO best practices evolve",
      "Email support for implementation questions",
      "Compatible with GPT-4, Claude, and other LLMs",
    ],
    requirements: [
      "Access to ChatGPT Plus, Claude, or similar LLM",
      "Basic understanding of content creation",
      "No coding knowledge required",
    ],
    created: "2023-11-15",
    updated: "2024-02-20",
    sales: 856,
  }

  return asset
}

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  const asset = getAsset(params.id)

  return {
    title: asset.title,
    description: asset.description,
    alternates: {
      canonical: `/assets/${params.id}`,
    },
    openGraph: {
      title: asset.title,
      description: asset.description,
      type: "product",
      url: `/assets/${params.id}`,
      images: [
        {
          url: asset.image,
          width: 800,
          height: 600,
          alt: asset.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: asset.title,
      description: asset.description,
      images: [asset.image],
    },
  }
}

export default function AssetPage({ params }: { params: { id: string } }) {
  const asset = getAsset(params.id)

  if (!asset) {
    notFound()
  }

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(asset)),
        }}
      />
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Asset Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="bg-secondary/80">
                    {asset.category}
                  </Badge>
                  <Badge variant="outline">{asset.useCase}</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-3">{asset.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={asset.creator.avatar} alt={asset.creator.name} />
                      <AvatarFallback>{asset.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      by <span className="font-medium">{asset.creator.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-yellow-500 mr-1"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{asset.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({asset.reviews} reviews)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{asset.sales} sales</div>
                </div>
              </div>

              {/* Asset Gallery */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/50">
                <Image
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {asset.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/50"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${asset.title} preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Asset Details */}
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-6">
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: asset.longDescription }}
                  />
                </TabsContent>
                <TabsContent value="features" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Features</h3>
                      <ul className="space-y-2">
                        {asset.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {asset.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-6">
                  <AssetReviews assetId={asset.id} />
                </TabsContent>
              </Tabs>

              {/* Creator Info (Mobile) */}
              <Card className="lg:hidden border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={asset.creator.avatar} alt={asset.creator.name} />
                      <AvatarFallback>{asset.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{asset.creator.name}</h3>
                      <p className="text-sm text-muted-foreground">Creator</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">{asset.creator.bio}</p>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Related Assets */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">You May Also Like</h2>
                <RelatedAssets currentAssetId={asset.id} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-20">
              {/* Purchase Options */}
              <PurchaseOptions asset={asset} />

              {/* Creator Info (Desktop) */}
              <Card className="hidden lg:block border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={asset.creator.avatar} alt={asset.creator.name} />
                      <AvatarFallback>{asset.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{asset.creator.name}</h3>
                      <p className="text-sm text-muted-foreground">Creator</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">{asset.creator.bio}</p>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Asset Information */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Asset Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{asset.created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last updated</span>
                      <span>{asset.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span>{asset.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Use Case</span>
                      <span>{asset.useCase}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

