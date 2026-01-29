"use client";

import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

type ChatMessage = {
  id: number;
  message: string;
  userId: number;
  createdAt: string;
};

/* ================= CONFIG ================= */

const WS_URL = "ws://localhost:8080";

export default function DiscussPage() {
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  /* ================= CONNECT WS ================= */

  useEffect(() => {
    // 🔥 IMPORTANT: prevent double connection (Strict Mode fix)
    if (wsRef.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      switch (payload.type) {
        case "history":
          setMessages((prev) => [...prev, payload.data]);
          break;

        case "send":
          setMessages((prev) => [...prev, payload.data]);
          break;

        case "edit":
          setMessages((prev) =>
            prev.map((m) =>
              m.id === payload.data.id ? payload.data : m
            )
          );
          break;

        case "delete":
          setMessages((prev) =>
            prev.filter((m) => m.id !== payload.messageId)
          );
          break;
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
      wsRef.current = null; // 🔥 IMPORTANT
    };

    return () => {
      ws.close();
    };
  }, []);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = () => {
    const ws = wsRef.current;

    if (!ws) {
      console.warn("WebSocket not initialized");
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open:", ws.readyState);
      return;
    }

    if (!text.trim()) return;

    ws.send(
      JSON.stringify({
        type: "send",
        userId: 1,
        message: text,
      })
    );

    setText("");
  };

  /* ================= UI ================= */

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* ===== NAVBAR ===== */}
      <header className="border-b border-neutral-800 px-8 py-4 flex justify-between">
        <h1 className="font-semibold text-lg">DevForces Discuss</h1>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          M
        </div>
      </header>

      {/* ===== CHAT BODY ===== */}
      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-neutral-500 mt-2">
              User {msg.userId} ·{" "}
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-neutral-500 text-sm">
            No messages yet. Start the discussion 🚀
          </p>
        )}
      </main>

      {/* ===== INPUT BOX ===== */}
      <div className="border-t border-neutral-800 px-8 py-4 flex gap-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 px-6 py-2 rounded-xl text-sm hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
