"use client";

import { Sidebar, SidebarFooter, SidebarHeader } from "../ui/sidebar";
import SidebarContentWrapper from "./sidebarContent";
import { SiteSwitcher } from "./siteSwitcher";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>

      <SidebarContentWrapper />

      <SidebarFooter className="border-t">
        <SiteSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
