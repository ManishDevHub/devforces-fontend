"use client";
import React, { useState, useEffect } from "react";
import ContestSection from '@/components/contests-section'
import CtaSection from '@/components/cta-section'
import DiscussSection from '@/components/discuss-section'
import FeatureSection from '@/components/feature-section'
import  { Footer } from '@/components/footer-section'
import LeaderboardSection from '@/components/leaderboard-section'
import Navbar from '@/components/navbar'
import PracticeSection from '@/components/practice-section'
import ProblemSection from '@/components/problem-section'
import StatsSection from '@/components/StatsSection'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Users, Zap } from 'lucide-react'
import Link from "next/link";
import ChatWidget from "@/components/chat-widget";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div>

      <Navbar></Navbar>
      <section className="relative overflow-hidden border-b border-border">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glowing Orbs */}
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-4 w-4" />
            <span>Season 4 Contests Now Live</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Compete. Build.{" "}
            <span className="text-primary">Dominate.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            The ultimate competitive programming platform for web developers. 
            Solve real-world challenges, build production-grade systems, and 
            prove your skills against the best developers worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isLoggedIn && (
              <Button asChild size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
              {/* <Link href="/contest">
                View Contests
              </Link> */}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold text-foreground sm:text-3xl">50K+</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Active Developers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Trophy className="h-5 w-5" />
                <span className="text-2xl font-bold text-foreground sm:text-3xl">1,200+</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Contests Held</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Zap className="h-5 w-5" />
                <span className="text-2xl font-bold text-foreground sm:text-3xl">5,000+</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Problems Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <StatsSection></StatsSection>
    <ContestSection></ContestSection>
    <ProblemSection></ProblemSection>
    <PracticeSection></PracticeSection>
    <LeaderboardSection></LeaderboardSection>
    <DiscussSection></DiscussSection>
    <FeatureSection></FeatureSection>
    <CtaSection></CtaSection>
    <Footer></Footer>

     
      <ChatWidget />
    </div>
  )
}
