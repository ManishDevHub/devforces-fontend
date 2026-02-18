"use client";
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserActivity } from "@/lib/user-client";

interface ProfileCalendarProps {
  activity: UserActivity[];
}

export default function ProfileCalendar({ activity }: ProfileCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const activeDaysMap = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((item) => {
      const dateKey = new Date(item.date).toISOString().slice(0, 10);
      map.set(dateKey, item.count);
    });
    return map;
  }, [activity]);

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDay = firstDayOfMonth.getDay(); // 0 is Sunday
    const totalDays = lastDayOfMonth.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const remaining = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [viewDate]);

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activity Calendar</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-24 text-center text-sm font-medium">
            {monthName} {year}
          </div>
          <button
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {calendarData.map((item, idx) => {
          const date = new Date(item.year, item.month, item.day);
          const dateKey = date.toISOString().slice(0, 10);
          const count = activeDaysMap.get(dateKey) || 0;
          const isCurrent = item.isCurrentMonth;
          const today = isToday(item.day, item.month, item.year);

          return (
            <div
              key={idx}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition-all ${
                isCurrent
                  ? "border-border/50 bg-background/30 text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground/30"
              } ${today ? "ring-1 ring-primary" : ""}`}
              title={`${dateKey}: ${count} submissions`}
            >
              <span>{item.day}</span>
              {count > 0 && (
                <div 
                  className={`mt-1 h-1.5 w-1.5 rounded-full ${
                    count > 5 ? "bg-emerald-500" : count > 2 ? "bg-emerald-500/60" : "bg-emerald-500/30"
                  }`} 
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
           <div className="h-2 w-2 rounded-full border border-primary ring-1 ring-primary/20" />
           <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
           <div className="h-2 w-2 rounded-full bg-emerald-500" />
           <span>Active Day</span>
        </div>
      </div>
    </div>
  );
}
