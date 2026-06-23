import React, { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../hooks";
import { Modal } from "../../ui";
import styles from "./LogoutButton.module.css";

/**
 * LogoutButton handles logout triggers and displays a confirmation modal.
 */
export const LogoutButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.button}
        aria-label="Log out of Shamba"
      >
        <LogOut size={16} />
        <span className={styles.text}>Log Out</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Log Out"
        description="Are you sure you want to log out? This will clear your current session and redirect you to the login screen."
        confirmText="Yes, Log Out"
        cancelText="Cancel"
      />
    </>
  );
};
