import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { Button } from "../Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Modal component used for confirmation dialogs.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} aria-label={cancelText}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button variant="accent" onClick={onConfirm} aria-label={confirmText}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
