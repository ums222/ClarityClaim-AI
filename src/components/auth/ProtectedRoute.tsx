import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'admin' | 'manager' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-neutral-950" : "bg-neutral-50"
      )}>
        <div className="text-center">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin mx-auto mb-4",
            isDark ? "text-teal-400" : "text-teal-600"
          )} />
          <p className={cn(
            "text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && profile) {
    const roleHierarchy: Record<string, number> = {
      super_admin: 5,
      owner: 4,
      admin: 3,
      executive: 3,
      manager: 2,
      billing_specialist: 1,
      user: 1,
      viewer: 0,
    };

    const userRoleLevel = roleHierarchy[profile.role] ?? 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/app" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
