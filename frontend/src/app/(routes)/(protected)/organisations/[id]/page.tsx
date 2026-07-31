"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useOrganisation } from "@/hooks/useOrganisations";
import { useEventOverviews, useFinancialSummary } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MetricCard,
  ChartCard,
  DashboardSection,
} from "@/components/dashboard/primitives";
import { ExpenseBreakdownChart } from "@/components/dashboard/charts";
import {
  Building2,
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  mandal: "Mandal",
  ngo: "NGO",
  trust: "Trust",
  committee: "Committee",
  other: "Other",
};

export default function OrganisationDetailPage() {
  const params = useParams();
  const orgId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: org, isLoading, error } = useOrganisation(orgId);
  const { data: events } = useEventOverviews(orgId);
  const { data: financial } = useFinancialSummary(orgId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-96 mb-4" />
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Organisation not found.</p>
            <Button asChild className="mt-4">
              <Link href="/organisations">Back to Organisations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const surplus =
    (financial?.totalDonations || 0) - (financial?.totalExpenses || 0);

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/organisations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organisations
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{org.name}</h1>
            <Badge variant="secondary">{TYPE_LABELS[org.type]}</Badge>
          </div>
          {org.description && (
            <p className="text-muted-foreground mt-1">{org.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/organisations/${orgId}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/events/new?org=${orgId}`}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Total Donations"
              value={`₹${(financial?.totalDonations || 0).toLocaleString("en-IN")}`}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Expenses"
              value={`₹${(financial?.totalExpenses || 0).toLocaleString("en-IN")}`}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <MetricCard
              title="Balance"
              value={`₹${surplus.toLocaleString("en-IN")}`}
              icon={<Building2 className="h-4 w-4" />}
            />
            <MetricCard
              title="Members"
              value={org.members?.length || 0}
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          {financial && Object.keys((financial as unknown as Record<string, Record<string, number>>).expensesByCategory || {}).length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <ChartCard title="Expense Breakdown">
                <ExpenseBreakdownChart
                  data={(financial as unknown as Record<string, Record<string, number>>).expensesByCategory || {}}
                />
              </ChartCard>
            </div>
          )}

          {/* Recent Events */}
          <DashboardSection title="Recent Events">
            <div className="space-y-2">
              {events?.slice(0, 5).map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.type} &middot;{" "}
                      {new Date(event.startDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </Link>
              ))}
              {(!events || events.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events yet
                </p>
              )}
            </div>
          </DashboardSection>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Events</h2>
            <Button asChild size="sm">
              <Link href={`/events/new?org=${orgId}`}>
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {events?.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.type} &middot;{" "}
                    {new Date(event.startDate).toLocaleDateString("en-IN")}
                    {event.endDate &&
                      ` — ${new Date(event.endDate).toLocaleDateString("en-IN")}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      ₹{parseFloat(String(event.totalDonations)).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.donorCount} donors
                    </p>
                  </div>
                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              </Link>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No events yet
              </p>
            )}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Members ({org.members?.length || 0})</h2>
          </div>
          <div className="space-y-2">
            {org.members?.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.user.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/organisations/${orgId}/ledger`}>
                <CardHeader>
                  <CardTitle className="text-base">Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View all journal entries and account balances
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/organisations/${orgId}/reports/income-statement`}>
                <CardHeader>
                  <CardTitle className="text-base">Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Income vs expenses with surplus/deficit
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/organisations/${orgId}/reports/cash-book`}>
                <CardHeader>
                  <CardTitle className="text-base">Cash Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Daily cash in/out with running balance
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/organisations/${orgId}/reports/trial-balance`}>
                <CardHeader>
                  <CardTitle className="text-base">Trial Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All accounts with debits and credits
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
