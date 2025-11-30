import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import ErrorBoundary from "./components/shared/ErrorBoundary";

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

// Error pages
import NotFoundPage from "./pages/NotFoundPage";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// App pages
import AppLayout from "./components/app/AppLayout";
import DashboardPage from "./pages/app/DashboardPage";
import AppealsStudioPage from "./pages/app/AppealsStudioPage";
import SettingsPage from "./pages/app/SettingsPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import PatientsPage from "./pages/app/PatientsPage";

// Toast wrapper component
const ToasterWrapper = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme as "light" | "dark"}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* App routes (authenticated) */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="appeals" element={<AppealsStudioPage />} />
            <Route path="appeals/:id" element={<AppealsStudioPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
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
          
          {/* 404 catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToasterWrapper />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
