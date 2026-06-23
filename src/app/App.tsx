import React from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppProvider } from "../store";
import { AppRoutes } from "../routes";

/**
 * App component wraps the application with context stores, routing layers, and toaster setups.
 */
export function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          {/* Global Toast Alerts */}
          <Toaster position="top-right" richColors />
          
          {/* Main Route Configurations */}
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
