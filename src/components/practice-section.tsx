import { div } from 'framer-motion/client'
import { ArrowRight, Badge, BarChart3, BookOpen, Clock, Layers, Target, Zap } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

export default function PracticeSection() {

    const practiceModules = [
  {
    title: "Beginner Track",
    description: "Master the fundamentals of web development with guided practice and easy problems",
    icon: BookOpen,
    problems: 150,
    duration: "~20 hours",
    progress: 45,
    topics: ["HTML/CSS", "JavaScript", "REST APIs", "Git"],
    level: "Beginner",
    levelColor: "bg-green-500/20 text-green-400",
  },
  {
    title: "Backend Mastery",
    description: "Deep dive into server-side development, databases, and API design patterns",
    icon: Layers,
    problems: 280,
    duration: "~40 hours",
    progress: 23,
    topics: ["Node.js", "Databases", "Auth", "Caching"],
    level: "Intermediate",
    levelColor: "bg-accent/20 text-accent",
  },
  {
    title: "System Design",
    description: "Learn to architect scalable systems and ace technical interviews",
    icon: Target,
    problems: 120,
    duration: "~35 hours",
    progress: 12,
    topics: ["Scaling", "Load Balancing", "Microservices", "CDN"],
    level: "Advanced",
    levelColor: "bg-primary/20 text-primary",
  },
  {
    title: "Speed Challenges",
    description: "Timed coding challenges to improve your problem-solving speed",
    icon: Zap,
    problems: 500,
    duration: "Unlimited",
    progress: 67,
    topics: ["Algorithms", "Data Structures", "Optimization"],
    level: "All Levels",
    levelColor: "bg-secondary text-secondary-foreground",
  },
]

const dailyChallenges = [
  {
    day: "Today",
    title: "Build a JWT Refresh Token System",
    difficulty: "Medium",
    xp: 150,
    completed: false,
  },
  {
    day: "Yesterday",
    title: "Implement Rate Limiting Middleware",
    difficulty: "Easy",
    xp: 100,
    completed: true,
  },
  {
    day: "2 days ago",
    title: "Create a WebSocket Chat Server",
    difficulty: "Hard",
    xp: 200,
    completed: true,
  },
]
  return (
    <div>
            <section id="practice" className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge fontVariant="outline" className="mb-4 border-primary/30 text-primary">
              Practice
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Structured Learning Paths
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Follow curated tracks or challenge yourself with daily problems to level up your skills
            </p>
          </div>
          <Button variant="outline" className="w-fit gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
            View All Tracks
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Practice Modules */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {practiceModules.map((module, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <module.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <Badge fontVariant="outline" className={`mt-1 ${module.levelColor} border-0`}>
                      {module.level}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {module.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{module.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{module.problems} problems</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration}</span>
                </div>
              </div>

              {/* Topics */}
              <div className="mt-4 flex flex-wrap gap-2">
                {module.topics.map((topic) => (
                  <Badge key={topic} fontVariant="secondary" className="bg-secondary text-secondary-foreground">
                    {topic}
                  </Badge>
                ))}
              </div>

              <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Continue Track
              </Button>
            </div>
          ))}
        </div>

        {/* Daily Challenges */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Daily Challenges</h3>
            <span className="text-sm text-muted-foreground">Earn bonus XP every day!</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {dailyChallenges.map((challenge, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 transition-all ${
                  challenge.completed
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{challenge.day}</span>
                  <Badge 
                    fontVariant="outline" 
                    className={
                      challenge.difficulty === "Easy" 
                        ? "border-green-500/30 text-green-400" 
                        : challenge.difficulty === "Medium"
                        ? "border-accent/30 text-accent"
                        : "border-primary/30 text-primary"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                <h4 className="mt-2 font-medium text-foreground">{challenge.title}</h4>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-accent">+{challenge.xp} XP</span>
                  {challenge.completed ? (
                    <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                      Solve Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    </div>
  )
}
