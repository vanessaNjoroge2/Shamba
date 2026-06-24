import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, Download, ArrowRight, Clock, TrendingUp, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../../../store";
import { useStep } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import { StepBar, PrintableReport } from "../../../components/shared";
import styles from "./SaveFarm.module.css";

const REGION_NAMES: Record<string, string> = {
  nairobi: "Nairobi",
  central: "Central Kenya",
  rift: "Rift Valley",
  western: "Western Kenya",
  coast: "Coast",
  eastern: "Eastern Kenya",
};

const HEALTH_LABEL: Record<string, string> = {
  healthy: "Good",
  moderate: "Warning",
  dry: "Critical",
};

const gradeClass = (grade: string) =>
  grade === "A" ? styles.gradeA : grade === "B" ? styles.gradeB : styles.gradeC;

/**
 * SaveFarm lets the farmer download their report as a PDF and keeps a history
 * of previous downloads.
 */
export const SaveFarm: React.FC = () => {
  const { farmInfo, savedReports, addSavedReport, setCurrentStepId } = useAppStore();
  const { currentStepId } = useStep();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStepId(5);
  }, [setCurrentStepId]);

  const handleDownload = () => {
    const entry = addSavedReport();
    if (!entry) {
      toast.error("Analyse your farm first, then you can download the report.");
      return;
    }
    toast.success("Report saved to your downloads. Use the dialog to save as PDF.");
    // Let the state settle, then open the browser's print-to-PDF dialog.
    setTimeout(() => window.print(), 150);
  };

  if (!farmInfo) {
    return (
      <div className={styles.page}>
        <div className={styles.stepTrackerWrapper}>
          <StepBar />
        </div>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.iconBox}>
              <Leaf size={28} className={styles.icon} />
            </div>
            <h1 className={styles.title}>No report to save yet</h1>
            <p className={styles.subtitle}>
              Analyse your farm first, then come back to download your report.
            </p>
            <Button onClick={() => navigate("/onboarding")}>
              Analyse my farm <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const regionLabel = REGION_NAMES[farmInfo.region] || "Central Kenya";
  const cropLabel = farmInfo.cropType
    ? farmInfo.cropType.charAt(0).toUpperCase() + farmInfo.cropType.slice(1)
    : "-";
  const sizeLabel = farmInfo.farmSize ? `${farmInfo.farmSize} ${farmInfo.sizeUnit}` : "-";
  const grade = farmInfo.carbon_grade ?? farmInfo.carbonGrade ?? "C";

  return (
    <div className={styles.page}>
      <div className={styles.stepTrackerWrapper}>
        <StepBar />
      </div>

      <div className={styles.container}>
        <div className={styles.cardHeader}>
          <div className={styles.iconBox}>
            <FileText size={28} className={styles.icon} />
          </div>
          <div className={styles.headerTitles}>
            <EyebrowPill>Your Farm Report</EyebrowPill>
            <h1 className={styles.title}>Download your report</h1>
            <p className={styles.subtitle}>
              Save a PDF copy of your farm analysis. Every download is kept in
              your history below.
            </p>
          </div>
        </div>

        {/* Current report summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Region</span>
            <span className={styles.summaryVal}>{regionLabel}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Crop</span>
            <span className={styles.summaryVal}>{cropLabel}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Farm size</span>
            <span className={styles.summaryVal}>{sizeLabel}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Carbon grade</span>
            <span className={`${styles.gradeBadge} ${gradeClass(grade)}`}>
              Grade {grade}
            </span>
          </div>
        </div>

        <Button onClick={handleDownload} fullWidth>
          <Download size={17} /> Download report (PDF)
        </Button>

        {/* Download history */}
        <div className={styles.historySection}>
          <h2 className={styles.historyTitle}>
            <Clock size={15} /> Previous downloads
          </h2>

          {savedReports.length === 0 ? (
            <div className={styles.emptyHistory}>
              No downloads yet. Your saved reports will appear here.
            </div>
          ) : (
            <ul className={styles.historyList}>
              {savedReports.map((r) => (
                <li key={r.id} className={styles.historyItem}>
                  <div className={styles.historyMain}>
                    <span className={styles.historyName}>
                      {(REGION_NAMES[r.region] || r.region)} ·{" "}
                      {r.cropType.charAt(0).toUpperCase() + r.cropType.slice(1)}
                    </span>
                    <span className={styles.historyDate}>
                      {new Date(r.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.historyTags}>
                    <span className={styles.historyHealth}>
                      {HEALTH_LABEL[r.healthStatus] || r.healthStatus}
                    </span>
                    <span className={`${styles.gradeBadge} ${gradeClass(r.carbonGrade)}`}>
                      {r.carbonGrade}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.calloutWrapper}>
          <InfoCallout icon={<TrendingUp size={15} />}>
            <strong>Tip.</strong> Saving a report also unlocks your historical
            trends. See how your farm changes over time on the Progress page.
          </InfoCallout>
        </div>

        <button
          onClick={() => navigate("/progress")}
          className={styles.secondaryLink}
          aria-label="Go to progress and trends"
        >
          View my trends <ArrowRight size={15} />
        </button>
      </div>

      <PrintableReport farmInfo={farmInfo} />
    </div>
  );
};
