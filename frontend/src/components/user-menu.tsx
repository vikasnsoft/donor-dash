"use client";

import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Component function
function UserMenuComponent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'User'} />
          <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {user?.role}
              </span>
            </div>
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Your Profile
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export for dynamic import
export const UserMenu = UserMenuComponent;

// Default export
const userMenuModule = { UserMenu };
export default userMenuModule;
