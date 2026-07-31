import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  CreditCard,
  Users,
  Receipt,
  BarChart3,
  Shield,
  FolderOpen,
  Bell,
} from "lucide-react";

const features = [
  { icon: CalendarDays, title: "Event Management", description: "Organise events with committees, campaigns, and volunteer tracking." },
  { icon: CreditCard, title: "Donation Recording", description: "Record donations with receipts, multiple payment methods, and auto-posting to ledger." },
  { icon: Users, title: "Donor Management", description: "Manage donors with families, lifetime tracking, and duplicate detection." },
  { icon: Receipt, title: "Shared Expenses", description: "Split bills with flexible splits, debt simplification, and settlements." },
  { icon: BarChart3, title: "Financial Reports", description: "Income statement, cash book, trial balance, and event summaries." },
  { icon: Shield, title: "Double-Entry Accounting", description: "Professional ledger with balanced journal entries and audit trail." },
  { icon: FolderOpen, title: "Campaign Tracking", description: "Track collection campaigns with volunteer routes and progress." },
  { icon: Bell, title: "Notifications", description: "Real-time notifications for donations, settlements, and group activity." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Everything you need to manage community finances — from donations to accounting.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto text-left">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
