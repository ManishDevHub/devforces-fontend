import { ArrowRight, Badge, Bot, Check, Database, Globe, Lock, Server, Shield, Webhook } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

export default function ProblemSection() {

    const problemCategories = [
  {
    icon: Shield,
    title: "Authentication Systems",
    description: "Build secure auth flows with OAuth, JWT, sessions, and multi-factor authentication",
    count: 342,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bot,
    title: "Bot Automation",
    description: "Create Discord bots, Slack integrations, and automated workflows",
    count: 218,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Server,
    title: "App Backend",
    description: "Design scalable APIs, microservices, and server architectures",
    count: 456,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Webhook,
    title: "Webhooks & Events",
    description: "Implement real-time event systems, webhooks, and pub/sub patterns",
    count: 187,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Optimize queries, design schemas, and handle data migrations",
    count: 298,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Globe,
    title: "Full-Stack Apps",
    description: "Complete end-to-end applications with frontend and backend",
    count: 412,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

const featuredProblems = [
  {
    id: "DF-2847",
    title: "Implement OAuth 2.0 with PKCE Flow",
    difficulty: "Hard",
    category: "Auth Systems",
    solvedBy: 2341,
    acceptance: "32%",
    tags: ["OAuth", "Security", "JWT"],
  },
  {
    id: "DF-1923",
    title: "Build a Rate-Limited Webhook Processor",
    difficulty: "Medium",
    category: "Webhooks",
    solvedBy: 4562,
    acceptance: "48%",
    tags: ["Webhooks", "Queue", "Rate Limiting"],
  },
  {
    id: "DF-3401",
    title: "Discord Bot with Slash Commands",
    difficulty: "Medium",
    category: "Bot Automation",
    solvedBy: 3891,
    acceptance: "54%",
    tags: ["Discord", "Bot", "API"],
  },
  {
    id: "DF-4102",
    title: "Design a Multi-Tenant SaaS Backend",
    difficulty: "Expert",
    category: "App Backend",
    solvedBy: 891,
    acceptance: "18%",
    tags: ["Architecture", "Multi-tenant", "API"],
  },
  {
    id: "DF-2156",
    title: "Real-time Collaboration WebSocket Server",
    difficulty: "Hard",
    category: "Backend",
    solvedBy: 1876,
    acceptance: "28%",
    tags: ["WebSocket", "Real-time", "CRDT"],
  },
  {
    id: "DF-1847",
    title: "Session Management with Redis",
    difficulty: "Easy",
    category: "Auth Systems",
    solvedBy: 8923,
    acceptance: "72%",
    tags: ["Redis", "Sessions", "Cache"],
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Medium":
      return "bg-accent/10 text-accent border-accent/20"
    case "Hard":
      return "bg-primary/10 text-primary border-primary/20"
    case "Expert":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}
  return (
    <div>
  <section id="problems" className="border-b border-border bg-card/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <Badge fontVariant="outline" className="mb-4 border-primary/30 text-primary">
            Problems
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Real-World Challenges
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Practice with thousands of problems covering authentication, webhooks, 
            bot automation, backend architecture, and more.
          </p>
        </div>

        {/* Problem Categories */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problemCategories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50"
            >
              <div className={`inline-flex rounded-lg p-3 ${category.bgColor}`}>
                <category.icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {category.count} problems
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Featured Problems */}
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Featured Problems</h3>
            <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Acceptance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {featuredProblems.map((problem, index) => (
                    <tr key={problem.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        {index % 3 === 0 ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : index % 4 === 0 ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <div className="h-5 w-5" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-mono text-xs text-muted-foreground">{problem.id}</span>
                          <p className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                            {problem.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge fontVariant="outline" className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                        {problem.acceptance}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} fontVariant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
