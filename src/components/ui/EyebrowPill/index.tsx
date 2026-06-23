import React from "react";
import styles from "./EyebrowPill.module.css";

export interface EyebrowPillProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

/**
 * EyebrowPill component used for section labels and status indicators.
 */
export const EyebrowPill: React.FC<EyebrowPillProps> = ({
  children,
  dark = false,
  className = "",
}) => {
  const themeClass = dark ? styles.dark : styles.light;

  return (
    <span className={`${styles.pill} ${themeClass} ${className}`}>
      {children}
    </span>
  );
};
