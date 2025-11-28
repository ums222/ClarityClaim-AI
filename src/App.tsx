import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage"));

const AppFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
    Loading ClarityClaim…
  </div>
);

function App() {
  return (
    <Suspense fallback={<AppFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
