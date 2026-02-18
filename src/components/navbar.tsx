"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle2 } from "lucide-react";

import {
  clearStoredToken,
  fetchUserProfile,
  getStoredToken,
  UserProfile,
} from "@/lib/user-client";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/contest", label: "Contest" },
  { href: "/problem", label: "Problems" },
  { href: "/practice", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/discuss", label: "Discuss" },
];

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const token = getStoredToken();
      if (!token) {
        if (isMounted) {
          setIsAuthResolved(true);
        }
        return;
      }

      try {
        const profile = await fetchUserProfile(token);
        if (isMounted) {
          setUser(profile);
        }
      } catch {
        clearStoredToken();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthResolved(true);
        }
      }
    };

    void loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const userInitial = useMemo(() => {
    if (!user?.email) {
      return "U";
    }

    return user.email.charAt(0).toUpperCase();
  }, [user?.email]);

  const handleLogout = () => {
    clearStoredToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Dev<span className="text-primary">Forces</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="group relative text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Admin
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthResolved && user ? (
            <>
              <Link
                href="/profile"
                className="hidden items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary/40 hover:bg-accent/40 sm:flex h-10 w-10 p-0"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {userInitial}
                  </div>
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="sign" className="hidden sm:inline-flex">
                <Link href="/login">Sign In</Link>
              </Button>
              {!isAuthResolved && (
                <span className="hidden items-center text-sm text-muted-foreground sm:inline-flex">
                  <UserCircle2 className="h-4 w-4 animate-pulse" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
