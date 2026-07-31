"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useIncomeStatement } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function IncomeStatementPage() {
  const params = useParams();
  const orgId = params.id as string;

  const now = new Date();
  const fyStart = now.getMonth() >= 3
    ? `${now.getFullYear()}-04-01`
    : `${now.getFullYear() - 1}-04-01`;

  const [from, setFrom] = useState(fyStart);
  const [to, setTo] = useState(now.toISOString().split("T")[0]);

  const { data, isLoading } = useIncomeStatement(orgId, from, to);

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Income Statement</h1>
      <p className="text-muted-foreground mb-6">
        Income vs expenses for the selected period
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
        <div className="space-y-6">
          {/* Income */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.income.items.length > 0 ? (
                  data.income.items.map((item) => (
                    <div
                      key={item.account.code}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <span className="text-sm text-muted-foreground mr-2">
                          {item.account.code}
                        </span>
                        <span>{item.account.name}</span>
                      </div>
                      <span className="font-medium text-green-600">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No income recorded for this period
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t-2 font-bold">
                  <span>Total Income</span>
                  <span className="text-green-600">
                    ₹{data.income.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.expenses.items.length > 0 ? (
                  data.expenses.items.map((item) => (
                    <div
                      key={item.account.code}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <span className="text-sm text-muted-foreground mr-2">
                          {item.account.code}
                        </span>
                        <span>{item.account.name}</span>
                      </div>
                      <span className="font-medium text-red-600">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No expenses recorded for this period
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t-2 font-bold">
                  <span>Total Expenses</span>
                  <span className="text-red-600">
                    ₹{data.expenses.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Surplus / Deficit */}
          <Card
            className={
              data.surplus >= 0
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {data.surplus >= 0 ? "Surplus" : "Deficit"}
                </span>
                <span
                  className={`text-2xl font-bold ${
                    data.surplus >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(data.surplus).toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
