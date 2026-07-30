"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  Cog,
  CreditCard,
  FolderOpen,
  Heart,
  LayoutDashboard,
  Receipt,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type SubMenuItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

type SidebarMenuItemType = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: {
    content: string;
    variant: "green" | "orange";
  };
  children?: SubMenuItem[];
};

const mainMenuItems: SidebarMenuItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organisations",
    href: "/organisations",
    icon: Building2,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Donors",
    href: "/donors",
    icon: Heart,
  },
  {
    title: "Donations",
    href: "/donations",
    icon: CreditCard,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: Receipt,
  },
  {
    title: "Groups",
    href: "/groups",
    icon: FolderOpen,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    badge: {
      content: "Admin",
      variant: "orange",
    },
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Cog,
    children: [
      { title: "Profile", href: "/settings/profile", icon: Users },
      { title: "Billing", href: "/settings/billing", icon: CreditCard },
    ],
  },
];

function SidebarContentWrapper() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuToggle = (menuTitle: string) => {
    setOpenMenu(openMenu === menuTitle ? null : menuTitle);
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openMenu === item.title}
                  onOpenChange={() => handleMenuToggle(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <div className="flex items-center gap-2 w-full">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-full px-2 py-0.5 text-xs text-white",
                              item.badge.variant === "green"
                                ? "bg-green-500"
                                : "bg-orange-500",
                            )}
                          >
                            {item.badge.content}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200",
                            openMenu === item.title ? "rotate-180" : "",
                          )}
                        />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={`${item.href}${child.href}`}
                          className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-accent"
                        >
                          <child.icon size={16} />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon size={18} />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "ml-auto rounded-full px-2 py-0.5 text-xs text-white",
                          item.badge.variant === "green"
                            ? "bg-green-500"
                            : "bg-orange-500",
                        )}
                      >
                        {item.badge.content}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
export default SidebarContentWrapper;
