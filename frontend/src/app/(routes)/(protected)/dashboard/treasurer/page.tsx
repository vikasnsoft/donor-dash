"use client";

import { useState } from "react";
import { useOrganisations } from "@/hooks/useOrganisations";
import {
  useFinancialSummary,
  useEventOverviews,
} from "@/hooks/useDashboard";
import {
  MetricCard,
  ChartCard,
  TableCard,
  DashboardSection,
} from "@/components/dashboard/primitives";
import { ExpenseBreakdownChart } from "@/components/dashboard/charts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IndianRupee,
  Wallet,
  Building2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

export default function TreasurerDashboard() {
  const { data: orgs } = useOrganisations();
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  const orgId = selectedOrg || orgs?.data?.[0]?._id || "";

  const { data: financial, isLoading: loadingFinancial } =
    useFinancialSummary(orgId);
  const { data: events } = useEventOverviews(orgId);

  const surplus =
    (financial?.totalDonations || 0) - (financial?.totalExpenses || 0);
  const expensesByCategory = (financial as unknown as Record<string, Record<string, number>>)?.expensesByCategory || {};

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treasurer Dashboard</h1>
          <p className="text-muted-foreground">
            Financial position and cash management
          </p>
        </div>
        {orgs && orgs.data.length > 1 && (
          <Select value={orgId} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select organisation" />
            </SelectTrigger>
            <SelectContent>
              {orgs.data.map((org) => (
                <SelectItem key={org._id} value={org._id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!orgId && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Select an organisation to view financial details.
            </p>
          </CardContent>
        </Card>
      )}

      {orgId && (
        <>
          {/* Financial Position */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Cash Position"
              value={`₹${(financial?.cashBalance || 0).toLocaleString(
                "en-IN"
              )}`}
              icon={<Wallet className="h-4 w-4" />}
              loading={loadingFinancial}
            />
            <MetricCard
              title="Bank Position"
              value={`₹${(financial?.bankBalance || 0).toLocaleString(
                "en-IN"
              )}`}
              icon={<Building2 className="h-4 w-4" />}
              loading={loadingFinancial}
            />
            <MetricCard
              title="Total Income"
              value={`₹${(
                financial?.totalDonations || 0
              ).toLocaleString("en-IN")}`}
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 0, label: "this period" }}
              loading={loadingFinancial}
            />
            <MetricCard
              title="Surplus / Deficit"
              value={`₹${surplus.toLocaleString("en-IN")}`}
              icon={
                surplus >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )
              }
              loading={loadingFinancial}
            />
          </div>

          {/* Expense Breakdown */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <ChartCard title="Expense Breakdown" subtitle="By category">
              <ExpenseBreakdownChart
                data={expensesByCategory}
              />
            </ChartCard>

            <TableCard title="Recent Ledger Activity">
              <div className="space-y-2">
                {events?.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-green-600">
                          +₹
                          {parseFloat(
                            String(event.totalDonations)
                          ).toLocaleString("en-IN")}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-red-600">
                          -₹
                          {parseFloat(
                            String(event.totalExpenses)
                          ).toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
                {(!events || events.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No events yet
                  </p>
                )}
              </div>
            </TableCard>
          </div>

          {/* Quick Actions */}
          <DashboardSection title="Quick Actions">
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href={`/organisations/${orgId}/ledger`}>
                  View Ledger
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/organisations/${orgId}/reports/income-statement`}>
                  Income Statement
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/organisations/${orgId}/reports/cash-book`}>
                  Cash Book
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/organisations/${orgId}/data/export/ledger`}>
                  Export Ledger
                </Link>
              </Button>
            </div>
          </DashboardSection>
        </>
      )}
    </div>
  );
}
