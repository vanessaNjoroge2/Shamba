import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wheat, Sprout, Leaf, CloudRain, Droplets, Activity, Info, MapPin, ArrowRight } from "lucide-react";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import styles from "./FarmInfo.module.css";

const CROPS = [
  { id: "maize", label: "Maize", Icon: Wheat },
  { id: "beans", label: "Beans", Icon: Sprout },
  { id: "coffee", label: "Coffee", Icon: Leaf },
  { id: "vegetables", label: "Vegetables", Icon: Leaf },
  { id: "sorghum", label: "Sorghum", Icon: Wheat },
  { id: "cassava", label: "Cassava", Icon: Sprout },
];

const IRRIGATION = [
  {
    id: "rainfall",
    label: "Rainfall only",
    desc: "No added irrigation",
    Icon: CloudRain,
  },
  {
    id: "drip",
    label: "Drip irrigation",
    desc: "Tubes or trickle lines",
    Icon: Droplets,
  },
  {
    id: "furrow",
    label: "Furrow / flood",
    desc: "Channels cut between rows",
    Icon: Activity,
  },
  {
    id: "sprinkler",
    label: "Sprinkler",
    desc: "Overhead water spray",
    Icon: CloudRain,
  },
];

/**
 * FarmInfo component captures farm statistics during onboarding.
 */
export const FarmInfo: React.FC = () => {
  const { farmInfo, saveFarmInfo, setCurrentStepId } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  // Local state initialized from global state if present
  const [cropType, setCropType] = useState(farmInfo?.cropType || "maize");
  const [farmSize, setFarmSize] = useState(farmInfo?.farmSize || "1.5");
  const [sizeUnit, setSizeUnit] = useState(farmInfo?.sizeUnit || "acres");
  const [irrigation, setIrrigation] = useState(farmInfo?.irrigation || "rainfall");
  const [mobileStep, setMobileStep] = useState(1);

  // Set the current step ID to 2 (Enter Farm Info) when page mounts
  useEffect(() => {
    setCurrentStepId(2);
  }, [setCurrentStepId]);

  const handleSubmit = () => {
    saveFarmInfo({
      cropType,
      farmSize,
      sizeUnit,
      irrigation,
    });
    navigate("/analysis");
  };

  const handleMobileNext = () => {
    if (mobileStep < 3) {
      setMobileStep(mobileStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleMobilePrev = () => {
    if (mobileStep > 1) {
      setMobileStep(mobileStep - 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.page}>
      {/* Step tracker */}
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <EyebrowPill>
            <MapPin size={11} /> Step 2 of 5
          </EyebrowPill>
          <h1 className={styles.title}>Tell us about your farm</h1>
          <p className={styles.subtitle}>
            We use this to calibrate the AI model to your exact conditions.
          </p>
        </div>

        {/* Mobile progress indicators */}
        <div className={styles.mobileStepProgress}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${styles.progressDot} ${s <= mobileStep ? styles.progressDotActive : ""}`}
            />
          ))}
        </div>

        {/* Desktop View: All fields visible */}
        <div className={styles.desktopFields}>
          {/* Crop Type Selection */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>What is your primary crop?</legend>
            <div className={styles.cropGrid}>
              {CROPS.map(({ id, label, Icon }) => {
                const selected = cropType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCropType(id)}
                    className={`${styles.cropButton} ${selected ? styles.selectedBtn : ""}`}
                    aria-pressed={selected}
                  >
                    <Icon
                      size={20}
                      className={`${styles.cropIcon} ${selected ? styles.selectedCropIcon : ""}`}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Farm Size */}
          <div className={styles.sizeSection}>
            <label htmlFor="farm-size" className={styles.legend}>
              How large is your farm?
            </label>
            <div className={styles.sizeInputs}>
              <input
                id="farm-size"
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className={styles.sizeInput}
                aria-label="Farm size number"
                required
              />
              <div className={styles.unitToggle} role="group" aria-label="Size unit">
                {["acres", "hectares"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSizeUnit(u)}
                    className={`${styles.unitButton} ${sizeUnit === u ? styles.unitActive : ""}`}
                    aria-pressed={sizeUnit === u}
                  >
                    {u === "hectares" ? "ha" : "acres"}
                  </button>
                ))}
              </div>
            </div>
            <p className={styles.helperText}>
              Shamba is optimised for farms 0.5–5 acres (0.2–2 ha)
            </p>
          </div>

          {/* Irrigation */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>How do you water your crops?</legend>
            <div className={styles.irrigationGrid}>
              {IRRIGATION.map(({ id, label, desc, Icon }) => {
                const selected = irrigation === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setIrrigation(id)}
                    className={`${styles.irrigationButton} ${selected ? styles.selectedIrrigation : ""}`}
                    aria-pressed={selected}
                  >
                    <Icon
                      size={20}
                      className={`${styles.irrigationIcon} ${selected ? styles.selectedIrrigationIcon : ""}`}
                    />
                    <div>
                      <div className={`${styles.irrigationLabel} ${selected ? styles.selectedText : ""}`}>
                        {label}
                      </div>
                      <div className={`${styles.irrigationDesc} ${selected ? styles.selectedDescText : ""}`}>
                        {desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.submitBtnWrapper}>
            <Button onClick={handleSubmit} fullWidth>
              Analyze My Farm <ArrowRight size={17} />
            </Button>
          </div>
        </div>

        {/* Mobile View: Step-by-step form */}
        <div className={styles.mobileFields}>
          {mobileStep === 1 && (
            <div>
              <p className={styles.mobileStepLabel}>1 of 3 — Crop Type</p>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>What is your primary crop?</legend>
                <div className={styles.cropGrid}>
                  {CROPS.map(({ id, label, Icon }) => {
                    const selected = cropType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCropType(id)}
                        className={`${styles.cropButton} ${selected ? styles.selectedBtn : ""}`}
                        aria-pressed={selected}
                      >
                        <Icon
                          size={20}
                          className={`${styles.cropIcon} ${selected ? styles.selectedCropIcon : ""}`}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {mobileStep === 2 && (
            <div>
              <p className={styles.mobileStepLabel}>2 of 3 — Farm Size</p>
              <div className={styles.sizeSection}>
                <label htmlFor="mobile-farm-size" className={styles.legend}>
                  How large is your farm?
                </label>
                <div className={styles.sizeInputs}>
                  <input
                    id="mobile-farm-size"
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className={styles.sizeInput}
                    aria-label="Farm size number"
                    required
                  />
                  <div className={styles.unitToggle} role="group" aria-label="Size unit">
                    {["acres", "hectares"].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setSizeUnit(u)}
                        className={`${styles.unitButton} ${sizeUnit === u ? styles.unitActive : ""}`}
                        aria-pressed={sizeUnit === u}
                      >
                        {u === "hectares" ? "ha" : "acres"}
                      </button>
                    ))}
                  </div>
                </div>
                <p className={styles.helperText}>
                  Shamba is optimised for farms 0.5–5 acres (0.2–2 ha)
                </p>
              </div>
            </div>
          )}

          {mobileStep === 3 && (
            <div>
              <p className={styles.mobileStepLabel}>3 of 3 — Irrigation Method</p>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>How do you water your crops?</legend>
                <div className={styles.irrigationGrid}>
                  {IRRIGATION.map(({ id, label, desc, Icon }) => {
                    const selected = irrigation === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setIrrigation(id)}
                        className={`${styles.irrigationButton} ${selected ? styles.selectedIrrigation : ""}`}
                        aria-pressed={selected}
                      >
                        <Icon
                          size={20}
                          className={`${styles.irrigationIcon} ${selected ? styles.selectedIrrigationIcon : ""}`}
                        />
                        <div>
                          <div className={`${styles.irrigationLabel} ${selected ? styles.selectedText : ""}`}>
                            {label}
                          </div>
                          <div className={`${styles.irrigationDesc} ${selected ? styles.selectedDescText : ""}`}>
                            {desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          <div className={styles.mobileNavButtons}>
            <Button variant="ghost" onClick={handleMobilePrev}>
              {mobileStep === 1 ? "Back" : "Previous"}
            </Button>
            <Button onClick={handleMobileNext} fullWidth>
              {mobileStep < 3 ? (
                <>
                  Next <ArrowRight size={17} />
                </>
              ) : (
                <>
                  Analyze My Farm <ArrowRight size={17} />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={styles.calloutWrapper}>
          <InfoCallout icon={<Info size={15} />}>
            <strong>Your privacy matters.</strong> We do not store precise GPS
            coordinates or personally identifiable data. Only region-level data is used for analysis.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
};
