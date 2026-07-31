"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLedgerEntries, type LedgerEntry } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  donation: "Donation",
  expense: "Expense",
  settlement: "Settlement",
  adjustment: "Adjustment",
  opening_balance: "Opening Balance",
  refund: "Refund",
  transfer: "Transfer",
};

const STATUS_COLORS: Record<string, string> = {
  posted: "bg-green-500",
  draft: "bg-yellow-500",
  void: "bg-red-500",
};

export default function LedgerPage() {
  const params = useParams();
  const orgId = params.id as string;
  const [page, setPage] = useState(1);
  const [sourceType, setSourceType] = useState("");
  const [status, setStatus] = useState("");

  const filters: Record<string, string> = {};
  if (sourceType) filters.sourceType = sourceType;
  if (status) filters.status = status;

  const { data, isLoading } = useLedgerEntries(orgId, page, 20, filters);

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Ledger</h1>
      <p className="text-muted-foreground mb-6">
        All journal entries in the accounting ledger
      </p>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="donation">Donation</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="settlement">Settlement</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="opening_balance">Opening Balance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No ledger entries found.</p>
          </CardContent>
        </Card>
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((entry: LedgerEntry) => (
            <Link key={entry._id} href={`/ledger/${entry._id}`}>
              <Card className="hover:shadow-md transition-shadow mb-3">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {entry.entryNumber}
                        </span>
                        <Badge
                          className={`${STATUS_COLORS[entry.status]} text-white text-xs`}
                        >
                          {entry.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {SOURCE_TYPE_LABELS[entry.sourceType] || entry.sourceType}
                        </Badge>
                      </div>
                      <p className="font-medium mt-1">{entry.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("en-IN")}
                      </p>
                      <p className="font-medium">
                        ₹{parseFloat(String(entry.totalAmount)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Journal Lines */}
                  <div className="mt-3 border-t pt-2">
                    {entry.lines?.map((line, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {line.account?.code}
                          </span>
                          <span>{line.account?.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={
                              line.type === "debit"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }
                          >
                            {line.type === "debit"
                              ? `₹${parseFloat(String(line.amount)).toLocaleString("en-IN")}`
                              : ""}
                          </span>
                          <span
                            className={
                              line.type === "credit"
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }
                          >
                            {line.type === "credit"
                              ? `₹${parseFloat(String(line.amount)).toLocaleString("en-IN")}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
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
            Page {page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(data.meta.totalPages, p + 1))
            }
            disabled={page === data.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
