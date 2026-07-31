"use client";

import { useParams } from "next/navigation";
import { useDonor, useDonorSearch } from "@/hooks/useDonors";
import { useDonorDonations } from "@/hooks/useDonations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/dashboard/primitives";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  CalendarDays,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  family: "Family",
  corporate: "Corporate",
};

export default function DonorDetailPage() {
  const params = useParams();
  const donorId = params.id as string;

  const { data: donor, isLoading } = useDonor(donorId);
  const { data: donations } = useDonorDonations(donorId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-96 mb-4" />
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Donor not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/donors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Donors
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{donor.name}</h1>
            <Badge variant="secondary">
              {TYPE_LABELS[donor.type]}
            </Badge>
            {donor.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {donor.address.city}
                {donor.address.state && `, ${donor.address.state}`}
              </span>
            )}
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/donors/${donorId}/edit`}>Edit</Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricCard
          title="Total Donated"
          value={`₹${parseFloat(
            String(donor.stats?.totalDonated || 0)
          ).toLocaleString("en-IN")}`}
          icon={<IndianRupee className="h-4 w-4" />}
        />
        <MetricCard
          title="Donations"
          value={donor.stats?.donationCount || 0}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <MetricCard
          title="Last Donation"
          value={
            donor.stats?.lastDonationDate
              ? new Date(donor.stats.lastDonationDate).toLocaleDateString(
                  "en-IN"
                )
              : "Never"
          }
          icon={<CalendarDays className="h-4 w-4" />}
        />
      </div>

      {/* Family Members */}
      {donor.familyMembers && donor.familyMembers.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {donor.familyMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.relation && (
                      <p className="text-sm text-muted-foreground">
                        {member.relation}
                      </p>
                    )}
                  </div>
                  {member.phone && (
                    <span className="text-sm text-muted-foreground">
                      {member.phone}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {donor.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{donor.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Donation History</CardTitle>
        </CardHeader>
        <CardContent>
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
                      {donation.event?.name} &middot;{" "}
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
            <p className="text-sm text-muted-foreground text-center py-4">
              No donations recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
