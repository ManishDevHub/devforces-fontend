export type ContestStatus = "live" | "upcoming" | "past";
export type ContestFrequency = "weekly" | "bi-weekly" | "monthly" | "special";
export type ContestCategory = "auth" | "backend" | "automation" | "api" | "database" | "fullstack";

export interface Contest {
  id: string;
  title: string;
  description: string;
  status: ContestStatus;
  frequency: ContestFrequency;
  category: ContestCategory;
  startTime: Date;
  endTime: Date;
  participants: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  problems: number;
}

export const contests: Contest[] = [
  // Live Contests
  {
    id: "1",
    title: "Auth System Challenge #42",
    description: "Build a secure JWT authentication system with refresh tokens and role-based access control",
    status: "live",
    frequency: "weekly",
    category: "auth",
    startTime: new Date("2026-01-31T10:00:00"),
    endTime: new Date("2026-01-31T14:00:00"),
    participants: 1247,
    difficulty: "Medium",
    problems: 4,
  },
  {
    id: "2",
    title: "Bot Automation Sprint",
    description: "Create a Discord bot with rate limiting, command handling, and database integration",
    status: "live",
    frequency: "bi-weekly",
    category: "automation",
    startTime: new Date("2026-01-31T08:00:00"),
    endTime: new Date("2026-01-31T20:00:00"),
    participants: 892,
    difficulty: "Hard",
    problems: 5,
  },
  // Upcoming Contests
  {
    id: "3",
    title: "Backend Blitz Round 15",
    description: "High-performance API design with caching, pagination, and error handling",
    status: "upcoming",
    frequency: "weekly",
    category: "backend",
    startTime: new Date("2026-02-02T15:00:00"),
    endTime: new Date("2026-02-02T18:00:00"),
    participants: 0,
    difficulty: "Medium",
    problems: 3,
  },
  {
    id: "4",
    title: "Database Masters Championship",
    description: "Complex SQL queries, indexing strategies, and database optimization challenges",
    status: "upcoming",
    frequency: "monthly",
    category: "database",
    startTime: new Date("2026-02-07T12:00:00"),
    endTime: new Date("2026-02-07T18:00:00"),
    participants: 0,
    difficulty: "Expert",
    problems: 6,
  },
  {
    id: "5",
    title: "API Design Challenge",
    description: "RESTful API design with OpenAPI specs, versioning, and rate limiting",
    status: "upcoming",
    frequency: "bi-weekly",
    category: "api",
    startTime: new Date("2026-02-05T09:00:00"),
    endTime: new Date("2026-02-05T13:00:00"),
    participants: 0,
    difficulty: "Medium",
    problems: 4,
  },
  {
    id: "6",
    title: "Full Stack Fury",
    description: "End-to-end application with auth, real-time updates, and deployment",
    status: "upcoming",
    frequency: "monthly",
    category: "fullstack",
    startTime: new Date("2026-02-15T10:00:00"),
    endTime: new Date("2026-02-15T22:00:00"),
    participants: 0,
    difficulty: "Expert",
    problems: 8,
  },
  // Past Contests
  {
    id: "7",
    title: "Auth System Challenge #41",
    description: "OAuth2 implementation with multiple providers and session management",
    status: "past",
    frequency: "weekly",
    category: "auth",
    startTime: new Date("2026-01-24T10:00:00"),
    endTime: new Date("2026-01-24T14:00:00"),
    participants: 1589,
    difficulty: "Medium",
    problems: 4,
  },
  {
    id: "8",
    title: "Backend Blitz Round 14",
    description: "Microservices communication patterns and message queue implementation",
    status: "past",
    frequency: "weekly",
    category: "backend",
    startTime: new Date("2026-01-26T15:00:00"),
    endTime: new Date("2026-01-26T18:00:00"),
    participants: 1123,
    difficulty: "Hard",
    problems: 3,
  },
  {
    id: "9",
    title: "Automation Arena #7",
    description: "CI/CD pipeline automation with GitHub Actions and deployment strategies",
    status: "past",
    frequency: "bi-weekly",
    category: "automation",
    startTime: new Date("2026-01-18T08:00:00"),
    endTime: new Date("2026-01-18T16:00:00"),
    participants: 756,
    difficulty: "Medium",
    problems: 5,
  },
  {
    id: "10",
    title: "New Year Championship 2026",
    description: "Grand competition covering all categories with prizes",
    status: "past",
    frequency: "special",
    category: "fullstack",
    startTime: new Date("2026-01-01T00:00:00"),
    endTime: new Date("2026-01-01T12:00:00"),
    participants: 3421,
    difficulty: "Expert",
    problems: 10,
  },
  {
    id: "11",
    title: "API Showdown #12",
    description: "GraphQL vs REST implementation challenge",
    status: "past",
    frequency: "bi-weekly",
    category: "api",
    startTime: new Date("2026-01-12T10:00:00"),
    endTime: new Date("2026-01-12T14:00:00"),
    participants: 892,
    difficulty: "Hard",
    problems: 4,
  },
  {
    id: "12",
    title: "Database Deep Dive #3",
    description: "NoSQL vs SQL performance optimization",
    status: "past",
    frequency: "monthly",
    category: "database",
    startTime: new Date("2026-01-05T12:00:00"),
    endTime: new Date("2026-01-05T18:00:00"),
    participants: 634,
    difficulty: "Expert",
    problems: 6,
  },
];

export function getContestsByStatus(status: ContestStatus): Contest[] {
  return contests.filter((contest) => contest.status === status);
}

export function getContestsByFrequency(frequency: ContestFrequency): Contest[] {
  return contests.filter((contest) => contest.frequency === frequency);
}

export function formatDuration(start: Date, end: Date): string {
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export function formatTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
