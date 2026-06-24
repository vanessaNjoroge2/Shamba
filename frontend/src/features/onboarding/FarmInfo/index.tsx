import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wheat, Sprout, Leaf, CloudRain, Droplets, Activity, Info, MapPin, ArrowRight, Coffee } from "lucide-react";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout, RegionSelect } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import { SoilMetrics } from "./SoilMetrics";
import styles from "./FarmInfo.module.css";

const CROPS = [
  { id: "maize", label: "Maize", Icon: Wheat },
  { id: "beans", label: "Beans", Icon: Sprout },
  { id: "wheat", label: "Wheat", Icon: Wheat },
  { id: "rice", label: "Rice", Icon: Leaf },
  { id: "sorghum", label: "Sorghum", Icon: Wheat },
  { id: "cassava", label: "Cassava", Icon: Sprout },
  { id: "potato", label: "Potato", Icon: Sprout },
  { id: "tomato", label: "Tomato", Icon: Sprout },
  { id: "coffee", label: "Coffee", Icon: Coffee },
  { id: "tea", label: "Tea", Icon: Leaf },
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

interface RegionInfo {
  name: string;
  n: number;
  p: number;
  k: number;
  carbonValue: number;
  carbonGrade: "A" | "B" | "C";
  healthStatus: "healthy" | "moderate" | "dry";
}

const REGION_DATA: Record<string, RegionInfo> = {
  nairobi: {
    name: "Nairobi",
    n: 45,
    p: 20,
    k: 120,
    carbonValue: 95,
    carbonGrade: "C",
    healthStatus: "dry",
  },
  central: {
    name: "Central Kenya",
    n: 65,
    p: 35,
    k: 180,
    carbonValue: 145,
    carbonGrade: "A",
    healthStatus: "healthy",
  },
  rift: {
    name: "Rift Valley",
    n: 70,
    p: 40,
    k: 200,
    carbonValue: 160,
    carbonGrade: "A",
    healthStatus: "healthy",
  },
  western: {
    name: "Western Kenya",
    n: 55,
    p: 30,
    k: 150,
    carbonValue: 130,
    carbonGrade: "B",
    healthStatus: "moderate",
  },
  coast: {
    name: "Coast",
    n: 30,
    p: 15,
    k: 90,
    carbonValue: 80,
    carbonGrade: "C",
    healthStatus: "dry",
  },
  eastern: {
    name: "Eastern Kenya",
    n: 35,
    p: 18,
    k: 100,
    carbonValue: 90,
    carbonGrade: "C",
    healthStatus: "dry",
  },
};

const REGIONS = [
  { value: "nairobi", label: "Nairobi" },
  { value: "central", label: "Central Kenya" },
  { value: "rift", label: "Rift Valley" },
  { value: "western", label: "Western Kenya" },
  { value: "coast", label: "Coast" },
  { value: "eastern", label: "Eastern Kenya" },
];

/**
 * FarmInfo component captures farm statistics during onboarding.
 */
export const FarmInfo: React.FC = () => {
  const { farmInfo, saveFarmInfo, runAssessment, setCurrentStepId } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  // Local state initialized from global state if present
  const [cropType, setCropType] = useState(farmInfo?.cropType || "maize");
  const [farmSize, setFarmSize] = useState(farmInfo?.farmSize || "1.5");
  const [sizeUnit, setSizeUnit] = useState(farmInfo?.sizeUnit || "acres");
  const [irrigation, setIrrigation] = useState(farmInfo?.irrigation || "rainfall");
  const [region, setRegion] = useState(farmInfo?.region || "");
  const [soilData, setSoilData] = useState<{ n: number; p: number; k: number } | undefined>(farmInfo?.soilData);
  const [loadingSoil, setLoadingSoil] = useState(false);
  const [mobileStep, setMobileStep] = useState(1);

  // Set the current step ID to 2 (Enter Farm Info) when page mounts
  useEffect(() => {
    setCurrentStepId(2);
  }, [setCurrentStepId]);

  // Fetch soil data automatically on region change
  useEffect(() => {
    if (!region) {
      setSoilData(undefined);
      return;
    }

    setLoadingSoil(true);
    const timer = setTimeout(() => {
      const data = REGION_DATA[region];
      if (data) {
        setSoilData({ n: data.n, p: data.p, k: data.k });
      }
      setLoadingSoil(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [region]);

  const handleSubmit = () => {
    if (!region) return;
    const info = REGION_DATA[region];
    const farmData = {
      cropType,
      farmSize,
      sizeUnit,
      irrigation,
      region,
      soilData,
      healthStatus: info?.healthStatus || "moderate",
      carbonValue: info?.carbonValue || 38,
      carbonGrade: info?.carbonGrade || "C",
    };
    // Persist inputs immediately so the dashboard always has data, then move to
    // the loading screen and run the real backend assessment in the background.
    saveFarmInfo(farmData);
    setCurrentStepId(3);
    navigate("/analysis");
    runAssessment(farmData);
  };

  const handleMobileNext = () => {
    if (mobileStep < 4) {
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
          {[1, 2, 3, 4].map((s) => (
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

          {/* Farm Region Selection */}
          <div className={styles.fieldset}>
            <label htmlFor="farm-region" className={styles.legend}>
              Where is your farm located?
            </label>
            <RegionSelect
              id="farm-region"
              value={region}
              onChange={setRegion}
              options={REGIONS}
              placeholder="Select your farm region"
              ariaLabel="Farm region"
            />
            <p className={styles.helperText}>
              Select your farm region to automatically use regional soil data.
            </p>

            {/* Soil metrics display */}
            <div style={{ marginTop: "1rem" }}>
              <label className={styles.legend}>Soil Metrics (Auto-Populated)</label>
              {loadingSoil ? (
                <div className={styles.soilLoading}>
                  <div className={styles.spinner} />
                  <span>Fetching soil data from regional database...</span>
                </div>
              ) : soilData ? (
                <SoilMetrics soilData={soilData} />
              ) : (
                <div className={styles.soilPlaceholder}>
                  Select region to automatically load soil data
                </div>
              )}
            </div>
          </div>

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
            <Button onClick={handleSubmit} fullWidth disabled={!region || loadingSoil}>
              Analyze My Farm <ArrowRight size={17} />
            </Button>
          </div>
        </div>

        {/* Mobile View: Step-by-step form */}
        <div className={styles.mobileFields}>
          {mobileStep === 1 && (
            <div>
              <p className={styles.mobileStepLabel}>1 of 4 - Crop Type</p>
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
              <p className={styles.mobileStepLabel}>2 of 4 - Farm Region</p>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Where is your farm located?</legend>
                <RegionSelect
                  id="mobile-farm-region"
                  value={region}
                  onChange={setRegion}
                  options={REGIONS}
                  placeholder="Select your farm region"
                  ariaLabel="Farm region"
                />
                <p className={styles.helperText}>
                  Select your farm region to automatically use regional soil data.
                </p>

                {/* Soil metrics display */}
                <div style={{ marginTop: "1rem" }}>
                  <label className={styles.legend}>Soil Metrics (Auto-Populated)</label>
                  {loadingSoil ? (
                    <div className={styles.soilLoading}>
                      <div className={styles.spinner} />
                      <span>Fetching soil data...</span>
                    </div>
                  ) : soilData ? (
                    <SoilMetrics soilData={soilData} />
                  ) : (
                    <div className={styles.soilPlaceholder}>
                      Select region to automatically load soil data
                    </div>
                  )}
                </div>
              </fieldset>
            </div>
          )}

          {mobileStep === 3 && (
            <div>
              <p className={styles.mobileStepLabel}>3 of 4 - Farm Size</p>
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

          {mobileStep === 4 && (
            <div>
              <p className={styles.mobileStepLabel}>4 of 4 - Irrigation Method</p>
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
            <Button onClick={handleMobileNext} fullWidth disabled={mobileStep === 2 && (!region || loadingSoil)}>
              {mobileStep < 4 ? (
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
