import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { cookies } from "next/headers";
import { DashboardHeader } from "./dashboard-header";

/**
 * Server component that handles the main layout structure
 */
export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get sidebar state from cookies in a server component
  const cookiesStore = await cookies();
  // Get the sidebar state from cookies, defaulting to false if not set
  const sidebarCookie = cookiesStore.get("sidebar_state");
  const defaultOpen = sidebarCookie?.value === "true" || false;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex w-full h-dvh overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Use the client component wrapper for header with user menu */}
          <DashboardHeader />

          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
