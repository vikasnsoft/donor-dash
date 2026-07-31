"use client";

import { useParams } from "next/navigation";
import { useDonation, useCancelDonation } from "@/hooks/useDonations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IndianRupee,
  CalendarDays,
  CreditCard,
  User,
  FileText,
  ArrowLeft,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  online: "Online",
  qr: "QR Code",
};

export default function DonationDetailPage() {
  const params = useParams();
  const donationId = params.id as string;
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: donation, isLoading } = useDonation(donationId);
  const cancelMutation = useCancelDonation();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Donation not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    cancelMutation.mutate(
      { id: donationId, reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Donation cancelled");
          setShowCancel(false);
        },
        onError: () => toast.error("Failed to cancel donation"),
      }
    );
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/events/${donation.event?._id || ""}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Link>
      </Button>

      {/* Receipt Card */}
      <Card className="mb-6">
        <CardHeader className="text-center border-b">
          <div className="text-sm text-muted-foreground mb-1">
            Donation Receipt
          </div>
          <div className="text-3xl font-bold text-orange-500">
            ₹{parseFloat(String(donation.amount)).toLocaleString("en-IN")}
          </div>
          {donation.receiptNumber && (
            <div className="text-sm text-muted-foreground mt-1">
              Receipt: {donation.receiptNumber}
            </div>
          )}
          <Badge
            className="mt-2 w-fit mx-auto"
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
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Donor</p>
                <p className="font-medium">
                  {donation.donor?.name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(donation.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {METHOD_LABELS[donation.method] || donation.method}
                </p>
              </div>
            </div>
            {donation.reference && (
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium">{donation.reference}</p>
                </div>
              </div>
            )}
            {donation.event && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Event</p>
                  <p className="font-medium">{donation.event.name}</p>
                </div>
              </div>
            )}
            {donation.campaign && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Campaign</p>
                  <p className="font-medium">{donation.campaign.name}</p>
                </div>
              </div>
            )}
            {donation.collectedBy && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Collected By</p>
                  <p className="font-medium">{donation.collectedBy.name}</p>
                </div>
              </div>
            )}
          </div>

          {donation.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{donation.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        {donation.status === "received" && (
          <>
            <Button variant="outline" className="flex-1">
              Print Receipt
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowCancel(true)}
            >
              Cancel Donation
            </Button>
          </>
        )}
        {donation.ledgerEntry && (
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/ledger/${donation.ledgerEntry}`}>
              View Ledger Entry
            </Link>
          </Button>
        )}
      </div>

      {/* Cancel Dialog */}
      {showCancel && (
        <Card className="mt-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Cancel Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will cancel the donation and reverse the ledger entry. This
              action cannot be undone.
            </p>
            <Input
              placeholder="Reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending
                  ? "Cancelling..."
                  : "Confirm Cancellation"}
              </Button>
              <Button variant="ghost" onClick={() => setShowCancel(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
