"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Mail, PenLine, ShieldCheck, Trophy, Upload, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";

import ContributionGrid from "@/components/contribution-grid";
import ProfileCalendar from "@/components/profile-calendar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  clearStoredToken,
  fetchUserCalendar,
  fetchUserContests,
  fetchUserProfile,
  fetchUserHistory,
  getStoredToken,
  updateUserProfile,
  UserActivity,
  UserContest,
  UserProfile,
} from "@/lib/user-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getContestStatusClass = (status: string) => {
  if (status === "LIVE") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "UPCOMING") return "border-primary/30 bg-primary/10 text-primary";
  return "border-border bg-secondary text-muted-foreground";
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [contests, setContests] = useState<UserContest[]>([]);
  const [history, setHistory] = useState<any[]>([]); // Recent submissions
  const [rank, setRank] = useState<number | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const token = getStoredToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [profileData, activityData, contestsData, historyData] = await Promise.all([
          fetchUserProfile(token),
          fetchUserCalendar(token),
          fetchUserContests(token),
          fetchUserHistory(token),
        ]);

        // Fetch Leaderboard for Rank
        const leaderboardRes = await fetch(`${API_BASE_URL}/api/user/leaderboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const leaderboard = await leaderboardRes.json();
        const myEntry = leaderboard.find((u: any) => u.id === profileData.id);
        const myPoints = myEntry ? (myEntry.points || 0) : 0;
        const myRank = Math.max(1, 500000 - myPoints);

        if (!isMounted) return;

        setProfile(profileData);
        setEditName(profileData.name || "");
        setEditBio(profileData.bio || "");
        setActivity(activityData);
        setContests(contestsData);
        setHistory(historyData);
        setRank(myRank > 0 ? myRank : null);
        setStatus("ready");
      } catch (loadError) {
        if (!isMounted) return;

        clearStoredToken();
        setError(loadError instanceof Error ? loadError.message : "Failed to load profile");
        setStatus("error");
      }
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 2MB");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(profile?.name || "");
    setEditBio(profile?.bio || "");
    setAvatarFile(null);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const trimmedName = editName.trim();
    const trimmedBio = editBio.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }

    const hasNoChanges =
      trimmedName === (profile.name || "") &&
      trimmedBio === (profile.bio || "") &&
      !avatarFile;

    if (hasNoChanges) {
      toast("No changes to save");
      return;
    }

    const token = getStoredToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateUserProfile(token, {
        name: trimmedName,
        bio: trimmedBio,
        avatarFile,
      });

      setProfile(response.user);
      setEditName(response.user.name || "");
      setEditBio(response.user.bio || "");
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const totalSubmissions = useMemo(
    () => activity.reduce((sum, entry) => sum + entry.count, 0),
    [activity]
  );

  const activeDays = useMemo(
    () => activity.filter((entry) => entry.count > 0).length,
    [activity]
  );

  const registeredContests = useMemo(
    () =>
      contests
        .filter((contest) => contest.isRegistered)
        .sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        ),
    [contests]
  );
  
  const streaks = useMemo(() => {
    if (!activity || activity.length === 0) return { current: 0, max: 0 };
    
    const activeDates = new Set(
      activity
        .filter(a => a.count > 0)
        .map(a => new Date(a.date).toISOString().slice(0, 10))
    );
    
    if (activeDates.size === 0) return { current: 0, max: 0 };
    
    const sortedDates = Array.from(activeDates).sort();
    
    // Max Streak
    let max = 0;
    let currentTemp = 0;
    let prevDate: Date | null = null;
    
    sortedDates.forEach(dateStr => {
      const currDate = new Date(dateStr);
      if (prevDate) {
        const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.round(diff) === 1) {
          currentTemp++;
        } else {
          currentTemp = 1;
        }
      } else {
        currentTemp = 1;
      }
      max = Math.max(max, currentTemp);
      prevDate = currDate;
    });
    
    // Current Streak
    let current = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    let checkDate = activeDates.has(todayStr) ? today : (activeDates.has(yesterdayStr) ? yesterday : null);
    
    if (checkDate) {
      let d = new Date(checkDate);
      while (activeDates.has(d.toISOString().slice(0, 10))) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }
    
    return { current, max };
  }, [activity]);
  
  // Solved Stats calculation
  const solvedCount = profile?.solvedProblems || 0;
  const totalProblems = profile?.totalProblems || 1; // avoid div by 0
  const solvePercentage = Math.round((solvedCount / totalProblems) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvePercentage / 100) * circumference;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Unable to load profile</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "Please login again."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.2),transparent_46%)]" />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <section className="mb-8 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.name} avatar`}
                  className="h-24 w-24 rounded-full object-cover shadow-sm ring-4 ring-background"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-3xl font-semibold text-primary shadow-sm ring-4 ring-background">
                  {profile.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-3xl font-bold tracking-tight">{profile.name}</h1>
                <p className="mt-1 flex items-center gap-2 truncate text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </p>
               
                 <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
                   <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                     <Trophy className="h-3 w-3 text-amber-500" />
                     {rank ? `Rank #${rank}` : "Unranked"}
                   </div>
                   <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Joined {formatDate(profile.createdAt)}
                   </div>
                 </div>

              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/home">
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing((value) => !value)}
              >
                <PenLine className="mr-1.5 h-4 w-4" />
                {isEditing ? "Editing" : "Edit Profile"}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border/80 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">
              {profile.bio?.trim() || "No bio yet. Add one to introduce yourself."}
            </p>
          </div>
        </section>

        {isEditing && (
            <section className="mb-8 rounded-2xl border border-primary/25 bg-card p-5 shadow-sm animate-in fade-in-0 zoom-in-95 duration-300">
            <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={editBio}
                    onChange={(event) => setEditBio(event.target.value)}
                    placeholder="Tell others about your coding interests..."
                    maxLength={300}
                    className="min-h-28"
                  />
                  <p className="text-xs text-muted-foreground">
                    {editBio.length}/300 characters
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-background/70 p-4">
                <p className="text-sm font-medium">Avatar</p>
                <div className="flex items-center gap-3">
                  {avatarPreview || profile.avatar ? (
                    <img
                      src={avatarPreview || profile.avatar || ""}
                      alt="Avatar preview"
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      {profile.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="avatar"
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG/PNG/WebP, max 2MB.
                </p>
              </div>
            </form>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column: Stats */}
            <div className="flex flex-col gap-6 lg:col-span-2">
                 <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Submissions</p>
                        <p className="mt-1 text-2xl font-semibold text-primary">{totalSubmissions}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Active Days</p>
                        <p className="mt-1 text-2xl font-semibold">{activeDays}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Current Streak</p>
                        <div className="mt-1 flex items-baseline gap-1">
                          <p className="text-2xl font-semibold text-orange-500">{streaks.current}</p>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Days</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Max Streak</p>
                        <div className="mt-1 flex items-baseline gap-1">
                          <p className="text-2xl font-semibold text-primary">{streaks.max}</p>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Days</span>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Contribution Activity</h2>
                    <ContributionGrid activity={activity} />
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Recent History</h2>
                    {history.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No recent submissions.</p>
                    ) : (
                        <div className="space-y-4">
                            {history.map((sub: any) => (
                                <div key={sub.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        {sub.status === "ACCEPTED" ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{sub.problem?.title || "Unknown Problem"}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{new Date(sub.createdAt).toLocaleString()}</span>
                                                <span>•</span>
                                                <span className="capitalize">{sub.language}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs font-semibold">{sub.score} pts</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Right Column: Circle Stats & Contests */}
            <div className="flex flex-col gap-6">
                 {/* Progress Circle */}
                 <section className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center">
                    <h2 className="mb-4 text-lg font-semibold w-full text-left">Problem Solving</h2>
                    <div className="relative h-48 w-48">
                        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 192 192">
                            <circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-secondary"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{solvedCount}</span>
                            <span className="text-xs text-muted-foreground">Solved</span>
                            <span className="text-[10px] text-muted-foreground mt-1">out of {totalProblems}</span>
                        </div>
                    </div>
                 </section>

                 <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-semibold">Contest History</h2>
                    </div>
                    {registeredContests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        You haven&apos;t joined any contests yet.
                    </p>
                    ) : (
                    <div className="space-y-3">
                        {registeredContests.slice(0, 5).map((contest) => (
                        <Link
                            key={contest.id}
                            href={`/contest/${contest.id}`}
                            className="block rounded-xl border border-border bg-background/70 p-3 transition-colors hover:border-primary/40"
                        >
                            <div className="mb-1 flex items-center justify-between gap-3">
                            <p className="line-clamp-1 font-medium">{contest.title}</p>
                            <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getContestStatusClass(
                                contest.status
                                )}`}
                            >
                                {contest.status}
                            </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                            {new Date(contest.startTime).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </p>
                        </Link>
                        ))}
                    </div>
                    )}
                </section>
                
                <ProfileCalendar activity={activity} />
            </div>
        </div>

      </main>
    </div>
  );
}
