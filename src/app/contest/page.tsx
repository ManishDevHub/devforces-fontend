"use client";

import { useState, useMemo, useEffect } from "react";

import { ContestCard } from "@/components/contest-card";
import { ContestFilters } from "@/components/contest-filters";

import { Trophy, Flame, Calendar, History } from "lucide-react";
import Navbar from "@/components/navbar";
import { useAuthGuard } from "@/protectedRoute";
import { constants } from "buffer";


export type ContestStatus = "LIVE" | "UPCOMING" | "COMPLETED";
export type ContestFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type ContestCategory = "AUTH_SECURITY" | "API_BACKEND" | "BOT_AUTOMATION" | "APP_BACKEND" | "SYSTEM_DESIGN";

export default function ContestsPage() {

  useAuthGuard();

  const [ contests , setContests] = useState<any[]>([]);
  const [ loading , setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContestStatus | "all">("all");
  const [frequencyFilter, setFrequencyFilter] = useState<ContestFrequency | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchesStatus = statusFilter === "all" || contest.status === statusFilter;
      const matchesFrequency = frequencyFilter === "all" || contest.frequency === frequencyFilter;
      const matchesSearch =
        searchQuery === "" ||
        contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contest.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesFrequency && matchesSearch;
    });
  }, [statusFilter, frequencyFilter, searchQuery, contests]);

  const liveContests = filteredContests.filter((c) => c.status === "LIVE");
  const upcomingContests = filteredContests.filter((c) => c.status === "UPCOMING");
  const pastContests = filteredContests.filter((c) => c.status === "COMPLETED");

  const stats = {
    live: contests.filter((c) => c.status === "LIVE").length,
    upcoming: contests.filter((c) => c.status === "UPCOMING").length,
    past: contests.filter((c) => c.status === "COMPLETED").length,
    total: contests.length,
  };

  useEffect( () =>{

    const fetchContest = async () => {
      try{
         const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/user/contest/allcontest", {
          credentials: "include",
             headers: {
        'Authorization': `Bearer ${token}` 
      }
          
        })
        const data = await res.json();

        const maped = data.map((c:any) => {
          const now = new Date();
          const start = new Date(c.startTime);
          const end = new Date(c.endTime);
          let status = "UPCOMING"
            if (now >= start && now <= end) {
          status = "LIVE";
        } else if (now > new Date(c.endTime)) {
          status = "COMPLETED";
        }
        return {
          id:c.id,
          title:c.title,
          discription:`${c.type} contest`,
          frequency: c.type.toLowerCase(),
          status,
          startTime: start,
          endTime: end
        }
        })
        setContests(maped);

      }catch(err){

        console.error(err);
        console.log(" failed to fetch contests")
      } finally{
        setLoading(false)
      }
    }
    fetchContest();

  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar></Navbar>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Developer Contests
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Compete in real-world development challenges. Build auth systems, automate bots, 
            design APIs, and master backend engineering.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-live/10">
                <Flame className="h-5 w-5 text-live" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.live}</p>
                <p className="text-sm text-muted-foreground">Live Now</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-upcoming/10">
                <Calendar className="h-5 w-5 text-upcoming" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <History className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.past}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-4 font-semibold text-foreground">Filter Contests</h2>
              <ContestFilters
                statusFilter={statusFilter}
                frequencyFilter={frequencyFilter}
                searchQuery={searchQuery}
                onStatusChange={setStatusFilter}
                onFrequencyChange={setFrequencyFilter}
                onSearchChange={setSearchQuery}
              />
            </div>
          </aside>

          {/* Contest Grid */}
          <div className="space-y-8">
            {/* Live Contests */}
            {liveContests.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-live" />
                  </span>
                  <h2 className="text-xl font-semibold text-foreground">Live Contests</h2>
                  <span className="rounded-full bg-live/10 px-2 py-0.5 text-xs font-medium text-live">
                    {liveContests.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {liveContests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Contests */}
            {upcomingContests.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-upcoming" />
                  <h2 className="text-xl font-semibold text-foreground">Upcoming Contests</h2>
                  <span className="rounded-full bg-upcoming/10 px-2 py-0.5 text-xs font-medium text-upcoming">
                    {upcomingContests.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcomingContests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Contests */}
            {pastContests.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold text-foreground">Past Contests</h2>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {pastContests.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pastContests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredContests.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Trophy className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No contests found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-accent">
                <span className="text-xs font-bold text-accent-foreground">DF</span>
              </div>
              <span className="font-semibold">DevForces</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for developers who love to compete and learn.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
