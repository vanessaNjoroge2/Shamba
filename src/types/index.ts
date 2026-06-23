import React from "react";

/**
 * Represents the health status of a farm based on AI analysis.
 */
export type HealthStatus = "healthy" | "moderate" | "dry";

/**
 * Represents a single step in the multi-step navigation process.
 */
export interface Step {
  id: number;
  label: string;
  shortLabel: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  path: string;
}

/**
 * User credentials collected during authentication.
 */
export interface User {
  phone: string;
  email: string;
}

/**
 * Information entered by the farmer about their crops and setup.
 */
export interface FarmInfo {
  cropType: string;
  farmSize: string;
  sizeUnit: string;
  irrigation: string;
}

/**
 * Global App Context state structure.
 */
export interface AppContextState {
  isAuthenticated: boolean;
  user: User | null;
  mockOtp: string | null;
  currentStepId: number;
  completedStepIds: number[];
  farmInfo: FarmInfo | null;
  saved: boolean; // Indicates if the user saved their farm report, unlocking trend charts
}
