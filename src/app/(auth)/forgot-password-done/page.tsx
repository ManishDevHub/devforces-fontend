import React from "react";

export default function PsswordResetSent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl text-gray-800 font-semibold">
          {" "}
          Password Reset
        </h1>
        <p className="text-gray-500 mt-2">
          We’ve sent you an email with reset instructions.
        </p>
        <p className="text-gray-500 mt-1">
          If you don’t receive it within a few minutes, please contact support.
        </p>
      </div>
    </div>
  );
}
