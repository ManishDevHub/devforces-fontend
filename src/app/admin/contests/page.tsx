"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Search, BookOpen } from "lucide-react";
import { getStoredToken, API_BASE_URL } from "@/lib/user-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Contest {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  status: string;
  problems?: any[];
}

interface Problem {
  id: number;
  title: string;
  difficulty: string;
}

export default function AdminContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [selectedProblemIds, setSelectedProblemIds] = useState<number[]>([]);

  const [currentContest, setCurrentContest] = useState<Partial<Contest>>({
    title: "",
    type: "WEEKLY",
    startTime: "",
    endTime: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const token = getStoredToken();
    try {
      const [contestsRes, problemsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/getAllContestByadmin`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/user/problem/problems`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const contestsData = await contestsRes.json();
      const problemsData = await problemsRes.json();
      
      setContests(Array.isArray(contestsData) ? contestsData : []);
      setAllProblems(Array.isArray(problemsData) ? problemsData : []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    const url = isEditing 
      ? `${API_BASE_URL}/api/admin/updateContest/${currentContest.id}`
      : `${API_BASE_URL}/api/admin/createContest`;
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(currentContest)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setIsEditing(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving contest", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;
    const token = getStoredToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/deleteContest/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete contest", error);
    }
  };

  const openAddProblemsModal = async (contestId: number) => {
    setSelectedContestId(contestId);
    const token = getStoredToken();
    try {
       const res = await fetch(`${API_BASE_URL}/api/admin/getContestByIdByAdmin/${contestId}`, {
          headers: { Authorization: `Bearer ${token}` }
       });
       const data = await res.json();
       const existingIds = data.problems?.map((p: any) => p.problem.id) || [];
       setSelectedProblemIds(existingIds);
       setIsProblemModalOpen(true);
    } catch (error) {
       console.error("Failed to fetch contest detail", error);
    }
  };

  const handleAddProblems = async () => {
    const token = getStoredToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contest/${selectedContestId}/problems`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ problemIds: selectedProblemIds })
      });

      if (res.ok) {
        setIsProblemModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding problems", error);
    }
  };

  const toggleProblemSelection = (id: number) => {
    setSelectedProblemIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredContests = contests.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contests..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => { setIsEditing(false); setIsModalOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contest
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredContests.map((contest) => (
            <Card key={contest.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{contest.title}</h3>
                  <Badge variant="outline">{contest.type}</Badge>
                  <Badge className={cn(
                    contest.status === "LIVE" ? "bg-emerald-500 hover:bg-emerald-600" : 
                    contest.status === "UPCOMING" ? "bg-blue-500 hover:bg-blue-600" : "bg-muted"
                  )}>
                    {contest.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => openAddProblemsModal(contest.id)}>
                   <BookOpen className="h-4 w-4" />
                   Manage Problems
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setCurrentContest(contest); setIsEditing(true); setIsModalOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(contest.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Contest Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in-95">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setIsModalOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Contest" : "Create Contest"}</h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Title</label>
                <Input required value={currentContest.title} onChange={(e) => setCurrentContest({...currentContest, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type</label>
                <Select value={currentContest.type} onValueChange={(val) => setCurrentContest({...currentContest, type: val as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Start Time</label>
                <Input type="datetime-local" required 
                   value={currentContest.startTime ? new Date(currentContest.startTime).toISOString().slice(0, 16) : ""} 
                   onChange={(e) => setCurrentContest({...currentContest, startTime: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">End Time</label>
                <Input type="datetime-local" required 
                   value={currentContest.endTime ? new Date(currentContest.endTime).toISOString().slice(0, 16) : ""}
                   onChange={(e) => setCurrentContest({...currentContest, endTime: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Problems to Contest Modal */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-8 relative shadow-2xl max-h-[80vh] flex flex-col">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setIsProblemModalOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold mb-6">Manage Contest Problems</h2>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {allProblems.map(problem => (
                <div 
                  key={problem.id} 
                  className={cn(
                    "p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors",
                    selectedProblemIds.includes(problem.id) 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => toggleProblemSelection(problem.id)}
                >
                  <div>
                    <div className="font-semibold">{problem.title}</div>
                    <div className="text-xs text-muted-foreground">{problem.difficulty}</div>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center",
                    selectedProblemIds.includes(problem.id) ? "bg-primary border-primary" : "border-muted-foreground"
                  )}>
                    {selectedProblemIds.includes(problem.id) && <div className="h-2 w-2 rounded-full bg-white transition-all scale-100" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsProblemModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProblems}>Save Problems ({selectedProblemIds.length})</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
