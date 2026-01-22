"use client";

const problems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Problem ${i + 1}: Build Feature`,
  difficulty:
    i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
}));

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] to-[#121212] text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
         <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800">
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

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6 flex flex-col max-w-6xl mx-auto w-full overflow-hidden">

        {/* ----------- STATS (FIXED) ----------- */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <Stat
            title="Total Problems"
            value="120"
            gradient="from-blue-500 to-indigo-600"
          />
          <Stat
            title="Solved"
            value="45"
            gradient="from-green-500 to-emerald-600"
          />
          <Stat
            title="Unsolved"
            value="75"
            gradient="from-red-500 to-pink-600"
          />
        </div>

        {/* ----------- SEARCH + TOPICS (FIXED) ----------- */}
        <div className="mb-6 space-y-4">
          <input
            placeholder="Search problem"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap gap-2">
            <Topic color="bg-indigo-500/20 text-indigo-400">Auth_backend</Topic>
            <Topic color="bg-green-500/20 text-green-400">API_backend</Topic>
            <Topic color="bg-yellow-500/20 text-yellow-400">Bot_automation</Topic>
            <Topic color="bg-pink-500/20 text-pink-400">System_security</Topic>
             <Topic color="bg-pink-500/20 text-pink-400">System_backend</Topic>
          </div>
        </div>

        {/* ----------- PROBLEM LIST (ONLY SCROLL AREA) ----------- */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {problems.map((p) => (
            <div
              key={p.id}
              className="group relative bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 flex justify-between items-center cursor-pointer transition hover:-translate-y-[2px] hover:shadow-lg hover:shadow-black/40"
            >
              {/* LEFT COLOR BAR */}
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${
                  p.difficulty === "Easy"
                    ? "bg-green-400"
                    : p.difficulty === "Medium"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
              />

              <span className="text-sm font-medium ml-2">
                {p.title}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  p.difficulty === "Easy"
                    ? "text-green-400 border-green-400/40 bg-green-400/10"
                    : p.difficulty === "Medium"
                    ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/10"
                    : "text-red-400 border-red-400/40 bg-red-400/10"
                }`}
              >
                {p.difficulty}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Stat({
  title,
  value,
  gradient,
}: {
  title: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div
        className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`}
      />
      <p className="text-xs text-neutral-400">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Topic({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${color} cursor-pointer hover:opacity-80`}
    >
      {children}
    </span>
  );
}
