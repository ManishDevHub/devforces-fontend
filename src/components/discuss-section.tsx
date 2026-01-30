import { ArrowRight, Badge, Clock, Eye, MessageSquare, Pin, ThumbsUp, TrendingUp } from 'lucide-react'

import { Button } from './ui/button'

export default function DiscussSection() {

    const discussionTopics = [
  {
    id: 1,
    title: "Editorial: DevForces Round #846 - Problem D Solution Walkthrough",
    author: "codemaster_alex",
    authorTier: "Legendary",
    authorColor: "text-yellow-400",
    category: "Editorial",
    categoryColor: "bg-accent/20 text-accent",
    replies: 234,
    views: 1500,
    likes: 456,
    pinned: true,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Best practices for implementing OAuth 2.0 with PKCE in Next.js",
    author: "auth_expert",
    authorTier: "Grandmaster",
    authorColor: "text-destructive",
    category: "Tutorial",
    categoryColor: "bg-primary/20 text-primary",
    replies: 89,
    views: 600,
    likes: 234,
    pinned: false,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    title: "Help: My webhook processor is dropping events under high load",
    author: "junior_dev_42",
    authorTier: "Specialist",
    authorColor: "text-green-400",
    category: "Help",
    categoryColor: "bg-yellow-500/20 text-yellow-400",
    replies: 45,
    views: 230,
    likes: 67,
    pinned: false,
    timestamp: "8 hours ago",
  },
  {
    id: 4,
    title: "Announcement: Season 4 Championship Series Starting February 15th",
    author: "devforces_admin",
    authorTier: "Admin",
    authorColor: "text-primary",
    category: "Announcement",
    categoryColor: "bg-primary/20 text-primary",
    replies: 156,
    views: 4500,
    likes: 892,
    pinned: true,
    timestamp: "1 day ago",
  },

]

const trendingTags = [
  { name: "OAuth", count: 1234 },
  { name: "WebSockets", count: 987 },
  { name: "Next.js", count: 876 },
  { name: "Redis", count: 765 },
  { name: "Microservices", count: 654 },
  { name: "Docker", count: 543 },
]

 
  return (
    <div>
         <section id="discuss" className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge fontVariant="outline" className="mb-4 border-primary/30 text-primary">
              Discuss
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Community Discussions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Learn from the community, share solutions, and get help
            </p>
          </div>
          <Button variant="outline" className="w-fit gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
            View All Discussions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Discussion List */}
          <div className="lg:col-span-2 space-y-4">
            {discussionTopics.map((topic) => (
              <div
                key={topic.id}
                className={`group rounded-xl border p-5 transition-all hover:border-primary/50 ${
                  topic.pinned ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {topic.pinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <Badge fontVariant="outline" className={topic.categoryColor}>
                        {topic.category}
                      </Badge>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {topic.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className={`font-medium ${topic.authorColor}`}>
                        {topic.author}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{topic.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{topic.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{topic.likes}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full gap-2 border-border bg-transparent text-foreground hover:bg-secondary">
              Load More Discussions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Discussion CTA */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold text-foreground">Join the Conversation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your knowledge, ask questions, and connect with fellow developers.
              </p>
              <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Start a Discussion
              </Button>
            </div>

            {/* Trending Tags */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <TrendingUp className="h-5 w-5 text-accent" />
                Trending Tags
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Badge
                    key={tag.name}
                    fontVariant="secondary"
                    className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    {tag.name}
                    <span className="ml-1 text-xs text-muted-foreground">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Community Stats</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Discussions</span>
                  <span className="font-mono font-medium text-foreground">45,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Today</span>
                  <span className="font-mono font-medium text-foreground">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Online Now</span>
                  <span className="font-mono font-medium text-accent">3,456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
