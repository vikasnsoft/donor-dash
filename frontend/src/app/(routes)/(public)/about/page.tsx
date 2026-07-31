import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About DonorDash</h1>
        <div className="prose prose-lg">
          <p className="text-muted-foreground mb-4">
            DonorDash is a community finance platform built for organisations like
            Ganpati Utsav Mandals, Shiv Jayanti committees, NGOs, trusts, and
            event-based groups.
          </p>
          <p className="text-muted-foreground mb-4">
            We combine donor management, event-based collections, shared expenses,
            and double-entry accounting into one platform.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            To simplify financial management for community organisations so they
            can focus on what matters — serving their communities.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Event and campaign management</li>
            <li>Donor management with lifetime tracking</li>
            <li>Donation recording with receipt generation</li>
            <li>Double-entry accounting with ledger</li>
            <li>Financial reports (income statement, cash book, trial balance)</li>
            <li>Shared expense splitting with debt simplification</li>
            <li>Role-based dashboards</li>
          </ul>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
