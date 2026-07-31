"use client";

import { useState } from "react";
import { useGroups, useUserBalanceSummary, type Group } from "@/hooks/useGroups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/dashboard/primitives";
import {
  FolderOpen,
  Plus,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  trip: "Trip",
  home: "Home",
  couple: "Couple",
  committee: "Committee",
  event: "Event",
  other: "Other",
};

export default function GroupsPage() {
  const [page] = useState(1);
  const { data, isLoading } = useGroups(page);
  const { data: balanceSummary } = useUserBalanceSummary();

  const groups = data?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Manage shared expenses with friends and committees
          </p>
        </div>
        <Button asChild>
          <Link href="/groups/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Link>
        </Button>
      </div>

      {/* Balance Summary */}
      {balanceSummary && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <MetricCard
            title="You Are Owed"
            value={`₹${balanceSummary.totalOwed.toLocaleString("en-IN")}`}
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          />
          <MetricCard
            title="You Owe"
            value={`₹${balanceSummary.totalOwing.toLocaleString("en-IN")}`}
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          />
          <MetricCard
            title="Net Balance"
            value={`₹${balanceSummary.net.toLocaleString("en-IN")}`}
            icon={<IndianRupee className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Groups List */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}

      {!isLoading && groups.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No groups yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create a group to start splitting expenses with others.
            </p>
            <Button asChild>
              <Link href="/groups/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {groups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group: Group) => (
            <Link key={group._id} href={`/groups/${group._id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <Badge variant="secondary">
                      {TYPE_LABELS[group.type]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{group.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <span>
                        ₹{parseFloat(String(group.totalExpenses || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
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
