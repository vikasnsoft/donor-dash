import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Users,
  CalendarDays,
  BarChart3,
  Receipt,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event Management",
    description:
      "Organise Ganpati Utsav, Shiv Jayanti, and community events with full financial tracking.",
  },
  {
    icon: CreditCard,
    title: "Donation Tracking",
    description:
      "Record donations with receipts, multiple payment methods, and volunteer collection tracking.",
  },
  {
    icon: Users,
    title: "Donor Management",
    description:
      "Manage donors, families, and corporate sponsors with lifetime giving history.",
  },
  {
    icon: Receipt,
    title: "Shared Expenses",
    description:
      "Split bills among committee members with flexible splits and automatic settlements.",
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    description:
      "Trial balance, cash book, income statements, and event-wise financial summaries.",
  },
  {
    icon: Shield,
    title: "Double-Entry Accounting",
    description:
      "Professional-grade ledger with balanced journal entries and audit trail.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Community Finance
          <br />
          <span className="text-orange-500">Made Simple</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          DonorDash is the all-in-one platform for managing events, donations,
          collections, and shared expenses for community organisations like
          Ganpati Mandals, NGOs, and trusts.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to manage your community finances?
        </h2>
        <p className="text-muted-foreground mb-8">
          Free for small organisations. No credit card required.
        </p>
        <Button asChild size="lg">
          <Link href="/register">Create Your Account</Link>
        </Button>
      </section>
    </div>
  );
}
