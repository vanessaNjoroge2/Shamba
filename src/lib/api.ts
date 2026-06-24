// src/lib/api.ts
// Thin transport layer over Hibaq's FastAPI backend.
// Base URL is fixed for the hackathon demo - do not change.
const BASE_URL = "http://127.0.0.1:8000";

/**
 * Error thrown by the API helpers. `status` is the HTTP status code when the
 * server responded, or `undefined` when the request never reached the server
 * (network error / backend down) - callers use that distinction to decide
 * between "wrong credentials" and "fall back to offline mode".
 */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/** POST /api/auth/signup - JSON body { name, email, password }. */
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<TokenResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    throw new ApiError("Could not reach the server."); // no status → backend down
  }
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(detail ?? "Sign up failed", response.status);
  }
  return response.json();
}

/**
 * POST /api/auth/login - the backend uses OAuth2PasswordRequestForm, so this
 * must be sent as form-url-encoded with the email placed in the `username`
 * field (per Hibaq's note in auth_routes.py).
 */
export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    throw new ApiError("Could not reach the server."); // no status → backend down
  }
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(detail ?? "Incorrect email or password", response.status);
  }
  return response.json();
}

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
}

/** PUT /api/auth/me - update name + email. Requires a Bearer token. */
export async function updateProfile(
  token: string,
  name: string,
  email: string
): Promise<ProfileResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
  } catch {
    throw new ApiError("Could not reach the server.");
  }
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(detail ?? "Could not update profile", response.status);
  }
  return response.json();
}

/** POST /api/auth/change-password. Requires a Bearer token. */
export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  } catch {
    throw new ApiError("Could not reach the server.");
  }
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(detail ?? "Could not change password", response.status);
  }
}

// ── Farm assessment ───────────────────────────────────────────────────────────

/** Matches backend `schemas.FarmInput` exactly. */
export interface FarmAssessmentRequest {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  crop_type: string;
  irrigation_level: string; // low | medium | high
  soil_moisture: string; // dry | moderate | wet
  farm_size_acres: number;
  water_usage_litres: number;
}

export interface FarmAssessmentResponse {
  health_status: string;
  carbon_estimate: number;
  carbon_grade: string;
  recommendations: string;
  timestamp: string;
}

export interface FarmHistoryItem {
  crop_type: string;
  farm_size_acres: number;
  irrigation_level: string;
  soil_moisture: string;
  health_status: string;
  carbon_estimate: number;
  carbon_grade: string;
  recommendations: string;
  timestamp: string;
}

/** POST /api/assess-farm - requires a Bearer token. */
export async function assessFarm(
  data: FarmAssessmentRequest,
  token: string
): Promise<FarmAssessmentResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/assess-farm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError("Could not reach the server.");
  }
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(detail ?? `API error: ${response.status}`, response.status);
  }
  return response.json();
}

/** GET /api/farm-history - requires a Bearer token. */
export async function getFarmHistory(token: string): Promise<FarmHistoryItem[]> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/farm-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError("Could not reach the server.");
  }
  if (!response.ok) {
    throw new ApiError("Failed to fetch history", response.status);
  }
  return response.json();
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Pulls FastAPI's `{ detail }` error message out of a failed response. */
async function readDetail(response: Response): Promise<string | null> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    /* ignore non-JSON bodies */
  }
  return null;
}
