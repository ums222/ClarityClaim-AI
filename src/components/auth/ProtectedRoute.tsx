import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that handles authentication-based routing
 * 
 * @param children - The component(s) to render if access is granted
 * @param requireAuth - If true, requires user to be authenticated (default: true)
 * @param redirectTo - Where to redirect if access is denied (default: "/login")
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // In demo mode (Supabase not configured), allow access to all routes
  if (!isConfigured) {
    return <>{children}</>;
  }

  // If auth is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If auth is NOT required (like login page) and user IS logged in, redirect to app
  if (!requireAuth && user) {
    const from = location.state?.from?.pathname || "/app";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

/**
 * PublicOnlyRoute - For pages that should only be accessible when NOT logged in
 * (login, signup, forgot-password)
 */
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/app">
      {children}
    </ProtectedRoute>
  );
}
