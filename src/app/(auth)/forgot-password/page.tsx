"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, SetLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    SetLoading(true);

    try {
      const res = await fetch(
        "http://localhost:4000/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset link sent!");

        setTimeout(() => router.push("/forgot-password-done"), 3000);
      } else {
        toast.error(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Server connection error", error);
      toast.error("Server connection failed");
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg max-w-lg w-full rounded-lg p-10">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Password Reset
        </h1>
        <hr className="my-6" />

        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-5 rounded-md mb-6">
          <p>
            Can’t remember your password? Just enter your email and we’ll send
            you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-gray-600 rounded-lg outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg transition disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Reset My Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
