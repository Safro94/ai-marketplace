"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for related assets
const relatedAssets = [
  {
    id: 101,
    title: "Content Calendar Generator",
    description: "AI system for planning and scheduling content across multiple platforms.",
    price: 59,
    category: "Content Templates",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
  },
  {
    id: 102,
    title: "Keyword Research Framework",
    description: "Advanced prompts for discovering high-value keywords and search intent.",
    price: 49,
    category: "Prompt Engineering",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
  },
  {
    id: 103,
    title: "Blog Post Optimizer",
    description: "AI system that enhances existing content for better SEO performance.",
    price: 69,
    category: "AI Workflows",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
  },
]

export default function RelatedAssets({ currentAssetId }: { currentAssetId: number }) {
  // Filter out the current asset if it's in the related assets
  const filteredAssets = relatedAssets.filter((asset) => asset.id !== currentAssetId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredAssets.map((asset) => (
        <Link href={`/assets/${asset.id}`} key={asset.id}>
          <Card className="h-full overflow-hidden border-border/50 card-hover">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.title}
                  fill
                  className="object-cover transition-all"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-secondary/80 text-xs">
                  {asset.category}
                </Badge>
                <span className="text-sm font-bold">${asset.price}</span>
              </div>
              <h3 className="text-sm font-semibold mb-1 line-clamp-1">{asset.title}</h3>
              <div className="flex items-center text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-yellow-500 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{asset.rating}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

