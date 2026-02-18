"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Crown, Zap, Target, Flame, Star, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

// Helper to calculate tier
const getTier = (rating: number): User["tier"] => {
  if (rating >= 3000) return "legendary";
  if (rating >= 2700) return "grandmaster";
  if (rating >= 2400) return "master";
  if (rating >= 2100) return "expert";
  if (rating >= 1800) return "specialist";
  return "pupil";
};

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

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/api/user/leaderboard`, { headers });
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        
        // Transform backend data to Frontend User interface and add rank (Starts at 500,000)
        const transformedUsers: User[] = data.map((u: any, index: number) => ({
            id: u.id,
            rank: index + 1,
            username: u.name || "Anonymous",
            rating: u.points,
            maxRating: u.points, 
            problemsSolved: 0, 
            contestsParticipated: 0, 
            winRate: 0, 
            streak: 0, 
            trend: "same", 
            trendValue: 0,
            country: "US", 
            tier: getTier(u.points),
            isCurrentUser: false 
        }));

        setUsers(transformedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter currentUser if ID matches? (Need user context or token decoding, skipping for now)
  const currentUser = null; 

  const filteredUsers = useMemo(() => {
    let result = [...users]

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
  }, [search, category, users])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const topThree = users.slice(0, 3)

  if (loading) {
      return <div className="min-h-screen bg-background flex items-center justify-center">Loading Leaderboard...</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.3),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.2),transparent_45%)]" />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 animate-in fade-in-0 duration-500">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-in slide-in-from-top-2 duration-500">
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
        {topThree.length > 0 && (
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in zoom-in-95 duration-500 delay-150 md:gap-6">
          {/* 2nd Place */}
          {topThree[1] && (
          <div className="order-1 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-500/20 text-xl font-bold md:h-20 md:w-20">
                {topThree[1].username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-background">
                2
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[1].username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[1].tier || "pupil")}`}>
              {topThree[1].rating}
            </p>
            <img src="https://assets.leetcode.com/contest-config/contest/bc_card_img.png" alt="Second place podium card" className="mt-2 h-20 w-full rounded-t-lg object-cover shadow-md md:h-24" />
          </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
          <div className="order-0 flex flex-col items-center md:order-1">
            <div className="relative mb-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500/20 text-2xl font-bold md:h-24 md:w-24">
                {topThree[0].username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-background">
                1
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[0].username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[0].tier || "pupil")}`}>
              {topThree[0].rating}
            </p>
            <img src="https://assets.leetcode.com/contest-config/contest/wc_card_img.png" alt="First place podium card" className="mt-2 h-32 w-full rounded-t-lg object-cover shadow-md md:h-40" />
          </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
          <div className="order-2 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-700/20 text-xl font-bold md:h-20 md:w-20">
                {topThree[2].username.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-background">
                3
              </div>
            </div>
            <p className="mb-1 text-center text-sm font-semibold md:text-base">{topThree[2].username}</p>
            <p className={`text-sm font-medium ${getTierColor(topThree[2].tier || "pupil")}`}>
              {topThree[2].rating}
            </p>
            <img src="https://assets.leetcode.com/contest-config/contest/bc_card_img.png" alt="Third place podium card" className="mt-2 h-20 w-full rounded-t-lg object-cover shadow-md md:h-24" />
          </div>
          )}
        </div>
        )}

        {/* Current User Card */}
        {currentUser && (
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-500 delay-200 md:p-6">
            {/* ... logic for current user ... */}
            {/* Simplified or hidden if logic complicated for now */}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 animate-in slide-in-from-bottom-1 duration-500 delay-300 md:flex-row md:items-center md:justify-between">
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
          {/* Filters simplified */}
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-in fade-in-0 duration-500 delay-400">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Points</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border transition-colors duration-200 hover:bg-secondary/30 ${
                      user.isCurrentUser ? "bg-primary/5" : idx % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {user.rank <= 3 && <Trophy className={`h-4 w-4 ${user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-slate-400" : "text-amber-600"}`} />}
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
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div>
                        <p className={`font-semibold ${getTierColor(user.tier)}`}>{user.rating}</p>
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
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in-0 duration-500 delay-500">
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
