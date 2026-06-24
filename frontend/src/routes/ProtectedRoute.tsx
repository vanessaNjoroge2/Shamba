import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * ProtectedRoute component redirects unauthenticated users back to the login screen.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
