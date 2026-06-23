import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../hooks";
import { LogoutButton } from "../../shared";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell renders the main application navigation header and layouts post-login pages.
 */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.appShell}>
      {/* Navigation Header - Rendered only if authenticated */}
      {isAuthenticated && (
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
          <div className={styles.navContainer}>
            <Link to="/dashboard" className={styles.logoLink} aria-label="Shamba home">
              <span className={styles.logo}>Shamba</span>
            </Link>
            <div className={styles.actions}>
              <button
                onClick={() => navigate("/error")}
                className={styles.navButton}
                aria-label="View error demo page"
              >
                Error Demo
              </button>
              <LogoutButton />
            </div>
          </div>
        </nav>
      )}

      {/* Main Page Content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
};
