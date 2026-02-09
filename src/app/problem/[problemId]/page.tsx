"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  Play,
  Send,
  Timer,
  TimerOff,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react"
import { use } from "react"

/* ===================== TYPES ===================== */

interface Example {
  input: string
  output: string
  explanation?: string
}

interface Problem {
  id: number
  title: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  type:
    | "AUTH_SECURITY"
    | "API_BACKEND"
    | "BOT_AUTOMATION"
    | "APP_BACKEND"
    | "SYSTEM_DESIGN"
  examples: Example[] | null
  constraints: string | null
}

interface TestResult {
  id: number
  status: "passed" | "failed" | "running" | "pending"
  input: string
  expected: string
  actual?: string
  time?: string
}

type Language = "javascript" | "python" | "java"

/* ===================== CONSTANTS ===================== */

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
]

const STARTER_CODE: Record<Language, string> = {
  javascript: `function solve(input) {
  // Your solution here
  return output;
}`,
  python: `def solve(input):
    # Your solution here
    return output`,
  java: `public class Solution {
    public static Object solve(Object input) {
        // Your solution here
        return output;
    }
}`,
}

const DIFFICULTY_CONFIG: Record<
  Problem["difficulty"],
  { color: string; bg: string; label: string }
> = {
  EASY: { color: "text-green-700", bg: "bg-green-50", label: "Easy" },
  MEDIUM: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    label: "Medium",
  },
  HARD: { color: "text-red-700", bg: "bg-red-50", label: "Hard" },
}

/* ===================== HELPER FUNCTIONS ===================== */

/**
 * Safely parse and validate examples from API response
 * Handles various data formats and prevents rendering errors
 */
const parseExamples = (examples: any): Example[] => {
  // If examples is null or undefined, return empty array
  if (!examples) {
    console.warn("[parseExamples] No examples provided")
    return []
  }

  // If it's already an array, validate and filter
  if (Array.isArray(examples)) {
    const validExamples = examples
      .filter((ex) => {
        // Only include examples with required fields
        const isValid = ex && typeof ex === "object" && ex.input && ex.output
        if (!isValid) {
          console.warn("[parseExamples] Invalid example:", ex)
        }
        return isValid
      })
      .map((ex) => ({
        input: String(ex.input || ""),
        output: String(ex.output || ""),
        // Only include explanation if it's a string, ignore objects
        explanation:
          ex.explanation && typeof ex.explanation === "string"
            ? ex.explanation
            : undefined,
      }))

    console.log(
      `[parseExamples] Parsed ${validExamples.length} valid examples from array`
    )
    return validExamples
  }

  // If it's a single object (single example), convert to array
  if (typeof examples === "object" && examples.input && examples.output) {
    console.log("[parseExamples] Converting single example to array")
    return [
      {
        input: String(examples.input),
        output: String(examples.output),
        explanation:
          examples.explanation && typeof examples.explanation === "string"
            ? examples.explanation
            : undefined,
      },
    ]
  }

  console.warn("[parseExamples] Invalid examples format:", examples)
  return []
}

/**
 * Validate if the API response is problem data or authentication tokens
 */
const isAuthTokenResponse = (data: any): boolean => {
  return Boolean(data?.accessToken || data?.refreshToken)
}

/**
 * Validate problem data structure
 */
const isValidProblemData = (data: any): boolean => {
  return Boolean(data && data.id && data.title && data.description)
}

/* ===================== COMPONENT ===================== */

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ problemId: string }>
}) {
  /* ---------- CORE STATE ---------- */
  const [problem, setProblem] = useState<Problem | null>(null)
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState(STARTER_CODE.javascript)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* ---------- UI STATE ---------- */
  const [activeTab, setActiveTab] = useState("description")
  const [copied, setCopied] = useState<number | null>(null)

  /* ---------- TIMER STATE ---------- */
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)

  /* ---------- TEST STATE ---------- */
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(false)

  /* ===================== FETCH PROBLEM ===================== */
  const { problemId } = use(params)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        const token = localStorage.getItem("token")

        console.log("[fetchProblem] Token:", token ? "Present" : "Missing")

        if (!token) {
          setError("Authentication required. Please log in first.")
          setLoading(false)
          return
        }

        console.log(`[fetchProblem] Fetching problem ${problemId}`)
        const response = await fetch(
          `${apiUrl}/api/user/problem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401) {
            setError("Your session has expired. Please log in again.")
            setLoading(false)
            return
          }
          throw new Error(`HTTP ${response.status}: Failed to fetch problem`)
        }

        const data = await response.json()

        console.log("[fetchProblem] API Response:", data)

        // Check if response is authentication tokens instead of problem data
        if (isAuthTokenResponse(data)) {
          console.error(
            "[fetchProblem] Received auth tokens instead of problem data"
          )
          setError("Your session has expired. Please log in again.")
          setProblem(null)
          setLoading(false)
          return
        }

        // Validate problem structure
        if (!isValidProblemData(data)) {
          console.error("[fetchProblem] Invalid problem data structure:", data)
          setError("Invalid problem data received from server.")
          setProblem(null)
          setLoading(false)
          return
        }

        // Parse and sanitize the problem data
        const sanitizedProblem: Problem = {
          id: data.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          type: data.type,
          examples: parseExamples(data.examples), // Safe parsing
          constraints: data.constraints || null,
        }

        console.log("[fetchProblem] Sanitized Problem:", sanitizedProblem)
        setProblem(sanitizedProblem)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred"
        setError(message)
        console.error("[fetchProblem] Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  /* ===================== TIMER EFFECT ===================== */

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerRunning])

  /* ===================== HELPER FUNCTIONS ===================== */

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleLanguageChange = (lang: string) => {
    const selectedLang = lang as Language
    setLanguage(selectedLang)
    setCode(STARTER_CODE[selectedLang])
  }

  const resetCode = (): void => {
    setCode(STARTER_CODE[language])
  }

  const copyExample = (text: string, i: number): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(i)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch(() => {
        setError("Failed to copy to clipboard")
        setTimeout(() => setError(null), 3000)
      })
  }

  /* ===================== RUN / SUBMIT HANDLERS ===================== */

  const runCode = useCallback(() => {
    if (!code.trim()) {
      setError("Please write some code before running tests.")
      setTimeout(() => setError(null), 3000)
      return
    }

    setShowResults(true)
    setIsRunning(true)
    setActiveTab("testcases")
    setError(null)

    setTimeout(() => {
      const examples = problem?.examples || []
      if (examples.length > 0) {
        setTestResults([
          {
            id: 1,
            status: "passed",
            input: examples[0].input,
            expected: examples[0].output,
            actual: examples[0].output,
            time: "0.045s",
          },
        ])
      } else {
        setTestResults([])
        setError("No test cases available for this problem.")
      }
      setIsRunning(false)
    }, 1000)
  }, [code, problem])

  const submitCode = useCallback(() => {
    if (!code.trim()) {
      setError("Please write some code before submitting.")
      setTimeout(() => setError(null), 3000)
      return
    }

    setShowResults(true)
    setIsSubmitting(true)
    setActiveTab("testcases")
    setError(null)

    setTimeout(() => {
      const examples = problem?.examples || []
      if (examples.length > 0) {
        setTestResults(
          examples.map((ex, i) => ({
            id: i + 1,
            status: Math.random() > 0.3 ? "passed" : "failed",
            input: ex.input,
            expected: ex.output,
            actual:
              Math.random() > 0.3 ? ex.output : "Different output",
            time: `${(Math.random() * 0.1).toFixed(3)}s`,
          }))
        )
      } else {
        setTestResults([])
        setError("No test cases available for this problem.")
      }
      setIsSubmitting(false)
    }, 1200)
  }, [code, problem])

  /* ===================== LOADING STATE ===================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    )
  }

  /* ===================== ERROR STATE ===================== */

  if (error && !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-xl w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="mt-2 space-y-2">
              <p className="font-semibold">{error}</p>
              {error.includes("session") && (
                <p className="text-xs opacity-90">
                  Please return to the login page and sign in again.
                </p>
              )}
              {error.includes("API") && (
                <p className="text-xs opacity-90">
                  Troubleshooting: Check that your API server is running and the
                  endpoint is correct.
                </p>
              )}
            </AlertDescription>
          </Alert>
          <Link href="/practice" className="block">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Problems
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-xl w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Failed to load problem</p>
              <p className="text-xs opacity-90 mt-1">
                The problem could not be found or loaded.
              </p>
            </AlertDescription>
          </Alert>
          <Link href="/practice" className="block">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Problems
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ===================== MAIN RENDER ===================== */

  const difficultyConfig = DIFFICULTY_CONFIG[problem.difficulty]
  const examples = problem.examples || []

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 h-16 gap-4">
          {/* Back Button */}
          <Link href="/practice">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          {/* Title & Metadata */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <span className="font-mono text-sm text-muted-foreground">
              {"DF" + String(problem.id).padStart(3, "0")}
            </span>
            <h1 className="text-xl font-semibold truncate">{problem.title}</h1>
            <Badge
              variant="outline"
              className={`${difficultyConfig.color} ${difficultyConfig.bg} border-current`}
            >
              {difficultyConfig.label}
            </Badge>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
            <Button
              size="sm"
              variant={timerRunning ? "default" : "outline"}
              onClick={() => setTimerRunning(!timerRunning)}
              className="gap-2"
            >
              {timerRunning ? (
                <>
                  <TimerOff className="h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Timer className="h-4 w-4" /> Start
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Problem Description */}
        <div className="w-1/2 border-r overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="rounded-none border-b w-full justify-start bg-muted/30 h-auto p-0">
              <TabsTrigger value="description" className="rounded-none">
                Description
              </TabsTrigger>
              <TabsTrigger value="testcases" className="rounded-none">
                Test Cases
              </TabsTrigger>
              <TabsTrigger value="hints" className="rounded-none">
                Hints
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {/* Description Tab */}
              <TabsContent
                value="description"
                className="space-y-6 p-6 m-0 h-full"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-foreground whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>

                {problem.constraints && (
                  <div>
                    <h3 className="font-semibold mb-2">Constraints</h3>
                    <ul className="space-y-1 text-sm">
                      {problem.constraints.split("\n").map((constraint, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {constraint.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {examples.length > 0 ? (
                  <div>
                    <h3 className="font-semibold mb-3">Examples</h3>
                    <div className="space-y-4">
                      {examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-4 bg-muted/30 space-y-2"
                        >
                          <div className="text-sm font-mono text-muted-foreground">
                            Example {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground mb-1">
                              Input:
                            </div>
                            <pre className="bg-background rounded p-2 text-xs overflow-x-auto">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground mb-1">
                              Output:
                            </div>
                            <pre className="bg-background rounded p-2 text-xs overflow-x-auto">
                              {example.output}
                            </pre>
                          </div>
                          {example.explanation && (
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground mb-1">
                                Explanation:
                              </div>
                              <p className="text-xs text-foreground whitespace-pre-wrap">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 mt-2 bg-transparent"
                            onClick={() => copyExample(example.input, idx)}
                          >
                            {copied === idx ? (
                              <>
                                <Check className="h-3 w-3" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy Input
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      No examples available for this problem.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Test Cases Tab */}
              <TabsContent value="testcases" className="p-6 m-0">
                {showResults ? (
                  <div className="space-y-3">
                    {testResults.length > 0 ? (
                      testResults.map((result) => (
                        <div
                          key={result.id}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            {result.status === "passed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : result.status === "failed" ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
                            )}
                            <span className="font-semibold capitalize">
                              Test Case {result.id}{" "}
                              <span className="text-xs text-muted-foreground">
                                ({result.status})
                              </span>
                            </span>
                          </div>
                          <div className="text-xs space-y-1 ml-7">
                            <div>
                              <span className="text-muted-foreground">
                                Input:{" "}
                              </span>
                              <span className="font-mono">{result.input}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Expected:{" "}
                              </span>
                              <span className="font-mono">
                                {result.expected}
                              </span>
                            </div>
                            {result.actual && (
                              <div>
                                <span className="text-muted-foreground">
                                  Actual:{" "}
                                </span>
                                <span className="font-mono">
                                  {result.actual}
                                </span>
                              </div>
                            )}
                            {result.time && (
                              <div>
                                <span className="text-muted-foreground">
                                  Time:{" "}
                                </span>
                                <span className="font-mono">{result.time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No results yet</p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Run or submit your code to see test results
                  </p>
                )}
              </TabsContent>

              {/* Hints Tab */}
              <TabsContent value="hints" className="p-6 m-0">
                <p className="text-muted-foreground">
                  Hints will be added later
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT PANEL - Code Editor */}
        <div className="w-1/2 flex flex-col bg-slate-950 text-white">
          {/* Language Selector */}
          <div className="border-b border-slate-700 p-4">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Code Editor */}
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            className="flex-1 bg-slate-950 text-white border-0 font-mono text-sm resize-none rounded-none p-4 focus-visible:ring-0"
          />

          {/* Error Alert */}
          {error && problem && (
            <div className="border-t border-slate-700 p-4">
              <Alert variant="destructive" className="bg-red-950 border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-slate-700 p-4 flex gap-3">
            <Button
              onClick={runCode}
              disabled={isRunning || !code.trim()}
              className="flex-1 gap-2"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Run Code
                </>
              )}
            </Button>
            <Button
              onClick={submitCode}
              disabled={isSubmitting || !code.trim()}
              className="flex-1 gap-2"
              variant={isSubmitting ? "secondary" : "default"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit
                </>
              )}
            </Button>
            <Button
              onClick={resetCode}
              disabled={isRunning || isSubmitting}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}