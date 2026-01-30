import { Badge, BarChart3, Code2, Globe, Shield, Timer, Trophy, Users, Zap } from 'lucide-react';
import React from 'react'

export default function FeatureSection() {
    const features = [
  {
    icon: Code2,
    title: "AI Code Sandbox",
    description:
      "Write, run, and test real code in an isolated sandbox. Our AI-powered environment supports multiple languages with secure execution—no mockups, only real code.",
  },
  {
    icon: Zap,
    title: "AI Code Evaluator",
    description:
      "Get instant AI-driven feedback on correctness, performance, edge cases, and code quality. Understand not just what failed, but why it failed.",
  },
  {
    icon: Timer,
    title: "Live Coding Contests",
    description:
      "Participate in real-time coding contests with strict time limits. Compete globally, solve problems faster, and climb the leaderboard.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Analyze your submissions with detailed insights—execution time, memory usage, optimization tips, and AI-generated improvement suggestions.",
  },
  {
    icon: Users,
    title: "Team-Based Challenges",
    description:
      "Collaborate with teammates in shared coding rooms. Solve problems together, review each other’s code, and learn through teamwork.",
  },
  {
    icon: Shield,
    title: "Real-World Industry Problems",
    description:
      "Practice challenges inspired by real company use cases—APIs, authentication, system design, backend logic, and scalable architectures.",
  },
  {
    icon: Globe,
    title: "Global Developer Arena",
    description:
      "Join a global community of developers. Discuss solutions, compare approaches, and learn best practices from top performers worldwide.",
  },
  {
    icon: Trophy,
    title: "Skill Verification & Rankings",
    description:
      "Earn verified badges, rankings, and certificates based on AI-evaluated performance. Showcase your DevForces profile to recruiters.",
  },
];

  return (
    <div>
        <section className="border-b border-border bg-card/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge fontVariant="outline" className="mb-4 border-primary/30 text-primary">
            Platform Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-muted-foreground">
            A comprehensive platform designed to help you become a better web developer 
            through competitive programming and structured learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              
              <div className="relative">
                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </div>
  )
}
