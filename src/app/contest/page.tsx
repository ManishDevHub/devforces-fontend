"use client";

import { useState } from "react";

const contests = [
  {
    id: 479,
    title: "Weekly Contest 479",
    date: "Dec 7, 2025 · 08:00 AM",
    status: "past",
  },
  {
    id: 171,
    title: "Biweekly Contest 171",
    date: "Dec 6, 2025 · 08:00 PM",
    status: "past",
  },
  {
    id: 480,
    title: "Weekly Contest 480",
    date: "Dec 14, 2025 · 08:00 AM",
    status: "upcoming",
  },
  {
    id: 50,
    title: "Monthly Contest 50",
    date: "Dec 20, 2025 · 08:00 PM",
    status: "running",
  },
];

export default function ContestPage() {
  const [tab, setTab] = useState<"all" | "past" | "upcoming">("all");

  const filtered = contests.filter((c) => {
    if (tab === "all") return true;
    if (tab === "past") return c.status === "past";
    return c.status !== "past";
  });

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center p-6 overflow-hidden">
      <div className="w-full max-w-7xl h-full border border-neutral-700 rounded-[32px] overflow-hidden flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="h-52 relative border-b border-neutral-700">
          {/* better blue background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a44] via-[#0b4fa3]/40 to-[#081a2e]" />

          <div className="relative h-full flex items-center justify-center gap-12">
            <ContestBox title="Weekly Contest" type="weekly" />
            <ContestBox title="Biweekly Contest" type="biweekly" />
            <ContestBox title="Monthly Contest" type="monthly" />
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 bg-neutral-900 p-6 overflow-hidden">

          {/* TABS */}
          <div className="flex gap-8 mb-6 text-sm">
            <Tab active={tab === "all"} onClick={() => setTab("all")}>
              All Contests
            </Tab>
            <Tab active={tab === "past"} onClick={() => setTab("past")}>
              Past Contests
            </Tab>
            <Tab active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
              Upcoming / Running
            </Tab>
          </div>

          {/* CONTEST LIST */}
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {filtered.map((contest) => (
              <div
                key={contest.id}
                className="flex items-center justify-between bg-neutral-800 rounded-2xl p-5 hover:bg-neutral-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-bold">
                    C
                  </div>

                  <div>
                    <p className="font-medium">{contest.title}</p>
                    <p className="text-xs text-neutral-400">
                      {contest.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-4 py-1.5 rounded-full font-medium ${
                    contest.status === "past"
                      ? "bg-blue-600/30 text-gray-300"
                      : contest.status === "running"
                      ? "bg-green-600/30 text-green-400"
                      : "bg-purple-600/30 text-purple-400"
                  }`}
                >
                  {contest.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ContestBox({
  title,
  type,
}: {
  title: string;
  type: "weekly" | "biweekly" | "monthly";
}) {
  const styles =
    type === "weekly"
      ? "from-blue-600/30 to-blue-400/10 border-blue-400/40 text-blue-200"
      : type === "biweekly"
      ? "from-purple-600/30 to-purple-400/10 border-purple-400/40 text-purple-200"
      : "from-orange-600/30 to-orange-400/10 border-orange-400/40 text-orange-200";

  return (
    <div
      className={`w-72 h-32 rounded-3xl border bg-gradient-to-br ${styles} 
      flex items-center justify-center text-lg font-semibold cursor-pointer
      hover:scale-[1.03] transition`}
    >
      {title}
    </div>
  );
}

function Tab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer pb-1 transition ${
        active
          ? "border-b-2 border-white font-semibold text-white"
          : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {children}
    </span>
  );
}
