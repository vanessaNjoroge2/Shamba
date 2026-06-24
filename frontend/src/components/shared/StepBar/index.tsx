import React from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import { useStep } from "../../../hooks";
import styles from "./StepBar.module.css";

export interface StepBarProps {
  compact?: boolean;
}

/**
 * StepBar rendering the 5-step interactive chevron progress bar.
 */
export const StepBar: React.FC<StepBarProps> = ({ compact = false }) => {
  const { steps, currentStepId, completedStepIds, setCurrentStepId } = useStep();
  const navigate = useNavigate();

  const handleStepClick = (stepId: number, path: string) => {
    // Navigate user to the clicked step route
    navigate(path);
    setCurrentStepId(stepId);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, i) => {
          const isComplete = completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;

          // Clip paths for the chevron shape
          const clipPath = isFirst
            ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
            : isLast
              ? "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 50%)"
              : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 14px 50%)";

          // Calculate state-based styles
          let bgClass = styles.mutedBg;
          let fgClass = styles.mutedFg;

          if (isComplete) {
            bgClass = styles.completeBg;
            fgClass = styles.completeFg;
          } else if (isCurrent) {
            bgClass = styles.currentBg;
            fgClass = styles.currentFg;
          }

          const Icon = step.Icon;

          return (
            <button
              key={step.id}
              role="listitem"
              onClick={() => handleStepClick(step.id, step.path)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${step.id}: ${step.label}${isComplete ? " (complete)" : isCurrent ? " (current)" : ""}`}
              className={`${styles.stepTab} ${bgClass} ${fgClass}`}
              style={{
                clipPath,
                paddingLeft: i === 0 ? "12px" : "18px",
                paddingRight: i === steps.length - 1 ? "12px" : "18px",
                marginLeft: i > 0 ? "-2px" : 0,
              }}
            >
              <span className={styles.iconWrapper}>
                {isComplete ? (
                  <CheckCircle size={13} strokeWidth={2.5} aria-label="Completed" />
                ) : (
                  <Icon size={13} strokeWidth={2.5} />
                )}
              </span>
              {!compact && (
                <span className={styles.labelMd}>{step.label}</span>
              )}
              {!compact && (
                <span className={styles.labelSm}>{step.id}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
