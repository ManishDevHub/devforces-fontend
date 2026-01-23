"use client";

export default function PracticePage() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white flex flex-col overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center font-bold shadow">
              D
            </div>
            <span className="font-semibold text-lg tracking-wide">DevForces</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <span className="hover:text-white cursor-pointer">Contests</span>
            <span className="hover:text-white cursor-pointer">Practice</span>
            <span className="hover:text-white cursor-pointer">Problems</span>
            <span className="hover:text-white cursor-pointer">Discuss</span>
            <span className="hover:text-white cursor-pointer">Leaderboard</span>
          </nav>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <main className="flex-1 flex items-center justify-center p-10 overflow-hidden">
        <div className="w-full max-w-7xl flex gap-10">

          {/* ================= LEFT CARD (PROBLEMS) ================= */}
          <div className="flex-1 h-[600px] bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-[32px] p-8 flex flex-col shadow-xl">

            {/* FIXED HEADER */}
            <h2 className="text-xl font-semibold mb-6 text-indigo-400 shrink-0">
              Challenges
            </h2>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl px-6 py-4 hover:scale-[1.02] hover:border-indigo-500 transition cursor-pointer"
                >
                  <span className="text-sm font-medium">
                    Problem {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT CARD (CONTESTS) ================= */}
          <div className="flex-1 h-[600px] bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-[32px] p-8 flex flex-col shadow-xl">

            {/* FIXED HEADER */}
            <h2 className="text-xl font-semibold mb-6 text-pink-400 shrink-0">
              Contests
            </h2>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto  space-y-5 pr-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-purple-600/20 to-pink-500/10 border border-neutral-700 rounded-2xl px-6 py-4 hover:scale-[1.02] transition cursor-pointer"
                >
                  <span className="text-sm font-medium">
                    Contest {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
