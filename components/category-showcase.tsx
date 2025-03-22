"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Bot, Workflow, Briefcase, FileText, Database } from "lucide-react"

const categories = [
  {
    id: "prompt-engineering",
    name: "Prompt Engineering Systems",
    description: "Advanced prompt frameworks and systems",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-500",
    count: 124,
  },
  {
    id: "custom-gpts",
    name: "Custom GPTs & AI Agents",
    description: "Specialized AI assistants for specific tasks",
    icon: Bot,
    color: "bg-blue-500/10 text-blue-500",
    count: 87,
  },
  {
    id: "ai-workflows",
    name: "AI Workflow Automations",
    description: "Ready-to-use automation templates",
    icon: Workflow,
    color: "bg-green-500/10 text-green-500",
    count: 56,
  },
  {
    id: "industry-solutions",
    name: "Industry-Specific Solutions",
    description: "Tailored AI assets for specific industries",
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-500",
    count: 42,
  },
  {
    id: "content-templates",
    name: "Content Creation Templates",
    description: "Templates for creating various content types",
    icon: FileText,
    color: "bg-pink-500/10 text-pink-500",
    count: 98,
  },
  {
    id: "data-tools",
    name: "Data Analysis Tools",
    description: "AI tools for analyzing and visualizing data",
    icon: Database,
    color: "bg-cyan-500/10 text-cyan-500",
    count: 35,
  },
]

export default function CategoryShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link href={`/categories/${category.id}`} key={category.id}>
          <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <p className="text-sm font-medium">{category.count} assets</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

