"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Search } from "lucide-react";
import { getStoredToken, API_BASE_URL } from "@/lib/user-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: string;
  points: number;
  constraints?: string;
  examples?: any;
}

export default function AdminProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Partial<Problem>>({
    title: "",
    description: "",
    difficulty: "MEDIUM",
    type: "APP_BACKEND",
    points: 100,
    constraints: "",
    examples: { tests: [] }
  });

  const fetchProblems = async () => {
    setLoading(true);
    const token = getStoredToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/problem/allProblem`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch problems", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    const url = isEditing 
      ? `${API_BASE_URL}/api/admin/problem/${currentProblem.id}`
      : `${API_BASE_URL}/api/admin/problem/createProblem`;
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(currentProblem)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentProblem({
          title: "",
          description: "",
          difficulty: "MEDIUM",
          type: "APP_BACKEND",
          points: 100,
          constraints: "",
          examples: { tests: [] }
        });
        fetchProblems();
      } else {
        const err = await res.json();
        alert(err.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving problem", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    const token = getStoredToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/problem/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProblems();
      }
    } catch (error) {
      console.error("Failed to delete problem", error);
    }
  };

  const openEditModal = (problem: Problem) => {
    setCurrentProblem(problem);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search problems..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => { 
          setIsEditing(false); 
          setCurrentProblem({
            title: "",
            description: "",
            difficulty: "MEDIUM",
            type: "APP_BACKEND",
            points: 100,
            constraints: "",
            examples: { tests: [] }
          });
          setIsModalOpen(true); 
        }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{problem.title}</h3>
                  <Badge variant={
                    problem.difficulty === "EASY" ? "easy" : 
                    problem.difficulty === "MEDIUM" ? "medium" : "hard"
                  }>
                    {problem.difficulty}
                  </Badge>
                  <Badge variant="outline">{problem.type}</Badge>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                  {problem.description}
                </div>
                <div className="text-xs font-medium text-primary">Points: {problem.points}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditModal(problem)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(problem.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {filteredProblems.length === 0 && (
            <div className="text-center p-12 bg-muted/50 rounded-xl">
               <p className="text-muted-foreground font-medium">No problems found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal / Overlay Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border-primary/20 animate-in zoom-in-95">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Problem" : "Add New Problem"}</h2>
            
            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold">Title</label>
                <Input 
                  required 
                  placeholder="Problem title..." 
                  value={currentProblem.title}
                  onChange={(e) => setCurrentProblem({...currentProblem, title: e.target.value})}
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea 
                  required 
                  placeholder="Problem description (Markdown supported)..." 
                  className="min-h-[150px]"
                  value={currentProblem.description}
                  onChange={(e) => setCurrentProblem({...currentProblem, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Difficulty</label>
                <Select 
                  value={currentProblem.difficulty} 
                  onValueChange={(val) => setCurrentProblem({...currentProblem, difficulty: val as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Type</label>
                 <Select 
                  value={currentProblem.type} 
                  onValueChange={(val) => setCurrentProblem({...currentProblem, type: val as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APP_BACKEND">App Backend</SelectItem>
                    <SelectItem value="API_BACKEND">API Backend</SelectItem>
                    <SelectItem value="AUTH_SECURITY">Auth & Security</SelectItem>
                    <SelectItem value="BOT_AUTOMATION">Bot Automation</SelectItem>
                    <SelectItem value="SYSTEM_DESIGN">System Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Points</label>
                <Input 
                  type="number"
                  required 
                  value={currentProblem.points}
                  onChange={(e) => setCurrentProblem({...currentProblem, points: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold">Constraints</label>
                <Textarea 
                  placeholder="Execution time caps, memory limits, etc..." 
                  value={currentProblem.constraints}
                  onChange={(e) => setCurrentProblem({...currentProblem, constraints: e.target.value})}
                />
              </div>

              {/* Test Cases Section */}
              <div className="space-y-4 md:col-span-2 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Test Cases (Examples)</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const tests = [...(currentProblem.examples?.tests || [])];
                      tests.push({ input: "", expected: "" });
                      setCurrentProblem({ ...currentProblem, examples: { tests } });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Case
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {(currentProblem.examples?.tests || []).map((test: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border relative">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 h-8 w-8 text-destructive"
                        onClick={() => {
                          const tests = [...(currentProblem.examples?.tests || [])];
                          tests.splice(index, 1);
                          setCurrentProblem({ ...currentProblem, examples: { tests } });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Input</label>
                          <Textarea 
                            placeholder="e.g. [1, 2, 3] or 5"
                            className="text-sm font-mono min-h-[60px]"
                            value={test.input}
                            onChange={(e) => {
                              const tests = [...(currentProblem.examples?.tests || [])];
                              tests[index].input = e.target.value;
                              setCurrentProblem({ ...currentProblem, examples: { tests } });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Expected Output</label>
                          <Textarea 
                            placeholder="e.g. 6 or 'result'"
                            className="text-sm font-mono min-h-[60px]"
                            value={test.expected}
                            onChange={(e) => {
                              const tests = [...(currentProblem.examples?.tests || [])];
                              tests[index].expected = e.target.value;
                              setCurrentProblem({ ...currentProblem, examples: { tests } });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(currentProblem.examples?.tests || []).length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
                      <p className="text-sm text-muted-foreground">No test cases added yet. These are required for Docker execution.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 md:col-span-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{isEditing ? "Update Problem" : "Create Problem"}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
