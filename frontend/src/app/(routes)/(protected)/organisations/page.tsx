"use client";

import Link from "next/link";
import { useOrganisations } from "@/hooks/useOrganisations";
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
import { Building2, Plus, Users } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  mandal: "Mandal",
  ngo: "NGO",
  trust: "Trust",
  committee: "Committee",
  other: "Other",
};

export default function OrganisationsPage() {
  const { data, isLoading, error } = useOrganisations();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organisations</h1>
          <p className="text-muted-foreground">
            Manage your mandals, trusts, and committees
          </p>
        </div>
        <Button asChild>
          <Link href="/organisations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Organisation
          </Link>
        </Button>
      </div>

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

      {error && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Failed to load organisations. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {data && data.data.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No organisations yet
            </h3>
            <p className="mb-4 text-muted-foreground">
              Create your first organisation to start managing events and
              donations.
            </p>
            <Button asChild>
              <Link href="/organisations/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Organisation
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((org) => (
            <Link key={org._id} href={`/organisations/${org._id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <Badge variant="secondary">{TYPE_LABELS[org.type] || org.type}</Badge>
                  </div>
                  {org.description && (
                    <CardDescription className="line-clamp-2">
                      {org.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {org.members?.length || 0} member
                      {org.members?.length !== 1 ? "s" : ""}
                    </span>
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
