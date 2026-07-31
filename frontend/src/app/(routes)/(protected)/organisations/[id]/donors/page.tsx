"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useDonors } from "@/hooks/useDonors";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  family: "Family",
  corporate: "Corporate",
};

export default function DonorsPage() {
  const params = useParams();
  const orgId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDonors(orgId, page, 20);

  const donors = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Donors</h1>
          <p className="text-muted-foreground">
            {data?.meta?.total || 0} donors
          </p>
        </div>
        <Button asChild>
          <Link href={`/organisations/${orgId}/donors/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Donor
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search donors by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Donor List */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {!isLoading && donors.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No donors yet</h3>
            <p className="mb-4 text-muted-foreground">
              Add your first donor to start recording donations.
            </p>
            <Button asChild>
              <Link href={`/organisations/${orgId}/donors/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Donor
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {donors.length > 0 && (
        <div className="space-y-2">
          {donors.map((donor) => (
            <Link key={donor._id} href={`/donors/${donor._id}`}>
              <Card className="hover:shadow-md transition-shadow mb-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{donor.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {TYPE_LABELS[donor.type]}
                        </Badge>
                        {donor.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {donor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {donor.phone}
                          </span>
                        )}
                        {donor.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {donor.email}
                          </span>
                        )}
                        {donor.address?.city && (
                          <span>{donor.address.city}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {parseFloat(
                          String(donor.stats?.totalDonated || 0)
                        ).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donor.stats?.donationCount || 0} donations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
