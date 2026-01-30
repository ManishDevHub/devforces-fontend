import React from 'react'

export default function StatsSection() {

     const stats = [
    { value: "98%", label: "of users improved their skills", description: "Based on self-reported surveys" },
    { value: "3x", label: "faster time to job placement", description: "Compared to traditional learning" },
    { value: "500+", label: "companies actively recruiting", description: "From startups to Fortune 500" },
    { value: "24/7", label: "global community support", description: "Never code alone again" },
  ]
  return (
    <div>
      
        <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
      
        
    </div>
  )
}
