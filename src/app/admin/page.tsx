"use client";

import React, { useEffect, useState } from "react";
import { Users, FileCode2, Trophy, CheckCircle2 } from "lucide-react";
import { getStoredToken, API_BASE_URL } from "@/lib/user-client";

interface Stats {
  users: number;
  problems: number;
  contests: number;
  submissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, problems: 0, contests: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = getStoredToken();
      try {
        // Fetch real stats from API
        const [problemsRes, contestsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/problem/allProblem`, {
             headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/admin/getAllContestByadmin`, {
             headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const problems = await problemsRes.json();
        const contests = await contestsRes.json();

        setStats({
          users: 0, // Placeholder
          problems: problems.length || 0,
          contests: contests.length || 0,
          submissions: 0 // Placeholder
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Problems", value: stats.problems, icon: FileCode2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Contests", value: stats.contests, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Submissions", value: stats.submissions, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg w-fit ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{loading ? "..." : stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
             <p className="text-muted-foreground italic">No recent activity found.</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">System Health</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="text-emerald-500 font-medium">Online</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Docker Workers</span>
                <span className="text-emerald-500 font-medium">Active</span>
             </div>
             <div className="flex items-center justify-between">
                <span>Worker Queue (Redis)</span>
                <span className="text-emerald-500 font-medium">Healthy</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
