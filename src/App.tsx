import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./contexts/AuthContext";
import { PageLoader } from "./components/ui/PageLoader";

// Landing page - loaded eagerly for fast initial load
import LandingPage from "./pages/LandingPage";

// Auth pages - loaded eagerly (critical path)
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// Auth pages - lazy loaded (less critical)
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

// Protected Route - loaded eagerly
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ============================================
// APP PAGES - All lazy loaded (only for authenticated users)
// ============================================
const DashboardPage = lazy(() => import("./pages/app/DashboardPage"));
const ClaimsPage = lazy(() => import("./pages/app/ClaimsPage"));
const ClaimDetailPage = lazy(() => import("./pages/app/ClaimDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/app/AnalyticsPage"));
const AppealsPage = lazy(() => import("./pages/app/AppealsPage"));
const AppealDetailPage = lazy(() => import("./pages/app/AppealDetailPage"));
const AppealTemplatesPage = lazy(() => import("./pages/app/AppealTemplatesPage"));
const SettingsPage = lazy(() => import("./pages/app/SettingsPage"));
const AppIntegrationsPage = lazy(() => import("./pages/app/IntegrationsPage"));
const BillingPage = lazy(() => import("./pages/app/BillingPage"));
const AppSecurityPage = lazy(() => import("./pages/app/SecurityPage"));
const AppHelpPage = lazy(() => import("./pages/app/HelpPage"));

// ============================================
// MARKETING PAGES - Lazy loaded (not needed on initial load)
// ============================================

// Product pages
const IntegrationsPage = lazy(() => import("./pages/IntegrationsPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const ApiDocsPage = lazy(() => import("./pages/ApiDocsPage"));

// Company pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const PressPage = lazy(() => import("./pages/PressPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));

// Resource pages
const BlogPage = lazy(() => import("./pages/BlogPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const WebinarsPage = lazy(() => import("./pages/WebinarsPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const StatusPage = lazy(() => import("./pages/StatusPage"));

// Legal pages
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const HipaaPage = lazy(() => import("./pages/HipaaPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));

// ============================================
// ENVIRONMENT DETECTION
// ============================================

/**
 * Determines if we're on the app subdomain
 * - app.apclaims.net → Web App (Railway)
 * - www.apclaims.net → Marketing (Vercel)
 * - *.railway.app → Web App
 * - localhost with VITE_IS_APP=true → Web App
 */
const isAppSubdomain = (): boolean => {
  const hostname = window.location.hostname;
  return (
    hostname.startsWith("app.") ||
    hostname.includes("railway.app") ||
    import.meta.env.VITE_IS_APP === "true"
  );
};

/**
 * Home page component - routes based on subdomain
 */
const HomePage = () => {
  if (isAppSubdomain()) {
    return <Navigate to="/login" replace />;
  }
  return <LandingPage />;
};

/**
 * Suspense wrapper with loading state
 */
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/**
 * Protected route with suspense
 */
const ProtectedSuspenseRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <SuspenseWrapper>{children}</SuspenseWrapper>
  </ProtectedRoute>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Home - redirects to login on app subdomain, shows landing on www */}
          <Route path="/" element={<HomePage />} />

          {/* ================================ */}
          {/* AUTH ROUTES                      */}
          {/* ================================ */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/forgot-password"
            element={
              <SuspenseWrapper>
                <ForgotPasswordPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <SuspenseWrapper>
                <ResetPasswordPage />
              </SuspenseWrapper>
            }
          />

          {/* ================================ */}
          {/* PROTECTED APP ROUTES             */}
          {/* ================================ */}
          <Route
            path="/app"
            element={
              <ProtectedSuspenseRoute>
                <DashboardPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/claims"
            element={
              <ProtectedSuspenseRoute>
                <ClaimsPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/claims/:id"
            element={
              <ProtectedSuspenseRoute>
                <ClaimDetailPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/appeals"
            element={
              <ProtectedSuspenseRoute>
                <AppealsPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/appeals/:id"
            element={
              <ProtectedSuspenseRoute>
                <AppealDetailPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/appeals/:id/edit"
            element={
              <ProtectedSuspenseRoute>
                <AppealDetailPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/appeals/templates"
            element={
              <ProtectedSuspenseRoute>
                <AppealTemplatesPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/analytics"
            element={
              <ProtectedSuspenseRoute>
                <AnalyticsPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedSuspenseRoute>
                <SettingsPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/integrations"
            element={
              <ProtectedSuspenseRoute>
                <AppIntegrationsPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/billing"
            element={
              <ProtectedSuspenseRoute>
                <BillingPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/security"
            element={
              <ProtectedSuspenseRoute>
                <AppSecurityPage />
              </ProtectedSuspenseRoute>
            }
          />
          <Route
            path="/app/help"
            element={
              <ProtectedSuspenseRoute>
                <AppHelpPage />
              </ProtectedSuspenseRoute>
            }
          />

          {/* ================================ */}
          {/* MARKETING - PRODUCT ROUTES       */}
          {/* ================================ */}
          <Route
            path="/integrations"
            element={
              <SuspenseWrapper>
                <IntegrationsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/security"
            element={
              <SuspenseWrapper>
                <SecurityPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/api-docs"
            element={
              <SuspenseWrapper>
                <ApiDocsPage />
              </SuspenseWrapper>
            }
          />

          {/* ================================ */}
          {/* MARKETING - COMPANY ROUTES       */}
          {/* ================================ */}
          <Route
            path="/about"
            element={
              <SuspenseWrapper>
                <AboutPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/careers"
            element={
              <SuspenseWrapper>
                <CareersPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/press"
            element={
              <SuspenseWrapper>
                <PressPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/partners"
            element={
              <SuspenseWrapper>
                <PartnersPage />
              </SuspenseWrapper>
            }
          />

          {/* ================================ */}
          {/* MARKETING - RESOURCE ROUTES      */}
          {/* ================================ */}
          <Route
            path="/blog"
            element={
              <SuspenseWrapper>
                <BlogPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/case-studies"
            element={
              <SuspenseWrapper>
                <CaseStudiesPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/webinars"
            element={
              <SuspenseWrapper>
                <WebinarsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/help"
            element={
              <SuspenseWrapper>
                <HelpCenterPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/status"
            element={
              <SuspenseWrapper>
                <StatusPage />
              </SuspenseWrapper>
            }
          />

          {/* ================================ */}
          {/* MARKETING - LEGAL ROUTES         */}
          {/* ================================ */}
          <Route
            path="/privacy"
            element={
              <SuspenseWrapper>
                <PrivacyPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/terms"
            element={
              <SuspenseWrapper>
                <TermsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/hipaa"
            element={
              <SuspenseWrapper>
                <HipaaPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/cookies"
            element={
              <SuspenseWrapper>
                <CookiesPage />
              </SuspenseWrapper>
            }
          />

          {/* ================================ */}
          {/* CATCH-ALL REDIRECT               */}
          {/* ================================ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
