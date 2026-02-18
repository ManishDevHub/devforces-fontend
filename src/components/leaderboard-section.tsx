import { ArrowRight, Crown, Medal, Minus, TrendingDown, TrendingUp, Trophy } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export default function LeaderboardSection() {



const topUsers = [
  {
    rank: 1,
    username: "codemaster_alex",
    country: "US",
    rating: 3847,
    maxRating: 3901,
    solved: 2847,
    contests: 156,
    change: "+15",
    tier: "Legendary",
    tierColor: "text-yellow-400",
  },
  {
    rank: 2,
    username: "fullstack_ninja",
    country: "DE",
    rating: 3712,
    maxRating: 3756,
    solved: 2634,
    contests: 142,
    change: "+8",
    tier: "Legendary",
    tierColor: "text-yellow-400",
  },
  {
    rank: 3,
    username: "backend_wizard",
    country: "IN",
    rating: 3689,
    maxRating: 3702,
    solved: 2521,
    contests: 138,
    change: "-3",
    tier: "Legendary",
    tierColor: "text-yellow-400",
  },
  {
    rank: 4,
    username: "api_architect",
    country: "UK",
    rating: 3542,
    maxRating: 3598,
    solved: 2398,
    contests: 127,
    change: "+22",
    tier: "Grandmaster",
    tierColor: "text-destructive",
  },
  {
    rank: 5,
    username: "devops_king",
    country: "CA",
    rating: 3487,
    maxRating: 3512,
    solved: 2267,
    contests: 119,
    change: "0",
    tier: "Grandmaster",
    tierColor: "text-destructive",
  },
  {
    rank: 6,
    username: "auth_expert",
    country: "JP",
    rating: 3421,
    maxRating: 3445,
    solved: 2189,
    contests: 114,
    change: "+5",
    tier: "Grandmaster",
    tierColor: "text-destructive",
  },
  {
    rank: 7,
    username: "webhook_master",
    country: "FR",
    rating: 3356,
    maxRating: 3401,
    solved: 2067,
    contests: 108,
    change: "-12",
    tier: "Master",
    tierColor: "text-primary",
  },
  {
    rank: 8,
    username: "database_guru",
    country: "BR",
    rating: 3298,
    maxRating: 3334,
    solved: 1945,
    contests: 102,
    change: "+18",
    tier: "Master",
    tierColor: "text-primary",
  },
]

const ratingTiers = [
  { name: "Legendary", range: "3600+", color: "bg-yellow-400", count: 127 },
  { name: "Grandmaster", range: "3200-3599", color: "bg-destructive", count: 456 },
  { name: "Master", range: "2800-3199", color: "bg-primary", count: 1234 },
  { name: "Expert", range: "2400-2799", color: "bg-accent", count: 3456 },
  { name: "Specialist", range: "2000-2399", color: "bg-green-500", count: 8901 },
]

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
  return <span className="w-5 text-center font-mono text-muted-foreground">#{rank}</span>
}

const getChangeIcon = (change: string) => {
  const num = parseInt(change)
  if (num > 0) return <TrendingUp className="h-4 w-4 text-green-400" />
  if (num < 0) return <TrendingDown className="h-4 w-4 text-destructive" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}
  return (
    <div>
          <section id="leaderboard" className="border-b border-border bg-card/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Leaderboard
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Global Rankings
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top developers competing for glory and recognition
            </p>
          </div>
          <Button variant="outline" className="w-fit gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
            Full Leaderboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Main Leaderboard Table */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Rating
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                        Solved
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topUsers.map((user) => (
                      <tr key={user.rank} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(user.rank)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={`font-medium ${user.tierColor}`}>
                                {user.username}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.tier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-mono font-bold text-foreground">{user.rating}</p>
                          <p className="font-mono text-xs text-muted-foreground">max: {user.maxRating}</p>
                        </td>
                        <td className="hidden px-4 py-4 font-mono text-muted-foreground sm:table-cell">
                          {user.solved}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {getChangeIcon(user.change)}
                            <span className={`font-mono text-sm ${
                              parseInt(user.change) > 0 
                                ? "text-green-400" 
                                : parseInt(user.change) < 0 
                                ? "text-destructive" 
                                : "text-muted-foreground"
                            }`}>
                              {user.change}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Rating Distribution Sidebar */}
          <div className="space-y-6">
            {/* Rating Tiers */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Trophy className="h-5 w-5 text-accent" />
                Rating Tiers
              </h3>
              <div className="mt-4 space-y-3">
                {ratingTiers.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                      <span className="text-sm text-foreground">{tier.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-muted-foreground">{tier.range}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({tier.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats Card */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold text-foreground">Your Ranking</h3>
              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">#12,847</p>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">1,847</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">234</p>
                    <p className="text-xs text-muted-foreground">Solved</p>
                  </div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  View Your Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
  )
}
