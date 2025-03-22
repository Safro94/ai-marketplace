"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock data for reviews
const reviews = [
  {
    id: 1,
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2024-02-15",
    title: "Excellent SEO system",
    content:
      "This prompt system has completely transformed how I create content. My articles are now ranking much higher and the process is so much more efficient.",
  },
  {
    id: 2,
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2024-02-10",
    title: "Very helpful for content creation",
    content:
      "The templates are well-designed and easy to use. I would have given 5 stars but I had a few questions about implementation that took some time to figure out.",
  },
  {
    id: 3,
    user: {
      name: "Robert Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2024-01-28",
    title: "Worth every penny",
    content:
      "I was skeptical at first, but this system has paid for itself many times over. My content is ranking better and I'm saving hours of work each week.",
  },
  {
    id: 4,
    user: {
      name: "Lisa Wong",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2024-01-15",
    title: "Game changer for my business",
    content:
      "As someone who struggles with SEO, this system has been invaluable. The prompts are clear and the results are excellent.",
  },
]

// Calculate rating distribution
const ratingCounts = [0, 0, 0, 0, 0] // 1-5 stars
reviews.forEach((review) => {
  ratingCounts[review.rating - 1]++
})

const totalReviews = reviews.length
const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews

export default function AssetReviews({ assetId }: { assetId: number }) {
  const [visibleReviews, setVisibleReviews] = useState(3)

  const loadMoreReviews = () => {
    setVisibleReviews(reviews.length)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating) ? "text-yellow-500" : "text-muted-foreground"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Based on {totalReviews} reviews</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <div className="w-12 text-sm text-muted-foreground">{rating} stars</div>
              <Progress value={(ratingCounts[rating - 1] / totalReviews) * 100} className="h-2" />
              <div className="w-12 text-sm text-right text-muted-foreground">{ratingCounts[rating - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.slice(0, visibleReviews).map((review) => (
          <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.user.name}</div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= review.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500" : "text-muted-foreground"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <h4 className="font-medium mb-1">{review.title}</h4>
            <p className="text-sm text-muted-foreground">{review.content}</p>
          </div>
        ))}

        {visibleReviews < reviews.length && (
          <div className="text-center">
            <Button variant="outline" onClick={loadMoreReviews}>
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

