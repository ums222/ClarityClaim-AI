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
import ClaimsPage from "./pages/app/ClaimsPage";
import ClaimDetailPage from "./pages/app/ClaimDetailPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import AppealsPage from "./pages/app/AppealsPage";
import AppealDetailPage from "./pages/app/AppealDetailPage";
import AppealTemplatesPage from "./pages/app/AppealTemplatesPage";
import SettingsPage from "./pages/app/SettingsPage";
import AppIntegrationsPage from "./pages/app/IntegrationsPage";
import BillingPage from "./pages/app/BillingPage";
import AppSecurityPage from "./pages/app/SecurityPage";
import AppHelpPage from "./pages/app/HelpPage";

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

// Check if we're on the app subdomain (app.apclaims.net or Railway URL)
const isAppSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname.startsWith('app.') || 
         hostname.includes('railway.app') ||
         import.meta.env.VITE_IS_APP === 'true';
};

// Home page component - shows login on app subdomain, landing page on www
const HomePage = () => {
  if (isAppSubdomain()) {
    return <Navigate to="/login" replace />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Home - redirects to login on app subdomain, shows landing on www */}
          <Route path="/" element={<HomePage />} />
          
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
                <ClaimsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/claims/:id"
            element={
              <ProtectedRoute>
                <ClaimDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/appeals"
            element={
              <ProtectedRoute>
                <AppealsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/appeals/:id"
            element={
              <ProtectedRoute>
                <AppealDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/appeals/:id/edit"
            element={
              <ProtectedRoute>
                <AppealDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/appeals/templates"
            element={
              <ProtectedRoute>
                <AppealTemplatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/integrations"
            element={
              <ProtectedRoute>
                <AppIntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/security"
            element={
              <ProtectedRoute>
                <AppSecurityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/help"
            element={
              <ProtectedRoute>
                <AppHelpPage />
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

export default App;
