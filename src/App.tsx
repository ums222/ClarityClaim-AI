import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./contexts/AuthContext";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// App pages (authenticated)
import DashboardPage from "./pages/app/DashboardPage";

// Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Product pages
import IntegrationsPage from "./pages/IntegrationsPage";
import SecurityPage from "./pages/SecurityPage";
import ApiDocsPage from "./pages/ApiDocsPage";

// Company pages
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import PressPage from "./pages/PressPage";
import PartnersPage from "./pages/PartnersPage";

// Resource pages
import BlogPage from "./pages/BlogPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import WebinarsPage from "./pages/WebinarsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import StatusPage from "./pages/StatusPage";

// Legal pages
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import HipaaPage from "./pages/HipaaPage";
import CookiesPage from "./pages/CookiesPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Landing/Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/claims"
            element={
              <ProtectedRoute>
                <PlaceholderAppPage title="Claims" description="Manage and track your claims" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/appeals"
            element={
              <ProtectedRoute>
                <PlaceholderAppPage title="Appeals" description="Review and manage appeals" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/analytics"
            element={
              <ProtectedRoute>
                <PlaceholderAppPage title="Analytics" description="View performance metrics and trends" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <PlaceholderAppPage title="Settings" description="Manage your account and preferences" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/help"
            element={
              <ProtectedRoute>
                <PlaceholderAppPage title="Help Center" description="Get help and support" />
              </ProtectedRoute>
            }
          />
          
          {/* Product routes */}
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          
          {/* Company routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          
          {/* Resource routes */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/webinars" element={<WebinarsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/status" element={<StatusPage />} />
          
          {/* Legal routes */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/hipaa" element={<HipaaPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Placeholder component for app pages not yet built
import { useTheme } from "./hooks/useTheme";
import { cn } from "./lib/utils";
import AppLayout from "./components/app/AppLayout";
import { Construction } from "lucide-react";

function PlaceholderAppPage({ title, description }: { title: string; description: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className={cn(
            "mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center",
            isDark ? "bg-teal-500/20" : "bg-teal-50"
          )}>
            <Construction className={cn(
              "h-8 w-8",
              isDark ? "text-teal-400" : "text-teal-600"
            )} />
          </div>
          <h1 className={cn(
            "text-2xl font-semibold mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            {title}
          </h1>
          <p className={cn(
            "text-sm max-w-md",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            {description}
          </p>
          <p className={cn(
            "text-xs mt-4",
            isDark ? "text-neutral-500" : "text-neutral-500"
          )}>
            This feature is coming soon in Phase 2-3
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
