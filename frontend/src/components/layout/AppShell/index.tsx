import React from "react";
import { useAuth } from "../../../hooks";
import { Navbar } from "../Navbar";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell renders the main application navigation header and layouts post-login pages.
 */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.appShell}>
      {/* Persistent top navigation - rendered only when authenticated */}
      {isAuthenticated && <Navbar />}

      {/* Main Page Content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
};
