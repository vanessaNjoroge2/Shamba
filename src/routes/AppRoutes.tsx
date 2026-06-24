import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppShell } from "../components/layout";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  OtpPage,
  OnboardingPage,
  AnalysisPage,
  DashboardPage,
  SavePage,
  ProgressPage,
  ErrorPage,
} from "../pages";

/**
 * AppRoutes defines the routing hierarchy of the Shamba application.
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/otp" element={<OtpPage />} />

      {/* Protected Pages - Wrapped with AppShell and Auth Guard */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <AppShell>
              <OnboardingPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <AppShell>
              <AnalysisPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/save"
        element={
          <ProtectedRoute>
            <AppShell>
              <SavePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProgressPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/error"
        element={
          <ProtectedRoute>
            <AppShell>
              <ErrorPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
