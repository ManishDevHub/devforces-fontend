"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Send,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Trophy,
  Users,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Code2,
  FileText,
  Terminal,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"


type Language = "node" | "python" | "java"
type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT"
  | "COMPILATION_ERROR"

type SubmissionResultRow = {
  passed: boolean
  input: string
  expected: string
  output?: string
  error?: string
}

type SubmissionResultPayload = {
  status: SubmissionStatus
  score: number | null
  executionMs: number | null
  feedback?: {
    ai?: {
      summary?: string
    }
    sandbox?: {
      results?: SubmissionResultRow[]
      error?: string
    }
  } | null
}

type ProblemHintPayload = {
  hints: string[]
  source: "ai" | "fallback"
}

type ContestExample = {
  input: string
  output: string
  explanation?: string
}

type ContestProblem = {
  id: string
  dbId: number
  title: string
  difficulty: "EASY" | "MEDIUM" | "HARD" | string
  description: string
  examples: ContestExample[]
  constraints: string[]
  points: number
}

type ContestData = {
  id: string | number
  title: string
  participants: number
  totalTime: number
  problems: ContestProblem[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"



const parseContestExamples = (rawExamples: unknown): ContestExample[] => {
  const parsed: ContestExample[] = []

  const pushExample = (example: Record<string, unknown>) => {
    const input = stringifyValue(example.input)
    const output = stringifyValue(example.output ?? example.expected)
    if (!input && !output) {
      return
    }

    parsed.push({
      input,
      output,
      explanation:
        typeof example.explanation === "string"
          ? example.explanation
          : undefined,
    })
  }

  if (Array.isArray(rawExamples)) {
    rawExamples.forEach((example) => {
      if (example && typeof example === "object") {
        pushExample(example as Record<string, unknown>)
      }
    })
    return parsed
  }

  if (!rawExamples || typeof rawExamples !== "object") {
    return parsed
  }

  const exampleObject = rawExamples as Record<string, unknown>
  if (Array.isArray(exampleObject.tests)) {
    exampleObject.tests.forEach((test) => {
      if (test && typeof test === "object") {
        pushExample(test as Record<string, unknown>)
      }
    })
    return parsed
  }

  pushExample(exampleObject)
  return parsed
}

const parseConstraints = (rawConstraints: unknown): string[] => {
  if (Array.isArray(rawConstraints)) {
    return rawConstraints
      .map((constraint) => stringifyValue(constraint).trim())
      .filter((constraint) => constraint.length > 0)
  }

  if (typeof rawConstraints === "string") {
    return rawConstraints
      .split("\n")
      .map((constraint) => constraint.trim())
      .filter((constraint) => constraint.length > 0)
  }

  if (!rawConstraints || typeof rawConstraints !== "object") {
    return []
  }

  return [JSON.stringify(rawConstraints)]
}

function stringifyValue(val: unknown): string {
  if (val === null || val === undefined) return ""
  if (typeof val === "string") return val
  if (typeof val === "object") return JSON.stringify(val)
  return String(val)
}

export default function ContestDetailPage() {
  const params = useParams() as { contestId: string }
  const contestId = params.contestId

  const [contestData, setContestData] = useState<ContestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const activeProblem = contestData?.problems?.[currentProblemIndex]

  const [language, setLanguage] = useState<Language>("node")
  const [codes, setCodes] = useState<Record<string, Record<Language, string>>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [activeTab, setActiveTab] = useState<"description" | "testcases" | "hints">("description")
  const [consoleOutput, setConsoleOutput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionMode, setActionMode] = useState<"RUN" | "SUBMIT" | null>(null)
  const [problemStatus, setProblemStatus] = useState<
    Record<string, "solved" | "attempted" | "unsolved">
  >({})
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string; time: string }>
  >([])
  const [copiedExample, setCopiedExample] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [problemHints, setProblemHints] = useState<string[]>([])
  const [hintsSource, setHintsSource] = useState<"ai" | "fallback" | null>(null)
  const [loadingHints, setLoadingHints] = useState(false)
  const [hintsError, setHintsError] = useState<string | null>(null)

  // ================= HELPER FUNCTIONS =================
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeRemaining <= 300) return "text-hard"
    if (timeRemaining <= 900) return "text-medium"
    return "text-easy"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle2 className="w-4 h-4 text-easy" />
      case "attempted":
        return <AlertTriangle className="w-4 h-4 text-medium" />
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedExample(index)
      setTimeout(() => setCopiedExample(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // ================= FETCH CONTEST =================
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          const router = window.location.assign("/login");
          return
        }

        const res = await fetch(
          `${API_BASE_URL}/api/user/contest/${contestId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch contest: ${res.status}`)
        }

        const data = await res.json()

        // Check if the response contains contest data or if it's just tokens
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response format")
        }

        // If the API returns tokens instead of contest data, handle it
        if (data.accessToken || data.refreshToken) {
          console.error("Received authentication tokens instead of contest data")
          setError("Invalid API response - received tokens instead of contest data")
          setLoading(false)
          return
        }

        // Validate that we have the necessary contest fields
        if (!data.title || !data.problems || !Array.isArray(data.problems)) {
          console.error("Invalid contest data structure:", data)
          setError("Invalid contest data received from server")
          setLoading(false)
          return
        }

        const rawProblems = data.problems as Array<Record<string, unknown>>

        const formatted: ContestData = {
          id: data.id || contestId,
          title: data.title || "Untitled Contest",
          participants: Number(data.participants) || 0,
          totalTime:
            data.endTime && data.startTime
              ? (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 1000
              : 3600, // Default 1 hour if times not provided
          problems: rawProblems.map((p, index: number) => {
            const difficulty = String(p.difficulty || "MEDIUM").toUpperCase()
            const numericProblemId = Number(p.id)

            return {
              id: String.fromCharCode(65 + index),
              dbId:
                Number.isInteger(numericProblemId) && numericProblemId > 0
                  ? numericProblemId
                  : index + 1,
              title:
                typeof p.title === "string" && p.title.trim().length > 0
                  ? p.title
                  : `Problem ${index + 1}`,
              difficulty,
              description:
                typeof p.description === "string" && p.description.trim().length > 0
                  ? p.description
                  : "No description available",
              examples: parseContestExamples(p.examples),
              constraints: parseConstraints(p.constraints),
              points: difficulty === "EASY" ? 100 : difficulty === "MEDIUM" ? 200 : 400,
            }
          }),
        }

        setContestData(formatted)
        setError(null)
      } catch (err) {
        console.error("Error fetching contest:", err)
        setError(err instanceof Error ? err.message : "Failed to load contest")
      } finally {
        setLoading(false)
      }
    }

    if (contestId) {
      fetchContest()
    }
  }, [contestId])

  // ================= INIT TIMER =================
  useEffect(() => {
    if (contestData?.totalTime) {
      setTimeRemaining(contestData.totalTime)
    }
  }, [contestData])

  // ================= INIT CODES =================
  useEffect(() => {
    if (!contestData || !contestData.problems) return

    const initialCodes: Record<string, Record<Language, string>> = {}

    contestData.problems.forEach((problem) => {
      initialCodes[problem.id] = {
        node: `function solve(input) {\n  // Write your solution here\n  return input;\n}\n\nmodule.exports = { solve };`,
        python: `def solve(input):\n    # Write your solution here\n    return input`,
        java: `public class Solution {\n    public static String solve(String input) {\n        // Write your solution here\n        return input;\n    }\n}`,
      }
    })

    setCodes(initialCodes)
  }, [contestData])

  // ================= INIT STATUS =================
  useEffect(() => {
    if (!contestData || !contestData.problems) return

    const statusObj: Record<string, "solved" | "attempted" | "unsolved"> = {}
    contestData.problems.forEach((p) => {
      statusObj[p.id] = "unsolved"
    })
    setProblemStatus(statusObj)
  }, [contestData])

  const fetchHintsForCurrentProblem = useCallback(async () => {
    const activeProblem = contestData?.problems?.[currentProblemIndex]
    if (!activeProblem) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setLoadingHints(true)
      setHintsError(null)

      const response = await fetch(
        `${API_BASE_URL}/api/user/problem/${activeProblem.dbId}/hints`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to load hints (${response.status})`)
      }

      const payload = (await response.json()) as ProblemHintPayload
      setProblemHints(Array.isArray(payload.hints) ? payload.hints : [])
      setHintsSource(payload.source || null)
    } catch (hintError) {
      setHintsError(
        hintError instanceof Error ? hintError.message : "Failed to load hints"
      )
    } finally {
      setLoadingHints(false)
    }
  }, [contestData, currentProblemIndex])

  // ================= AI HINTS =================
  useEffect(() => {
    void fetchHintsForCurrentProblem()
  }, [fetchHintsForCurrentProblem])

  useEffect(() => {
    setTestResults([])
    setConsoleOutput("")
    setActiveTab("description")
  }, [currentProblemIndex])

  // ================= TIMER =================
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  // ================= HANDLERS =================
  const getCurrentCode = () => {
    if (!contestData || !activeProblem) return ""
    return codes[activeProblem.id]?.[language] || ""
  }

  const setCurrentCode = (code: string) => {
    if (!contestData || !activeProblem) return
    setCodes((prev) => ({
      ...prev,
      [activeProblem.id]: {
        ...prev[activeProblem.id],
        [language]: code,
      },
    }))
  }

  const handleReset = () => {
    setCurrentCode("")
    setConsoleOutput("")
    setTestResults([])
  }

  const pollContestSubmission = async (submissionId: number) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No authentication token found")
    }

    const terminalStatus: SubmissionStatus[] = [
      "ACCEPTED",
      "WRONG_ANSWER",
      "RUNTIME_ERROR",
      "TIME_LIMIT",
      "COMPILATION_ERROR",
    ]

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const response = await fetch(
        `${API_BASE_URL}/api/user/submissions/${submissionId}?type=CONTEST`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch submission result (${response.status})`)
      }

      const payload = (await response.json()) as SubmissionResultPayload
      if (terminalStatus.includes(payload.status)) {
        return payload
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    throw new Error("Submission timed out while waiting for result")
  }

  const executeSubmission = async (mode: "RUN" | "SUBMIT") => {
    if (!contestData || !contestData.problems?.length) {
      return
    }

    const currentProblem = contestData.problems[currentProblemIndex]
    if (!currentProblem) {
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("No authentication token found")
      return
    }

    const code = getCurrentCode()
    if (!code.trim()) {
      setConsoleOutput("Please write code before submitting.")
      return
    }

    setActionMode(mode)
    setIsSubmitting(true)
    setConsoleOutput(mode === "RUN" ? "Running code in sandbox..." : "Submitting solution...")

    try {
      const submitResponse = await fetch(
        `${API_BASE_URL}/api/user/contests/${contestId}/problems/${currentProblem.dbId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code,
            language,
          }),
        }
      )

      const submitPayload = await submitResponse.json()
      if (!submitResponse.ok) {
        throw new Error(submitPayload.message || "Submission failed")
      }

      const submissionId = Number(submitPayload.submissionId)
      if (!submissionId) {
        throw new Error("Invalid submission response")
      }

      const result = await pollContestSubmission(submissionId)
      const rows = result.feedback?.sandbox?.results || []

      setTestResults(
        rows.map((row) => ({
          passed: Boolean(row.passed),
          input: stringifyValue(row.input),
          expected: stringifyValue(row.expected),
          actual: stringifyValue(row.output || row.error) || "",
          time: result.executionMs ? `${result.executionMs}ms` : "-",
        }))
      )

      setProblemStatus((prev) => ({
        ...prev,
        [currentProblem.id]:
          result.status === "ACCEPTED" ? "solved" : "attempted",
      }))

      const aiSummary = result.feedback?.ai?.summary
      const outputLines = [
        `${mode === "RUN" ? "Run" : "Submit"} completed.`,
        `Status: ${result.status}`,
        result.score !== null ? `Score: ${result.score}` : null,
        result.executionMs !== null ? `Execution: ${result.executionMs}ms` : null,
        result.feedback?.sandbox?.error ? `Sandbox Error: ${stringifyValue(result.feedback?.sandbox?.error)}` : null,
        aiSummary || null,
      ].filter(Boolean)

      setConsoleOutput(outputLines.join("\n"))
      setActiveTab("testcases")
    } catch (submissionError) {
      setConsoleOutput(
        submissionError instanceof Error
          ? submissionError.message
          : "Submission failed"
      )
    } finally {
      setIsSubmitting(false)
      setActionMode(null)
    }
  }

  const handleRun = () => {
    void executeSubmission("RUN")
  }

  const handleSubmit = () => {
    void executeSubmission("SUBMIT")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-easy bg-easy/10 border-easy/30"
      case "MEDIUM":
        return "text-medium bg-medium/10 border-medium/30"
      case "HARD":
        return "text-hard bg-hard/10 border-hard/30"
      default:
        return "text-muted-foreground"
    }
  }

  // ================= SAFE LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading contest...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-hard mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Contest</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!contestData || !contestData.problems || contestData.problems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-medium mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Contest Data</h2>
          <p className="text-muted-foreground mb-4">This contest has no problems or invalid data.</p>
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Ensure currentProblem is definitely defined for the rest of the component
  const currentProblem = contestData.problems[currentProblemIndex]
  if (!currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const totalPoints = contestData.problems.reduce(
    (sum: number, p) => sum + (p.points || 0),
    0
  )

  const earnedPoints = contestData.problems.reduce(
    (sum: number, p) =>
      problemStatus[p.id] === "solved" ? sum + (p.points || 0) : sum,
    0
  )

  return (
    <div className={cn("flex h-screen flex-col bg-background text-foreground transition-colors duration-300", isFullscreen && "fixed inset-0 z-50")}>
      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-hard/20 flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6 text-hard" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Exit Contest?</h3>
                <p className="text-sm text-muted-foreground">Your progress will be saved. You can rejoin later.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={() => setShowExitModal(false)} className="flex-1">
                Stay
              </Button>
              <Link href="/practice" className="flex-1">
                <Button variant="destructive" className="w-full">
                  Exit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="z-10 border-b border-border bg-card px-4 flex flex-col">
        {/* Top bar */}
        <div className="h-12 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowExitModal(true)} 
                className="flex items-center gap-2 text-sm font-medium hover:text-hard transition-colors bg-accent/50 px-3 py-1 rounded-md border border-border/50"
              >
                 <LogOut className="w-4 h-4" />
                 <span>Exit</span>
              </button>
              
              <div className="h-4 w-px bg-border/50" />
              
              <div className="flex items-center gap-3">
                 <Trophy className="w-5 h-5 text-primary animate-bounce-slow" />
                 <h1 className="text-lg font-bold tracking-tight">{contestData.title}</h1>
              </div>
           </div>

           <div className="flex items-center gap-6">
              {/* Score */}
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Points</span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-primary">{earnedPoints}</span>
                    <span className="text-xs text-muted-foreground opacity-50">/ {totalPoints}</span>
                 </div>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Timer */}
              <div className={cn("flex items-center gap-3 bg-muted px-4 py-1.5 rounded-lg border", 
                timeRemaining <= 300 ? "border-hard/50 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-border/50"
              )}>
                 <Clock className={cn("w-4 h-4", getTimeColor())} />
                 <span className={cn("font-mono font-black text-xl tracking-tighter", getTimeColor())}>
                   {formatTime(timeRemaining)}
                 </span>
              </div>
           </div>
        </div>

        {/* Navigation bar */}
        <div className="h-10 border-t border-border/30 flex items-center justify-between">
           <div className="flex items-center gap-1">
              {contestData.problems.map((p, idx) => (
                 <button
                   key={p.id}
                   onClick={() => setCurrentProblemIndex(idx)}
                   className={cn(
                     "flex items-center gap-2 px-4 h-8 rounded-md text-xs font-bold transition-all relative group",
                     currentProblemIndex === idx 
                       ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                       : "hover:bg-accent text-muted-foreground"
                   )}
                 >
                    {getStatusIcon(problemStatus[p.id])}
                    <span>{p.id}</span>
                    {currentProblemIndex === idx && (
                      <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-t-full shadow-[0_0_5px_white]" />
                    )}
                 </button>
              ))}
           </div>

           <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentProblemIndex((p) => Math.max(0, p - 1))}
                disabled={currentProblemIndex === 0}
                className="h-7 text-xs font-bold hover:bg-white/5"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Prev
              </Button>
              <div className="text-[10px] font-bold text-muted-foreground/30 px-2 uppercase">{currentProblemIndex + 1} / {contestData.problems.length}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentProblemIndex((p) => Math.min(contestData.problems.length - 1, p + 1))}
                disabled={currentProblemIndex === contestData.problems.length - 1}
                className="h-7 text-xs font-bold hover:bg-white/5"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
           </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 flex overflow-hidden p-1 gap-1">
        {/* Left Side: Problem Detail */}
        <div className={cn("w-1/2 flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden shadow-xl transition-all", isFullscreen && "hidden")}>
           <div className="flex border-b border-border/30 bg-muted/30">
              {[
                { id: "description", label: "Description", icon: FileText },
                { id: "testcases", label: "Results", icon: Terminal },
                { id: "hints", label: "Hints", icon: Lightbulb },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2",
                    activeTab === tab.id
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "description" && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <span className="text-3xl font-black text-primary/30 font-mono tracking-tighter">{currentProblem.id}</span>
                          <h2 className="text-2xl font-bold">{currentProblem.title}</h2>
                       </div>
                        <Badge variant={currentProblem.difficulty.toLowerCase() === "easy" ? "easy" : currentProblem.difficulty.toLowerCase() === "medium" ? "medium" : "hard"}>
                          {currentProblem.difficulty}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                       <span className="bg-muted px-2 py-0.5 rounded border border-border/50">Points: {currentProblem.points}</span>
                       <span className="bg-muted px-2 py-0.5 rounded border border-border/50">Attempts: {problemStatus[currentProblem.id]}</span>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-border/50 via-transparent to-transparent" />

                    <div className="prose prose-invert max-w-none">
                       <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">{currentProblem.description}</p>
                    </div>

                    {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                      <div className="space-y-3">
                         <h3 className="text-sm font-bold text-primary flex items-center">
                            <Terminal className="h-4 w-4 mr-2" />
                            Constraints
                         </h3>
                         <div className="bg-muted/30 rounded-lg border border-border/30 p-4">
                            <ul className="space-y-2">
                               {currentProblem.constraints.map((c, i) => (
                                 <li key={i} className="flex gap-2 text-sm text-muted-foreground font-mono">
                                    <span className="text-primary italic opacity-50">•</span>
                                    {String(c)}
                                 </li>
                               ))}
                            </ul>
                         </div>
                      </div>
                    )}

                    <div className="space-y-4">
                       <h3 className="text-sm font-bold text-primary flex items-center tracking-widest uppercase">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Test Examples
                       </h3>
                       {currentProblem.examples.map((ex, i) => (
                         <div key={i} className="group relative">
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary/20 rounded-full group-hover:bg-primary transition-all duration-300" />
                            <div className="bg-white/[0.03] border border-border/20 rounded-xl p-4 space-y-3 hover:bg-accent/10 transition-all">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">Case Example {i+1}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0" 
                                    onClick={() => copyToClipboard(`${ex.input}\n${ex.output}`, i)}
                                  >
                                     {copiedExample === i ? <Check className="h-3 w-3 text-easy" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[10px] font-mono text-primary/50 uppercase">Input</p>
                                  <pre className="text-xs font-mono bg-muted p-2 rounded border border-border/10 overflow-x-auto">{ex.input}</pre>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[10px] font-mono text-emerald-500/50 uppercase">Expected</p>
                                  <pre className="text-xs font-mono bg-muted p-2 rounded border border-border/10 overflow-x-auto">{ex.output}</pre>
                               </div>
                               {ex.explanation && (
                                 <div className="text-[11px] text-muted-foreground italic pl-2 border-l border-primary/20">
                                   {ex.explanation}
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === "testcases" && (
                 <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col items-center justify-center py-4 border-b border-border/30">
                       <h2 className="text-lg font-bold">Execution Trace</h2>
                       <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Live Sandbox Feedback</p>
                    </div>

                    {testResults.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                         <div className="relative">
                            <Terminal className="w-16 h-16 opacity-10" />
                            <Play className="absolute inset-0 m-auto w-6 h-6 animate-pulse text-primary opacity-40" />
                         </div>
                         <p className="font-bold tracking-tight">System Idle</p>
                         <p className="text-[10px] uppercase font-mono tracking-tighter opacity-70">Click 'Run' or 'Submit' to prompt sandbox grading</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {testResults.map((result, i) => (
                           <div key={i} className={cn("p-4 rounded-xl border transition-all hover:translate-x-1 duration-300 shadow-lg", 
                             result.passed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                           )}>
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", result.passed ? "bg-emerald-500/20" : "bg-red-500/20")}>
                                       {result.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold tracking-tight">Test Case {i+1}</p>
                                       <p className={cn("text-[10px] font-black uppercase", result.passed ? "text-emerald-500" : "text-red-500")}>
                                          {result.passed ? "Passed" : "Failed"}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-mono text-muted-foreground">{result.time}</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 font-mono">
                                 <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Actual Output</span>
                                    <div className="text-xs p-2 rounded bg-muted border border-border/10 h-12 overflow-y-auto break-all">
                                      {stringifyValue(result.actual) || "(empty)"}
                                    </div>
                                 </div>
                                 <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Expected Output</span>
                                    <div className="text-xs p-2 rounded bg-muted border border-border/10 h-12 overflow-y-auto break-all">
                                      {stringifyValue(result.expected)}
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
              )}

              {activeTab === "hints" && (
                 <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                       <h2 className="text-lg font-bold flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                          AI Hints System
                       </h2>
                       <Button size="sm" variant="outline" className="h-8 border-border/50" onClick={() => void fetchHintsForCurrentProblem()} disabled={loadingHints}>
                         {loadingHints ? <Loader2 className="w-4 h-4 animate-spin"/> : <RotateCcw className="w-4 h-4" />}
                       </Button>
                    </div>

                    {loadingHints ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground tracking-widest font-bold uppercase animate-pulse">Scanning Code Patterns...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {problemHints.length === 0 ? (
                           <p className="text-center text-muted-foreground py-20">No hints generated yet.</p>
                         ) : (
                           problemHints.map((hint, i) => (
                              <Card key={i} className="bg-amber-500/5 border-amber-500/20 overflow-hidden hover:bg-amber-500/10 transition-all cursor-default">
                                 <div className="p-4 flex gap-4">
                                    <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                       <span className="text-xs font-bold text-amber-500">{i+1}</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-foreground/80">{hint}</p>
                                 </div>
                              </Card>
                           ))
                         )}
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-blue-300/80 leading-relaxed italic">
                      <span className="font-bold uppercase not-italic mr-2">Note:</span>
                      AI hints are based on generalized patterns and may not reflect the specific constraints of the sandbox runner.
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Right Side: Editor & Console */}
        <div className={cn("flex-1 flex flex-col gap-1 overflow-hidden", isFullscreen ? "w-full" : "w-1/2")}>
           {/* Editor Panel */}
           <div className="flex-1 bg-card rounded-lg border border-border/50 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="h-10 border-b border-border/50 flex items-center justify-between px-3 bg-muted/30">
                 <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="bg-transparent border-none text-xs font-mono font-bold focus:outline-none focus:ring-0 cursor-pointer hover:text-primary transition-colors pr-4"
                    >
                      <option value="node" className="bg-popover">JavaScript (Node)</option>
                      <option value="python" className="bg-popover">Python 3.x</option>
                      <option value="java" className="bg-popover">Java OpenJDK</option>
                    </select>
                 </div>
                 
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest hover:bg-accent" onClick={handleReset}>
                      <RotateCcw className="h-3 w-3 mr-1.5" />
                      Reset
                    </Button>
                    <div className="h-4 w-px bg-border/30 mx-1" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-md hover:bg-accent"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                 </div>
              </div>

              <textarea
                value={getCurrentCode()}
                onChange={(e) => setCurrentCode(e.target.value)}
                spellCheck={false}
                className="flex-1 resize-none rounded-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed text-foreground focus:outline-none selection:bg-primary/20"
                placeholder="// Write your solution here..."
                style={{ tabSize: 2 }}
              />

              {isSubmitting && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                   <div className="flex flex-col items-center space-y-4 bg-card/90 p-6 rounded-2xl border border-border/10 shadow-3xl animate-in zoom-in-95 duration-200">
                      <div className="relative">
                         <Loader2 className="h-10 w-10 animate-spin text-primary" />
                         <div className="absolute inset-0 m-auto h-4 w-4 bg-primary rounded-full animate-pulse blur-md" />
                      </div>
                      <div className="text-center">
                         <p className="font-black text-sm tracking-widest uppercase">{actionMode === "RUN" ? "Running Payload" : "Judging..."}</p>
                         <p className="text-[9px] text-muted-foreground font-mono mt-1">Establishing Secure Sandbox Pipe</p>
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Console / Actions */}
           <div className="h-[25%] bg-card rounded-lg border border-border/50 flex flex-col shadow-2xl">
              <div className="h-9 border-b border-border/50 flex items-center justify-between px-3 bg-muted/30">
                 <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Execution Console</span>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-muted-foreground/80 leading-relaxed bg-muted/10">
                 {consoleOutput ? (
                   <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-30">
                      <Terminal className="h-8 w-8" />
                      <p className="uppercase tracking-widest text-[9px] font-bold">Waiting for input exec</p>
                   </div>
                 )}
              </div>

              <div className="h-12 border-t border-border/50 flex items-center justify-between px-4 bg-muted/30">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Grader Shared Active</span>
                 </div>

                 <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleRun} 
                      disabled={isSubmitting} 
                      className="h-8 bg-transparent border-border/50 hover:bg-accent text-xs font-bold"
                    >
                      <Play className="h-3 w-3 mr-2 fill-emerald-500 text-emerald-500" />
                      Run Code
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black min-w-[120px] shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                           <Send className="h-3 w-3 mr-2" />
                           Final Submit
                        </>
                      )}
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
