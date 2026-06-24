import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost";
  fullWidth?: boolean;
}

/**
 * Reusable Button component styled via CSS modules using design tokens.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  disabled,
  ...props
}) => {
  const variantClass =
    variant === "accent"
      ? styles.accent
      : variant === "ghost"
        ? styles.ghost
        : styles.primary;

  const widthClass = fullWidth ? styles.fullWidth : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
