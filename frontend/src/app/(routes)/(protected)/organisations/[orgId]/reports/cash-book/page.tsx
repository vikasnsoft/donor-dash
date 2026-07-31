"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCashBook } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CashBookPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(now.toISOString().split("T")[0]);

  const { data, isLoading } = useCashBook(orgId, from, to);

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Cash Book</h1>
      <p className="text-muted-foreground mb-6">
        Daily cash in/out with running balance
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

      {isLoading && <Skeleton className="h-96 w-full" />}

      {data && (
        <>
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">Total In</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{data.totalIn.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">Total Out</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{data.totalOut.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    data.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{data.balance.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Entries Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {data.entries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-left py-2 font-medium">Entry #</th>
                        <th className="text-left py-2 font-medium">
                          Description
                        </th>
                        <th className="text-right py-2 font-medium">In (₹)</th>
                        <th className="text-right py-2 font-medium">
                          Out (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.entries.map((entry, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2">
                            {new Date(entry.date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {entry.entryNumber}
                          </td>
                          <td className="py-2">{entry.description}</td>
                          <td className="py-2 text-right text-green-600">
                            {entry.in > 0
                              ? `₹${entry.in.toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                          <td className="py-2 text-right text-red-600">
                            {entry.out > 0
                              ? `₹${entry.out.toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No cash transactions for this period
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
