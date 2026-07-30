"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityItem {
  _id: string;
  description: string;
  user?: { name: string; avatar?: string };
  createdAt: string;
  type?: string;
}

interface ActivityCardProps {
  title?: string;
  items: ActivityItem[];
  loading?: boolean;
  maxItems?: number;
}

const ACTIVITY_COLORS: Record<string, string> = {
  donation: "bg-green-500",
  expense: "bg-red-500",
  settlement: "bg-blue-500",
  member: "bg-purple-500",
  default: "bg-gray-400",
};

export function ActivityCard({
  title = "Recent Activity",
  items,
  loading = false,
  maxItems = 10,
}: ActivityCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const displayItems = items.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div key={item._id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {item.user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${
                    ACTIVITY_COLORS[item.type || "default"]
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
