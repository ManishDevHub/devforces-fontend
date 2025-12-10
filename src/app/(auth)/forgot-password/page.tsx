"use client";

import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function ForgotPassword() {

const [ email , setEmail] = useState("")
const [ loading , SetLoading] = useState(false)

const handleSubmit = async( e: any)=>{
    e.priventDeafult();
SetLoading(true);

try{

  const res = await fetch("" , {
    method: "POST",
  headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email})
  })
  const data  = await res.json();
  
  if(!res.ok){
    toast.error(  data.error|| " Faield to send reset link")
    SetLoading(false)
    return;
  }
  toast.success("Password reset link sent")

}catch(error){
  console.log("server error")
}
SetLoading(false)

}




 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg max-w-lg w-full rounded-lg p-10">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Password Reset
        </h1>

        <hr className="my-6" />

        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-5 rounded-md mb-6">
          <p>
            Can’t remember your password?  
            Just enter your email and we’ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-0.5px to-black px-4 py-3 text-gray-600 rounded-lg outline-none"
            />

            {email === "" && (
              <p className="text-red-600 text-sm mt-1">Required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg transition"
          >
            {loading ? "Sending..." : "Reset My Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
