"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
/* ===== TYPES MUST BE AT TOP ===== */
type Post = {
  id: number;
  text: string;
  image?: string;
  time: string;
};

export default function DiscussPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);

   const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); 
    }
  }, [router]);

  const sendPost = () => {
    if (!text.trim() && !image) return;

    setPosts((prev) => [
      {
        id: Date.now(),
        text,
        image: image || undefined,
        time: "just now",
      },
      ...prev,
    ]);

    setText("");
    setImage(null);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* NAVBAR */}
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
             
              className="px-4 py-2 rounded-full  bg-blue-500 hover:bg-blue-600 transition font-medium"
            >
              M
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-8 p-8 overflow-hidden">
        {/* FEED */}
        <section className="flex-[7] overflow-y-auto space-y-6 pr-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
            >
              <p className="text-sm mb-3">{post.text}</p>

              {post.image && (
                <img
                  src={post.image}
                  className="rounded-xl max-h-64 object-cover"
                  alt="uploaded"
                />
              )}

              <p className="text-xs text-neutral-500 mt-3">
                {post.time}
              </p>
            </div>
          ))}
        </section>

        {/* SIDEBAR */}
        <aside className="w-half space-y-6">

      {/* ===== INTERVIEW CRASH COURSE CARD ===== */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-6">
        <h3 className="text-lg font-semibold leading-snug">
          DevForces Interview <br /> Problem Practice
        </h3>
        <p className="text-sm text-white/80 mt-2">
          Aithentication & Bot Automation
        </p>

        <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200">
          Start Learning
        </button>
      </div>

      {/* ===== CONTEST CARD ===== */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">DevForces Contest</h4>
          <p className="text-sm text-neutral-400 mt-1">
            Participate and win prizes.
          </p>
          <button className="mt-3 bg-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-600">
            Join Contest
          </button>
        </div>

        <div className="text-yellow-400 text-5xl">🏆</div>
        
      </div>

      {/* ===== DISCUSS CARD ===== */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Discuss Now</h4>
          <p className="text-sm text-neutral-400 mt-1">
            Share interview questions. <br />
            Get solutions.
          </p>
          <button className="mt-3 bg-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-600">
            Let’s Discuss
          </button>
        </div>

        <div className="text-green-400 text-5xl">💬</div>
      </div>

      {/* ===== DEVFORCES PROMO CARD (REPLACED LEETCOINS) ===== */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">DevForces</h4>
          <p className="text-sm text-neutral-400 mt-1">
            Join to enhance your skills <br />
            in a better way.
          </p>
          <button className="mt-3 bg-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-600">
            Join DevForces
          </button>
        </div>

        <div className="text-yellow-400 text-5xl">⚡</div>
      </div>

    </aside>
      </main>

      {/* COMMENT BOX */}
      <div className="border-t border-neutral-800 bg-neutral-900 px-8 py-4">
        {image && (
          <img
            src={image}
            className="h-32 rounded-xl object-cover mb-3"
            alt="preview"
          />
        )}

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
            id="imgUpload"
          />
          <label htmlFor="imgUpload" className="cursor-pointer">
            📷
          </label>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type comment here..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm outline-none"
          />

          <button
            onClick={sendPost}
            className="px-6 py-2 bg-green-600 rounded-xl text-sm hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
