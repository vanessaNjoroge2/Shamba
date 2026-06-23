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
    label: "Healthy",
    Icon: Leaf,
    colorClass: styles.colorHealthy,
    bgClass: styles.bgHealthy,
    borderClass: styles.borderHealthy,
    iconLabel: "Green leaf — farm is healthy",
    ndvi: "0.72",
    fillWidth: "72%",
    desc: "Your crops show excellent chlorophyll absorption. Soil moisture is optimal for this stage of growth. Keep doing what you are doing!"
  },
  moderate: {
    label: "Moderate Stress",
    Icon: ThermometerSun,
    colorClass: styles.colorModerate,
    bgClass: styles.bgModerate,
    borderClass: styles.borderModerate,
    iconLabel: "Thermometer — moderate heat stress",
    ndvi: "0.42",
    fillWidth: "42%",
    desc: "Your crops show signs of mild heat stress. Soil moisture is below the seasonal average for the region. Action recommended within 2 weeks."
  },
  dry: {
    label: "Drought Risk",
    Icon: Flame,
    colorClass: styles.colorDry,
    bgClass: styles.bgDry,
    borderClass: styles.borderDry,
    iconLabel: "Flame — high drought risk",
    ndvi: "0.21",
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

  // Determine health status dynamically based on irrigation input
  const getHealthStatus = (): HealthStatus => {
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
              {cropLabel} · {sizeLabel} · {irrigationLabel} · Murang'a, Kenya
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
                <div className={styles.healthMeta}>
                  NDVI score: {cfg.ndvi} / 1.00
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
              <span>{cfg.ndvi.replace("0.", "")} / 100</span>
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
                  ? "NDVI index is optimal (0.72). Regular nitrogen tracking shows stable absorption, but adding compost sustains organic micro-biome."
                  : `Satellite imagery shows reduced leaf greenness (NDVI: ${cfg.ndvi} vs regional baseline 0.61). Nitrogen deficiency is the most likely cause given current rainfall patterns.`}
              </p>
            </div>

            <div className={styles.tipsList}>
              {(health === "healthy"
                ? [
                    "Continue crop monitoring every 2 weeks",
                    "Add compost or leaf mold to topsoil",
                    "Avoid over-watering in low-lying quadrants",
                  ]
                : [
                    "Use 50 kg CAN per acre, applied at base of plants",
                    "Add 5 cm organic mulch layer to retain moisture",
                    "Avoid irrigation during hottest part of day (11am–3pm)",
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
                <span className={styles.carbonValue}>38</span>
                <span className={styles.carbonMax}>/ 100</span>
              </div>
              <p className={styles.carbonLabel}>Carbon Sequestration Score</p>
            </div>

            <div className={styles.carbonCallout}>
              <TreePine size={18} className={styles.treeIcon} />
              <p className={styles.carbonCalloutDesc}>
                Your farm is sequestering carbon equivalent to{" "}
                <strong>4.2 trees planted this year</strong> — below the potential of 11 trees for a healthy 1.5-acre plot.
              </p>
            </div>

            <div className={styles.carbonProgressBarBg}>
              <div
                className={styles.carbonProgressBarFill}
                style={{ width: "38%" }}
              />
            </div>
            <div className={styles.carbonProgressLabels}>
              <span>Low</span>
              <span>Score: 38</span>
              <span>High</span>
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
            <strong>Carbon credit eligibility.</strong> Once your score reaches
            55+, you may qualify for micro carbon credit programs through our
            partner network. Improve soil health to unlock this benefit.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
};
