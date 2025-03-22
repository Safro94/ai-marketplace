"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const testimonials = [
  {
    id: 1,
    content:
      "The prompt engineering systems I purchased have completely transformed my content creation process. I'm saving hours each week and producing better results.",
    author: {
      name: "David Wilson",
      role: "Content Marketing Manager",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  },
  {
    id: 2,
    content:
      "As a financial advisor, the custom GPT I bought has become an invaluable assistant. It helps me analyze data and generate reports in a fraction of the time.",
    author: {
      name: "Jennifer Lee",
      role: "Financial Advisor",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  },
  {
    id: 3,
    content:
      "The industry-specific AI solutions available here are exceptional. I found exactly what I needed for my healthcare practice, and implementation was seamless.",
    author: {
      name: "Dr. Michael Brown",
      role: "Healthcare Professional",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Hear from professionals who have transformed their work with our AI assets
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-border/50 bg-secondary/30">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-12 w-12 text-primary/20 mb-6" />
              <p className="text-xl md:text-2xl font-medium mb-8">{testimonials[currentIndex].content}</p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src={testimonials[currentIndex].author.avatar}
                    alt={testimonials[currentIndex].author.name}
                  />
                  <AvatarFallback>{testimonials[currentIndex].author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonials[currentIndex].author.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].author.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 space-x-2">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full p-0 ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
            <Button variant="outline" size="icon" onClick={nextTestimonial} className="h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

