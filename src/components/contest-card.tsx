"use client";

import React from "react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Contest } from "@/lib/contests";
import { formatDuration, formatTimeRemaining } from "@/lib/contests";
import {
  Calendar,
  Clock,
  Users,
  Zap,
  Code,
  Bot,
  Server,
  Database,
  Layers,
  Shield,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  auth: <Shield className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  automation: <Bot className="h-4 w-4" />,
  api: <Code className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  fullstack: <Layers className="h-4 w-4" />,
};

const difficultyColors: Record<string, string> = {
  Easy: "text-sky-400",
  Medium: "text-blue-400",
  Hard: "text-indigo-400",
  Expert: "text-fuchsia-400",
};

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const isLive = contest.status === "live";
  const isUpcoming = contest.status === "upcoming";
  const isPast = contest.status === "past";

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      {isLive && (
        <div className="absolute right-3 top-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-live" />
          </span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            {categoryIcons[contest.category]}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-tight text-foreground group-hover:text-accent transition-colors">
              {contest.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {contest.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={`${
              isLive
                ? "border-live/30 bg-live/10 text-live"
                : isUpcoming
                  ? "border-upcoming/30 bg-upcoming/10 text-upcoming"
                  : "border-border bg-secondary text-muted-foreground"
            }`}
          >
            {isLive ? "Live" : isUpcoming ? "Upcoming" : "Completed"}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {contest.frequency.replace("-", " ")}
          </Badge>
          <Badge variant="outline" className={difficultyColors[contest.difficulty]}>
            {contest.difficulty}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {contest.startTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(contest.startTime, contest.endTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {contest.participants > 0
                ? `${contest.participants.toLocaleString()} joined`
                : "Be the first!"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{contest.problems} problems</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border pt-4">
        {isLive ? (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-live font-medium">
              Ends in {formatTimeRemaining(contest.endTime)}
            </span>
            <Button size="sm" className="bg-live text-background hover:bg-live/90">
              Join Now
            </Button>
          </div>
        ) : isUpcoming ? (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-upcoming font-medium">
              Starts in {formatTimeRemaining(contest.startTime)}
            </span>
            <Button size="sm" variant="outline" className="border-upcoming/50 text-upcoming hover:bg-upcoming/10 bg-transparent">
              Register
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {contest.endTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
              View Results
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
