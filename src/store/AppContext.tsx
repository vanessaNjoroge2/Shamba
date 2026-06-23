import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { AppContextState, FarmInfo, User, Step } from "../types";
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
 * Structure of the AppContext interface, containing states and action dispatchers.
 */
export interface AppContextType extends AppContextState {
  loginUser: (phone: string, email: string) => void;
  verifyOtp: (otp: string) => boolean;
  resendOtp: () => void;
  logout: () => void;
  saveFarmInfo: (info: FarmInfo) => void;
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

  /**
   * Triggers generation and simulation of OTP sending to phone & email.
   */
  const loginUser = (phone: string, email: string) => {
    // Generate a mock 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setUser({ phone, email });
    
    // Simulate sending SMS/email
    toast.success(`OTP sent to +254${phone} and ${email}. (Code: ${generatedOtp})`, {
      duration: 10000,
    });
  };

  /**
   * Resends the existing or generates a new mock OTP.
   */
  const resendOtp = () => {
    if (!user) return;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    
    toast.success(`New OTP sent to +254${user.phone} and ${user.email}. (Code: ${generatedOtp})`, {
      duration: 10000,
    });
  };

  /**
   * Verifies the OTP entered by the user.
   */
  const verifyOtp = (otp: string): boolean => {
    if (otp === mockOtp) {
      setIsAuthenticated(true);
      // Mark step 1 as complete
      completeStep(1);
      return true;
    }
    return false;
  };

  /**
   * Logs out the user and clears state.
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setMockOtp(null);
    setFarmInfo(null);
    setSavedState(false);
    setCompletedStepIds([1]);
    setCurrentStepIdState(1);
    
    localStorage.removeItem("shamba_isAuthenticated");
    localStorage.removeItem("shamba_user");
    localStorage.removeItem("shamba_mockOtp");
    localStorage.removeItem("shamba_farmInfo");
    localStorage.removeItem("shamba_saved");
    localStorage.removeItem("shamba_completedStepIds");
    localStorage.removeItem("shamba_currentStepId");
    
    toast.info("Logged out successfully.");
  };

  /**
   * Saves the onboarding farm info inputs.
   */
  const saveFarmInfo = (info: FarmInfo) => {
    setFarmInfo(info);
    completeStep(2);
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
        mockOtp,
        currentStepId,
        completedStepIds,
        farmInfo,
        saved,
        loginUser,
        verifyOtp,
        resendOtp,
        logout,
        saveFarmInfo,
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
