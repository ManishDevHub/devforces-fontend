import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevForces",
  description: "DevForces competitive programming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="devforces-theme-init" strategy="beforeInteractive">
          {`
            (() => {
              const key = "devforces-theme";
              const root = document.documentElement;
              const savedTheme = localStorage.getItem(key);
              const resolvedTheme =
                savedTheme === "light" || savedTheme === "dark"
                  ? savedTheme
                  : window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";

              root.classList.toggle("dark", resolvedTheme === "dark");
              root.style.colorScheme = resolvedTheme;
            })();
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
