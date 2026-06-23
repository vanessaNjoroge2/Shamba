import React from "react";
import styles from "./InfoCallout.module.css";

export interface InfoCalloutProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * InfoCallout component provides visual warnings or explanations.
 */
export const InfoCallout: React.FC<InfoCalloutProps> = ({
  icon,
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.callout} ${className}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.text}>{children}</div>
    </div>
  );
};
