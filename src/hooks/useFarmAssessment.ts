// src/hooks/useFarmAssessment.ts
import { useState } from "react";
import {
  assessFarm,
  getFarmHistory,
  FarmAssessmentRequest,
  FarmAssessmentResponse,
  FarmHistoryItem,
} from "../lib/api";
import { useAppStore } from "../store";

export function useFarmAssessment() {
  const { authToken } = useAppStore();
  const [data, setData] = useState<FarmAssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = async (
    formData: FarmAssessmentRequest
  ): Promise<FarmAssessmentResponse | null> => {  // ← now returns the result
    setLoading(true);
    setError(null);
    try {
      const result = await assessFarm(formData, authToken ?? "");
      setData(result);
      return result;            // ← caller (onboarding form) gets this value
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
      return null;              // ← caller knows it failed
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, submitAssessment };
}

/**
 * Loads the signed-in farmer's assessment history from GET /api/farm-history.
 * `fetchHistory()` is parameterless so pages can call it from a mount effect.
 */
export function useFarmHistory() {
  const { authToken } = useAppStore();
  const [history, setHistory] = useState<FarmHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async (): Promise<FarmHistoryItem[]> => {
    if (!authToken) {
      // No real session (offline/demo mode) - nothing to load, keep empty state.
      setHistory([]);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getFarmHistory(authToken);
      setHistory(result);
      return result;
    } catch (err) {
      setError("Could not load your farm history.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory };
}