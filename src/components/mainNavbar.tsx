import Link from "next/link";
import React from 'react'
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className=" w-full bg-background border-b ">
        <div  className="mx-auto h-14 m-w-xl flex items-center justify-between px-5 ">
         
            <Link className="text-xl font-bold" href="/">DevForce</Link>
            <div className=" hidden md:flex items-center gap-10">
                <Link className="text-sm font-medium hover:text-primary " href="/contest"> Contest</Link>
                <Link className="text-sm font-medium hover:text-primary " href="/problem"> Problems</Link>
                <Link className="text-sm font-medium hover:text-primary " href="/practice"> Practice</Link>
                <Link className="text-sm font-medium hover:text-primary " href="/leaderboard">LeaderBoard</Link>
                 <Link className="text-sm font-medium hover:text-primary " href="/discuss">Discuss</Link>

            </div>
            <div className="flex items-center gap-2">
                <Button className="flex items-center gap-5" variant="default" >
                  <Link href="/register"> Get Started </Link> </Button>
                  <Button className="flex items-center gap-2 "variant="sign">
                    <Link href="/login"> Signin</Link> </Button>
            </div>
         
        </div>

    </div>
  )
}
