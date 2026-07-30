import { ReactNode } from "react";
import { useAuth, Role } from "@/providers/auth-provider";

interface RoleBasedComponentProps {
  requiredRoles?: Role[];
  allowedRoles?: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on the user's role
 */
export function RoleBasedComponent({
  requiredRoles = [],
  allowedRoles = [],
  children,
  fallback = null,
}: RoleBasedComponentProps) {
  const { user, checkPermission } = useAuth();
  
  const hasPermission = () => {
    if (requiredRoles.length === 0 && allowedRoles.length === 0) {
      return true;
    }
    if (!user) return false;
    if (user.isAdmin) return true;
    if (allowedRoles.length > 0 && allowedRoles.includes(user.role)) {
      return true;
    }
    if (requiredRoles.length > 0 && !checkPermission(requiredRoles)) {
      return false;
    }
    if (requiredRoles.length > 0 && allowedRoles.length === 0) {
      return true;
    }
    return false;
  };
  
  if (!hasPermission()) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Higher-order component that wraps a component with role-based access control
 */
export function withRoleCheck<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: Role[],
  FallbackComponent: React.ComponentType<P> | null = null
) {
  const WrappedComponent = (props: P) => {
    const { user, checkPermission } = useAuth();
    
    if (!user || !checkPermission(requiredRoles)) {
      return FallbackComponent ? <FallbackComponent {...props} /> : null;
    }
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withRoleCheck(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}
