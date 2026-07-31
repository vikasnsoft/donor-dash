"use client";

import { useParams } from "next/navigation";
import { useLedgerEntry } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  posted: "bg-green-500",
  draft: "bg-yellow-500",
  void: "bg-red-500",
};

const SOURCE_LABELS: Record<string, string> = {
  donation: "Donation",
  expense: "Expense",
  settlement: "Settlement",
  adjustment: "Adjustment",
  opening_balance: "Opening Balance",
  refund: "Refund",
  transfer: "Transfer",
};

export default function LedgerEntryPage() {
  const params = useParams();
  const entryId = params.id as string;

  const { data: entry, isLoading } = useLedgerEntry(entryId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Ledger entry not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/reports">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ledger
        </Link>
      </Button>

      {/* Entry Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-lg text-muted-foreground">
              {entry.entryNumber}
            </span>
            <Badge className={`${STATUS_COLORS[entry.status]} text-white`}>
              {entry.status}
            </Badge>
            <Badge variant="outline">
              {SOURCE_LABELS[entry.sourceType] || entry.sourceType}
            </Badge>
          </div>
          <CardTitle>{entry.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(entry.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-medium text-lg">
                ₹{parseFloat(String(entry.totalAmount)).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">
                {entry.createdBy?.name || "System"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Lines */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Journal Lines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Account</th>
                  <th className="text-left py-2 font-medium">Description</th>
                  <th className="text-right py-2 font-medium">Debit (₹)</th>
                  <th className="text-right py-2 font-medium">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {entry.lines?.map((line, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3">
                      <div>
                        <span className="text-muted-foreground mr-2">
                          {line.account?.code}
                        </span>
                        <span className="font-medium">
                          {line.account?.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">
                        {line.account?.type}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {line.description || "—"}
                    </td>
                    <td className="py-3 text-right">
                      {line.type === "debit" ? (
                        <span className="text-green-600 font-medium">
                          ₹{parseFloat(String(line.amount)).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {line.type === "credit" ? (
                        <span className="text-red-600 font-medium">
                          ₹{parseFloat(String(line.amount)).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-bold">
                  <td colSpan={2} className="py-2">
                    Totals
                  </td>
                  <td className="py-2 text-right text-green-600">
                    ₹
                    {entry.lines
                      ?.filter((l) => l.type === "debit")
                      .reduce(
                        (sum, l) => sum + parseFloat(String(l.amount)),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 text-right text-red-600">
                    ₹
                    {entry.lines
                      ?.filter((l) => l.type === "credit")
                      .reduce(
                        (sum, l) => sum + parseFloat(String(l.amount)),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
