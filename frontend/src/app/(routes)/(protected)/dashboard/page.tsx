"use client";

import { useAuth } from "@/providers/auth-provider";
import OrganisationDashboard from "./organisation/page";
import TreasurerDashboard from "./treasurer/page";

export default function DashboardPage() {
  const { user } = useAuth();

  // Route to role-specific dashboard
  if (user?.role === "auditor" || user?.role === "supervisor") {
    return <TreasurerDashboard />;
  }

  // Default: Organisation dashboard for admin, volunteer, support, guest
  return <OrganisationDashboard />;
}
