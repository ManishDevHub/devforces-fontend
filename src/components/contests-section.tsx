import { ArrowRight, Badge, Calendar, Clock, Trophy, Users } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

export default function ContestSection() {
    const upcomingContests = [
  {
    id: 1,
    title: "DevForces Round #847 (Div. 2)",
    date: "Feb 2, 2026",
    time: "19:00 UTC",
    duration: "2 hours",
    participants:1200,
    type: "Rated",
    difficulty: "Intermediate",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Auth System Challenge",
    date: "Feb 5, 2026",
    time: "14:00 UTC",
    duration: "2 hours",
    participants: 3200,
    type: "Rated",
    difficulty: "Advanced",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Backend Masters Cup",
    date: "Feb 8, 2026",
    time: "10:00 UTC",
    duration: "2 hours",
    participants: 6800,
    type: "Rated",
    difficulty: "Expert",
    status: "upcoming",
  },
]

const recentContests = [
  {
    id: 4,
    title: "DevForces Round #846 (Div. 1)",
    participants: 5200,
    winner: "codemaster_alex",
    rating: "+145",
  },
  {
    id: 5,
    title: "Webhook Integration Sprint",
    participants: 400,
    winner: "fullstack_ninja",
    rating: "+98",
  },
  {
    id: 6,
    title: "API Design Championship",
    participants: 1300,
    winner: "backend_wizard",
    rating: "+167",
  },
]
  return (
    <div>
           <section id="contests" className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Badge fontVariant="outline" className="mb-4 border-primary/30 text-primary">
              Contests
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Compete in Real-Time
            </h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of developers in weekly rated contests
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
            View All Contests
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Upcoming Contests */}
        <div className="mt-12">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Upcoming Contests</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            {upcomingContests.map((contest) => (
              <div
                key={contest.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="absolute right-0 top-0 h-24 w-24 bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                
                <div className="flex items-start justify-between">
                  <Badge 
                    fontVariant="secondary" 
                    className={`
                      ${contest.difficulty === "Intermediate" ? "bg-accent/20 text-accent" : ""}
                      ${contest.difficulty === "Advanced" ? "bg-primary/20 text-primary" : ""}
                      ${contest.difficulty === "Expert" ? "bg-destructive/20 text-destructive" : ""}
                    `}
                  >
                    {contest.difficulty}
                  </Badge>
                  <Badge fontVariant="outline" className="border-primary/30 text-primary">
                    {contest.type}
                  </Badge>
                </div>

                <h4 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {contest.title}
                </h4>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{contest.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{contest.time} • {contest.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{contest.participants.toLocaleString()} registered</span>
                  </div>
                </div>

                <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Register Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="mt-16">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Recent Results</h3>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Contest
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Winner
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Rating Δ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentContests.map((contest) => (
                  <tr key={contest.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                        {contest.title}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                      {contest.participants.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">{contest.winner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-green-400">{contest.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
