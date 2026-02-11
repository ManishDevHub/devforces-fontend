"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useParams } from "next/navigation"


type Language = "javascript" | "python" | "java"

export default function ContestDetailPage() {
  const params = useParams() as { contestId: string }
  const contestId = params.contestId

  const [contestData, setContestData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [language, setLanguage] = useState<Language>("javascript")
  const [codes, setCodes] = useState<Record<string, Record<Language, string>>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [activeTab, setActiveTab] = useState<"description" | "testcases" | "hints">("description")
  const [consoleOutput, setConsoleOutput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [problemStatus, setProblemStatus] = useState<
    Record<string, "solved" | "attempted" | "unsolved">
  >({})
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string; time: string }>
  >([])
  const [copiedExample, setCopiedExample] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

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
          setError("No authentication token found")
          setLoading(false)
          return
        }

        const res = await fetch(
          `http://localhost:4000/api/user/contest/${contestId}`,
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

        const formatted = {
          id: data.id || contestId,
          title: data.title || "Untitled Contest",
          participants: Number(data.participants) || 0,
          totalTime:
            data.endTime && data.startTime
              ? (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 1000
              : 3600, // Default 1 hour if times not provided
          problems: data.problems.map((p: any, index: number) => ({
            id: String.fromCharCode(65 + index),
            dbId: p.id || index,
            title: p.title || `Problem ${index + 1}`,
            difficulty: p.difficulty || "MEDIUM",
            description: p.description || "No description available",
            examples: Array.isArray(p.examples) ? p.examples : [],
            constraints: p.constraints 
              ? (typeof p.constraints === 'string' ? p.constraints.split("\n") : [])
              : [],
            points:
              p.difficulty === "EASY"
                ? 100
                : p.difficulty === "MEDIUM"
                ? 200
                : 400,
          })),
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

    contestData.problems.forEach((problem: any) => {
      initialCodes[problem.id] = {
        javascript: `// Write your solution here\n\nfunction solve() {\n  \n}`,
        python: `# Write your solution here\n\ndef solve():\n    pass`,
        java: `// Write your solution here\n\nclass Solution {\n    public static void main(String[] args) {\n        \n    }\n}`,
      }
    })

    setCodes(initialCodes)
  }, [contestData])

  // ================= INIT STATUS =================
  useEffect(() => {
    if (!contestData || !contestData.problems) return

    const statusObj: any = {}
    contestData.problems.forEach((p: any) => {
      statusObj[p.id] = "unsolved"
    })
    setProblemStatus(statusObj)
  }, [contestData])

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
    if (!contestData || !currentProblem) return ""
    return codes[currentProblem.id]?.[language] || ""
  }

  const setCurrentCode = (code: string) => {
    if (!contestData || !currentProblem) return
    setCodes((prev) => ({
      ...prev,
      [currentProblem.id]: {
        ...prev[currentProblem.id],
        [language]: code,
      },
    }))
  }

  const handleReset = () => {
    setCurrentCode("")
    setConsoleOutput("")
    setTestResults([])
  }

  const handleRun = () => {
    setConsoleOutput("Running your code...\n")
    // Add your run logic here
    setTimeout(() => {
      setConsoleOutput("Code executed successfully!")
    }, 1000)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Add your submit logic here
    setTimeout(() => {
      setIsSubmitting(false)
      setConsoleOutput("Submission received!")
    }, 2000)
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

  const currentProblem = contestData.problems[currentProblemIndex]

  const totalPoints = contestData.problems.reduce(
    (sum: number, p: any) => sum + (p.points || 0),
    0
  )

  const earnedPoints = contestData.problems.reduce(
    (sum: number, p: any) =>
      problemStatus[p.id] === "solved" ? sum + (p.points || 0) : sum,
    0
  )

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-hard/20 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-hard" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Exit Contest?</h3>
                <p className="text-sm text-muted-foreground">Your progress will be saved</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to exit the contest? You can rejoin anytime before it ends.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border hover:bg-secondary bg-transparent"
                onClick={() => setShowExitModal(false)}
              >
                Continue Contest
              </Button>
              <Link href="/practice" className="flex-1">
                <Button className="w-full bg-hard hover:bg-hard/80 text-white">Exit Contest</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contest Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowExitModal(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{contestData.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-secondary/50 border border-border">
              <Clock className={`w-4 h-4 ${getTimeColor()}`} />
              <span className={`font-mono font-bold text-lg ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
              {timeRemaining <= 300 && <span className="text-xs text-hard animate-pulse">LOW TIME</span>}
            </div>

            {/* Points */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-primary">
                {earnedPoints}/{totalPoints}
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{contestData.participants.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Problem Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-secondary/30 border-t border-border">
          {contestData.problems.map((problem: any, index: number) => (
            <button
              key={problem.id}
              onClick={() => setCurrentProblemIndex(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentProblemIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {getStatusIcon(problemStatus[problem.id])}
              <span className="font-medium">{problem.id}</span>
              <Badge variant="outline" className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                {problem.points}
              </Badge>
            </button>
          ))}

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentProblemIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentProblemIndex === 0}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentProblemIndex((prev) => Math.min(contestData.problems.length - 1, prev + 1))}
              disabled={currentProblemIndex === contestData.problems.length - 1}
              className="border-border"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-7.5rem)]">
        {/* Problem Panel */}
        <div className={`${isFullscreen ? "hidden" : "w-1/2"} border-r border-border flex flex-col`}>
          {/* Problem Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">{currentProblem.id}.</span>
                <h1 className="text-xl font-bold text-foreground">{currentProblem.title}</h1>
              </div>
              <Badge className={`${getDifficultyColor(currentProblem.difficulty)} border`}>
                {currentProblem.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Points: {currentProblem.points}</span>
              <span>Status: {problemStatus[currentProblem.id]}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {[
              { id: "description", label: "Description", icon: FileText },
              { id: "testcases", label: "Test Cases", icon: Terminal },
              { id: "hints", label: "Hints", icon: Lightbulb },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "description" && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{currentProblem.description}</p>
                </div>

                {/* Examples */}
                {currentProblem.examples && currentProblem.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Examples</h3>
                    <div className="space-y-4">
                      {currentProblem.examples.map((example: any, index: number) => (
                        <div key={index} className="bg-secondary/30 rounded-lg border border-border overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-b border-border">
                            <span className="text-sm font-medium text-foreground">Example {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${example.input}\n${example.output}`, index)}
                              className="h-7 text-muted-foreground hover:text-foreground"
                            >
                              {copiedExample === index ? (
                                <Check className="w-3.5 h-3.5 text-easy" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                          <div className="p-3 space-y-2">
                            <div>
                              <span className="text-xs text-muted-foreground">Input:</span>
                              <pre className="mt-1 text-sm text-foreground font-mono bg-background/50 p-2 rounded">
                                {String(example.input || "")}
                              </pre>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Output:</span>
                              <pre className="mt-1 text-sm text-foreground font-mono bg-background/50 p-2 rounded">
                                {String(example.output || "")}
                              </pre>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="text-xs text-muted-foreground">Explanation:</span>
                                <p className="mt-1 text-sm text-muted-foreground">{String(example.explanation)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Constraints</h3>
                    <ul className="space-y-1.5">
                      {currentProblem.constraints.map((constraint: any, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <code className="font-mono">{String(constraint)}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "testcases" && (
              <div className="space-y-4">
                {testResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Terminal className="w-12 h-12 mb-4 opacity-50" />
                    <p>Run your code to see test results</p>
                  </div>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border overflow-hidden ${
                        result.passed ? "border-easy/30 bg-easy/5" : "border-hard/30 bg-hard/5"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between px-3 py-2 ${
                          result.passed ? "bg-easy/10" : "bg-hard/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-easy" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-hard" />
                          )}
                          <span className={`text-sm font-medium ${result.passed ? "text-easy" : "text-hard"}`}>
                            Test Case {index + 1}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{result.time}</span>
                      </div>
                      <div className="p-3 space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <code className="text-foreground">{result.input}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected: </span>
                          <code className="text-foreground">{result.expected}</code>
                        </div>
                        {!result.passed && (
                          <div>
                            <span className="text-muted-foreground">Actual: </span>
                            <code className="text-hard">{result.actual}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4">
                {[1, 2, 3].map((hint) => (
                  <details key={hint} className="group">
                    <summary className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {hint}
                      </div>
                      <span className="font-medium text-foreground">Hint {hint}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-2 p-3 text-sm text-muted-foreground bg-secondary/20 rounded-lg border border-border">
                      {hint === 1 && "Think about using a hash map to store values you've seen."}
                      {hint === 2 && "Consider the time complexity - can you solve this in O(n)?"}
                      {hint === 3 && "What if you store the complement of each number as you iterate?"}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className={`${isFullscreen ? "w-full" : "w-1/2"} flex flex-col bg-background`}>
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="javascript">Node.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              value={getCurrentCode()}
              onChange={(e) => setCurrentCode(e.target.value)}
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-[#0a0a12] text-foreground resize-none focus:outline-none"
              style={{ tabSize: 2 }}
              spellCheck={false}
            />
          </div>

          {/* Console Output */}
          <div className="h-24 border-t border-border bg-secondary/20">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-secondary/30">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Console</span>
            </div>
            <div className="p-3 font-mono text-sm text-muted-foreground overflow-auto h-[calc(100%-2rem)]">
              {consoleOutput || "Click 'Run' to execute your code..."}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Problem {currentProblemIndex + 1} of {contestData.problems.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRun} disabled={isSubmitting} className="border-border bg-transparent">
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Judging...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}