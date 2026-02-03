"use client"

import React from "react"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  ChevronRight,
  Code,
  Shield,
  Bot,
  Workflow,
  Zap,
  Trophy,
  TrendingUp,
  Hash,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

type Difficulty = "Easy" | "Medium" | "Hard"
type Category = "Auth System" | "Backend" | "Bot Automation" | "API Design"

interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  category: Category
  acceptance: number
  submissions: number
}

const problems: Problem[] = [
  { id: "DF001", title: "JWT Token Refresh Flow", difficulty: "Easy", category: "Auth System", acceptance: 78.5, submissions: 12450 },
  { id: "DF002", title: "OAuth2 Provider Integration", difficulty: "Medium", category: "Auth System", acceptance: 52.3, submissions: 8920 },
  { id: "DF003", title: "Multi-Factor Authentication", difficulty: "Hard", category: "Auth System", acceptance: 31.2, submissions: 5670 },
  { id: "DF004", title: "RESTful API Rate Limiter", difficulty: "Medium", category: "API Design", acceptance: 45.8, submissions: 15230 },
  { id: "DF005", title: "GraphQL Schema Design", difficulty: "Medium", category: "API Design", acceptance: 48.1, submissions: 9870 },
  { id: "DF006", title: "WebSocket Connection Manager", difficulty: "Hard", category: "Backend", acceptance: 28.9, submissions: 4560 },
  { id: "DF007", title: "Discord Command Handler", difficulty: "Easy", category: "Bot Automation", acceptance: 82.1, submissions: 18930 },
  { id: "DF008", title: "Database Connection Pooling", difficulty: "Medium", category: "Backend", acceptance: 55.4, submissions: 11200 },
  { id: "DF009", title: "Slack Event Processor", difficulty: "Medium", category: "Bot Automation", acceptance: 49.7, submissions: 7650 },
  { id: "DF010", title: "API Versioning Strategy", difficulty: "Easy", category: "API Design", acceptance: 71.3, submissions: 14780 },
  { id: "DF011", title: "Session-Based Auth with Redis", difficulty: "Medium", category: "Auth System", acceptance: 58.2, submissions: 9340 },
  { id: "DF012", title: "Microservices Message Queue", difficulty: "Hard", category: "Backend", acceptance: 25.6, submissions: 3890 },
  { id: "DF013", title: "Telegram Bot State Machine", difficulty: "Hard", category: "Bot Automation", acceptance: 33.4, submissions: 5120 },
  { id: "DF014", title: "OpenAPI Spec Generator", difficulty: "Medium", category: "API Design", acceptance: 44.9, submissions: 6780 },
  { id: "DF015", title: "Role-Based Access Control", difficulty: "Medium", category: "Auth System", acceptance: 51.8, submissions: 10560 },
  { id: "DF016", title: "Cron Job Scheduler", difficulty: "Easy", category: "Backend", acceptance: 75.2, submissions: 16890 },
  { id: "DF017", title: "GitHub Actions Bot", difficulty: "Medium", category: "Bot Automation", acceptance: 46.3, submissions: 8210 },
  { id: "DF018", title: "API Gateway Implementation", difficulty: "Hard", category: "API Design", acceptance: 29.7, submissions: 4230 },
]

const categories: { name: Category; icon: React.ReactNode; color: string }[] = [
  { name: "Auth System", icon: <Shield className="h-4 w-4" />, color: "text-primary" },
  { name: "Backend", icon: <Code className="h-4 w-4" />, color: "text-chart-2" },
  { name: "Bot Automation", icon: <Bot className="h-4 w-4" />, color: "text-chart-3" },
  { name: "API Design", icon: <Workflow className="h-4 w-4" />, color: "text-chart-4" },
]

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"]

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
        difficulty === "Easy" && "bg-easy/10 text-easy border border-easy/20",
        difficulty === "Medium" && "bg-medium/10 text-medium border border-medium/20",
        difficulty === "Hard" && "bg-hard/10 text-hard border border-hard/20"
      )}
    >
      {difficulty}
    </span>
  )
}

function CategoryIcon({ category }: { category: Category }) {
  const cat = categories.find((c) => c.name === category)
  return cat ? <span className={cat.color}>{cat.icon}</span> : null
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All")
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDifficulty =
        selectedDifficulty === "All" || problem.difficulty === selectedDifficulty
      const matchesCategory =
        selectedCategory === "All" || problem.category === selectedCategory
      return matchesSearch && matchesDifficulty && matchesCategory
    })
  }, [searchQuery, selectedDifficulty, selectedCategory])

  const stats = useMemo(() => {
    return {
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.1_250),transparent)]" />

    <Navbar></Navbar>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Challenge Yourself</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl text-balance mb-4">
            Problem Set
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            Master real-world developer challenges. Build authentication systems, backends, bots, and APIs that scale.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
          <StatCard
            icon={<Hash className="h-5 w-5 text-foreground" />}
            label="Total Problems"
            value={problems.length}
            color="bg-secondary"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-easy" />}
            label="Easy"
            value={stats.easy}
            color="bg-easy/10"
          />
          <StatCard
            icon={<Zap className="h-5 w-5 text-medium" />}
            label="Medium"
            value={stats.medium}
            color="bg-medium/10"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5 text-hard" />}
            label="Hard"
            value={stats.hard}
            color="bg-hard/10"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by problem name or ID (e.g., DF001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-4 text-base bg-card border-border focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedDifficulty === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty("All")}
                className={cn(
                  "h-8 text-xs font-medium",
                  selectedDifficulty === "All"
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                )}
              >
                All
              </Button>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? "All" : difficulty)}
                  className={cn(
                    "h-8 text-xs font-medium border transition-all",
                    selectedDifficulty === difficulty
                      ? difficulty === "Easy"
                        ? "border-easy bg-easy/10 text-easy hover:bg-easy/20"
                        : difficulty === "Medium"
                          ? "border-medium bg-medium/10 text-medium hover:bg-medium/20"
                          : "border-hard bg-hard/10 text-hard hover:bg-hard/20"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  )}
                >
                  {difficulty}
                </Button>
              ))}
            </div>

            <div className="h-6 w-px bg-border hidden sm:block" />

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(category.name === selectedCategory ? "All" : category.name)
                  }
                  className={cn(
                    "h-8 text-xs font-medium gap-1.5 border transition-all",
                    selectedCategory === category.name
                      ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  )}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedDifficulty !== "All" || selectedCategory !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedDifficulty("All")
                  setSelectedCategory("All")
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground ml-auto"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProblems.length}</span> of{" "}
            <span className="font-semibold text-foreground">{problems.length}</span> problems
          </p>
        </div>

        {/* Problem List */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-secondary/30 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-2 lg:col-span-1">ID</div>
            <div className="col-span-6 lg:col-span-5">Problem</div>
            <div className="col-span-4 lg:col-span-2 hidden sm:block">Category</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2 text-right hidden lg:block">Acceptance</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div
                  key={problem.id}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all cursor-pointer group",
                    "hover:bg-primary/5 hover:border-l-2 hover:border-l-primary hover:pl-[22px]",
                    index % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                  )}
                >
                  <div className="col-span-2 lg:col-span-1">
                    <span className="font-mono text-sm font-medium text-primary">{problem.id}</span>
                  </div>
                  <div className="col-span-6 lg:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {problem.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                  <div className="col-span-4 lg:col-span-2 hidden sm:block">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CategoryIcon category={problem.category} />
                      <span className="hidden xl:inline truncate">{problem.category}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </div>
                  <div className="col-span-2 text-right hidden lg:block">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-foreground">
                        {problem.acceptance.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {problem.submissions.toLocaleString()} submissions
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No problems found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your search query or filters to find what you&apos;re looking for
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDifficulty("All")
                    setSelectedCategory("All")
                  }}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Ready to level up your skills?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Join our next contest
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
