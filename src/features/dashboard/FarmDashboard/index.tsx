import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, ThermometerSun, Flame, BarChart2, User, TrendingUp, ArrowRight, TreePine, Award } from "lucide-react";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { EyebrowPill, InfoCallout } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import { HealthStatus } from "../../../types";
import styles from "./FarmDashboard.module.css";

const HEALTH_CONFIG = {
  healthy: {
    label: "Good",
    Icon: Leaf,
    colorClass: styles.colorHealthy,
    bgClass: styles.bgHealthy,
    borderClass: styles.borderHealthy,
    iconLabel: "Green leaf - farm is healthy",
    fillWidth: "72%",
    desc: "Your crops show excellent chlorophyll absorption. Soil moisture is optimal for this stage of growth. Keep doing what you are doing!"
  },
  moderate: {
    label: "Warning",
    Icon: ThermometerSun,
    colorClass: styles.colorModerate,
    bgClass: styles.bgModerate,
    borderClass: styles.borderModerate,
    iconLabel: "Thermometer - moderate heat stress",
    fillWidth: "42%",
    desc: "Your crops show signs of mild heat stress. Soil moisture is below the seasonal average for the region. Action recommended within 2 weeks."
  },
  dry: {
    label: "Critical",
    Icon: Flame,
    colorClass: styles.colorDry,
    bgClass: styles.bgDry,
    borderClass: styles.borderDry,
    iconLabel: "Flame - high drought risk",
    fillWidth: "21%",
    desc: "Critical water stress detected. Vegetation moisture content is extremely low. Immediate irrigation or moisture-retention action is required."
  },
};

/**
 * FarmDashboard component displaying AI insights on soil, health, and carbon.
 */
export const FarmDashboard: React.FC = () => {
  const { farmInfo, setCurrentStepId, saved } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  // Set the current step ID to 4 (View Dashboard) when page mounts
  useEffect(() => {
    setCurrentStepId(4);
  }, [setCurrentStepId]);

  // Guard: no farm data at all yet (e.g. user jumped straight to /dashboard)
  if (!farmInfo) {
    return (
      <div className={styles.page}>
        <div className={styles.stepTrackerWrapper}>
          <StepBar />
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No assessment yet.</p>
          <button onClick={() => navigate("/onboarding")} className={styles.emptyLink}>
            Analyse your farm <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // Determine health status dynamically: prefer the real backend result, then
  // the region-derived fallback, then an irrigation-based heuristic.
  const getHealthStatus = (): HealthStatus => {
    const apiStatus = farmInfo?.health_status;
    if (apiStatus && ["healthy", "moderate", "dry"].includes(apiStatus)) {
      return apiStatus as HealthStatus;
    }
    if (farmInfo?.healthStatus) return farmInfo.healthStatus;
    if (farmInfo?.irrigation === "drip") return "healthy";
    if (farmInfo?.irrigation === "furrow" || farmInfo?.irrigation === "sprinkler") return "healthy";
    if (farmInfo?.irrigation === "rainfall") return "moderate";
    return "moderate";
  };

  const health = getHealthStatus();
  const cfg = HEALTH_CONFIG[health];
  const HealthIcon = cfg.Icon;

  // Format farm data details
  const cropLabel = farmInfo?.cropType ? farmInfo.cropType.charAt(0).toUpperCase() + farmInfo.cropType.slice(1) : "Maize";
  const sizeLabel = farmInfo?.farmSize ? `${farmInfo.farmSize} ${farmInfo.sizeUnit}` : "1.5 acres";
  const irrigationLabel = farmInfo?.irrigation
    ? farmInfo.irrigation === "rainfall"
      ? "Rainfall-fed"
      : farmInfo.irrigation.charAt(0).toUpperCase() + farmInfo.irrigation.slice(1)
    : "Rainfall-fed";

  const REGION_NAMES: Record<string, string> = {
    nairobi: "Nairobi",
    central: "Central Kenya",
    rift: "Rift Valley",
    western: "Western Kenya",
    coast: "Coast",
    eastern: "Eastern Kenya",
  };
  const regionId = farmInfo?.region || "central";
  const rawRegionName = REGION_NAMES[regionId] || "Central Kenya";
  const regionLabel = rawRegionName.includes("Kenya") ? rawRegionName : `${rawRegionName}, Kenya`;

  // Prefer the real backend numbers; fall back to region-derived local values.
  const carbonValue = farmInfo?.carbon_estimate ?? farmInfo?.carbonValue ?? 38;
  const carbonGrade = farmInfo?.carbon_grade ?? farmInfo?.carbonGrade ?? "C";

  // Parse the backend's numbered recommendation string into individual tips.
  const apiRecommendations = farmInfo?.recommendations
    ? farmInfo.recommendations
        .split(/\n+/)
        .map((line) =>
          line
            .replace(/^\s*\d+[.)]\s*/, "")
            .replace(/[‒-―]/g, "-") // normalise any dash to a hyphen
            .trim()
        )
        .filter(Boolean)
    : null;

  const assessmentDate = farmInfo?.assessment_timestamp
    ? new Date(farmInfo.assessment_timestamp).toLocaleDateString()
    : null;

  return (
    <div className={styles.page}>
      {/* Step tracker */}
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <EyebrowPill>
              <BarChart2 size={11} /> Your Farm Report
            </EyebrowPill>
            <h1 className={styles.title}>Farm Analysis</h1>
            <p className={styles.subtitle}>
              {cropLabel} · {sizeLabel} · {irrigationLabel} · {regionLabel}
              {assessmentDate ? ` · Analysed ${assessmentDate}` : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("/save")}
            className={styles.saveButton}
            aria-label="Save this farm report to your profile"
          >
            <User size={15} /> {saved ? "Saved" : "Save My Farm"}
          </button>
        </div>

        <div className={styles.grid}>
          {/* Card 1: Farm Health */}
          <div className={styles.card}>
            <div className={styles.pillWrapper}>
              <EyebrowPill>Farm Health Status</EyebrowPill>
            </div>
            <div className={styles.healthStatusRow}>
              <div
                className={`${styles.healthIconBox} ${cfg.bgClass} ${cfg.borderClass}`}
                aria-label={cfg.iconLabel}
                role="img"
              >
                <HealthIcon size={26} className={cfg.colorClass} />
              </div>
              <div>
                <div className={`${styles.healthLabel} ${cfg.colorClass}`}>
                  {cfg.label}
                </div>
              </div>
            </div>
            <p className={styles.cardDescription}>{cfg.desc}</p>
            <div className={styles.progressBarBg}>
              <div
                className={`${styles.progressBarFill} ${
                  health === "healthy"
                    ? styles.bgHealthyFill
                    : health === "dry"
                      ? styles.bgDryFill
                      : styles.bgModerateFill
                }`}
                style={{ width: cfg.fillWidth }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>Critical</span>
              <span>{cfg.label}</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Card 2: Recommendations */}
          <div className={styles.card}>
            <div className={styles.pillWrapper}>
              <EyebrowPill>
                <Leaf size={11} /> Top Recommendation
              </EyebrowPill>
            </div>
            <h3 className={styles.cardTitle}>
              {health === "healthy"
                ? "Maintain soil aeration and micro-nutrients"
                : "Apply nitrogen-rich mulch within 14 days"}
            </h3>

            <div className={styles.calloutBox}>
              <p className={styles.calloutTitle}>Why this recommendation</p>
              <p className={styles.calloutDesc}>
                {health === "healthy"
                  ? "Your crops show strong, steady growth for this region. Keeping up your current soil care and adding compost will sustain healthy yields."
                  : "Your crops show signs of stress for this region and season. Nitrogen support and better moisture retention are the most useful next steps."}
              </p>
            </div>

            <div className={styles.tipsList}>
              {(apiRecommendations && apiRecommendations.length > 0
                ? apiRecommendations
                : health === "healthy"
                ? [
                    "Continue crop monitoring every 2 weeks",
                    "Add compost or leaf mold to topsoil",
                    "Avoid over-watering in low-lying quadrants",
                  ]
                : [
                    "Use 50 kg CAN per acre, applied at base of plants",
                    "Add 5 cm organic mulch layer to retain moisture",
                    "Avoid irrigation during hottest part of day (11am to 3pm)",
                  ]
              ).map((tip, i) => (
                <div key={i} className={styles.tipItem}>
                  <span className={styles.tipNumber}>{i + 1}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Carbon */}
          <div className={styles.card}>
            <div className={styles.pillWrapper}>
              <EyebrowPill>
                <TreePine size={11} /> Carbon Monitoring
              </EyebrowPill>
            </div>
            <div className={styles.carbonScoreBlock}>
              <div className={styles.carbonValueRow}>
                <span className={styles.carbonValue}>{carbonValue}</span>
                <span className={styles.carbonUnit}>kg CO₂</span>
                <span className={styles.carbonDivider}>|</span>
                <span className={`${styles.carbonGradeBadge} ${
                  carbonGrade === "A"
                    ? styles.gradeA
                    : carbonGrade === "B"
                      ? styles.gradeB
                      : styles.gradeC
                }`}>
                  Grade {carbonGrade}
                </span>
              </div>
              <p className={styles.carbonLabel}>Carbon Impact</p>
            </div>

            <div className={styles.carbonCallout}>
              <TreePine size={18} className={styles.treeIcon} />
              <p className={styles.carbonCalloutDesc}>
                {carbonGrade === "A"
                  ? `A low carbon footprint for a ${sizeLabel} farm. This is excellent - keeping your water use efficient holds you in the top band.`
                  : carbonGrade === "B"
                    ? `A moderate carbon footprint for a ${sizeLabel} farm. Small changes to how you irrigate can move you into the top band.`
                    : `A high carbon footprint for a ${sizeLabel} farm. Reducing water use is the fastest way to bring it down.`}
              </p>
            </div>

            <div className={styles.carbonProgressBarBg}>
              <div
                className={styles.carbonProgressBarFill}
                style={{ width: `${Math.min((carbonValue / 10) * 100, 100)}%` }}
              />
            </div>
            <div className={styles.carbonProgressLabels}>
              <span>Lower is better</span>
              <span>{carbonValue} kg CO₂</span>
              <span>Higher</span>
            </div>

            <button
              onClick={() => navigate("/progress")}
              className={styles.trendLink}
              aria-label="View carbon trend history page"
            >
              <TrendingUp size={14} />
              View carbon trend history
              <ArrowRight size={14} className={styles.arrowIcon} />
            </button>
          </div>
        </div>

        {/* Lower callout */}
        <div className={styles.footerCallout}>
          <InfoCallout icon={<Award size={15} />}>
            <strong>Carbon credit eligibility.</strong> Farms that reach Grade A
            may qualify for micro carbon credit programs through our partner
            network. Lower your water use to improve your grade and unlock this.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
};
