"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrganisations } from "@/hooks/useOrganisations";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Plus, MapPin, Users, IndianRupee } from "lucide-react";

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

export default function EventsPage() {
  const { data: orgs } = useOrganisations();
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: events, isLoading } = useEvents(
    selectedOrg,
    1,
    50,
    statusFilter || undefined
  );

  const firstOrg = orgs?.data?.[0];
  const orgId = selectedOrg || firstOrg?._id || "";

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage events like Ganpati Utsav, Shiv Jayanti, and more
          </p>
        </div>
        {orgId && (
          <Button asChild>
            <Link href={`/events/new?org=${orgId}`}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!orgId && !isLoading && (
        <Card>
          <CardContent className="py-10 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No organisation selected</h3>
            <p className="mb-4 text-muted-foreground">
              Create an organisation first to manage events.
            </p>
            <Button asChild>
              <Link href="/organisations/new">Create Organisation</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {events && events.data.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No events yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create your first event to start managing donations and campaigns.
            </p>
            {orgId && (
              <Button asChild>
                <Link href={`/events/new?org=${orgId}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {events && events.data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.data.map((event) => (
            <Link key={event._id} href={`/events/${event._id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <Badge className={STATUS_COLORS[event.status]}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {TYPE_LABELS[event.type] || event.type} &middot; {event.financialYear}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString("en-IN")}
                      {event.endDate &&
                        ` — ${new Date(event.endDate).toLocaleDateString("en-IN")}`}
                    </span>
                  </div>
                  {event.location?.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.committee?.length || 0} committee members</span>
                  </div>
                  {parseFloat(String(event.totalDonations)) > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span>
                        ₹{parseFloat(String(event.totalDonations)).toLocaleString("en-IN")} collected
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
