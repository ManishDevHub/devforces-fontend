"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Crown, Zap, Target, Flame, Star, Code2, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"

type TimeFilter = "all" | "monthly" | "weekly"
type Category = "all" | "rating" | "problems" | "contests"

interface User {
  id: string
  rank: number
  username: string
  rating: number
  maxRating: number
  problemsSolved: number
  contestsParticipated: number
  winRate: number
  streak: number
  trend: "up" | "down" | "same"
  trendValue: number
  country: string
  tier: "legendary" | "grandmaster" | "master" | "expert" | "specialist" | "pupil"
  isCurrentUser?: boolean
}

const USERS: User[] = [
  { id: "U001", rank: 1, username: "CodeMaster_X", rating: 3245, maxRating: 3301, problemsSolved: 1847, contestsParticipated: 156, winRate: 78, streak: 45, trend: "up", trendValue: 3, country: "US", tier: "legendary" },
  { id: "U002", rank: 2, username: "AlgoKing", rating: 3198, maxRating: 3220, problemsSolved: 1756, contestsParticipated: 142, winRate: 72, streak: 38, trend: "up", trendValue: 1, country: "CN", tier: "legendary" },
  { id: "U003", rank: 3, username: "ByteWizard", rating: 3156, maxRating: 3180, problemsSolved: 1698, contestsParticipated: 138, winRate: 69, streak: 52, trend: "down", trendValue: 2, country: "IN", tier: "legendary" },
  { id: "U004", rank: 4, username: "NeuralNinja", rating: 3089, maxRating: 3120, problemsSolved: 1623, contestsParticipated: 129, winRate: 65, streak: 28, trend: "same", trendValue: 0, country: "JP", tier: "grandmaster" },
  { id: "U005", rank: 5, username: "QuantumCoder", rating: 3045, maxRating: 3100, problemsSolved: 1587, contestsParticipated: 124, winRate: 63, streak: 33, trend: "up", trendValue: 5, country: "RU", tier: "grandmaster" },
  { id: "U006", rank: 6, username: "SyntaxSage", rating: 2987, maxRating: 3010, problemsSolved: 1534, contestsParticipated: 118, winRate: 61, streak: 21, trend: "up", trendValue: 2, country: "DE", tier: "grandmaster" },
  { id: "U007", rank: 7, username: "LogicLord", rating: 2934, maxRating: 2980, problemsSolved: 1489, contestsParticipated: 112, winRate: 58, streak: 19, trend: "down", trendValue: 1, country: "KR", tier: "grandmaster" },
  { id: "U008", rank: 8, username: "BinaryBeast", rating: 2876, maxRating: 2920, problemsSolved: 1423, contestsParticipated: 105, winRate: 55, streak: 25, trend: "up", trendValue: 4, country: "BR", tier: "master" },
  { id: "U009", rank: 9, username: "RecursionKing", rating: 2845, maxRating: 2890, problemsSolved: 1378, contestsParticipated: 98, winRate: 52, streak: 17, trend: "same", trendValue: 0, country: "CA", tier: "master" },
  { id: "U010", rank: 10, username: "HashMapHero", rating: 2798, maxRating: 2850, problemsSolved: 1334, contestsParticipated: 94, winRate: 50, streak: 14, trend: "down", trendValue: 3, country: "UK", tier: "master" },
  { id: "U011", rank: 11, username: "StackOverflow", rating: 2756, maxRating: 2800, problemsSolved: 1289, contestsParticipated: 89, winRate: 48, streak: 22, trend: "up", trendValue: 2, country: "AU", tier: "master" },
  { id: "U012", rank: 12, username: "TreeTraverser", rating: 2712, maxRating: 2760, problemsSolved: 1245, contestsParticipated: 85, winRate: 46, streak: 11, trend: "up", trendValue: 1, country: "FR", tier: "master" },
  { id: "U013", rank: 13, username: "GraphGuru", rating: 2678, maxRating: 2720, problemsSolved: 1198, contestsParticipated: 81, winRate: 44, streak: 16, trend: "down", trendValue: 2, country: "NL", tier: "expert" },
  { id: "U014", rank: 14, username: "DPDynamo", rating: 2634, maxRating: 2680, problemsSolved: 1156, contestsParticipated: 77, winRate: 42, streak: 9, trend: "same", trendValue: 0, country: "SE", tier: "expert" },
  { id: "U015", rank: 15, username: "GreedyGenius", rating: 2589, maxRating: 2640, problemsSolved: 1112, contestsParticipated: 73, winRate: 40, streak: 13, trend: "up", trendValue: 3, country: "PL", tier: "expert" },
  { id: "U016", rank: 16, username: "BitManipulator", rating: 2545, maxRating: 2600, problemsSolved: 1067, contestsParticipated: 69, winRate: 38, streak: 8, trend: "up", trendValue: 1, country: "SG", tier: "expert" },
  { id: "U017", rank: 17, username: "HeapHandler", rating: 2498, maxRating: 2550, problemsSolved: 1023, contestsParticipated: 65, winRate: 36, streak: 20, trend: "down", trendValue: 1, country: "ES", tier: "expert" },
  { id: "U018", rank: 18, username: "SegmentSeeker", rating: 2456, maxRating: 2510, problemsSolved: 978, contestsParticipated: 61, winRate: 34, streak: 7, trend: "up", trendValue: 2, country: "IT", tier: "specialist" },
  { id: "U019", rank: 19, username: "FenwickFan", rating: 2412, maxRating: 2470, problemsSolved: 934, contestsParticipated: 58, winRate: 32, streak: 12, trend: "same", trendValue: 0, country: "CH", tier: "specialist" },
  { id: "U020", rank: 20, username: "TrieTitan", rating: 2367, maxRating: 2420, problemsSolved: 889, contestsParticipated: 54, winRate: 30, streak: 6, trend: "down", trendValue: 4, country: "AT", tier: "specialist" },
  { id: "U021", rank: 42, username: "DevForceUser", rating: 1856, maxRating: 1920, problemsSolved: 234, contestsParticipated: 28, winRate: 21, streak: 5, trend: "up", trendValue: 8, country: "US", tier: "pupil", isCurrentUser: true },
]

const getTierColor = (tier: User["tier"]) => {
  switch (tier) {
    case "legendary": return "text-amber-400"
    case "grandmaster": return "text-red-400"
    case "master": return "text-orange-400"
    case "expert": return "text-blue-400"
    case "specialist": return "text-cyan-400"
    case "pupil": return "text-emerald-400"
    default: return "text-muted-foreground"
  }
}

const getTierBg = (tier: User["tier"]) => {
  switch (tier) {
    case "legendary": return "bg-amber-500/10 border-amber-500/30"
    case "grandmaster": return "bg-red-500/10 border-red-500/30"
    case "master": return "bg-orange-500/10 border-orange-500/30"
    case "expert": return "bg-blue-500/10 border-blue-500/30"
    case "specialist": return "bg-cyan-500/10 border-cyan-500/30"
    case "pupil": return "bg-emerald-500/10 border-emerald-500/30"
    default: return "bg-muted"
  }
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />
  return null
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [category, setCategory] = useState<Category>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const currentUser = USERS.find(u => u.isCurrentUser)

  const filteredUsers = useMemo(() => {
    let result = [...USERS]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        u => u.username.toLowerCase().includes(searchLower) || 
             u.id.toLowerCase().includes(searchLower) ||
             u.country.toLowerCase().includes(searchLower)
      )
    }

    if (category === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (category === "problems") {
      result.sort((a, b) => b.problemsSolved - a.problemsSolved)
    } else if (category === "contests") {
      result.sort((a, b) => b.contestsParticipated - a.contestsParticipated)
    }

    return result
  }, [search, category])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const topThree = USERS.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
 <Navbar></Navbar>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Global Rankings</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Leaderboard</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Compete with developers worldwide. Climb the ranks by solving problems and winning contests.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-10 grid grid-cols-3 gap-4 md:gap-6">
          {/* 2nd Place */}
          <div className="order-1 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-500/20 text-xl font-bold md:h-20 md:w-20">
                {topThree[1]?.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-background">
                2
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[1]?.username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[1]?.tier || "pupil")}`}>
              {topThree[1]?.rating}
            </p>
            {/* <div className="mt-2 h-24 w-full rounded-t-lg bg-slate-500/20 md:h-32" /> */}
             <img src="https://assets.leetcode.com/contest-config/contest/bc_card_img.png"  className="mt-2 h-20 w-full rounded-t-lg md:h-24" />
          </div>

          {/* 1st Place */}
          <div className="order-0 flex flex-col items-center md:order-1">
     
            <div className="relative mb-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500/20 text-2xl font-bold md:h-24 md:w-24">
                {topThree[0]?.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
             
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-background">
                1
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[0]?.username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[0]?.tier || "pupil")}`}>
              {topThree[0]?.rating}
            </p>
            {/* <div className="mt-2 h-32 w-full rounded-t-lg bg-amber-500/20 md:h-40" /> */}
            <img src="https://assets.leetcode.com/contest-config/contest/wc_card_img.png"  className="mt-2 h-32 w-full rounded-t-lg md:h-40" />
                    
          </div>

          {/* 3rd Place */}
          <div className="order-2 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-700/20 text-xl font-bold md:h-20 md:w-20">
                {topThree[2]?.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-background">
                3
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[2]?.username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[2]?.tier || "pupil")}`}>
              {topThree[2]?.rating}
            </p>
            {/* <div className="mt-2 h-20 w-full rounded-t-lg bg-amber-700/20 md:h-24" /> */}
            <img src="https://assets.leetcode.com/contest-config/contest/bc_card_img.png"  className="mt-2 h-20 w-full rounded-t-lg md:h-24" />

          </div>
        </div>

        {/* Current User Card */}
        {currentUser && (
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-lg font-bold">
                  {currentUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{currentUser.username}</span>
                    <Badge variant="outline" className="border-primary/30 text-primary">You</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Rank #{currentUser.rank}</span>
                    <span className={getTierColor(currentUser.tier)}>
                      {currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto md:gap-6">
                <div className="rounded-lg bg-background/50 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-primary">{currentUser.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-lg bg-background/50 px-4 py-2 text-center">
                  <p className="text-lg font-bold">{currentUser.problemsSolved}</p>
                  <p className="text-xs text-muted-foreground">Solved</p>
                </div>
                <div className="rounded-lg bg-background/50 px-4 py-2 text-center">
                  <p className="text-lg font-bold">{currentUser.contestsParticipated}</p>
                  <p className="text-xs text-muted-foreground">Contests</p>
                </div>
                <div className="rounded-lg bg-background/50 px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <p className="text-lg font-bold">{currentUser.streak}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by username, ID, or country..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="h-11 bg-card pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Time Filter */}
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
              {(["all", "monthly", "weekly"] as TimeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    timeFilter === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t === "all" ? "All Time" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
              {(["all", "rating", "problems", "contests"] as Category[]).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c)
                    setCurrentPage(1)
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {c === "all" && <Users className="h-3.5 w-3.5" />}
                  {c === "rating" && <Star className="h-3.5 w-3.5" />}
                  {c === "problems" && <Target className="h-3.5 w-3.5" />}
                  {c === "contests" && <Calendar className="h-3.5 w-3.5" />}
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="hidden px-4 py-3 text-center text-sm font-medium text-muted-foreground md:table-cell">Problems</th>
                  <th className="hidden px-4 py-3 text-center text-sm font-medium text-muted-foreground lg:table-cell">Contests</th>
                  <th className="hidden px-4 py-3 text-center text-sm font-medium text-muted-foreground lg:table-cell">Win Rate</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border transition-colors hover:bg-secondary/30 ${
                      user.isCurrentUser ? "bg-primary/5" : idx % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        <span className={`font-mono font-semibold ${user.rank <= 3 ? "text-lg" : ""}`}>
                          #{user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${getTierBg(user.tier)} text-sm font-semibold`}>
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.username}</span>
                            {user.isCurrentUser && (
                              <Badge variant="outline" className="border-primary/30 text-xs text-primary">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{user.id}</span>
                            <span>-</span>
                            <span>{user.country}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div>
                        <p className={`font-semibold ${getTierColor(user.tier)}`}>{user.rating}</p>
                        <p className="text-xs text-muted-foreground">max {user.maxRating}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-center md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.problemsSolved}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-center lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.contestsParticipated}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-center lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span className="font-medium">{user.winRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {user.trend === "up" && (
                          <>
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400">+{user.trendValue}</span>
                          </>
                        )}
                        {user.trend === "down" && (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-red-400">-{user.trendValue}</span>
                          </>
                        )}
                        {user.trend === "same" && (
                          <Minus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tier Legend */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Rating Tiers</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              { tier: "legendary", label: "Legendary", range: "3000+" },
              { tier: "grandmaster", label: "Grandmaster", range: "2700-2999" },
              { tier: "master", label: "Master", range: "2400-2699" },
              { tier: "expert", label: "Expert", range: "2100-2399" },
              { tier: "specialist", label: "Specialist", range: "1800-2099" },
              { tier: "pupil", label: "Pupil", range: "0-1799" },
            ].map((t) => (
              <div
                key={t.tier}
                className={`rounded-lg border p-3 ${getTierBg(t.tier as User["tier"])}`}
              >
                <p className={`font-semibold ${getTierColor(t.tier as User["tier"])}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.range}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
