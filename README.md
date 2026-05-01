<div align="center">

# 🎯 DevForces — Frontend

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
<img src="https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white" />

> 🌐 **The sleek, modern Next.js frontend** for the DevForces competitive programming platform — featuring a rich code editor, real-time contest pages, AI-powered chat, animated leaderboards, and a beautiful discussion board.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Key Components](#-key-components)
- [API Communication](#-api-communication)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)

---

## 🌟 Overview

The DevForces frontend is a **Next.js 16 app** with full TypeScript support. It delivers a fast, responsive, and visually stunning competitive programming experience inspired by platforms like LeetCode and Codeforces — but with a modern edge.

Core highlights:
- 🖥️ **Server & client components** with Next.js App Router
- 🎨 **Dark-first design** with Tailwind CSS v4 + custom animations
- ⚡ **Framer Motion** powered micro-animations throughout
- 📡 **Real-time chat** via WebSocket connection
- 🤖 **AI Chat widget** for problem hints and code review
- 🔐 **Protected routes** with JWT middleware
- 📊 **Activity calendar** (GitHub-style contribution graph)
- 🏆 **Animated leaderboard** with live ranking

---

## ✨ Features

| Feature | Details |
|---|---|
| 🏠 **Landing Page** | Animated hero, features showcase, live stats, CTA section |
| 🔐 **Auth Pages** | Login, Register with form validation and hot toast notifications |
| 🧩 **Practice Section** | Browse and filter problems by difficulty, type, and status |
| 🧑‍💻 **Problem Page** | Code editor, language selector, run & submit, AI hints tab |
| 🏆 **Contests** | Browse upcoming/live/completed contests, register, submit |
| 📊 **Leaderboard** | Global ranking table with animated entries |
| 👤 **Profile Page** | User stats, GitHub-style activity calendar, submission history |
| 💬 **Discuss** | Real-time community chat with WebSocket |
| 🤖 **AI Chat Widget** | Floating AI assistant for code review and hints |
| 🛡️ **Admin Panel** | Problem creation, contest management, user overview |
| 🌙 **Theme Toggle** | Dark / Light mode switcher |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **UI Primitives** | Radix UI (Tabs, Select, Dropdown, Slot) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Auth** | JWT Decode (client-side token parsing) |
| **Notifications** | React Hot Toast |
| **Component Variants** | Class Variance Authority (CVA) |
| **Class Utilities** | clsx + tailwind-merge |

---

## 📂 Project Structure

```
frontend/
├── public/                    # Static assets (images, icons)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout (fonts, providers)
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── globals.css        # Global styles & Tailwind directives
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/         # /login
│   │   │   └── register/      # /register
│   │   ├── home/              # /home — authenticated home
│   │   ├── practice/          # /practice — problem list
│   │   ├── problem/
│   │   │   └── [problemId]/   # /problem/:id — code editor page
│   │   ├── contest/
│   │   │   ├── page.tsx       # /contest — contest list
│   │   │   └── [contestId]/   # /contest/:id — contest detail
│   │   ├── leaderboard/       # /leaderboard
│   │   ├── profile/           # /profile — user profile
│   │   ├── discuss/           # /discuss — real-time chat
│   │   └── admin/             # /admin — admin dashboard
│   │       ├── problems/      # Admin problem management
│   │       └── contests/      # Admin contest management
│   ├── components/
│   │   ├── navbar.tsx              # Main navigation bar
│   │   ├── mainNavbar.tsx          # Authenticated navbar variant
│   │   ├── feature-section.tsx     # Landing: features showcase
│   │   ├── StatsSection.tsx        # Landing: platform statistics
│   │   ├── cta-section.tsx         # Landing: call-to-action
│   │   ├── footer-section.tsx      # Site footer
│   │   ├── practice-section.tsx    # Problem list with filters
│   │   ├── problem-section.tsx     # Code editor & submission UI
│   │   ├── contests-section.tsx    # Contest browser
│   │   ├── contest-card.tsx        # Individual contest card
│   │   ├── contest-filters.tsx     # Contest filter controls
│   │   ├── leaderboard-section.tsx # Animated leaderboard table
│   │   ├── discuss-section.tsx     # WebSocket chat UI
│   │   ├── chat-widget.tsx         # Floating AI assistant widget
│   │   ├── contribution-grid.tsx   # GitHub-style activity calendar
│   │   ├── profile-calendar.tsx    # Profile activity heatmap
│   │   ├── theme-toggle.tsx        # Dark/Light mode toggle
│   │   └── ui/                     # Reusable primitive components
│   ├── lib/
│   │   └── user-client.ts     # Axios instance + API base URL config
│   └── protectedRoute.ts      # Client-side route protection logic
├── middleware.ts               # Next.js middleware (auth redirect)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json
└── .env
```

---

## 🗺 Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | 🏠 Landing page with hero & features | Public |
| `/login` | 🔐 User login | Public |
| `/register` | 📝 User registration | Public |
| `/home` | 🏡 Authenticated home dashboard | 🔒 Auth |
| `/practice` | 🧩 Problem list with filters | 🔒 Auth |
| `/problem/:problemId` | 🧑‍💻 Code editor + submission page | 🔒 Auth |
| `/contest` | 🏆 Contest browser (upcoming / live / past) | 🔒 Auth |
| `/contest/:contestId` | 📋 Contest detail + submission | 🔒 Auth |
| `/leaderboard` | 📊 Global ranking leaderboard | 🔒 Auth |
| `/profile` | 👤 User profile, stats, activity calendar | 🔒 Auth |
| `/discuss` | 💬 Real-time community chat | 🔒 Auth |
| `/admin` | 🛡️ Admin dashboard | 🛡 Admin |
| `/admin/problems` | ➕ Create / edit problems | 🛡 Admin |
| `/admin/contests` | 📅 Create / edit contests | 🛡 Admin |

---

## 🧩 Key Components

### `practice-section.tsx`
The core problem browser. Displays all available coding problems in a filterable, searchable list. Highlights difficulty (Easy / Medium / Hard) with color-coded badges and shows the user's solve status.

### `problem-section.tsx`
The full code editor interface. Features:
- Multi-language selector (Node.js, Python, Java)
- Run and Submit buttons
- Execution result display (stdout, status, execution time)
- AI hints tab powered by Gemini

### `leaderboard-section.tsx`
An animated ranking table with Framer Motion stagger animations. Shows user ranks, names, avatars, and points in real time.

### `discuss-section.tsx`
Real-time community chat powered by WebSocket. Supports:
- Sending messages
- Editing own messages
- Deleting own messages
- Loading message history on connect

### `contribution-grid.tsx` / `profile-calendar.tsx`
A GitHub-style contribution heatmap built from daily activity data. Visualizes when and how often a user has submitted solutions.

### `contest-card.tsx`
A visually rich card component for each contest showing type, difficulty, time remaining (with countdown), status badge, and a register/view button.

### `chat-widget.tsx`
A floating AI assistant bubble that provides:
- Problem-specific hints and explanations
- General code review via Gemini AI

### `theme-toggle.tsx`
Switches between dark and light theme with a smooth transition animation.

---

## 🔌 API Communication

All API calls go through a centralized Axios instance defined in `src/lib/user-client.ts`:

```typescript
// src/lib/user-client.ts
import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const userClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default userClient;
```

**Usage across components:**

```typescript
import userClient from "@/lib/user-client";

// Example: fetch problems
const { data } = await userClient.get("/api/user/problems", {
  headers: { Authorization: `Bearer ${token}` },
});
```

**WebSocket connection** (discuss page):

```typescript
const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => ws.send(JSON.stringify({ type: "send", userId, message }));
ws.onmessage = (e) => {
  const payload = JSON.parse(e.data);
  // Handle: history | send | edit | delete
};
```

---

## 🛡 Route Protection

**Next.js Middleware** (`middleware.ts`) intercepts unauthenticated requests and redirects to `/login`. Client-side protection is handled by `protectedRoute.ts` which decodes the JWT stored in localStorage.

```
Request → middleware.ts → check token → ✅ proceed | ❌ redirect /login
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# WebSocket server URL
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

> ⚠️ Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets here!

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- Backend API running on `http://localhost:4000`
- WebSocket server running on `ws://localhost:8080`

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your backend URL
```

### Running in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 📜 Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Build optimized production bundle |
| `start` | `next start` | Serve the production build |
| `lint` | `eslint` | Run ESLint across the project |

---

## 🎨 Design System

The UI is built with **Tailwind CSS v4** and a dark-first design approach:

- **Colors:** Custom dark palette with vibrant accent colors
- **Typography:** System font stack optimized for readability
- **Animations:** Framer Motion for page transitions and micro-interactions
- **Components:** Radix UI primitives (accessible, headless) styled with Tailwind
- **Icons:** Lucide React icon library
- **Notifications:** React Hot Toast for feedback messages

---

<div align="center">

**Built with ❤️ for competitive programmers**

</div>
