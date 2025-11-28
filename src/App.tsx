import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./hooks/useAuth";

// Main pages
import PricingPage from "./pages/PricingPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";

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
import ResourcesPage from "./pages/ResourcesPage";
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

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";

// Error pages
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
        {/* Main routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
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
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/webinars" element={<WebinarsPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/status" element={<StatusPage />} />
        
        {/* Legal routes */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/hipaa" element={<HipaaPage />} />
        <Route path="/hipaa-notice" element={<HipaaPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/cookie-policy" element={<CookiesPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* 404 - catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
