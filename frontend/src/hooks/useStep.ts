import { useAppStore, STEPS } from "../store";

/**
 * Custom React hook to interact with multi-step onboarding and progress tracker.
 */
export const useStep = () => {
  const { currentStepId, completedStepIds, completeStep, setCurrentStepId } = useAppStore();

  return {
    currentStepId,
    completedStepIds,
    steps: STEPS,
    completeStep,
    setCurrentStepId,
  };
};
