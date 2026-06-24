import { useAppStore } from "../store";

/**
 * Custom React hook to access authentication state and handlers.
 */
export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    authToken,
    mockOtp,
    signupUser,
    loginUser,
    requestPasswordReset,
    verifyOtp,
    resendOtp,
    logout,
  } = useAppStore();

  return {
    isAuthenticated,
    user,
    authToken,
    mockOtp,
    signup: signupUser,
    login: loginUser,
    requestPasswordReset,
    verifyOtp,
    resendOtp,
    logout,
  };
};
