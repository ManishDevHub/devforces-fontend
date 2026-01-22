"use client";

import React from "react";

const problems = Array.from({ length: 25 }).map((_, i) => {
  const difficulty =
    i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard";

  return {
    id: i + 1,
    title: `Problem ${i + 1}: Build Feature ${i + 1}`,
    difficulty,
  };
});

const topics = [
  "Array",
  "String",
  "Hash Map",
  "Recursion",
  "Dynamic Programming",
  "Graph",
  "Tree",
  "Stack",
  "Queue",
];

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* HEADER */}
      <header className="h-14 border-b border-slate-800 flex items-center px-6">
        <h1 className="text-lg font-semibold">Problems</h1>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">

          <div className="border border-slate-800 bg-slate-900 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Topics</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {topics.map((topic) => (
                <li
                  key={topic}
                  className="cursor-pointer hover:text-white"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="col-span-12 lg:col-span-9 space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-800 bg-slate-900 rounded-xl p-5">
              <p className="text-sm text-slate-400">Total Problems</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                25
              </p>
            </div>
            <div className="border border-slate-800 bg-slate-900 rounded-xl p-5">
              <p className="text-sm text-slate-400">Solved</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                9
              </p>
            </div>
            <div className="border border-slate-800 bg-slate-900 rounded-xl p-5">
              <p className="text-sm text-slate-400">Unsolved</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                16
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 text-sm text-slate-400 border-b border-slate-800 pb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-7">Title</div>
            <div className="col-span-4 text-right">Difficulty</div>
          </div>

          {/* PROBLEM LIST */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {problems.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 items-center px-4 py-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition"
              >
                <div className="col-span-1 text-slate-400">
                  {p.id}
                </div>
                <div className="col-span-7">
                  {p.title}
                </div>
                <div
                  className={`col-span-4 text-right font-medium
                    ${
                      p.difficulty === "Easy"
                        ? "text-green-400"
                        : p.difficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  `}
                >
                  {p.difficulty}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
