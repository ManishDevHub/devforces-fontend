"use client";

import { ContestFrequency, ContestStatus } from "@/app/contest/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


interface ContestFiltersProps {
  statusFilter: ContestStatus | "all";
  frequencyFilter: ContestFrequency | "all";
  searchQuery: string;
  onStatusChange: (status: ContestStatus | "all") => void;
  onFrequencyChange: (frequency: ContestFrequency | "all") => void;
  onSearchChange: (query: string) => void;
}

export function ContestFilters({
  statusFilter,
  frequencyFilter,
  searchQuery,
  onStatusChange,
  onFrequencyChange,
  onSearchChange,
}: ContestFiltersProps) {
  const statusOptions: { value: ContestStatus | "all"; label: string }[] = [
    { value: "all", label: "All Contests" },
    { value: "LIVE", label: "Live" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const frequencyOptions: { value: ContestFrequency | "all"; label: string }[] = [
    { value: "all", label: "All Frequencies" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "BIWEEKLY", label: "Bi-Weekly" },
    { value: "MONTHLY", label: "Monthly" },
   
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contests..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-secondary border-border pl-10"
        />
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">Status</span>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className={
                statusFilter === option.value
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "border-border hover:bg-secondary"
              }
            >
              {option.label}
              {option.value === "LIVE" && (
                <span className="ml-1.5 flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Frequency Filters */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">Frequency</span>
        <div className="flex flex-wrap gap-2">
          {frequencyOptions.map((option) => (
            <Button
              key={option.value}
              variant={frequencyFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFrequencyChange(option.value)}
              className={
                frequencyFilter === option.value
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "border-border hover:bg-secondary"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
