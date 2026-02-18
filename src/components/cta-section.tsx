import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export default function CtaSection() {
  return (
    <div>
         <section className="relative overflow-hidden border-b border-border py-24 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          <Zap className="h-4 w-4" />
          <span>Join 50,000+ developers today</span>
        </div>

        <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ready to Level Up Your{" "}
          <span className="text-primary">Development Skills</span>?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Start competing in web development contests, solve real-world problems, 
          and build a portfolio that gets you noticed. Free to join, unlimited potential.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
          <p className="text-sm text-muted-foreground">Trusted by developers at</p>E
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Vercel"].map((company) => (
              <span key={company} className="text-sm font-medium text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
