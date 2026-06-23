import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { TrendingUp, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { EyebrowPill, Button } from "../../../components/ui";
import { StepBar } from "../../../components/shared";
import styles from "./TrackProgress.module.css";

const TREND_DATA = [
  { visit: "Oct 23", health: 65, carbon: 30 },
  { visit: "Dec 23", health: 70, carbon: 34 },
  { visit: "Feb 24", health: 62, carbon: 29 },
  { visit: "Apr 24", health: 75, carbon: 38 },
  { visit: "Jun 24", health: 78, carbon: 41 },
  { visit: "Aug 24", health: 80, carbon: 38 },
];

/**
 * TrackProgress component displays empty progress state or Recharts historical trends.
 */
export const TrackProgress: React.FC = () => {
  const { saved, user, setCurrentStepId, farmInfo } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  // Set the current step ID to 5 (Track Progress) when page mounts
  useEffect(() => {
    setCurrentStepId(5);
  }, [setCurrentStepId]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        <div className={styles.navigationRow}>
          <button
            onClick={() => navigate("/dashboard")}
            className={styles.backLink}
            aria-label="Return to dashboard"
          >
            <ChevronRight size={18} className={styles.rotateBack} /> Return to Dashboard
          </button>
        </div>

        <div className={styles.titleBlock}>
          <EyebrowPill>
            <TrendingUp size={11} /> Historical Trends
          </EyebrowPill>
          <h1 className={styles.title}>Your farm over time</h1>
        </div>

        {saved ? (
          <>
            <p className={styles.subtitle}>
              {(() => {
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
                return regionLabel;
              })()} · 6 visits since October 2023
            </p>

            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Farm Health &amp; Carbon Score</h2>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--shamba-sage-border)" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="visit"
                      tick={{ fill: "var(--shamba-muted)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--shamba-sage-border)" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "var(--shamba-muted)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickCount={5}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--shamba-primary-dark-green)",
                        border: "none",
                        borderRadius: "10px",
                        color: "var(--shamba-mint)",
                        fontSize: 13,
                      }}
                      labelStyle={{ color: "var(--shamba-sage-border)", fontWeight: 600 }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ color: "var(--shamba-muted)", fontSize: 13 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="health"
                      name="Farm Health"
                      stroke="var(--shamba-primary-dark-green)"
                      strokeWidth={2.5}
                      dot={{ fill: "var(--shamba-primary-dark-green)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbon"
                      name="Carbon Score"
                      stroke="var(--shamba-moderate)"
                      strokeWidth={2.5}
                      dot={{ fill: "var(--shamba-moderate)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.statsGrid}>
              {[
                { label: "Best Health Score", value: "80", sub: "August 2024", colorClass: styles.colorHealthy },
                { label: "Best Carbon Score", value: "41", sub: "June 2024", colorClass: styles.colorModerate },
                { label: "Total Improvement", value: "+23%", sub: "Since first visit", colorClass: styles.colorPrimary },
              ].map(({ label, value, sub, colorClass }) => (
                <div key={label} className={styles.statCard}>
                  <p className={styles.statLabel}>{label}</p>
                  <p className={`${styles.statValue} ${colorClass}`}>{value}</p>
                  <p className={styles.statSub}>{sub}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className={styles.emptyStateCard}>
            <div className={styles.emptyIconBox}>
              <TrendingUp size={36} className={styles.emptyIcon} />
            </div>
            <h2 className={styles.emptyTitle}>Your trend chart is waiting</h2>
            <p className={styles.emptyDesc}>
              Trends appear after your <strong>second visit</strong>. Come back after trying our recommendations — you'll see your farm's health and carbon score change over time.
            </p>
            <div className={styles.checklist}>
              <p className={styles.checklistTitle}>What you'll unlock on your next visit:</p>
              <div className={styles.checklistItems}>
                {[
                  "Farm health score trend line",
                  "Carbon sequestration progress",
                  "Seasonal comparisons",
                  "Recommendation impact tracking",
                ].map((item) => (
                  <div key={item} className={styles.checkItem}>
                    <CheckCircle size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.emptyActions}>
              <Button onClick={() => navigate("/dashboard")}>
                Return to My Dashboard <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
