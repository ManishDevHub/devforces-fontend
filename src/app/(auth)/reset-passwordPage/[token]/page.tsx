"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, SetLoading] = useState(false);

  const router = useRouter();

  // URL se token extract karna sahi hai
  const params = useParams();
  const token = params.token;

  console.log("Token extracted:", token);

  const SubmitHandler = async (e: any) => {
    e.preventDefault();

    if (!password || !confirm) {
      return toast.error("Both fields are required.");
    }
    if (password !== confirm) {
      return toast.error("Password do not match!");
    }

    if (!token) {
      return toast.error("Reset token is missing from the URL.");
    }

    SetLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/user/reset-passwordPage/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully! Redirecting....");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(
          data.error || data.message || "Something went wrong on server."
        );
      }
    } catch (error) {
      console.error("Client side fetch error:", error);
      toast.error("Network error. Could not connect to the server.");
    }
    SetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white max-w-lg shadow-lg w-full rounded-lg p-10 ">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          New Password
        </h1>
        <hr className="my-6" />

        <form onSubmit={SubmitHandler}>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border text-gray-700 rounded-lg outline-none"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
              }}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border text-gray-700 rounded-lg outline-none"
            />
          </div>
          <button
            disabled={loading}
            className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg disabled:opacity-60"
            type="submit"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
