import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TrendingUp, Info, ChevronRight, ArrowRight } from "lucide-react";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import styles from "./SaveFarm.module.css";

/**
 * SaveFarm component allows users to save report configuration and see simulated trend graphs.
 */
export const SaveFarm: React.FC = () => {
  const { user, setSaved, completeStep, setCurrentStepId } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");

  // Set the current step ID to 5 when page mounts
  useEffect(() => {
    setCurrentStepId(5);
  }, [setCurrentStepId]);

  const handleSave = () => {
    // Set saved state to true to unlock the trends graph
    setSaved(true);
    completeStep(4); // Mark Dashboard step as complete
    navigate("/progress");
  };

  const handleSkip = () => {
    // Navigate without setting saved, displaying empty trends screen
    setSaved(false);
    completeStep(4);
    navigate("/progress");
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        <div className={styles.cardHeader}>
          <div className={styles.iconBox}>
            <TrendingUp size={28} className={styles.icon} />
          </div>
          <div className={styles.headerTitles}>
            <EyebrowPill>Optional Step</EyebrowPill>
            <h1 className={styles.title}>Save your farm report</h1>
            <p className={styles.subtitle}>
              Get a shareable link and unlock <strong>Historical Trends</strong> — see how your farm's health and carbon score change over time.
            </p>
          </div>
        </div>

        <div className={styles.calloutWrapper}>
          <InfoCallout icon={<Info size={15} />}>
            <strong>No password. No account required.</strong> We send you a private link by SMS. Your phone number is only used to identify your farm across visits.
          </InfoCallout>
        </div>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="farmer-name" className={styles.label}>
              Your name
            </label>
            <input
              id="farmer-name"
              type="text"
              placeholder="e.g. Wanjiku Kamau"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              autoComplete="name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="farmer-phone" className={styles.label}>
              Phone number
            </label>
            <div className={styles.phoneInputWrapper}>
              <div className={styles.countryCode}>🇰🇪 +254</div>
              <input
                id="farmer-phone"
                type="tel"
                placeholder="712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className={styles.phoneInput}
                autoComplete="tel"
              />
            </div>
          </div>

          <Button onClick={handleSave} fullWidth>
            Save &amp; Get My Trend Link <ArrowRight size={17} />
          </Button>

          <button
            onClick={handleSkip}
            className={styles.skipButton}
            aria-label="Skip saving and continue to trends"
          >
            Maybe later — skip this step
          </button>
        </div>
      </div>
    </div>
  );
};
