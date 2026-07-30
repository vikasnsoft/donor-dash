"use client";

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SiteSwitcher } from "@/components/sidebar/siteSwitcher";

/**
 * Client component for dashboard header
 * Contains sidebar trigger and user menu via SiteSwitcher
 */
export function DashboardHeader() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-medium">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Help"
        >
          <QuestionMarkCircledIcon className="h-5 w-5" />
        </Button>
        <div className="w-auto">
          <SiteSwitcher />
        </div>
      </div>
    </header>
  );
}
