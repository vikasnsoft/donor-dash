"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useDonationReport } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  online: "Online",
  qr: "QR Code",
};

export default function DonationReportPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(now.toISOString().split("T")[0]);

  const { data, isLoading } = useDonationReport(orgId, undefined, from, to);

  const totalByMethod =
    data?.byMethod.reduce((sum, m) => sum + m.total, 0) || 0;

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Donation Report</h1>
      <p className="text-muted-foreground mb-6">
        Donations by payment method and status
      </p>

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="text-sm font-medium">From</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">To</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {data && (
        <div className="space-y-6">
          {/* By Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                By Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.byMethod.length > 0 ? (
                <div className="space-y-2">
                  {data.byMethod.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <span className="font-medium">
                          {METHOD_LABELS[item._id] || item._id}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({item.count} donations)
                        </span>
                      </div>
                      <span className="font-medium">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t-2 font-bold">
                    <span>Total</span>
                    <span>₹{totalByMethod.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No donations for this period
                </p>
              )}
            </CardContent>
          </Card>

          {/* By Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By Status</CardTitle>
            </CardHeader>
            <CardContent>
              {data.byStatus.length > 0 ? (
                <div className="space-y-2">
                  {data.byStatus.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <span className="font-medium capitalize">
                          {item._id}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({item.count})
                        </span>
                      </div>
                      <span className="font-medium">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>

          {/* Daily Trend */}
          {data.daily.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-right py-2 font-medium">
                          Donations
                        </th>
                        <th className="text-right py-2 font-medium">
                          Amount (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.daily.map((day) => (
                        <tr key={day._id} className="border-b last:border-0">
                          <td className="py-2">{day._id}</td>
                          <td className="py-2 text-right">{day.count}</td>
                          <td className="py-2 text-right">
                            ₹{day.total.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
