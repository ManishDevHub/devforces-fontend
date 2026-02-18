"use client";
import React, { useMemo } from "react";
import { UserActivity } from "@/lib/user-client";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKS_TO_SHOW = 48; // About 11 months, fits better on most screens

const toDayKey = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
};

const getIntensityClass = (count: number) => {
  if (count <= 0) return "bg-muted";
  if (count <= 2) return "bg-emerald-500/30";
  if (count <= 5) return "bg-emerald-500/50";
  if (count <= 10) return "bg-emerald-500/70";
  return "bg-emerald-500";
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function ContributionGrid({ activity }: { activity: UserActivity[] }) {
  const { cells, monthLabels } = useMemo(() => {
    const countByDay = new Map<string, number>();
    activity.forEach((entry) => {
      countByDay.set(toDayKey(entry.date), entry.count);
    });

    const now = new Date();
    // Start from the most recent Saturday to make the grid align perfectly (Sunday starts top-down)
    const endDate = new Date(now);
    const endDay = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - endDay)); // Go to Saturday of current week

    const cellList: Array<{ date: string; count: number; dayOfWeek: number; month: number }> = [];
    const months: Array<{ label: string; index: number }> = [];
    let lastMonth = -1;

    const totalDays = WEEKS_TO_SHOW * 7;
    for (let i = totalDays - 1; i >= 0; i -= 1) {
      const date = new Date(endDate.getTime() - i * DAY_MS);
      const key = toDayKey(date);
      const dayOfWeek = date.getDay();
      const month = date.getMonth();

      // If Sunday, check if month changed to place label
      if (dayOfWeek === 0) {
         if (month !== lastMonth) {
            months.push({ label: MONTHS[month], index: (totalDays - 1 - i) / 7 });
            lastMonth = month;
         }
      }

      cellList.push({
        date: key,
        count: countByDay.get(key) || 0,
        dayOfWeek,
        month
      });
    }

    return { cells: cellList, monthLabels: months };
  }, [activity]);

  return (
    <div className="w-full space-y-3">
      <div className="relative flex">
        {/* Weekday Labels (vertical) */}
        <div className="mr-2 mt-6 grid grid-rows-7 gap-1 text-[10px] font-medium text-muted-foreground/60">
          {DAYS.map((day, i) => (
            <div key={i} className="h-3 flex items-center leading-none">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
          {/* Months Header (horizontal) */}
          <div className="relative h-6 w-full text-[10px] font-medium text-muted-foreground/60">
             {monthLabels.map((m, i) => (
               <div 
                 key={i} 
                 className="absolute top-1" 
                 style={{ left: `${m.index * 14}px` }}
               >
                 {m.label}
               </div>
             ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-flow-col grid-rows-7 gap-0.5 sm:gap-1">
            {cells.map((cell) => (
              <div
                key={cell.date}
                className={`h-3 w-3 shrink-0 rounded-[2px] ${getIntensityClass(cell.count)} transition-all hover:ring-2 hover:ring-primary/40 cursor-default`}
                title={`${cell.date}: ${cell.count} submissions`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-3">
        <div className="text-[11px] font-medium text-muted-foreground/80">
          Activity in the last {Math.round(WEEKS_TO_SHOW / 4)} months
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60">
          <span>Less</span>
          <div className="flex gap-0.5 sm:gap-1">
            <div className="h-2.5 w-2.5 rounded-[2px] bg-muted shadow-sm" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500/30 shadow-sm" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500/50 shadow-sm" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500/70 shadow-sm" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500 shadow-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
