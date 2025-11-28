import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from "./hooks/useTheme";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
