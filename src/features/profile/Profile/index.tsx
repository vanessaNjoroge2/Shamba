import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Eye, EyeOff, User as UserIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../../../store";
import { Button } from "../../../components/ui";
import styles from "./Profile.module.css";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function getInitials(name?: string, email?: string): string {
  const source = (name && name.trim()) || (email ? email.split("@")[0] : "");
  if (!source) return "F";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return (parts.slice(0, 2).map((p) => p[0]).join("") || "F").toUpperCase();
}

/**
 * Minimalist profile page: edit account details and change password.
 */
export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAppStore();
  const navigate = useNavigate();

  // Account details
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [infoError, setInfoError] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  // Change password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setInfoError("Name is required");
      return;
    }
    if (!isValidEmail(email)) {
      setInfoError("Please enter a valid email address");
      return;
    }
    setInfoError("");
    setSavingInfo(true);
    const result = await updateProfile(name.trim(), email);
    setSavingInfo(false);
    if (result.ok) {
      toast.success("Profile updated.");
    } else {
      setInfoError(result.error || "Could not update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw) {
      setPwError("Enter your current password");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match");
      return;
    }
    setPwError("");
    setSavingPw(true);
    const result = await changePassword(currentPw, newPw);
    setSavingPw(false);
    if (result.ok) {
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password updated.");
    } else {
      setPwError(result.error || "Current password is incorrect");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button
          onClick={() => navigate("/dashboard")}
          className={styles.backLink}
          aria-label="Back to dashboard"
        >
          <ChevronRight size={16} className={styles.backIcon} /> Back to dashboard
        </button>

        {/* Identity header */}
        <div className={styles.identity}>
          <span className={styles.avatar}>{getInitials(user?.name, user?.email)}</span>
          <div>
            <h1 className={styles.name}>{user?.name || "Your profile"}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>

        {/* Account details */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <UserIcon size={16} /> Account details
          </h2>
          <form onSubmit={handleSaveInfo} className={styles.form} noValidate>
            {infoError && <div className={styles.errorMessage}>{infoError}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="pf-name" className={styles.label}>Full name</label>
              <input
                id="pf-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                autoComplete="name"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="pf-email" className={styles.label}>Email address</label>
              <input
                id="pf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                autoComplete="email"
              />
            </div>
            <Button type="submit" disabled={savingInfo}>
              {savingInfo ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </section>

        {/* Change password */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Lock size={16} /> Change password
          </h2>
          <form onSubmit={handleChangePassword} className={styles.form} noValidate>
            {pwError && <div className={styles.errorMessage}>{pwError}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="pf-current" className={styles.label}>Current password</label>
              <input
                id="pf-current"
                type={showPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={styles.input}
                autoComplete="current-password"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="pf-new" className={styles.label}>New password</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="pf-new"
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={styles.passwordInput}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className={styles.eyeButton}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="pf-confirm" className={styles.label}>Confirm new password</label>
              <input
                id="pf-confirm"
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={styles.input}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={savingPw}>
              {savingPw ? "Updating..." : "Update password"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};
