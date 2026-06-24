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
 * User identity collected during authentication.
 * Email/password is the primary login; phone is optional (used by Save Farm).
 */
export interface User {
  email: string;
  name?: string;
  phone?: string;
}

export interface SoilData {
  n: number;
  p: number;
  k: number;
}

/**
 * Information entered by the farmer about their crops and setup.
 */
export interface FarmInfo {
  cropType: string;
  farmSize: string;
  sizeUnit: string;
  irrigation: string;
  region: string;
  soilData?: SoilData;
  // Local region-derived fallback values (used when the backend is unreachable)
  carbonValue?: number;
  carbonGrade?: string;
  healthStatus?: HealthStatus;
  // Real values returned by the backend /api/assess-farm endpoint
  health_status?: string;
  carbon_estimate?: number;
  carbon_grade?: string;
  recommendations?: string;
  assessment_timestamp?: string;
}

/**
 * A snapshot of a farm report the user downloaded/saved, kept as history.
 */
export interface SavedReport {
  id: string;
  timestamp: string;
  region: string;
  cropType: string;
  farmSize: string;
  sizeUnit: string;
  healthStatus: string;
  carbonEstimate: number;
  carbonGrade: string;
}

/**
 * Global App Context state structure.
 */
export interface AppContextState {
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null; // JWT from the backend (null when running in mock/offline mode)
  mockOtp: string | null;
  currentStepId: number;
  completedStepIds: number[];
  farmInfo: FarmInfo | null;
  saved: boolean; // Indicates if the user saved their farm report, unlocking trend charts
  savedReports: SavedReport[]; // history of downloaded/saved reports
  assessmentLoading: boolean;
  assessmentError: string | null;
}
