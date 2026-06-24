import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { AppContextState, FarmInfo, User, Step, HealthStatus } from "../types";
import {
  signup as apiSignup,
  login as apiLogin,
  assessFarm,
  ApiError,
  FarmAssessmentRequest,
} from "../lib/api";
import { Globe, MapPin, Zap, BarChart2, TrendingUp } from "lucide-react";

/**
 * Definition of the 5 onboarding and progress steps.
 */
export const STEPS: Step[] = [
  { id: 1, label: "Visit Website", shortLabel: "Visit", Icon: Globe, path: "/" },
  { id: 2, label: "Enter Farm Info", shortLabel: "Farm Info", Icon: MapPin, path: "/onboarding" },
  { id: 3, label: "AI Analysis", shortLabel: "Analysis", Icon: Zap, path: "/analysis" },
  { id: 4, label: "View Dashboard", shortLabel: "Dashboard", Icon: BarChart2, path: "/dashboard" },
  { id: 5, label: "Track Progress", shortLabel: "Progress", Icon: TrendingUp, path: "/progress" },
];

/**
 * Per-region climate + soil defaults used to fill in the model features the
 * onboarding form doesn't ask the farmer for (temperature, humidity, ph,
 * rainfall, and fallback N/P/K). Keeps the UX simple while still giving the
 * backend model the 10 features it needs.
 */
interface RegionDefaults {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  n: number;
  p: number;
  k: number;
}

const REGION_DEFAULTS: Record<string, RegionDefaults> = {
  nairobi: { temperature: 19, humidity: 65, ph: 6.2, rainfall: 900, n: 45, p: 20, k: 120 },
  central: { temperature: 20, humidity: 70, ph: 6.0, rainfall: 1200, n: 65, p: 35, k: 180 },
  rift: { temperature: 18, humidity: 60, ph: 6.5, rainfall: 1000, n: 70, p: 40, k: 200 },
  western: { temperature: 22, humidity: 75, ph: 5.8, rainfall: 1500, n: 55, p: 30, k: 150 },
  coast: { temperature: 27, humidity: 80, ph: 6.8, rainfall: 1100, n: 30, p: 15, k: 90 },
  eastern: { temperature: 24, humidity: 55, ph: 6.3, rainfall: 700, n: 35, p: 18, k: 100 },
};

// Form irrigation choice → backend irrigation_level (low | medium | high)
const IRRIGATION_LEVEL: Record<string, "low" | "medium" | "high"> = {
  rainfall: "low",
  drip: "medium",
  furrow: "high",
  sprinkler: "high",
};

// Rough litres-per-acre per irrigation method, used to estimate water usage.
const WATER_PER_ACRE: Record<string, number> = {
  rainfall: 0,
  drip: 2000,
  furrow: 8000,
  sprinkler: 5000,
};

// Region health → backend soil_moisture (dry | moderate | wet)
const SOIL_MOISTURE: Record<HealthStatus, "dry" | "moderate" | "wet"> = {
  dry: "dry",
  moderate: "moderate",
  healthy: "wet",
};

/**
 * Translates the farmer-friendly onboarding FarmInfo into the exact payload the
 * backend model expects (schemas.FarmInput).
 */
function buildAssessmentRequest(info: FarmInfo): FarmAssessmentRequest {
  const region = REGION_DEFAULTS[info.region] ?? REGION_DEFAULTS.central;
  const soil = info.soilData ?? { n: region.n, p: region.p, k: region.k };

  const sizeNumber = parseFloat(info.farmSize) || 1;
  const acres = info.sizeUnit === "hectares" ? sizeNumber * 2.471 : sizeNumber;

  const irrigation = info.irrigation || "rainfall";

  return {
    N: soil.n,
    P: soil.p,
    K: soil.k,
    temperature: region.temperature,
    humidity: region.humidity,
    ph: region.ph,
    rainfall: region.rainfall,
    crop_type: info.cropType,
    irrigation_level: IRRIGATION_LEVEL[irrigation] ?? "low",
    soil_moisture: SOIL_MOISTURE[info.healthStatus ?? "moderate"],
    farm_size_acres: Number(acres.toFixed(2)),
    water_usage_litres: Math.round((WATER_PER_ACRE[irrigation] ?? 0) * acres),
  };
}

/**
 * Mirrors the backend's carbon formula (ai_logic.estimate_carbon /
 * get_carbon_grade) so the offline fallback shows numbers on the SAME scale and
 * grading as a real assessment. Carbon here is an emissions footprint in kg
 * CO2, where lower is better.
 */
function estimateCarbonLocally(payload: FarmAssessmentRequest): {
  carbon: number;
  grade: string;
} {
  const carbon = Number(
    (payload.water_usage_litres * 0.0003 + payload.farm_size_acres * 0.5).toFixed(2)
  );
  const grade = carbon < 1.5 ? "A" : carbon < 3.0 ? "B" : "C";
  return { carbon, grade };
}

/** Plain-language fallback recommendations when the backend LLM isn't reached. */
function localRecommendations(info: FarmInfo, health: HealthStatus, carbon: number): string {
  return [
    `1. Check the soil moisture on your ${info.cropType} farm every week.`,
    `2. Your farm looks ${health} right now, so adjust watering to match.`,
    `3. Estimated carbon footprint is ${carbon} kg CO2; reducing water use will lower it.`,
  ].join("\n");
}

/**
 * Structure of the AppContext interface, containing states and action dispatchers.
 */
export interface AppContextType extends AppContextState {
  signupUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => void;
  verifyOtp: (otp: string) => boolean;
  resendOtp: () => void;
  logout: () => void;
  saveFarmInfo: (info: FarmInfo) => void;
  runAssessment: (info: FarmInfo) => Promise<boolean>;
  completeStep: (stepId: number) => void;
  setCurrentStepId: (stepId: number) => void;
  setSaved: (saved: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider component to wrap the React subtree and provide global states.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("shamba_isAuthenticated") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("shamba_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("shamba_authToken") || null;
  });

  const [mockOtp, setMockOtp] = useState<string | null>(() => {
    return localStorage.getItem("shamba_mockOtp") || null;
  });

  const [currentStepId, setCurrentStepIdState] = useState<number>(() => {
    return Number(localStorage.getItem("shamba_currentStepId")) || 1;
  });

  const [completedStepIds, setCompletedStepIds] = useState<number[]>(() => {
    const stored = localStorage.getItem("shamba_completedStepIds");
    return stored ? JSON.parse(stored) : [1]; // Step 1 (Visit Website) is complete by default
  });

  const [farmInfo, setFarmInfo] = useState<FarmInfo | null>(() => {
    const stored = localStorage.getItem("shamba_farmInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const [saved, setSavedState] = useState<boolean>(() => {
    return localStorage.getItem("shamba_saved") === "true";
  });

  const [assessmentLoading, setAssessmentLoading] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("shamba_isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("shamba_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shamba_user");
    }
  }, [user]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("shamba_authToken", authToken);
    } else {
      localStorage.removeItem("shamba_authToken");
    }
  }, [authToken]);

  useEffect(() => {
    if (mockOtp) {
      localStorage.setItem("shamba_mockOtp", mockOtp);
    } else {
      localStorage.removeItem("shamba_mockOtp");
    }
  }, [mockOtp]);

  useEffect(() => {
    localStorage.setItem("shamba_currentStepId", String(currentStepId));
  }, [currentStepId]);

  useEffect(() => {
    localStorage.setItem("shamba_completedStepIds", JSON.stringify(completedStepIds));
  }, [completedStepIds]);

  useEffect(() => {
    if (farmInfo) {
      localStorage.setItem("shamba_farmInfo", JSON.stringify(farmInfo));
    } else {
      localStorage.removeItem("shamba_farmInfo");
    }
  }, [farmInfo]);

  useEffect(() => {
    localStorage.setItem("shamba_saved", String(saved));
  }, [saved]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   * Creates an account against the backend. If the backend is unreachable we
   * fall back to a local "demo" account so the hackathon flow never blocks.
   * Returns false only when the server actively rejects the request (e.g. the
   * email is already registered or the input is invalid).
   */
  const signupUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { access_token } = await apiSignup(name, email, password);
      setAuthToken(access_token);
      setUser({ name, email });
      // Signup logs the farmer straight in - no separate login step needed.
      setIsAuthenticated(true);
      completeStep(1);
      return true;
    } catch (err) {
      const status = err instanceof ApiError ? err.status : undefined;
      if (status !== undefined) {
        // Server responded with an error (e.g. 400 email already registered)
        toast.error(err instanceof Error ? err.message : "Sign up failed");
        return false;
      }
      // No status → backend is down. Allow a local demo account so the demo runs.
      setUser({ name, email });
      setAuthToken(null);
      setIsAuthenticated(true);
      completeStep(1);
      toast.message("Offline mode - created a demo account locally.");
      return true;
    }
  };

  /**
   * Logs in against the backend. Falls back to a local demo session when the
   * backend is unreachable. Returns false for genuine bad credentials.
   */
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { access_token } = await apiLogin(email, password);
      setAuthToken(access_token);
      setUser({ email });
      setIsAuthenticated(true);
      completeStep(1);
      return true;
    } catch (err) {
      const status = err instanceof ApiError ? err.status : undefined;
      if (status === 401 || status === 400) {
        return false; // wrong email/password - surfaced inline by the caller
      }
      // Backend unreachable (or 5xx): accept a valid-looking demo login.
      if (!isValidEmail(email) || password.length < 6) return false;
      setUser({ email });
      setAuthToken(null);
      setIsAuthenticated(true);
      completeStep(1);
      toast.message("Offline mode - signed in with a demo session.");
      return true;
    }
  };

  /**
   * Forgot-password flow: generates a mock 6-digit OTP and "sends" it via toast.
   */
  const requestPasswordReset = (email: string) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setUser((prev) => ({ ...(prev ?? {}), email }));

    toast.success(`Reset code sent to ${email}. (Code: ${generatedOtp})`, {
      duration: 10000,
    });
  };

  /**
   * Resends the existing or generates a new mock OTP for the reset flow.
   */
  const resendOtp = () => {
    if (!user) return;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);

    toast.success(`New reset code sent to ${user.email}. (Code: ${generatedOtp})`, {
      duration: 10000,
    });
  };

  /**
   * Verifies the OTP entered by the user during the password-reset flow.
   * Does NOT log the user in - they confirm and then sign in normally.
   */
  const verifyOtp = (otp: string): boolean => {
    return otp === mockOtp;
  };

  /**
   * Logs out the user and clears state.
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthToken(null);
    setMockOtp(null);
    setFarmInfo(null);
    setSavedState(false);
    setCompletedStepIds([1]);
    setCurrentStepIdState(1);
    setAssessmentError(null);

    localStorage.removeItem("shamba_isAuthenticated");
    localStorage.removeItem("shamba_user");
    localStorage.removeItem("shamba_authToken");
    localStorage.removeItem("shamba_mockOtp");
    localStorage.removeItem("shamba_farmInfo");
    localStorage.removeItem("shamba_saved");
    localStorage.removeItem("shamba_completedStepIds");
    localStorage.removeItem("shamba_currentStepId");

    toast.info("Logged out successfully.");
  };

  /**
   * Saves the onboarding farm info inputs (local fallback data).
   */
  const saveFarmInfo = (info: FarmInfo) => {
    setFarmInfo(info);
    completeStep(2);
  };

  /**
   * Runs the real AI assessment against the backend and merges the result into
   * farmInfo. Persists the form inputs first so the dashboard always has data
   * even if the API call fails. Returns true when real backend data was applied.
   */
  const runAssessment = async (info: FarmInfo): Promise<boolean> => {
    setFarmInfo(info); // keep local fallback values regardless of API outcome
    completeStep(2);
    setAssessmentError(null);

    const payload = buildAssessmentRequest(info);

    // Offline estimate used when there's no real session or the API call fails.
    // Computed with the backend's own formula so the numbers are on one scale.
    const applyLocalEstimate = () => {
      const health = info.healthStatus ?? "moderate";
      const { carbon, grade } = estimateCarbonLocally(payload);
      setFarmInfo((prev) => ({
        ...(prev ?? info),
        health_status: health,
        carbon_estimate: carbon,
        carbon_grade: grade,
        recommendations: localRecommendations(info, health, carbon),
        assessment_timestamp: new Date().toISOString(),
        healthStatus: health,
      }));
    };

    // Without a real JWT the protected endpoint will only 401, so skip the call
    // and show consistent locally-estimated figures instead.
    if (!authToken) {
      applyLocalEstimate();
      return false;
    }

    setAssessmentLoading(true);
    try {
      const result = await assessFarm(payload, authToken);
      setFarmInfo((prev) => ({
        ...(prev ?? info),
        health_status: result.health_status,
        carbon_estimate: result.carbon_estimate,
        carbon_grade: result.carbon_grade,
        recommendations: result.recommendations,
        assessment_timestamp: result.timestamp,
        // keep the local fallback fields in sync with the real result
        healthStatus: (["healthy", "moderate", "dry"].includes(result.health_status)
          ? (result.health_status as HealthStatus)
          : prev?.healthStatus),
      }));
      toast.success("Farm analysis complete!");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not analyse your farm.";
      setAssessmentError(message);
      toast.error(`${message} Showing best estimates for your region.`);
      applyLocalEstimate();
      return false;
    } finally {
      setAssessmentLoading(false);
    }
  };

  /**
   * Appends a step ID to the completed steps array if not already present.
   */
  const completeStep = (stepId: number) => {
    setCompletedStepIds((prev) => {
      if (prev.includes(stepId)) return prev;
      return [...prev, stepId];
    });
  };

  /**
   * Set current active step ID.
   */
  const setCurrentStepId = (stepId: number) => {
    setCurrentStepIdState(stepId);
  };

  /**
   * Set saved status (enables trend charts).
   */
  const setSaved = (isSaved: boolean) => {
    setSavedState(isSaved);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        authToken,
        mockOtp,
        currentStepId,
        completedStepIds,
        farmInfo,
        saved,
        assessmentLoading,
        assessmentError,
        signupUser,
        loginUser,
        requestPasswordReset,
        verifyOtp,
        resendOtp,
        logout,
        saveFarmInfo,
        runAssessment,
        completeStep,
        setCurrentStepId,
        setSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to consume the AppContext states and dispatch actions.
 */
export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
};
