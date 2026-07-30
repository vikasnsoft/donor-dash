"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearch, SearchResult } from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  CreditCard,
  CalendarDays,
  FolderOpen,
  Receipt,
  Users,
  IndianRupee,
  X,
} from "lucide-react";
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

interface SearchBarProps {
  orgId?: string;
  className?: string;
}

export function SearchBar({ orgId, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useSearch(query, orgId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);
      setQuery("");
      router.push(result.path);
    },
    [router]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search donors, events, donations..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {data?.results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-accent transition-colors text-left"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded text-white",
                      TYPE_COLORS[result.type]
                    )}
                  >
                    {TYPE_ICONS[result.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {result.type}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
