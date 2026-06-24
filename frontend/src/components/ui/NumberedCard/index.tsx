import React from "react";
import styles from "./NumberedCard.module.css";

export interface NumberedCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

/**
 * NumberedCard displays a step number and corresponding title and description.
 */
export const NumberedCard: React.FC<NumberedCardProps> = ({
  number,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <span className={styles.number}>
        {String(number).padStart(2, "0")}
      </span>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
