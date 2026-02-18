"use client";

import { jwtDecode } from "jwt-decode";



import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Code2,
  Send,
  Search,
  Trash2,
  Pencil,
  X,
  Check,
  MessageSquare,
  Users,
  Clock,
  Hash,
  MoreVertical,
  Reply,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/navbar";

interface Message {
  id: string;
  odisplayuserid: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: number;
  edited: boolean;
  replyTo?: string;
}
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8080";



export default function DiscussPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Token not found, user not logged in");
    return;
  }

  let decoded: any;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("❌ Invalid token");
    return;
  }

  // 🔥 THIS IS THE FIX
  const userId = decoded.id; // 👈 backend puts id here

  if (!userId) {
    console.error("❌ userId not found in token");
    return;
  }

  setCurrentUserId(userId);

  const socket = new WebSocket(WS_URL);
  socketRef.current = socket;

  socket.onopen = () => {
    console.log("✅ WS connected as user:", userId);
  };

  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data);

    if (payload.type === "history" || payload.type === "send") {
      const msg = payload.data;

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          odisplayuserid: msg.userId,
          username: msg.user?.name ?? "User",
          avatar: msg.user?.name
            ? msg.user.name.slice(0, 2).toUpperCase()
            : "U",
          content: msg.message,
          timestamp: new Date(msg.createdAt).getTime(),
          edited: false,
        },
      ]);
    }

    if (payload.type === "edit") {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.data.id
            ? { ...m, content: payload.data.message, edited: true }
            : m
        )
      );
    }

    if (payload.type === "delete") {
      setMessages((prev) =>
        prev.filter((m) => m.id !== payload.messageId)
      );
    }
  };

  socket.onerror = (err) => {
    // Silently handle WS connection errors or implement retry logic here
  };

  return () => socket.close();
}, []);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

const handleSend = () => {
  if (!newMessage.trim()) return;
  if (!socketRef.current) return;

  socketRef.current.send(
    JSON.stringify({
      type: "send",
      userId: currentUserId, // ✅ REAL USER ID
      message: newMessage.trim(),
    })
  );

  setNewMessage("");
};


 const handleSaveEdit = () => {
  if (!editContent.trim() || !editingId) return;
  if (!socketRef.current) return;

  socketRef.current.send(
    JSON.stringify({
      type: "edit",
      messageId: editingId,
      userId: currentUserId,
      message: editContent.trim(),
    })
  );

  setEditingId(null);
  setEditContent("");
};


const handleDelete = (id: string) => {
  if (!socketRef.current) return;

  socketRef.current.send(
    JSON.stringify({
      type: "delete",
      messageId: id,
      userId: currentUserId,
    })
  );
};



  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
const handleEdit = (id: string) => {
  const msg = messages.find((m) => m.id === id);
  if (!msg) return;

  if (msg.odisplayuserid !== currentUserId) return;

  setEditingId(id);
  setEditContent(msg.content);
};

 const filteredMessages = messages.filter(
  (m) =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(m.id).includes(searchQuery)
);


  const onlineUsers = new Set(messages.map((m) => m.odisplayuserid)).size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

    <Navbar></Navbar>
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              GLOBAL CHAT
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discussion <span className="text-primary">Forum</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Connect with developers worldwide. Share solutions, ask questions, and learn together.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-easy/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-easy" />
            </div>
            <div>
              <p className="text-2xl font-bold">{onlineUsers}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-medium/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-medium" />
            </div>
            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-mono text-primary truncate max-w-[100px]">
                {currentUserId}
              </p>
              <p className="text-xs text-muted-foreground">Your ID</p>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-border bg-secondary/30">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages, users, or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="h-[500px] overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const isOwn = message.odisplayuserid === currentUserId;
                const replyMessage = message.replyTo
                  ? messages.find((m) => m.id === message.replyTo)
                  : null;

                return (
                  <div
                    key={message.id}
                    className={`group flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground border border-border"
                      }`}
                    >
                      {message.avatar}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                      {/* Header */}
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isOwn ? "justify-end" : ""
                        }`}
                      >
                        <span
                          className={`font-semibold text-sm ${
                            isOwn ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {message.username}
                        </span>
                       <span className="text-xs text-muted-foreground font-mono">
  #{message.id}
</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.edited && (
                          <span className="text-xs text-muted-foreground italic">
                            (edited)
                          </span>
                        )}
                      </div>

                      {/* Reply Reference */}
                      {replyMessage && (
                        <div
                          className={`text-xs text-muted-foreground mb-1 px-2 py-1 rounded bg-secondary/50 border-l-2 border-primary inline-block ${
                            isOwn ? "ml-auto" : ""
                          }`}
                        >
                          Replying to @{replyMessage.username}
                        </div>
                      )}

                      {/* Message Bubble */}
                      {editingId === message.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1 bg-input border-primary"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSaveEdit}
                            className="text-easy hover:text-easy"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            className="text-hard hover:text-hard"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-secondary border border-border rounded-tl-sm"
                          }`}
                        >
                          {message.content}
                        </div>
                      )}

                      {/* Actions */}
                      {editingId !== message.id && (
                        <div
                          className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isOwn ? "justify-end" : ""
                          }`}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleReply(message)}
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </Button>
                          {isOwn && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(message.id)}
                                className="h-7 w-7 text-muted-foreground hover:text-medium"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(message.id)}
                                className="h-7 w-7 text-muted-foreground hover:text-hard"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align={isOwn ? "end" : "start"}
                              className="bg-card border-border"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  navigator.clipboard.writeText(message.content)
                                }
                                className="cursor-pointer"
                              >
                                Copy Message
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigator.clipboard.writeText(message.id)
                                }
                                className="cursor-pointer"
                              >
                                Copy ID
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
              <Button
                size="sm"
                onClick={scrollToBottom}
                className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
              >
                <ChevronDown className="w-4 h-4 mr-1" />
                New Messages
              </Button>
            </div>
          )}

          {/* Reply Preview */}
          {replyingTo && (
            <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Reply className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Replying to</span>
                <span className="font-medium text-primary">@{replyingTo.username}</span>
                <span className="text-muted-foreground truncate max-w-[200px]">
                  {replyingTo.content}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setReplyingTo(null)}
                className="h-7 w-7 text-muted-foreground hover:text-hard"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="pr-12 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send. Your messages appear in blue. You can edit or delete your own
              messages.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Be respectful and follow the{" "}
            <span className="text-primary cursor-pointer hover:underline">
              community guidelines
            </span>
            . Messages are stored locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
