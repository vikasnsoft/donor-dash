import { DashboardLayout } from "@/layouts/dashboardLayout";
import { AuthProtection } from "../../../components/auth-protection";
import type { Role } from "@/hooks/useAuth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

/**
 * Layout component for protected routes
 * Uses a server component (DashboardLayout) with a client component wrapper (AuthProtection)
 * for auth checking and role-based access control
 */
export default function ProtectedLayout({
  children,
  requiredRoles = [],
}: ProtectedLayoutProps) {
  return (
    <AuthProtection requiredRoles={requiredRoles}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProtection>
  );
}
