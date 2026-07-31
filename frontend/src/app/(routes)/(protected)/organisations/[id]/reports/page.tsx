"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Scale,
  CreditCard,
  Download,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const reportCards = [
  {
    title: "Income Statement",
    description: "Income vs expenses with surplus/deficit for a period",
    icon: BarChart3,
    href: "income-statement",
  },
  {
    title: "Cash Book",
    description: "Daily cash in/out with running balance",
    icon: BookOpen,
    href: "cash-book",
  },
  {
    title: "Trial Balance",
    description: "All accounts with debits and credits",
    icon: Scale,
    href: "trial-balance",
  },
  {
    title: "Donation Report",
    description: "Donations by method, status, and daily breakdown",
    icon: CreditCard,
    href: "donations",
  },
];

export default function ReportsPage() {
  const params = useParams();
  const orgId = params.id as string;

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/organisations/${orgId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organisation
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">
            Reports generated from the accounting ledger
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/organisations/${orgId}/ledger`}>
            <BookOpen className="mr-2 h-4 w-4" />
            View Ledger
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportCards.map((report) => (
          <Link
            key={report.href}
            href={`/organisations/${orgId}/reports/${report.href}`}
          >
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <report.icon className="h-6 w-6 text-orange-500" />
                  <CardTitle className="text-base">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Export Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild variant="outline" size="sm">
              <a href={`/api/v1/organisations/${orgId}/data/export/donors`}>
                Export Donors (CSV)
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`/api/v1/organisations/${orgId}/data/export/donations`}>
                Export Donations (CSV)
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`/api/v1/organisations/${orgId}/data/export/ledger`}>
                Export Ledger (CSV)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
