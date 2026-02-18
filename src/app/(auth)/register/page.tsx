"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/user-client";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration Failed");
        return;
      }

      const loginRes = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!loginRes.ok) {
        toast.success("Register Successfully. Please login.");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
        return;
      }

      const loginData = await loginRes.json();
      localStorage.setItem("token", loginData.token);

      toast.success("Register Successfully");
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
     
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 shadow-2xl p-8">
       
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center font-bold text-black shadow">
            D
          </div>
          <h1 className="mt-3 text-xl font-semibold text-white">
            DevForces
          </h1>
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-slate-900 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-slate-900 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-slate-900 transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold text-white shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="flex justify-between text-sm mt-5">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot password?
          </a>
          <a href="/login" className="text-blue-400 hover:underline">
            Already have an account?
          </a>
        </div>
      </div>
    </div>
  );
}
