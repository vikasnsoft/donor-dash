"use client";

import { useParams } from "next/navigation";
import { useTrialBalance } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Scale, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  asset: "bg-blue-500",
  liability: "bg-purple-500",
  income: "bg-green-500",
  expense: "bg-red-500",
  equity: "bg-yellow-600",
};

export default function TrialBalancePage() {
  const params = useParams();
  const orgId = params.id as string;

  const { data, isLoading } = useTrialBalance(orgId);

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Trial Balance</h1>
          <p className="text-muted-foreground">
            All accounts with debits and credits
          </p>
        </div>
        {data && (
          <Badge
            variant={data.balanced ? "default" : "destructive"}
            className="text-base"
          >
            {data.balanced ? (
              <>
                <CheckCircle className="mr-1 h-4 w-4" /> Balanced
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-4 w-4" /> Unbalanced
              </>
            )}
          </Badge>
        )}
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}

      {data && (
        <>
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Code</th>
                      <th className="text-left py-2 font-medium">Account</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-right py-2 font-medium">
                        Debits (₹)
                      </th>
                      <th className="text-right py-2 font-medium">
                        Credits (₹)
                      </th>
                      <th className="text-right py-2 font-medium">
                        Balance (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr
                        key={entry.account._id}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 text-muted-foreground">
                          {entry.account.code}
                        </td>
                        <td className="py-2 font-medium">
                          {entry.account.name}
                        </td>
                        <td className="py-2">
                          <Badge
                            variant="secondary"
                            className={`${TYPE_COLORS[entry.account.type]} text-white text-xs`}
                          >
                            {entry.account.type}
                          </Badge>
                        </td>
                        <td className="py-2 text-right">
                          {entry.debits > 0
                            ? `₹${entry.debits.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="py-2 text-right">
                          {entry.credits > 0
                            ? `₹${entry.credits.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="py-2 text-right font-medium">
                          ₹{Math.abs(entry.balance).toLocaleString("en-IN")}
                          {entry.balance < 0 ? " (Cr)" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td colSpan={3} className="py-2">
                        Totals
                      </td>
                      <td className="py-2 text-right">
                        ₹{data.totalDebits.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 text-right">
                        ₹{data.totalCredits.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 text-right">
                        {data.balanced ? "✓" : "✗"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4 text-sm">
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded ${color}`} />
                    <span className="capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
