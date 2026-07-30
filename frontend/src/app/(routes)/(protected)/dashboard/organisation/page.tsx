"use client";

import { useState } from "react";
import { useOrganisations } from "@/hooks/useOrganisations";
import {
  useFinancialSummary,
  useEventOverviews,
  useDonorRetention,
} from "@/hooks/useDashboard";
import {
  MetricCard,
  ChartCard,
  TableCard,
  DashboardSection,
} from "@/components/dashboard/primitives";
import { CampaignProgressChart } from "@/components/dashboard/charts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Receipt,
  IndianRupee,
  CalendarDays,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function OrganisationDashboard() {
  const { data: orgs } = useOrganisations();
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  const orgId = selectedOrg || orgs?.data?.[0]?._id || "";
  const orgName = orgs?.data?.find((o) => o._id === orgId)?.name || "";

  const { data: financial, isLoading: loadingFinancial } =
    useFinancialSummary(orgId);
  const { data: events, isLoading: loadingEvents } = useEventOverviews(orgId);
  const { data: retention } = useDonorRetention(orgId);

  const activeEvents = events?.filter((e) => e.status === "active") || [];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {orgName ? `${orgName} Dashboard` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            Organisation overview and financial health
          </p>
        </div>
        {orgs && orgs.data.length > 1 && (
          <Select value={orgId} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select organisation" />
            </SelectTrigger>
            <SelectContent>
              {orgs.data.map((org) => (
                <SelectItem key={org._id} value={org._id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!orgId && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Create an organisation to see the dashboard.
            </p>
            <Button asChild className="mt-4">
              <Link href="/organisations/new">Create Organisation</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {orgId && (
        <>
          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Total Donations"
              value={`₹${(
                financial?.totalDonations || 0
              ).toLocaleString("en-IN")}`}
              icon={<CreditCard className="h-4 w-4" />}
              loading={loadingFinancial}
            />
            <MetricCard
              title="Total Expenses"
              value={`₹${(
                financial?.totalExpenses || 0
              ).toLocaleString("en-IN")}`}
              icon={<Receipt className="h-4 w-4" />}
              loading={loadingFinancial}
            />
            <MetricCard
              title="Active Events"
              value={activeEvents.length}
              icon={<CalendarDays className="h-4 w-4" />}
              loading={loadingEvents}
            />
            <MetricCard
              title="Total Donors"
              value={retention?.totalDonors || 0}
              subtitle={
                retention?.returningDonors
                  ? `${retention.retentionRate}% returning`
                  : undefined
              }
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          {/* Campaign Progress */}
          {activeEvents.length > 0 && (
            <DashboardSection
              title="Campaign Progress"
              description="Active campaign completion status"
              className="mb-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {activeEvents.slice(0, 2).map((event) => (
                  <ChartCard key={event._id} title={event.name}>
                    <CampaignProgressChart
                      data={[
                        {
                          name: event.name,
                          target: event.donationCompletion || 100,
                          collected: event.totalDonations,
                          completionPercentage:
                            event.donationCompletion || 0,
                        },
                      ]}
                    />
                  </ChartCard>
                ))}
              </div>
            </DashboardSection>
          )}

          {/* Events Table */}
          <DashboardSection
            title="Events"
            description="All events across the organisation"
          >
            <TableCard title="Event Overview">
              <div className="space-y-2">
                {events?.map((event) => (
                  <Link
                    key={event._id}
                    href={`/events/${event._id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.type} &middot;{" "}
                          {new Date(event.startDate).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          event.status === "active" ? "default" : "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₹
                          {parseFloat(
                            String(event.totalDonations)
                          ).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.donorCount} donors
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!events || events.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No events yet
                  </p>
                )}
              </div>
            </TableCard>
          </DashboardSection>
        </>
      )}
    </div>
  );
}
