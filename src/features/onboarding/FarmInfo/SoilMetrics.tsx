import React, { useState } from "react";
import { HelpCircle, Leaf, Sprout, ShieldCheck } from "lucide-react";
import styles from "./SoilMetrics.module.css";

interface SoilData {
  n: number;
  p: number;
  k: number;
}

interface Nutrient {
  key: "n" | "p" | "k";
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  what: string;
  why: string;
  low: number; // below this is "Low"
  high: number; // above this is "High"
}

const NUTRIENTS: Nutrient[] = [
  {
    key: "n",
    label: "Nitrogen (N)",
    Icon: Leaf,
    what: "Nitrogen feeds green, leafy growth.",
    why: "Too little makes leaves pale and growth slow. Enough keeps your crop strong and productive through the season.",
    low: 30,
    high: 60,
  },
  {
    key: "p",
    label: "Phosphorus (P)",
    Icon: Sprout,
    what: "Phosphorus builds strong roots, flowers and fruit.",
    why: "Low phosphorus means weak roots and poor fruiting. Good levels help your crop set a strong harvest.",
    low: 20,
    high: 35,
  },
  {
    key: "k",
    label: "Potassium (K)",
    Icon: ShieldCheck,
    what: "Potassium helps crops resist drought and disease.",
    why: "Low potassium leaves plants weak and thirsty. Good levels improve quality and hardiness.",
    low: 100,
    high: 160,
  },
];

function classify(value: number, n: Nutrient): { level: string; levelClass: string } {
  if (value < n.low) return { level: "Low", levelClass: styles.levelLow };
  if (value > n.high) return { level: "High", levelClass: styles.levelHigh };
  return { level: "Adequate", levelClass: styles.levelOk };
}

/**
 * Auto-populated soil readings (N, P, K). Each card is clickable and explains,
 * in plain language, what the reading means and why it matters for the farmer.
 */
export const SoilMetrics: React.FC<{ soilData: SoilData }> = ({ soilData }) => {
  const [activeKey, setActiveKey] = useState<Nutrient["key"] | null>(null);
  const active = NUTRIENTS.find((n) => n.key === activeKey) ?? null;
  const activeValue = active ? soilData[active.key] : 0;
  const activeReading = active ? classify(activeValue, active) : null;

  return (
    <div>
      <div className={styles.soilGrid}>
        {NUTRIENTS.map((n) => {
          const value = soilData[n.key];
          const isActive = activeKey === n.key;
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => setActiveKey(isActive ? null : n.key)}
              className={`${styles.soilCard} ${isActive ? styles.soilCardActive : ""}`}
              aria-expanded={isActive}
              aria-label={`${n.label}: ${value} mg/kg. Tap to learn what this means.`}
            >
              <span className={styles.soilLabel}>{n.label}</span>
              <span className={styles.soilValue}>{value} mg/kg</span>
              <span className={styles.whyHint}>
                <HelpCircle size={12} /> Why?
              </span>
            </button>
          );
        })}
      </div>

      {active && activeReading && (
        <div className={styles.explainPanel} role="region" aria-live="polite">
          <div className={styles.explainHeader}>
            <active.Icon size={16} className={styles.explainIcon} />
            <span className={styles.explainTitle}>{active.label}</span>
            <span className={`${styles.levelBadge} ${activeReading.levelClass}`}>
              {activeReading.level}
            </span>
          </div>
          <p className={styles.explainText}>{active.what}</p>
          <p className={styles.explainReading}>
            Your soil reads <strong>{activeValue} mg/kg</strong>, which is{" "}
            <strong>{activeReading.level.toLowerCase()}</strong> for most crops in
            your region.
          </p>
          <p className={styles.explainText}>{active.why}</p>
        </div>
      )}
    </div>
  );
};
