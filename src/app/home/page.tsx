"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Flame, Layers, Trophy, UserRound, Zap, ArrowRight, Code2, Terminal, Target } from "lucide-react";

import ContributionGrid from "@/components/contribution-grid";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  clearStoredToken,
  fetchUserCalendar,
  fetchUserContests,
  fetchUserProfile,
  getStoredToken,
  UserActivity,
  UserContest,
  UserProfile,
} from "@/lib/user-client";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function MainHome() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [contests, setContests] = useState<UserContest[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      const token = getStoredToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const [profileData, activityData, contestsData] = await Promise.all([
          fetchUserProfile(token),
          fetchUserCalendar(token),
          fetchUserContests(token),
        ]);
        if (!isMounted) return;
        setProfile(profileData);
        setActivity(activityData);
        setContests(contestsData);
        setStatus("ready");
      } catch (loadError) {
        if (!isMounted) return;
        clearStoredToken();
        setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard");
        setStatus("error");
      }
    };
    void loadDashboard();
    return () => { isMounted = false; };
  }, [router]);

  // Calculations
  const totalActivity = useMemo(() => activity.reduce((sum, entry) => sum + entry.count, 0), [activity]);
  const activeDays = useMemo(() => activity.filter((entry) => entry.count > 0).length, [activity]);
  const registeredContestsCount = useMemo(() => contests.filter((c) => c.isRegistered).length, [contests]);
  
  if (status === "loading") return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (status === "error" || !profile) return <div className="min-h-screen bg-background flex items-center justify-center">Error loading dashboard.</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_40%)]" />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in duration-700">
        
        {/* Welcome Hero - Long Animated Style */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-background p-8 shadow-sm md:p-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="relative z-10 max-w-2xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400 animate-in slide-in-from-left-4 duration-700 delay-100">
                Welcome, {profile.name}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground animate-in slide-in-from-left-4 duration-700 delay-200">
                DevForces is your arena. Compete in global contests, solve complex algorithms, and track your coding journey.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-left-4 duration-700 delay-300">
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/practice">Start Solving <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                    <Link href="/contest">Join Contest</Link>
                </Button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -m-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-20 h-40 w-40 text-primary/5">
             <Code2 className="h-full w-full opacity-20 rotate-12" />
          </div>
        </section>

        {/* Stats Row */}
        <section className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            {[
                { label: "Total Activity", value: totalActivity, icon: <Zap className="h-5 w-5 text-yellow-500" />, delay: "delay-0" },
                { label: "Active Days", value: activeDays, icon: <Flame className="h-5 w-5 text-orange-500" />, delay: "delay-100" },
                { label: "Contests", value: registeredContestsCount, icon: <Trophy className="h-5 w-5 text-yellow-600" />, delay: "delay-200" },
                { label: "Joined", value: formatDate(profile.createdAt), icon: <CalendarClock className="h-5 w-5 text-blue-500" />, delay: "delay-300" }
            ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        {stat.icon}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </section>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] animate-in slide-in-from-bottom-10 duration-700 delay-300">
            {/* Main Content */}
            <div className="space-y-8">
                {/* Contribution */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Activity Map</h2>
                        </div>
                        <Link href="/profile" className="text-sm text-primary hover:underline">View Full Profile</Link>
                    </div>
                    <ContributionGrid activity={activity} />
                </div>
                
                {/* Features / Shortcuts */}
                <div className="grid gap-4 sm:grid-cols-2">
                     <Link href="/problem" className="group rounded-2xl border border-border bg-card p-6 transition-all hover:bg-accent/50">
                        <div className="mb-3 inline-block rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                            <Terminal className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold">Problems</h3>
                        <p className="text-sm text-muted-foreground">Access over 2000+ coding challenges to improve your skills.</p>
                     </Link>
                     <Link href="/leaderboard" className="group rounded-2xl border border-border bg-card p-6 transition-all hover:bg-accent/50">
                        <div className="mb-3 inline-block rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold">Leaderboard</h3>
                        <p className="text-sm text-muted-foreground">See where you stand among the top developers globally.</p>
                     </Link>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
                    <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" /> 
                        Snapshot
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                        {profile.avatar ? (
                            <img src={profile.avatar} className="h-16 w-16 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                                {profile.email[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-lg">{profile.name}</p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl bg-secondary/50 p-4">
                             <p className="text-sm font-medium">Daily Streak</p>
                             <div className="mt-1 flex items-end gap-1">
                                <span className="text-2xl font-bold text-orange-500">
                                    {/* Calculated streak or 0 */}
                                    {activity.filter(a => a.count > 0).length > 0 ? "1" : "0"} 
                                </span>
                                <span className="mb-1 text-xs text-muted-foreground">days</span>
                             </div>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/profile">Go to Profile</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
