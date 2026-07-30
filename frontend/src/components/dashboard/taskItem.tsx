"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  title: string;
  completed?: boolean;
  className?: string;
  description?: string;
}

export function TaskItem({
  title,
  description = "Additional information and instructions for this task.",
  completed = false,
  className,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300",
          )}
        >
          {completed && <Check className="h-3.5 w-3.5" />}
        </div>
        <span className="flex-1 text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div className="ml-8 rounded-md border bg-gray-50 p-3 text-sm">
          <p>{description}</p>
          {!completed && (
            <Button className="mt-2" size="sm">
              Start Now
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
