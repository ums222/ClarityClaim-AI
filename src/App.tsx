import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load the landing page for better code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-clarity-secondary border-t-transparent" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
