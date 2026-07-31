"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useEvent } from "@/hooks/useEvents";
import {
  useDailyDonations,
  useVolunteerPerformance,
  useCampaignSummaries,
  useEventSummary,
} from "@/hooks/useDashboard";
import { useDonations } from "@/hooks/useDonations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MetricCard,
  ChartCard,
  TableCard,
  DashboardSection,
} from "@/components/dashboard/primitives";
import { DonationTrendChart, CampaignProgressChart } from "@/components/dashboard/charts";
import {
  CalendarDays,
  MapPin,
  Users,
  IndianRupee,
  Plus,
  ArrowLeft,
  CreditCard,
  Receipt,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-500",
  planning: "bg-blue-500",
  active: "bg-green-500",
  completed: "bg-purple-500",
  closed: "bg-yellow-600",
  archived: "bg-gray-400",
  cancelled: "bg-red-500",
};

const TYPE_LABELS: Record<string, string> = {
  ganpati: "Ganpati Utsav",
  shiv_jayanti: "Shiv Jayanti",
  blood_donation: "Blood Donation",
  school_donation: "School Donation",
  tree_plantation: "Tree Plantation",
  cleanliness: "Cleanliness Drive",
  other: "Other",
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: event, isLoading, error } = useEvent(eventId);
  const { data: summary } = useEventSummary(eventId);
  const { data: dailyDonations } = useDailyDonations(eventId);
  const { data: volunteers } = useVolunteerPerformance(eventId);
  const { data: campaigns } = useCampaignSummaries(eventId);
  const { data: donations } = useDonations(eventId);

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

  if (error || !event) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Event not found.</p>
            <Button asChild className="mt-4">
              <Link href="/events">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const balance =
    parseFloat(String(event.totalDonations || 0)) -
    parseFloat(String(event.totalExpenses || 0));

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <Badge className={STATUS_COLORS[event.status]}>
              {event.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{TYPE_LABELS[event.type] || event.type}</span>
            <span>&middot;</span>
            <span>{event.financialYear}</span>
            {event.startDate && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(event.startDate).toLocaleDateString("en-IN")}
                  {event.endDate &&
                    ` — ${new Date(event.endDate).toLocaleDateString("en-IN")}`}
                </span>
              </>
            )}
            {event.location?.city && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location.city}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/events/${eventId}/edit`}>Edit</Link>
          </Button>
          <Button asChild>
            <Link href={`/events/${eventId}/donations/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Record Donation
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="committee">Committee</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Total Donations"
              value={`₹${parseFloat(String(event.totalDonations || 0)).toLocaleString("en-IN")}`}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Expenses"
              value={`₹${parseFloat(String(event.totalExpenses || 0)).toLocaleString("en-IN")}`}
              icon={<Receipt className="h-4 w-4" />}
            />
            <MetricCard
              title="Balance"
              value={`₹${balance.toLocaleString("en-IN")}`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Committee"
              value={event.committee?.length || 0}
              subtitle="members"
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          {/* Daily Donations Chart */}
          {dailyDonations && dailyDonations.length > 0 && (
            <ChartCard
              title="Donation Trend"
              subtitle="Daily donations and cumulative total"
              className="mb-8"
            >
              <DonationTrendChart data={dailyDonations} />
            </ChartCard>
          )}

          {/* Campaign Progress */}
          {campaigns && campaigns.length > 0 && (
            <ChartCard
              title="Campaign Progress"
              subtitle="Completion status of active campaigns"
              className="mb-8"
            >
              <CampaignProgressChart data={campaigns} />
            </ChartCard>
          )}

          {/* Quick Actions */}
          <DashboardSection title="Quick Actions">
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href={`/events/${eventId}/donations/new`}>
                  Record Donation
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/events/${eventId}/campaigns/new`}>
                  Create Campaign
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/events/${eventId}/reports/summary`}>
                  Event Report
                </Link>
              </Button>
            </div>
          </DashboardSection>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Donations</h2>
            <Button asChild size="sm">
              <Link href={`/events/${eventId}/donations/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Record Donation
              </Link>
            </Button>
          </div>
          {donations && donations.data.length > 0 ? (
            <div className="space-y-2">
              {donations.data.map((donation) => (
                <Link
                  key={donation._id}
                  href={`/donations/${donation._id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      ₹{parseFloat(String(donation.amount)).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {donation.donor?.name} &middot;{" "}
                      {new Date(donation.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{donation.method}</Badge>
                    <Badge
                      variant={
                        donation.status === "received"
                          ? "default"
                          : donation.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No donations recorded yet. Click &quot;Record Donation&quot; to add one.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Campaigns</h2>
            <Button asChild size="sm">
              <Link href={`/events/${eventId}/campaigns/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </Button>
          </div>
          {campaigns && campaigns.length > 0 ? (
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <Card key={campaign._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.donationCount} donations
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{parseFloat(String(campaign.collected || 0)).toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.completionPercentage}% complete
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No campaigns yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Committee Tab */}
        <TabsContent value="committee">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Committee ({event.committee?.length || 0})
            </h2>
          </div>
          <div className="space-y-2">
            {event.committee?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.user?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.user?.email}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {member.role.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {(!event.committee || event.committee.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No committee members assigned.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/events/${eventId}/reports/summary`}>
                <CardHeader>
                  <CardTitle className="text-base">Event Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Financial summary with donations, expenses, and balance
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/events/${eventId}/reports/volunteers`}>
                <CardHeader>
                  <CardTitle className="text-base">Volunteer Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collection totals by volunteer
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
