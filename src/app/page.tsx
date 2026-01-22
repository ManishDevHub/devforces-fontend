"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const RATINGS = [
  { label: "Frontend", value: 4.8 },
  { label: "Backend", value: 4.6 },
  { label: "UI-UX", value: 4.9 }
];

const STATS = [
  { label: "Active Users", value: "120K+" },
  { label: "Contests Hosted", value: "350+" },
  { label: "Problems", value: "2.5K+" },
  { label: "Submissions", value: "18M+" }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* NAVBAR */}
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

          <div className="flex items-center gap-4">
            

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.12),transparent_45%)]" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Build Skill. Win Contests.
          </h1>

          <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
            DevForces is a modern developer contest platform with real-time dev contests,
            project-based challenges, and a developer-first experience.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-10 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-xl"
            >
              Join Live Contest
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-10 py-4 rounded-2xl border border-slate-700 hover:border-purple-500 transition"
            >
              Browse Problems
            </button>
          </div>
        </motion.div>
      </section>

      {/* PRACTICE SECTION */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-center mb-16"
        >
          Build, Practice & Ship
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {["Dev Challenges", "Project-Based Practice", "Weekly Dev Tasks"].map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800 p-10 hover:border-purple-500 transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-400">{p}</h3>
              <p className="text-slate-400 text-sm">
                Hands-on development challenges focused on real-world engineering skills and production thinking.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 text-center"
              >
                <p className="text-3xl font-bold text-blue-400">{s.value}</p>
                <p className="text-sm text-slate-400 mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* HIRING CHALLENGES */}
<section className="py-28 bg-slate-950">
  <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
    
    {/* LEFT IMAGE */}
   <motion.img
  initial={{ opacity: 0, x: -40 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  src="https://cdn.hackerearth.com/webflow/homepage/assets/Hiring%20Challenge.jpg"
  alt="Hiring Challenges"
  className="w-full max-w-md rounded-3xl shadow-2xl"
/>


    {/* RIGHT CONTENT */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-purple-400 uppercase tracking-widest text-sm mb-3">
        Source
      </p>

      <h2 className="text-4xl font-bold mb-6">
        Hiring Challenges
      </h2>

      <p className="text-slate-400 leading-relaxed mb-8">
        Run AI-engineered hiring challenges designed to evaluate real-world
        development skills. Identify top performers quickly using structured,
        fair, and scalable assessments powered by DevForces.
      </p>

      <button className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold">
        Learn How Hiring Works
      </button>
    </motion.div>
  </div>
</section>
{/* LEARNING & DEVELOPMENT */}
<section className="py-28 bg-slate-900/40">
  <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-pink-400 uppercase tracking-widest text-sm mb-3">
        Upskill
      </p>

      <h2 className="text-4xl font-bold mb-6">
        Learning & Development
      </h2>

      <p className="text-slate-400 leading-relaxed mb-8">
        Build future-ready developer teams with continuous, project-based
        learning. Track progress, assign challenges, and upskill engineers
        with measurable outcomes.
      </p>

      <button className="px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 transition font-semibold">
        Get a Demo
      </button>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.img
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      src="https://cdn.hackerearth.com/webflow/homepage/assets/Learning%20&%20Development.jpg"
      alt="Learning & Development"
       className="w-full max-w-md rounded-3xl shadow-2xl"
    />
  </div>
</section>


      {/* RATINGS */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-semibold text-center mb-14">Community Ratings</h2>

          <div className="grid sm:grid-cols-3 gap-10">
            {RATINGS.map((r) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-slate-950 border border-slate-800 p-10 text-center"
              >
                <p className="text-slate-400 text-sm mb-2">{r.label}</p>
                <p className="text-4xl font-extrabold text-blue-400">{r.value}</p>
                <p className="text-yellow-400 mt-3 tracking-widest">★★★★★</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-cyan-600/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up Your Coding?</h2>
          <p className="text-slate-300 mb-10">
            Join thousands of developers competing, learning, and growing every day on DevForces.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-10 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-xl"
            >
              Start Competing
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-10 py-4 rounded-2xl border border-slate-600 hover:border-purple-500 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center font-bold shadow">
                D
              </div>
              <span className="text-lg font-semibold">DevForces</span>
            </div>
            <p className="text-slate-400 text-sm">
              A modern developer contest platform built for performance, learning, and clean design.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer">Contests</li>
              <li className="hover:text-white cursor-pointer">Practice</li>
              <li className="hover:text-white cursor-pointer">Problems</li>
              <li className="hover:text-white cursor-pointer">Leaderboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
          © 2026 DevForces. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
