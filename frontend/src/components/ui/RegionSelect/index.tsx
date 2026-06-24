import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./RegionSelect.module.css";

export interface RegionSelectOption {
  value: string;
  label: string;
}

export interface RegionSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: RegionSelectOption[];
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * A custom dropdown that fully replaces the native <select>. The native control
 * paints its open option list with the operating system's highlight colour
 * (blue on Windows), which cannot be styled reliably. This keeps the whole app
 * on the green Shamba theme.
 */
export const RegionSelect: React.FC<RegionSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={16} className={styles.checkIcon} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
