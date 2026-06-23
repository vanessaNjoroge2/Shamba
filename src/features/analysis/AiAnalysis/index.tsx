import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, Activity, Clock } from "lucide-react";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { EyebrowPill, InfoCallout } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import styles from "./AiAnalysis.module.css";

const PHASES = [
  "Locating satellite imagery…",
  "Calculating NDVI soil index…",
  "Cross-referencing rainfall data…",
  "Generating recommendations…",
  "Estimating carbon footprint…",
];

/**
 * AiAnalysis component simulates satellite intelligence scanning the farm.
 */
export const AiAnalysis: React.FC = () => {
  const { completeStep, setCurrentStepId } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Mark step 3 active on mount
  useEffect(() => {
    setCurrentStepId(3);
  }, [setCurrentStepId]);

  // Simulate progress bar loading
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Random incremental values
        const increment = Math.random() * 8 + 3;
        return Math.min(p + increment, 100);
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  // Update loading phases text
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhaseIndex((idx) => {
        if (idx < PHASES.length - 1) {
          return idx + 1;
        }
        return idx;
      });
    }, 800);

    return () => clearInterval(phaseInterval);
  }, []);

  // Redirect to dashboard when progress finishes
  useEffect(() => {
    if (progress === 100) {
      completeStep(3);
      const redirectTimer = setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, [progress, navigate, completeStep]);

  return (
    <div className={styles.page}>
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        {/* Animated icon cluster */}
        <div className={styles.iconContainer} role="status" aria-label="Analysis in progress">
          <Leaf size={40} className={styles.leafIcon} />
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${styles.orbitDot} ${styles[`orbitDot-${i}`]}`}
            />
          ))}
        </div>

        <div className={styles.header}>
          <EyebrowPill dark>
            <Activity size={11} /> AI Analysis Running
          </EyebrowPill>
          <h2 className={styles.title}>
            Analyzing your farm conditions…
          </h2>
          <p className={styles.phaseText}>
            {PHASES[phaseIndex]}
          </p>
        </div>

        {/* Progress bar container */}
        <div className={styles.progressBarWrapper}>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressPercentage}>
            {Math.round(progress)}% complete · Usually takes 15–30 seconds
          </p>
        </div>

        <div className={styles.calloutWrapper}>
          <InfoCallout icon={<Clock size={15} />}>
            <strong>Did you know?</strong> Shamba analyzes over 40 satellite data
            points per farm, including soil carbon density, cloud-cover adjusted
            NDVI, and 90-day precipitation trends.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
};
