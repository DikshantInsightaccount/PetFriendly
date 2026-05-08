import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import App from "./App";

// ✅ ✅ ADD THIS IMPORT
import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ FIX HERE */}
        <div className="app-bg">
          <App />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);