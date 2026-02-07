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
  Code2,
  FileText,
  TestTube,
  Lightbulb,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Terminal,
} from "lucide-react"

// Problem data
const problemsData: Record<string, Problem> = {
  "DF001": {
    id: "DF001",
    title: "JWT Authentication System",
    difficulty: "Medium",
    category: "Auth System",
    acceptance: "67.3%",
    submissions: 12453,
    description: `Design and implement a secure JWT (JSON Web Token) authentication system that handles user login, token generation, and token verification.

Your implementation should support:
- User authentication with username and password
- JWT token generation with customizable expiration
- Token verification and decoding
- Refresh token mechanism
- Proper error handling for invalid/expired tokens`,
    constraints: [
      "Token expiration should be configurable (default: 1 hour)",
      "Refresh tokens should have a longer expiration (default: 7 days)",
      "Use HS256 algorithm for token signing",
      "Handle edge cases: invalid credentials, expired tokens, malformed tokens",
      "Time complexity for verification: O(1)",
      "Do not store sensitive data in token payload"
    ],
    examples: [
      {
        input: `login({ username: "devuser", password: "secure123" })`,
        output: `{
  success: true,
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  expiresIn: 3600
}`,
        explanation: "Successful login returns access and refresh tokens with expiration time in seconds."
      },
      {
        input: `verifyToken("eyJhbGciOiJIUzI1NiIs...")`,
        output: `{
  valid: true,
  payload: { userId: "123", username: "devuser" },
  expiresAt: 1706745600
}`,
        explanation: "Token verification returns the decoded payload if valid."
      },
      {
        input: `verifyToken("invalid_or_expired_token")`,
        output: `{
  valid: false,
  error: "TOKEN_EXPIRED"
}`,
        explanation: "Invalid or expired tokens return an error code."
      }
    ],
    hints: [
      "Consider using a library like jsonwebtoken for Node.js",
      "Store the secret key securely, never hardcode it",
      "Include issued-at (iat) timestamp in your tokens",
      "Consider implementing token blacklisting for logout"
    ],
    testCases: [
      { id: 1, input: "Valid credentials login", expected: "Returns tokens", hidden: false },
      { id: 2, input: "Invalid password", expected: "Returns error", hidden: false },
      { id: 3, input: "Verify valid token", expected: "Returns payload", hidden: false },
      { id: 4, input: "Verify expired token", expected: "Returns TOKEN_EXPIRED", hidden: false },
      { id: 5, input: "Refresh token flow", expected: "Returns new access token", hidden: true },
      { id: 6, input: "Edge case: malformed token", expected: "Returns INVALID_TOKEN", hidden: true },
    ]
  }
}

interface Problem {
  id: string
  title: string
  difficulty: string
  category: string
  acceptance: string
  submissions: number
  description: string
  constraints: string[]
  examples: { input: string; output: string; explanation: string }[]
  hints: string[]
  testCases: { id: number; input: string; expected: string; hidden: boolean }[]
}

interface TestResult {
  id: number
  status: "passed" | "failed" | "running" | "pending"
  input: string
  expected: string
  actual?: string
  time?: string
}

const starterCode: Record<string, string> = {
  python: `class AuthSystem:
    def __init__(self, secret_key: str):
        """Initialize the authentication system with a secret key."""
        self.secret_key = secret_key
        # Your implementation here
    
    def login(self, username: str, password: str) -> dict:
        """
        Authenticate user and return tokens.
        Returns: { success, accessToken, refreshToken, expiresIn }
        """
        # Your implementation here
        pass
    
    def verify_token(self, token: str) -> dict:
        """
        Verify and decode a JWT token.
        Returns: { valid, payload/error }
        """
        # Your implementation here
        pass
    
    def refresh_token(self, refresh_token: str) -> dict:
        """
        Generate new access token using refresh token.
        Returns: { success, accessToken, expiresIn }
        """
        # Your implementation here
        pass

# Example usage:
# auth = AuthSystem("your-secret-key")
# result = auth.login("devuser", "secure123")
`,
  javascript: `class AuthSystem {
  constructor(secretKey) {
    this.secretKey = secretKey;
    // Your implementation here
  }

  /**
   * Authenticate user and return tokens.
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, accessToken?: string, refreshToken?: string, expiresIn?: number }}
   */
  login(username, password) {
    // Your implementation here
  }

  /**
   * Verify and decode a JWT token.
   * @param {string} token
   * @returns {{ valid: boolean, payload?: object, error?: string }}
   */
  verifyToken(token) {
    // Your implementation here
  }

  /**
   * Generate new access token using refresh token.
   * @param {string} refreshToken
   * @returns {{ success: boolean, accessToken?: string, expiresIn?: number }}
   */
  refreshToken(refreshToken) {
    // Your implementation here
  }
}

// Example usage:
// const auth = new AuthSystem("your-secret-key");
// const result = auth.login("devuser", "secure123");

module.exports = { AuthSystem };
`,
  java: `import java.util.*;

public class AuthSystem {
    private String secretKey;
    
    public AuthSystem(String secretKey) {
        this.secretKey = secretKey;
        // Your implementation here
    }
    
    /**
     * Authenticate user and return tokens.
     * @param username The username
     * @param password The password
     * @return Map containing success, accessToken, refreshToken, expiresIn
     */
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> result = new HashMap<>();
        // Your implementation here
        return result;
    }
    
    /**
     * Verify and decode a JWT token.
     * @param token The JWT token to verify
     * @return Map containing valid, payload/error
     */
    public Map<String, Object> verifyToken(String token) {
        Map<String, Object> result = new HashMap<>();
        // Your implementation here
        return result;
    }
    
    /**
     * Generate new access token using refresh token.
     * @param refreshToken The refresh token
     * @return Map containing success, accessToken, expiresIn
     */
    public Map<String, Object> refreshToken(String refreshToken) {
        Map<String, Object> result = new HashMap<>();
        // Your implementation here
        return result;
    }
    
    // Example usage:
    // AuthSystem auth = new AuthSystem("your-secret-key");
    // Map<String, Object> result = auth.login("devuser", "secure123");
}
`
}

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [problemId, setProblemId] = useState<string>("")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [language, setLanguage] = useState<string>("javascript")
  const [code, setCode] = useState<string>(starterCode.javascript)
  const [activeTab, setActiveTab] = useState<string>("description")
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [copied, setCopied] = useState<number | null>(null)
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  
  // Submission state
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)

  useEffect(() => {
    params.then((p) => {
      setProblemId(p.id)
      const prob = problemsData[p.id] || problemsData["DF001"]
      setProblem(prob)
    })
  }, [params])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    setCode(starterCode[newLang])
  }

  const resetCode = () => {
    setCode(starterCode[language])
  }

  const copyExample = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const runCode = useCallback(() => {
    if (!problem) return
    setIsRunning(true)
    setShowResults(true)
    setActiveTab("testcases")
    
    // Initialize test results
    const initialResults: TestResult[] = problem.testCases
      .filter((tc) => !tc.hidden)
      .map((tc) => ({
        id: tc.id,
        status: "pending",
        input: tc.input,
        expected: tc.expected,
      }))
    setTestResults(initialResults)

    // Simulate running tests
    initialResults.forEach((_, index) => {
      setTimeout(() => {
        setTestResults((prev) =>
          prev.map((r, i) =>
            i === index ? { ...r, status: "running" } : r
          )
        )
        
        setTimeout(() => {
          setTestResults((prev) =>
            prev.map((r, i) =>
              i === index
                ? {
                    ...r,
                    status: Math.random() > 0.3 ? "passed" : "failed",
                    actual: r.expected,
                    time: `${(Math.random() * 50 + 10).toFixed(0)}ms`,
                  }
                : r
            )
          )
          
          if (index === initialResults.length - 1) {
            setIsRunning(false)
          }
        }, 500)
      }, index * 800)
    })
  }, [problem])

  const submitCode = useCallback(() => {
    if (!problem) return
    setIsSubmitting(true)
    setShowResults(true)
    setActiveTab("testcases")

    // Initialize all test results including hidden
    const allResults: TestResult[] = problem.testCases.map((tc) => ({
      id: tc.id,
      status: "pending",
      input: tc.hidden ? "Hidden Test Case" : tc.input,
      expected: tc.hidden ? "Hidden" : tc.expected,
    }))
    setTestResults(allResults)

    // Simulate running all tests
    allResults.forEach((_, index) => {
      setTimeout(() => {
        setTestResults((prev) =>
          prev.map((r, i) =>
            i === index ? { ...r, status: "running" } : r
          )
        )

        setTimeout(() => {
          setTestResults((prev) =>
            prev.map((r, i) =>
              i === index
                ? {
                    ...r,
                    status: Math.random() > 0.2 ? "passed" : "failed",
                    actual: problem.testCases[i].hidden ? "Hidden" : r.expected,
                    time: `${(Math.random() * 100 + 20).toFixed(0)}ms`,
                  }
                : r
            )
          )

          if (index === allResults.length - 1) {
            setIsSubmitting(false)
          }
        }, 600)
      }, index * 700)
    })
  }, [problem])

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "bg-easy/20 text-easy border-easy/30"
      case "Medium":
        return "bg-medium/20 text-medium border-medium/30"
      case "Hard":
        return "bg-hard/20 text-hard border-hard/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/practice">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono text-sm">{problem.id}</span>
              <h1 className="font-semibold text-lg">{problem.title}</h1>
              <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-mono text-lg min-w-[80px]">{formatTime(timerSeconds)}</span>
              <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setTimerRunning(!timerRunning)}
                >
                  {timerRunning ? (
                    <TimerOff className="h-4 w-4 text-hard" />
                  ) : (
                    <Timer className="h-4 w-4 text-easy" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    setTimerRunning(false)
                    setTimerSeconds(0)
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 px-4">
              <TabsTrigger
                value="description"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <TestTube className="h-4 w-4" />
                Test Cases
                {showResults && (
                  <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    {testResults.filter((r) => r.status === "passed").length}/{testResults.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="hints"
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Lightbulb className="h-4 w-4" />
                Hints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="space-y-6">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Acceptance: <span className="text-foreground">{problem.acceptance}</span></span>
                  <span>Submissions: <span className="text-foreground">{problem.submissions.toLocaleString()}</span></span>
                  <span>Category: <span className="text-primary">{problem.category}</span></span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Problem Description</h3>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {problem.description}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                  <ul className="space-y-2">
                    {problem.constraints.map((constraint, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((example, i) => (
                      <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
                          <span className="text-sm font-medium">Example {i + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs"
                            onClick={() => copyExample(example.input, i)}
                          >
                            {copied === i ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Input:</span>
                            <pre className="mt-1 bg-background p-3 rounded-md text-sm font-mono overflow-x-auto">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Output:</span>
                            <pre className="mt-1 bg-background p-3 rounded-md text-sm font-mono overflow-x-auto text-easy">
                              {example.output}
                            </pre>
                          </div>
                          <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                            <span className="text-primary">Explanation:</span> {example.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testcases" className="flex-1 overflow-y-auto p-6 mt-0">
              {!showResults ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <TestTube className="h-12 w-12 mb-4 opacity-50" />
                  <p>Run or submit your code to see test results</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, i) => (
                    <div
                      key={result.id}
                      className={`border rounded-lg overflow-hidden ${
                        result.status === "passed"
                          ? "border-easy/30 bg-easy/5"
                          : result.status === "failed"
                          ? "border-hard/30 bg-hard/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          {result.status === "passed" ? (
                            <CheckCircle2 className="h-5 w-5 text-easy" />
                          ) : result.status === "failed" ? (
                            <XCircle className="h-5 w-5 text-hard" />
                          ) : result.status === "running" ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                          <span className="font-medium">Test Case {result.id}</span>
                          {problem.testCases[i]?.hidden && (
                            <Badge variant="outline" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                        {result.time && (
                          <span className="text-sm text-muted-foreground">{result.time}</span>
                        )}
                      </div>
                      {!problem.testCases[i]?.hidden && (
                        <div className="px-4 pb-3 pt-0 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">Input:</span>
                            <div className="mt-1 bg-background/50 p-2 rounded font-mono text-xs">
                              {result.input}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Expected:</span>
                            <div className="mt-1 bg-background/50 p-2 rounded font-mono text-xs">
                              {result.expected}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hints" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="space-y-4">
                {problem.hints.map((hint, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-4 flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground">{hint}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Code2 className="h-4 w-4 text-primary" />
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] h-8 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">
                    <span className="flex items-center gap-2">
                      <span className="text-yellow-400">JS</span> Node.js
                    </span>
                  </SelectItem>
                  <SelectItem value="python">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400">PY</span> Python
                    </span>
                  </SelectItem>
                  <SelectItem value="java">
                    <span className="flex items-center gap-2">
                      <span className="text-orange-400">JV</span> Java
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={resetCode} className="gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="absolute inset-0 w-full h-full bg-[#0a0a0f] text-foreground font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
              style={{
                tabSize: 2,
              }}
              spellCheck={false}
            />
            {/* Line numbers overlay */}
            <div className="absolute top-0 left-0 p-4 text-muted-foreground/30 font-mono text-sm pointer-events-none select-none leading-relaxed">
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          </div>

          {/* Console Output */}
          <div className="h-32 border-t border-border bg-[#0a0a0f]">
            <div className="flex items-center gap-2 px-4 h-8 border-b border-border bg-card/30">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Console</span>
            </div>
            <div className="p-3 font-mono text-xs text-muted-foreground h-[calc(100%-32px)] overflow-y-auto">
              {isRunning || isSubmitting ? (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {isSubmitting ? "Submitting..." : "Running test cases..."}
                </div>
              ) : showResults ? (
                <div className="space-y-1">
                  <div className="text-muted-foreground">
                    {"> "} Execution completed
                  </div>
                  <div className="text-easy">
                    {"> "} Passed: {testResults.filter((r) => r.status === "passed").length}/{testResults.length}
                  </div>
                  {testResults.some((r) => r.status === "failed") && (
                    <div className="text-hard">
                      {"> "} Failed: {testResults.filter((r) => r.status === "failed").length}/{testResults.length}
                    </div>
                  )}
                </div>
              ) : (
                <span className="opacity-50">{"> "} Ready to run...</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-4 h-14 border-t border-border bg-card/50">
            <div className="text-sm text-muted-foreground">
              {language === "javascript" && "Node.js 20.x"}
              {language === "python" && "Python 3.11"}
              {language === "java" && "Java 17"}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={runCode}
                disabled={isRunning || isSubmitting}
                className="gap-2 border-border bg-transparent"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run
              </Button>
              <Button
                onClick={submitCode}
                disabled={isRunning || isSubmitting}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
