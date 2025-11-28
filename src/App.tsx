import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Full page loading fallback
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-3 border-slate-700 border-t-clarity-secondary" />
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes - lazy load them too */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
