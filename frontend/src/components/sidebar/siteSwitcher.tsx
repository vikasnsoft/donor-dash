"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

/**
 * Combined component that serves as a user menu in the sidebar
 * Shows user info and provides options for profile, dashboard, settings, and logout
 */
export function SiteSwitcher() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="flex items-center gap-2 w-full">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'User'} />
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[250px]"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {user.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Your Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
