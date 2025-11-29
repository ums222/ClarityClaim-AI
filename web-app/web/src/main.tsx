import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./modules/app/AppLayout";
import DashboardPage from "./modules/app/pages/DashboardPage";
import ClaimsPage from "./modules/app/pages/ClaimsPage";
import ClaimDetailPage from "./modules/app/pages/ClaimDetailPage";
import EquityPage from "./modules/app/pages/EquityPage";
import AuthProvider from "./modules/auth/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="claims" element={<ClaimsPage />} />
              <Route path="claims/:id" element={<ClaimDetailPage />} />
              <Route path="equity" element={<EquityPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
