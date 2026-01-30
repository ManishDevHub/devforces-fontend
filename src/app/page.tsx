import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function page() {
  return (
    <div>

      <Navbar></Navbar>
      <div className='flex items-center justify-center bg-red-400'>
        <h5 className=' '>Season 4 Contest Now Live</h5>
        <h1>Compete. Build. Dominate</h1>
        <p>The ultimate competitive programming platform for web <br /> Solve real-world challenges, build production-grade systems, and prove <br /> your skills against the best developers worldwide.</p>
        <div>
          <Button> Get Started</Button>
          <Button> View Contests</Button>
        </div>
      </div>
     
    </div>
  )
}
