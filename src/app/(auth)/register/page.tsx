"use client";

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation";

export default function Register() {

const router = useRouter()
const [ form , setForm ] = useState({
    name: "",
    email: "",
    password: "",
    
})

const handleChange =(e: any) =>{
    setForm({ ...form , [e.target.name]: e.target.value});
}

const handleSubmit = async(e: any)=>{
    e.preventDefault();


try{

    const res = await fetch("http://localhost:4000/api/user/register" , {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body:JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            
        })
    })

    const data = await res.json();

    if(!res.ok){
        toast.error( data.error || "Registation Failed");
        return;
    }

    toast.success("Register Successfully")
    setTimeout(()=>{
        router.push("/login")
    } ,1500)

}catch(error){
    toast.error("Server error")
}
}

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-[#e9ecef]'>
        <div className=' bg-white shadow-2xl w-full max-w-md rounded-lg p-10'>

            <div className='flex flex-col items-center mb-8'>
                <img src="https://www.logoai.com/oss/icons/2021/10/27/MuCSnBxFpOQg2Kl.png" alt="logo" className='h-10 mb-1' />
                <h1 className='text-xl text-gray-700 bold font-semibold'>Devforces</h1>
            </div>
             
             <form onSubmit={handleSubmit} className='space-y-4'>
                <input type="text" name="name" placeholder='name' 
                className='w-full border border-0.5px to-black px-4 py-3 outline-none rounded-lg text-gray-600 mb-4'
                onChange={handleChange}
                />

              <input type="email" name="email" placeholder='email'
               onChange={handleChange}
              className='w-full border border-0.5px to-black px-4 py-3 outline-none rounded-lg text-gray-600 mb-4'
              />
             <input type="password" name="password" placeholder='password'
              onChange={handleChange}
             className='w-full border border-0.5px to-black px-4 py-3 outline-none rounded-lg text-gray-600 mb-4'
             />
             
                
                <button type='submit' className='w-full py-3 bg-gray-700 text-white rounded-lg text-lg hover:bg-gray-900 transition'
                > Register</button>
             </form>
             <div className='flex justify-between text-sm mt-3'>
                <a href="/forgot-password" className='text-blue-600 hover:underline'>forgot password?</a>
                <a href="/login" className='text-blue-600 hover:underline'>Already have an account? Login</a>
             </div>

        </div>
        
         </div>
  )
}
