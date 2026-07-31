"use client";

import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Users,
  CalendarDays,
  FolderOpen,
  CreditCard,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  donor: <Users className="h-4 w-4" />,
  event: <CalendarDays className="h-4 w-4" />,
  campaign: <FolderOpen className="h-4 w-4" />,
  donation: <CreditCard className="h-4 w-4" />,
  group: <Users className="h-4 w-4" />,
  expense: <Receipt className="h-4 w-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  donor: "bg-blue-500",
  event: "bg-green-500",
  campaign: "bg-purple-500",
  donation: "bg-orange-500",
  group: "bg-cyan-500",
  expense: "bg-red-500",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearch(query);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search Results</h1>
        {query && (
          <p className="text-muted-foreground mt-1">
            {data?.total || 0} results for &quot;{query}&quot;
          </p>
        )}
      </div>

      {!query && (
        <Card>
          <CardContent className="py-10 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Use the search bar or press <kbd className="px-2 py-1 bg-muted rounded text-sm">⌘K</kbd> to search
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {data && data.results.length === 0 && query && (
        <Card>
          <CardContent className="py-10 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
          </CardContent>
        </Card>
      )}

      {data && data.results.length > 0 && (
        <div className="space-y-2">
          {data.results.map((result) => (
            <Link key={`${result.type}-${result.id}`} href={result.path}>
              <Card className="hover:shadow-md transition-shadow mb-2">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded text-white",
                        TYPE_COLORS[result.type]
                      )}
                    >
                      {TYPE_ICONS[result.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {result.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
