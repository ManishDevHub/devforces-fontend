"use client";

import Link from "next/link";
import { use } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  Clock,
  Loader2,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  CheckCircle2,
  XCircle,
  Timer,
  TimerOff,
  Code2,
  Terminal,
  ChevronRight,
  History,
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Language = "node" | "python" | "java";
type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT"
  | "COMPILATION_ERROR";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: "AUTH_SECURITY" | "API_BACKEND" | "BOT_AUTOMATION" | "APP_BACKEND" | "SYSTEM_DESIGN";
  examples: Example[];
  constraints: string | null;
}

interface SubmissionResultRow {
  input: string;
  expected: string;
  output?: string;
  passed: boolean;
  error?: string;
}

interface SubmissionResultPayload {
  type: "NORMAL" | "CONTEST";
  id: number;
  status: SubmissionStatus;
  score: number | null;
  executionMs: number | null;
  createdAt: string;
  feedback?: {
    verdict?: SubmissionStatus;
    score?: number;
    sandbox?: {
      status: "PASSED" | "FAILED" | "ERROR";
      passed: number;
      failed: number;
      total: number;
      executionMs: number;
      error?: string;
      results: SubmissionResultRow[];
    };
    ai?: {
      summary?: string;
      strengths?: string[];
      weaknesses?: string[];
      securityIssues?: string[];
      improvements?: string[];
    };
  } | null;
  problem?: {
    id: number;
    title: string;
    difficulty: string;
    type: string;
  };
  code?: string;
  language?: string;
}

interface ProblemHintPayload {
  hints: string[];
  source: "ai" | "fallback";
}

interface ProblemSolutionPayload {
  solution: string;
  explanation?: string;
}

interface SubmissionHistoryItem {
  id: number;
  status: SubmissionStatus;
  score: number | null;
  executionMs: number | null;
  language: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const LANGUAGES: Array<{ value: Language; label: string }> = [
  { value: "node", label: "JavaScript (Node)" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];

const STARTER_CODE: Record<Language, string> = {
  node: `function solve(input) {
  // Parse input and return output string
  return input;
}

module.exports = { solve };`,
  python: `def solve(input):
    # Parse input and return output string
    return input`,
  java: `public class Solution {
    public static String solve(String input) {
        // Parse input and return output string
        return input;
    }
}`,
};

const parseExamples = (rawExamples: unknown): Example[] => {
  if (!rawExamples) return [];

  if (Array.isArray(rawExamples)) {
    return rawExamples
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        if (row.input === undefined || (row.output === undefined && row.expected === undefined)) {
          return null;
        }
        const ex: Example = {
          input: String(row.input ?? ""),
          output: String(row.output ?? row.expected ?? ""),
          explanation: typeof row.explanation === "string" ? row.explanation : undefined,
        };
        return ex;
      })
      .filter((item): item is Example => item !== null);
  }

  if (typeof rawExamples === "object" && rawExamples !== null) {
    const row = rawExamples as Record<string, unknown>;
    if (row.input !== undefined && (row.output !== undefined || row.expected !== undefined)) {
      return [
        {
          input: String(row.input ?? ""),
          output: String(row.output ?? row.expected ?? ""),
          explanation:
            typeof row.explanation === "string" ? row.explanation : undefined,
        },
      ];
    }
  }

  return [];
};

const difficultyBadgeClass: Record<Problem["difficulty"], string> = {
  EASY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  HARD: "bg-red-500/10 text-red-500 border-red-500/30",
};

const terminalStatuses: SubmissionStatus[] = [
  "ACCEPTED",
  "WRONG_ANSWER",
  "RUNTIME_ERROR",
  "TIME_LIMIT",
  "COMPILATION_ERROR",
];

const statusColorClass: Record<SubmissionStatus, string> = {
  PENDING: "text-amber-500",
  RUNNING: "text-blue-500",
  ACCEPTED: "text-emerald-500",
  WRONG_ANSWER: "text-red-500",
  RUNTIME_ERROR: "text-red-500",
  TIME_LIMIT: "text-orange-500",
  COMPILATION_ERROR: "text-red-500",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTimer = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const stringifyValue = (val: unknown): string => {
  if (val === null || val === undefined) return "(null)";
  if (typeof val === "string") return val;
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = use(params);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<Language>("node");
  const [code, setCode] = useState(STARTER_CODE.node);
  const [error, setError] = useState<string | null>(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLabel, setActionLabel] = useState<"RUN" | "SUBMIT" | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResultPayload | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [aiHints, setAiHints] = useState<string[]>([]);
  const [hintsSource, setHintsSource] = useState<"ai" | "fallback" | null>(null);
  const [loadingHints, setLoadingHints] = useState(false);
  const [hintsError, setHintsError] = useState<string | null>(null);
  
  const [solution, setSolution] = useState<string | null>(null);
  const [solutionExplanation, setSolutionExplanation] = useState<string | null>(null);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const [leftTab, setLeftTab] = useState("description");
  const [rightBottomTab, setRightBottomTab] = useState("testcase");

  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    const loadProblem = async () => {
      try {
        setLoadingProblem(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first.");
          setLoadingProblem(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/user/problem/${problemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load problem (${response.status})`);
        }

        const data = await response.json();
        const parsedProblem: Problem = {
          id: data.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          type: data.type,
          examples: parseExamples(data.examples),
          constraints: data.constraints || null,
        };

        if (isMounted.current) {
          setProblem(parsedProblem);
        }
      } catch (loadError) {
        if (!isMounted.current) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load problem");
      } finally {
        if (isMounted.current) {
          setLoadingProblem(false);
        }
      }
    };

    void loadProblem();
  }, [problemId]);

  const fetchHints = async (targetProblemId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      setLoadingHints(true);
      setHintsError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/user/problem/${targetProblemId}/hints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load hints (${response.status})`);
      }

      const payload = (await response.json()) as ProblemHintPayload;
      if (!isMounted.current) return;

      setAiHints(Array.isArray(payload.hints) ? payload.hints : []);
      setHintsSource(payload.source || null);
    } catch (hintError) {
      if (!isMounted.current) return;
      setHintsError(hintError instanceof Error ? hintError.message : "Failed to load hints");
    } finally {
      if (isMounted.current) {
        setLoadingHints(false);
      }
    }
  };

  const fetchSolution = async () => {
    if (!problem?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingSolution(true);
      const response = await fetch(`${API_BASE_URL}/api/user/problem/${problem.id}/solution`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch solution");

      const data = (await response.json()) as ProblemSolutionPayload;
      setSolution(data.solution);
      setSolutionExplanation(data.explanation || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSolution(false);
    }
  };

  const fetchHistory = async () => {
    if (!problem?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingHistory(true);
      const response = await fetch(`${API_BASE_URL}/api/user/problems/${problem.id}/submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = (await response.json()) as SubmissionHistoryItem[];
      setSubmissionHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (leftTab === "submissions") {
      void fetchHistory();
    }
  }, [leftTab, problem?.id]);

  useEffect(() => {
    if (!problem?.id) return;
    void fetchHints(problem.id);
  }, [problem?.id]);

  const loadSubmission = async (id: number) => {
     const token = localStorage.getItem("token");
     if (!token) return;

     try {
        setLoadingHistory(true);
        const response = await fetch(`${API_BASE_URL}/api/user/submissions/${id}?type=NORMAL`, {
           headers: {
              Authorization: `Bearer ${token}`,
           },
        });

        if (!response.ok) throw new Error("Failed to load submission");

        const data = (await response.json()) as SubmissionResultPayload;
        
        if (data.language) {
           setLanguage(data.language as Language);
        }
        if (data.code) {
           setCode(data.code);
        }
        
        setSubmissionResult(data);
        setRightBottomTab("result");
     } catch (err) {
        console.error(err);
     } finally {
        setLoadingHistory(false);
     }
  };

  const pollSubmissionResult = async (submissionId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first.");
    }

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const response = await fetch(
        `${API_BASE_URL}/api/user/submissions/${submissionId}?type=NORMAL`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch submission result (${response.status})`);
      }

      const result = (await response.json()) as SubmissionResultPayload;

      if (!isMounted.current) {
        return;
      }

      setSubmissionResult(result);

      if (terminalStatuses.includes(result.status)) {
        setRightBottomTab("result");
        return;
      }

      await sleep(1500);
    }

    throw new Error("Result is taking too long. Please refresh and check again.");
  };

  const submitCode = async (mode: "RUN" | "SUBMIT") => {
    try {
      if (!code.trim()) {
        setError("Please write code before submitting.");
        return;
      }

      setError(null);
      setSubmitting(true);
      setActionLabel(mode);
      setSubmissionResult(null);
      setRightBottomTab("result");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(`${API_BASE_URL}/api/user/problems/${problemId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language,
          mode,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Submission failed.");
      }

      const submissionId = Number(payload.submissionId);
      if (!submissionId) {
        throw new Error("Invalid submission response.");
      }

      if (!isMounted.current) return;

      setCurrentSubmissionId(submissionId);
      await pollSubmissionResult(submissionId);
    } catch (submitError) {
      if (!isMounted.current) return;
      setError(submitError instanceof Error ? submitError.message : "Submission failed.");
    } finally {
      if (isMounted.current) {
        setSubmitting(false);
        setActionLabel(null);
      }
    }
  };

  const resetCode = () => {
    setCode(STARTER_CODE[language]);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
        setError("Please login to use AI chat.");
        return;
    }

    const newMessage = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setSendingChat(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/problem/${problemId}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: currentInput })
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || "I couldn't generate a response." }]);
    } catch (err) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setSendingChat(false);
    }
  };

  const submissionRows = useMemo(
    () => submissionResult?.feedback?.sandbox?.results || [],
    [submissionResult]
  );

  if (loadingProblem) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Initializing sandbox environment...</p>
        </div>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-xl">
          <Alert variant="destructive" className="border-hard/50 bg-hard/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Link href="/practice" className="mt-6 block">
            <Button variant="outline" className="w-full h-11">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Playground
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="w-full max-w-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Problem not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="z-10 border-b border-border bg-card px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/practice">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md hover:bg-accent transition-all">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <Code2 className="h-4 w-4 text-primary" />
             <span className="text-sm font-mono text-muted-foreground">Problem Set</span>
             <ChevronRight className="h-3 w-3 text-muted-foreground" />
             <span className="text-sm font-semibold truncate max-w-[200px]">{problem.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Timer */}
           <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md border border-border/50">
             <Clock className="h-3.5 w-3.5 text-primary" />
             <span className="text-xs font-mono font-bold tracking-wider">{formatTimer(timerSeconds)}</span>
             <Button
                size="sm"
                variant="ghost"
                onClick={() => setTimerRunning(p => !p)}
                className="h-6 w-6 p-0 hover:bg-accent"
             >
               {timerRunning ? <TimerOff className="h-3 w-3" /> : <Play className="h-3 w-3 fill-primary text-primary" />}
             </Button>
           </div>
           
           <div className="h-4 w-px bg-border/50" />
           
           <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 border-border/50 bg-muted hover:bg-accent" onClick={resetCode}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset
              </Button>
              <Button size="sm" variant="outline" className="h-8 border-border/50 bg-muted hover:bg-accent" onClick={() => submitCode("RUN")} disabled={submitting}>
                <Play className="h-3.5 w-3.5 mr-1.5 fill-emerald-500 text-emerald-500" />
                Run
              </Button>
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={() => submitCode("SUBMIT")} disabled={submitting}>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Submit
              </Button>
           </div>
        </div>
      </header>

      {/* Main Split Body */}
      <main className="flex-1 flex overflow-hidden p-1 gap-1">
        {/* Left Side: Problem Info & Hints */}
        <div className="w-1/2 h-full flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden shadow-xl">
           <Tabs value={leftTab} onValueChange={setLeftTab} className="h-full flex flex-col">
              <TabsList className="h-10 w-full justify-start rounded-none border-b border-border/50 bg-muted/50 px-2 sticky top-0 z-10 backdrop-blur-md">
                 <TabsTrigger value="description" className="data-[state=active]:bg-accent data-[state=active]:text-primary transition-all">
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    Description
                 </TabsTrigger>
                 <TabsTrigger value="testcases" className="data-[state=active]:bg-accent data-[state=active]:text-emerald-500 transition-all">
                    <Terminal className="h-3.5 w-3.5 mr-1.5" />
                    Test Cases
                 </TabsTrigger>
                 <TabsTrigger value="hints" className="data-[state=active]:bg-accent data-[state=active]:text-amber-500 transition-all">
                    <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                    Hints
                 </TabsTrigger>
                 <TabsTrigger value="submissions" className="data-[state=active]:bg-accent data-[state=active]:text-blue-500 transition-all">
                    <History className="h-3.5 w-3.5 mr-1.5" />
                    Submissions
                 </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="flex-1 overflow-y-auto p-6 focus-visible:ring-0 m-0 h-full max-h-[80vh] custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{problem.title}</h1>
                    <Badge variant={problem.difficulty.toLowerCase() === "easy" ? "easy" : problem.difficulty.toLowerCase() === "medium" ? "medium" : "hard"}>
                          {problem.difficulty}
                        </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    <span className="bg-[#2a2a2a] px-2 py-1 rounded border border-border/50">{problem.type.replace("_", " ")}</span>
                    <div className="flex items-center gap-1.5">
                       <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                       1.2k Accepted
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                     <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[15px]">{problem.description}</p>
                  </div>
                </div>

                {problem.constraints && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center text-primary">
                      <Terminal className="h-4 w-4 mr-2" />
                      Constraints
                    </h3>
                    <div className="rounded-lg border border-border/30 bg-black/20 p-4">
                      <pre className="text-sm font-mono text-muted-foreground">{problem.constraints}</pre>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold flex items-center text-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Examples
                  </h3>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="space-y-2">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Example {i+1}:</p>
                       <div className="rounded-lg border border-border/30 bg-black/30 p-4 space-y-2 font-mono text-sm">
                          <div className="grid grid-cols-[100px_1fr]">
                            <span className="text-primary/70">Input:</span>
                            <span className="text-foreground">{ex.input}</span>
                          </div>
                          <div className="grid grid-cols-[100px_1fr]">
                            <span className="text-primary/70">Output:</span>
                            <span className="text-foreground">{ex.output}</span>
                          </div>
                          {ex.explanation && (
                            <div className="mt-2 pt-2 border-t border-border/10 text-xs text-muted-foreground italic">
                              {ex.explanation}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testcases" className="flex-1 overflow-y-auto p-6 focus-visible:ring-0 m-0 h-full max-h-[80vh] custom-scrollbar">
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                       <Terminal className="h-5 w-5 text-emerald-500" />
                       Problem Test Cases
                    </h2>
                    <p className="text-sm text-muted-foreground">The following cases are used to validate your solution. Ensure your code handles these inputs correctly.</p>
                    
                    <div className="space-y-6">
                       {problem.examples.map((ex, i) => (
                         <div key={i} className="space-y-3 p-4 rounded-xl border border-border/30 bg-muted/50">
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-black uppercase tracking-widest text-primary/70">Case {i+1}</span>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Input</label>
                                  <pre className="p-3 rounded-lg bg-muted border border-border/20 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">{ex.input}</pre>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Expected Output</label>
                                  <pre className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre-wrap">{ex.output}</pre>
                               </div>
                               {ex.explanation && (
                                 <div className="pt-2 border-t border-border/10">
                                    <p className="text-xs text-muted-foreground italic flex items-start gap-2">
                                       <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                       {ex.explanation}
                                    </p>
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </TabsContent>


              <TabsContent value="hints" className="flex-1 flex flex-col p-0 m-0 h-full max-h-[80vh] overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground opacity-50">
                        <Bot className="h-12 w-12 mb-4" />
                        <p>Ask for a hint or clarification about the problem.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                             msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={cn(
                            "rounded-lg p-3 text-sm max-w-[80%]",
                            msg.role === 'user' 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-foreground"
                          )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {sendingChat && (
                       <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 animate-pulse" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                       </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-border/50 bg-muted/50">
                     <form 
                       onSubmit={(e) => {
                         e.preventDefault();
                         handleSendChat();
                       }}
                       className="flex gap-2"
                     >
                        <Textarea 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask specifically about this problem..."
                          className="min-h-[40px] max-h-[120px] resize-none border-border/50 focus-visible:ring-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendChat();
                            }
                          }}
                        />
                        <Button type="submit" size="icon" disabled={!chatInput.trim() || sendingChat} className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-10 w-10">
                          <Send className="h-4 w-4" />
                        </Button>
                     </form>
                  </div>
              </TabsContent>
              
              <TabsContent value="submissions" className="flex-1 overflow-y-auto p-0 m-0 focus-visible:ring-0">
                  {loadingHistory ? (
                   <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Retrieving History...</p>
                   </div>
                 ) : submissionHistory.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                      <History className="h-12 w-12 opacity-20" />
                      <p className="text-sm font-medium">No submissions yet</p>
                      <p className="text-xs max-w-xs text-center">Solve the problem and submit your code to see your history here.</p>
                   </div>
                 ) : (
                   <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between px-2 mb-2">
                         <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Saved Records</h3>
                         <span className="text-[10px] font-mono text-muted-foreground">{submissionHistory.length} Attempts</span>
                      </div>
                      <div className="space-y-2">
                         {submissionHistory.map((sub) => (
                           <div 
                              key={sub.id} 
                              onClick={() => void loadSubmission(sub.id)}
                              className="group flex items-center justify-between p-3 rounded-xl bg-card border border-border/20 hover:bg-accent hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn("h-2 w-2 rounded-full", sub.status === "ACCEPTED" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]")} />
                                 <div>
                                    <p className={cn("text-sm font-bold tracking-tight", statusColorClass[sub.status])}>{sub.status}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[10px] font-mono text-muted-foreground uppercase">{sub.language}</span>
                                       <span className="text-[10px] text-muted-foreground/30">•</span>
                                       <span className="text-[10px] text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-black text-primary">{sub.score ?? "-"}</p>
                                 <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Points</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </TabsContent>
           </Tabs>
        </div>

        {/* Right Side: Editor & Terminal */}
        <div className="w-1/2 flex flex-col gap-1 overflow-hidden">
           {/* Editor Panel */}
           <div className="flex-1 bg-card rounded-lg border border-border/50 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="h-10 border-b border-border/50 flex items-center justify-between px-3 bg-muted/50">
                 <Select value={language} onValueChange={(v) => {
                    const l = v as Language;
                    setLanguage(l);
                    setCode(STARTER_CODE[l]);
                 }}>
                   <SelectTrigger className="h-7 w-40 border-none bg-transparent hover:bg-accent font-mono text-xs focus:ring-0 focus:ring-offset-0">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="bg-popover border-border/50">
                      {LANGUAGES.map(l => (
                        <SelectItem key={l.value} value={l.value} className="text-xs font-mono">{l.label}</SelectItem>
                      ))}
                   </SelectContent>
                 </Select>
                 
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md hover:bg-accent" onClick={resetCode}>
                       <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <div className="h-4 w-px bg-border/30 mx-1" />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md hover:bg-accent">
                       <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                 </div>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground focus-visible:ring-0 selection:bg-primary/20 placeholder:text-muted-foreground/30"
                placeholder="/* Write your masterpiece here... */"
              />
              
              {/* Submission Overlay Info */}
              {submitting && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
                   <div className="bg-[#1a1a1a] border border-border p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div>
                        <p className="font-bold text-sm tracking-tight">{actionLabel === "RUN" ? "Evaluating Code..." : "Submitting to Grader..."}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Contacting Sandbox Cluster</p>
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Terminal / Result Panel */}
           <div className="h-[38%] bg-card rounded-lg border border-border/50 flex flex-col overflow-hidden shadow-2xl">
              <Tabs value={rightBottomTab} onValueChange={setRightBottomTab} className="flex-1 flex flex-col">
                 <TabsList className="h-9 w-full justify-start rounded-none border-b border-border/50 bg-muted/50 px-2">
                    <TabsTrigger value="testcase" className="h-7 text-xs font-semibold data-[state=active]:bg-accent data-[state=active]:text-primary rounded-sm transition-all">
                       <Terminal className="h-3 w-3 mr-1.5" />
                       Testcase
                    </TabsTrigger>
                    <TabsTrigger value="result" className="h-7 text-xs font-semibold data-[state=active]:bg-accent data-[state=active]:text-emerald-500 rounded-sm transition-all">
                       <CheckCircle2 className="h-3 w-3 mr-1.5" />
                       Result
                    </TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="testcase" className="flex-1 overflow-y-auto p-4 m-0 bg-muted/20 focus-visible:ring-0">
                    <div className="space-y-4">
                       {problem.examples.map((ex, i) => (
                         <div key={i} className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Case {i+1}</label>
                            <div className="grid grid-cols-2 gap-3">
                               <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-muted-foreground">INPUT</span>
                                  <div className="p-2.5 rounded border border-border/20 bg-white/5 font-mono text-xs text-foreground/80 break-all">{ex.input}</div>
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-muted-foreground">EXPECTED</span>
                                  <div className="p-2.5 rounded border border-border/20 bg-muted/60 font-mono text-xs text-emerald-500/80 break-all">{ex.output}</div>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </TabsContent>
                 
                 <TabsContent value="result" className="flex-1 overflow-y-auto p-0 m-0 bg-muted/20 focus-visible:ring-0">
                    {!submissionResult && !submitting && (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                         <Play className="h-8 w-8" />
                         <p className="text-xs font-medium uppercase tracking-widest">Run tests to see results</p>
                      </div>
                    )}
                    
                    {submissionResult && (
                      <div className="p-4 space-y-4">
                         <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/30">
                            <div className="flex items-center gap-3">
                               {submissionResult.status === "ACCEPTED" ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
                               <div>
                                  <p className={cn("text-lg font-bold tracking-tight", statusColorClass[submissionResult.status])}>{submissionResult.status}</p>
                                  <p className="text-[10px] text-muted-foreground font-mono">Runtime: {submissionResult.executionMs ?? "?"} ms</p>
                               </div>
                            </div>
                            {submissionResult.score !== null && (
                               <div className="text-right">
                                  <p className="text-2xl font-black text-primary">{submissionResult.score}</p>
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Total Score</p>
                               </div>
                            )}
                         </div>

                         {submissionResult.feedback?.ai?.summary && (
                            <div className="space-y-4">
                               <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                  <div className="flex items-center gap-2 mb-2">
                                     <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                                     <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">AI Verdict Summary</span>
                                  </div>
                                  <p className="text-sm leading-relaxed text-foreground/90">{submissionResult.feedback.ai.summary}</p>
                               </div>

                               {(submissionResult.feedback.ai.strengths?.length ?? 0) > 0 && (
                                 <div className="grid gap-2">
                                   <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Strengths</p>
                                   <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                                     {submissionResult.feedback.ai.strengths?.map((s, i) => (
                                       <li key={i}>{s}</li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                               
                               {(submissionResult.feedback.ai.improvements?.length ?? 0) > 0 && (
                                 <div className="grid gap-2">
                                   <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Suggested Improvements</p>
                                   <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                                     {submissionResult.feedback.ai.improvements?.map((s, i) => (
                                       <li key={i}>{s}</li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                            </div>
                         )}

                          {submissionResult.feedback?.sandbox?.error && (
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 mt-4">
                               <div className="flex items-center gap-2 mb-2 text-red-400">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  <span className="text-xs font-bold uppercase tracking-wider">Sandbox Error</span>
                               </div>
                               <pre className="text-xs leading-relaxed text-red-400 font-mono whitespace-pre-wrap">{stringifyValue(submissionResult.feedback.sandbox.error)}</pre>
                            </div>
                          )}

                         {submissionRows.length > 0 && (
                          <div className="space-y-2 mt-4">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Sandbox Trace</p>
                            <div className="space-y-2">
                              {submissionRows.map((row, i) => (
                                <div key={i} className={cn("p-3 rounded-lg border transition-all", row.passed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
                                   <div className="flex items-center gap-2 mb-2">
                                      {row.passed ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                      ) : (
                                        <XCircle className="h-3 w-3 text-red-500" />
                                      )}
                                      <span className="text-[11px] font-bold">Test Case {i+1}</span>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-muted-foreground">
                                      <div className="space-y-1">
                                         <p className="text-primary/40 uppercase font-bold text-[8px]">Output</p>
                                         <p className="text-foreground break-all bg-muted p-1.5 rounded truncate max-h-12">{stringifyValue(row.output)}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-primary/40 uppercase font-bold text-[8px]">Expected</p>
                                         <p className="text-foreground break-all bg-muted p-1.5 rounded truncate max-h-12">{stringifyValue(row.expected)}</p>
                                      </div>
                                   </div>
                                   {row.error && <p className="mt-2 text-[10px] text-red-400 font-mono bg-red-400/5 p-2 rounded border border-red-400/20">{stringifyValue(row.error)}</p>}
                                </div>
                              ))}
                            </div>
                         </div>
                         )}
                      </div>
                    )}
                 </TabsContent>
              </Tabs>
           </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-border bg-card px-4 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span>Sandbox Online</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span>Node: v20.x</span>
            <span>Python: 3.11</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-foreground transition-colors">
               <AlertTriangle className="h-3 w-3" />
               <span>Report Problem</span>
            </div>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">v1.2.0-STABLE</span>
         </div>
      </footer>
    </div>
  );
}
