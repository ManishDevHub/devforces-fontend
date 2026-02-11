"use client"

import React, { useEffect } from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronRight,
  Code,
  Shield,
  Bot,
  Workflow,
  Zap,
  Trophy,
  Calendar,
  Users,
  Clock,
  Timer,
  Target,
  Flame,
  ArrowRight,
  AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

type Difficulty = "EASY" | "MEDIUM" | "HARD"
type Category = "Auth System" | "Backend" | "Bot Automation" | "API Design" | "System Design"
type ContestStatus = "Live" | "Upcoming" | "Ended"

interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  category: Category
  acceptance: number
  solved: boolean
}

interface Contest {
  id: string
  title: string
  status: ContestStatus
  startTime: string
  endTime: string
  duration: string
  participants: number
  problems: number
  rated: boolean
}

const categories: { name: Category; icon: React.ReactNode }[] = [
  { name: "Auth System", icon: <Shield className="h-3.5 w-3.5" /> },
  { name: "Backend", icon: <Code className="h-3.5 w-3.5" /> },
  { name: "Bot Automation", icon: <Bot className="h-3.5 w-3.5" /> },
  { name: "API Design", icon: <Workflow className="h-3.5 w-3.5" /> },
   { name: "System Design", icon: <Workflow className="h-3.5 w-3.5" /> },
]

const difficulties: Array<Difficulty | "All"> = ["All", "EASY", "MEDIUM", "HARD"]

function DifficultyBadge({ difficulty, small = false }: { difficulty: Difficulty; small?: boolean }) {
  const displayText = difficulty.charAt(0) + difficulty.slice(1).toLowerCase()
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide uppercase",
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        difficulty === "EASY" && "bg-easy/15 text-easy",
        difficulty === "MEDIUM" && "bg-medium/15 text-medium",
        difficulty === "HARD" && "bg-hard/15 text-hard"
      )}
    >
      {displayText}
    </span>
  )
}

function ContestStatusBadge({ status }: { status: ContestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "Live" && "bg-easy/15 text-easy",
        status === "Upcoming" && "bg-primary/15 text-primary",
        status === "Ended" && "bg-muted text-muted-foreground"
      )}
    >
      {status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-easy animate-pulse" />}
      {status}
    </span>
  )
}

export default function PracticePage() {
  const router = useRouter()
  const [problemSearch, setProblemSearch] = useState("")
  const [contestSearch, setContestSearch] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All")
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")
  const [selectedContestStatus, setSelectedContestStatus] = useState<ContestStatus | "All">("All")
  const [problems, setProblems] = useState<Problem[]>([])
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        const [problemsRes, contestsRes] = await Promise.all([
          fetch("http://localhost:4000/api/user/problem/problems", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("http://localhost:4000/api/user/contest/allcontest", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
        ])

        if (!problemsRes.ok) {
          throw new Error(`Failed to fetch problems: ${problemsRes.status}`)
        }

        if (!contestsRes.ok) {
          throw new Error(`Failed to fetch contests: ${contestsRes.status}`)
        }

        const problemsData = await problemsRes.json()
        const contestsData = await contestsRes.json()

        // Validate and format problems data
        if (Array.isArray(problemsData)) {
          const formattedProblems = problemsData.map((p: any) => ({
            id: String(p.id || p._id || ""),
            title: String(p.title || "Untitled Problem"),
            difficulty: (p.difficulty || "MEDIUM") as Difficulty,
            category: (p.category || "Backend") as Category,
            acceptance: Number(p.acceptance || 0),
            solved: Boolean(p.solved || false),
          }))
          setProblems(formattedProblems)
        } else {
          console.error("Invalid problems data format:", problemsData)
          setProblems([])
        }

        // Validate and format contests data
        if (Array.isArray(contestsData)) {
          const formattedContests = contestsData.map((c: any) => {
            // Determine contest status based on start and end times
            const now = new Date()
            const startTime = new Date(c.startTime)
            const endTime = new Date(c.endTime)
            
            let status: ContestStatus = "Upcoming"
            if (now >= startTime && now <= endTime) {
              status = "Live"
            } else if (now > endTime) {
              status = "Ended"
            }

            // Calculate duration
            const durationMs = endTime.getTime() - startTime.getTime()
            const hours = Math.floor(durationMs / (1000 * 60 * 60))
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
            const duration = `${hours}h ${minutes}m`

            // Format start time
            const formattedStartTime = startTime.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })

            return {
              id: String(c.id || c._id || ""),
              title: String(c.title || "Untitled Contest"),
              status,
              startTime: formattedStartTime,
              endTime: c.endTime,
              duration,
              participants: Number(c.participants || 0),
              problems: Array.isArray(c.problems) ? c.problems.length : Number(c.problems || 0),
              rated: Boolean(c.rated !== undefined ? c.rated : true),
            }
          })
          setContests(formattedContests)
        } else {
          console.error("Invalid contests data format:", contestsData)
          setContests([])
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
        problem.id.toLowerCase().includes(problemSearch.toLowerCase())
      const matchesDifficulty =
        selectedDifficulty === "All" || problem.difficulty === selectedDifficulty
      const matchesCategory =
        selectedCategory === "All" || problem.category === selectedCategory
      return matchesSearch && matchesDifficulty && matchesCategory
    })
  }, [problems, problemSearch, selectedDifficulty, selectedCategory])

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchesSearch =
        contest.title.toLowerCase().includes(contestSearch.toLowerCase()) ||
        contest.id.toLowerCase().includes(contestSearch.toLowerCase())
      const matchesStatus =
        selectedContestStatus === "All" || contest.status === selectedContestStatus
      return matchesSearch && matchesStatus
    })
  }, [contests, contestSearch, selectedContestStatus])

  const stats = {
    totalProblems: problems.length,
    solvedProblems: problems.filter((p) => p.solved).length,
    liveContests: contests.filter((c) => c.status === "Live").length,
    upcomingContests: contests.filter((c) => c.status === "Upcoming").length,
  }

  const handleProblemClick = (problemId: string) => {
    router.push(`/problem/${problemId}`)
  }

  const handleContestClick = (contestId: string, status: ContestStatus) => {
    if (status === "Live") {
      router.push(`/contest/${contestId}`)
    } else if (status === "Upcoming") {
      // Could show a registration modal or redirect to contest details
      router.push(`/contest/${contestId}`)
    } else {
      // For ended contests, could show results or virtual participation
      router.push(`/contest/${contestId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.1_250),transparent)]" />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading practice arena...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.1_250),transparent)]" />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-4">
            <AlertTriangle className="w-16 h-16 text-hard mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.1_250),transparent)]" />

      {/* Header */}
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Target className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Practice Arena</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-3">
            Contests & Problems
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Compete in live contests or practice with individual problems. Track your progress and climb the leaderboard.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.solvedProblems}/{stats.totalProblems}</p>
              <p className="text-xs text-muted-foreground">Problems Solved</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-easy/10">
              <Flame className="h-5 w-5 text-easy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.liveContests}</p>
              <p className="text-xs text-muted-foreground">Live Contests</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medium/10">
              <Calendar className="h-5 w-5 text-medium" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.upcomingContests}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hard/10">
              <Timer className="h-5 w-5 text-hard" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12h 34m</p>
              <p className="text-xs text-muted-foreground">Practice Time</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contests Section */}
          <section className="flex flex-col">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex-1 flex flex-col">
              {/* Section Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">All Contests</h2>
                      <p className="text-xs text-muted-foreground">{filteredContests.length} contests</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                   <Link href="/contest"> View All </Link>
                     <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Contest Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search contests..."
                    value={contestSearch}
                    onChange={(e) => setContestSearch(e.target.value)}
                    className="h-10 pl-10 pr-4 text-sm bg-background border-border focus:border-primary"
                  />
                </div>

                {/* Contest Status Filters */}
                <div className="flex items-center gap-2">
                  {(["All", "Live", "Upcoming", "Ended"] as const).map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContestStatus(status)}
                      className={cn(
                        "h-8 text-xs font-medium",
                        selectedContestStatus === status
                          ? status === "Live"
                            ? "border-easy bg-easy/10 text-easy hover:bg-easy/20"
                            : status === "Upcoming"
                              ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                              : status === "Ended"
                                ? "border-muted bg-muted text-muted-foreground"
                                : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      )}
                    >
                      {status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-easy mr-1.5 animate-pulse" />}
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contest List */}
              <div className="divide-y divide-border/50 overflow-y-auto flex-1 max-h-[500px]">
                {filteredContests.length > 0 ? (
                  filteredContests.map((contest) => (
                    <div
                      key={contest.id}
                      onClick={() => handleContestClick(contest.id, contest.status)}
                      className={cn(
                        "p-4 transition-all cursor-pointer group",
                        "hover:bg-primary/5",
                        contest.status === "Live" && "bg-easy/5 border-l-2 border-l-easy"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-primary">{contest.id}</span>
                            <ContestStatusBadge status={contest.status} />
                            {contest.rated && (
                              <Badge variant="outline" className="h-5 text-[10px] border-medium/30 text-medium">
                                Rated
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {contest.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {contest.status === "Live" ? contest.duration : contest.startTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {/* {contest.participants.toLocaleString()} */}
                            </span>
                            <span>{contest.problems} problems</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContestClick(contest.id, contest.status)
                          }}
                          className={cn(
                            "shrink-0",
                            contest.status === "Live"
                              ? "bg-easy hover:bg-easy/90 text-background"
                              : contest.status === "Upcoming"
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80 text-foreground"
                          )}
                        >
                          {contest.status === "Live" ? "Join" : contest.status === "Upcoming" ? "Register" : "Virtual"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No contests found</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Problems Section */}
          <section className="flex flex-col">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex-1 flex flex-col">
              {/* Section Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Code className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">All Problems</h2>
                      <p className="text-xs text-muted-foreground">{filteredProblems.length} problems</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                  <Link href="/problem"> View All </Link>
                     <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Problem Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search problems by name or ID..."
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    className="h-10 pl-10 pr-4 text-sm bg-background border-border focus:border-primary"
                  />
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-xs text-muted-foreground mr-1">Difficulty:</span>
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={cn(
                        "h-7 text-xs font-medium px-2.5",
                        selectedDifficulty === difficulty
                          ? difficulty === "EASY"
                            ? "border-easy bg-easy/10 text-easy hover:bg-easy/20"
                            : difficulty === "MEDIUM"
                              ? "border-medium bg-medium/10 text-medium hover:bg-medium/20"
                              : difficulty === "HARD"
                                ? "border-hard bg-hard/10 text-hard hover:bg-hard/20"
                                : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      )}
                    >
                      {difficulty === "All" ? "All" : difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                    </Button>
                  ))}
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground mr-1">Category:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory("All")}
                    className={cn(
                      "h-7 text-xs font-medium px-2.5",
                      selectedCategory === "All"
                        ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(category.name === selectedCategory ? "All" : category.name)}
                      className={cn(
                        "h-7 text-xs font-medium px-2.5 gap-1",
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
              </div>

              {/* Problem List */}
              <div className="divide-y divide-border/50 overflow-y-auto flex-1 max-h-[500px]">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => handleProblemClick(problem.id)}
                      className={cn(
                        "p-4 transition-all cursor-pointer group",
                        "hover:bg-primary/5",
                        problem.solved && "bg-easy/5"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                          problem.solved ? "bg-easy/20 text-easy" : "bg-secondary text-muted-foreground"
                        )}>
                          {problem.solved ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-mono">{problem.id.slice(-2)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-primary">{problem.id}</span>
                            <DifficultyBadge difficulty={problem.difficulty} small />
                          </div>
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {categories.find((c) => c.name === problem.category)?.icon}
                              <span className="hidden sm:inline">{problem.category}</span>
                            </span>
                            <span>{problem.acceptance.toFixed(1)}% acceptance</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Code className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No problems found</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProblemSearch("")
                        setSelectedDifficulty("All")
                        setSelectedCategory("All")
                      }}
                      className="mt-2 text-xs text-primary"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to compete?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join our next rated contest and test your skills against developers worldwide.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/contest">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse All Contests
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="border-border hover:border-primary/50 bg-transparent">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}