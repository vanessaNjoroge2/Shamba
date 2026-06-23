import { useAppStore } from "../store";

/**
 * Custom React hook to access authentication state and handlers.
 */
export const useAuth = () => {
  const { isAuthenticated, user, mockOtp, loginUser, verifyOtp, resendOtp, logout } = useAppStore();
  
  return {
    isAuthenticated,
    user,
    mockOtp,
    login: loginUser,
    verifyOtp,
    resendOtp,
    logout,
  };
};
