import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Create root and render app
const container = document.getElementById("root");
if (container) {
  // Remove initial loader
  const loader = container.querySelector(".initial-loader");
  if (loader) {
    loader.remove();
  }

  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
