"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

const categories = [
  { id: "prompt-engineering", label: "Prompt Engineering Systems" },
  { id: "custom-gpts", label: "Custom GPTs & AI Agents" },
  { id: "ai-workflows", label: "AI Workflow Automations" },
  { id: "industry-solutions", label: "Industry-Specific Solutions" },
  { id: "content-templates", label: "Content Creation Templates" },
  { id: "data-tools", label: "Data Analysis Tools" },
]

const useCases = [
  { id: "content-creation", label: "Content Creation" },
  { id: "data-analysis", label: "Data Analysis" },
  { id: "customer-support", label: "Customer Support" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "product-development", label: "Product Development" },
  { id: "research", label: "Research" },
]

const ratings = [
  { id: "4-up", label: "4.0 & up" },
  { id: "3-up", label: "3.0 & up" },
  { id: "2-up", label: "2.0 & up" },
]

export default function AssetFilters() {
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleUseCaseChange = (useCaseId: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(useCaseId) ? prev.filter((id) => id !== useCaseId) : [...prev, useCaseId],
    )
  }

  const handleRatingChange = (ratingId: string) => {
    setSelectedRatings((prev) => (prev.includes(ratingId) ? prev.filter((id) => id !== ratingId) : [...prev, ratingId]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedUseCases([])
    setSelectedRatings([])
    setPriceRange([0, 300])
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedUseCases.length > 0 ||
    selectedRatings.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 300

  const FiltersContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
            Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "use-cases", "ratings"]} className="space-y-2">
        <AccordionItem value="categories" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              <Slider
                defaultValue={[0, 300]}
                max={300}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                    className="h-8 w-16 text-xs"
                  />
                </div>
                <span className="text-xs text-muted-foreground">to</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="h-8 w-16 text-xs"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="use-cases" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium">Use Cases</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {useCases.map((useCase) => (
                <div key={useCase.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`usecase-${useCase.id}`}
                    checked={selectedUseCases.includes(useCase.id)}
                    onCheckedChange={() => handleUseCaseChange(useCase.id)}
                  />
                  <Label htmlFor={`usecase-${useCase.id}`} className="text-sm font-normal cursor-pointer">
                    {useCase.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ratings" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium">Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating.id}`}
                    checked={selectedRatings.includes(rating.id)}
                    onCheckedChange={() => handleRatingChange(rating.id)}
                  />
                  <Label
                    htmlFor={`rating-${rating.id}`}
                    className="text-sm font-normal cursor-pointer flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-yellow-500 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {rating.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block sticky top-20">
        <FiltersContent />
      </div>

      {/* Mobile filters button */}
      <div className="md:hidden mb-4">
        <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="w-full">
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-white">
              {selectedCategories.length +
                selectedUseCases.length +
                selectedRatings.length +
                (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-background z-50 md:hidden overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FiltersContent />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all
              </Button>
              <Button onClick={() => setShowMobileFilters(false)}>Apply filters</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

