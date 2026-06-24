import React, { useState } from "react";
import { useNavigate } from "react-router";
import { KeyRound, ArrowRight, Info, Sprout, ChevronRight } from "lucide-react";
import { useAuth } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "../Login/Login.module.css";

/**
 * ForgotPasswordPage: collect an email, "send" a mock 6-digit OTP via toast,
 * then continue to the OTP verification screen to reset the password.
 */
export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      requestPasswordReset(email);
      navigate("/otp");
    }, 600);
  };

  return (
    <div className={styles.authWrapper}>
      {/* Left panel - Photo */}
      <div className={styles.photoPanel}>
        <img
          src={farmerPhoto}
          alt="African farmer standing in maize field"
          className={styles.farmerImg}
        />
        <div className={styles.photoOverlay} />
        <div className={styles.brandOverlay}>
          <span className={styles.brandLogo}>Shamba</span>
          <div>
            <EyebrowPill dark>
              <Sprout size={11} /> We'll get you back in
            </EyebrowPill>
            <blockquote className={styles.quote}>
              Empowering East African farmers with AI-driven farm intelligence.
            </blockquote>
            <p className={styles.quoteAuthor}>Reset your password in two steps</p>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className={styles.formPanel}>
        <div className={styles.mobileHeader}>
          <span className={styles.brandLogo}>Shamba</span>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.headerBlock}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={styles.linkButton}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem" }}
            >
              <ChevronRight size={15} style={{ transform: "rotate(180deg)" }} /> Back to login
            </button>
            <EyebrowPill>
              <KeyRound size={11} /> Password Reset
            </EyebrowPill>
            <h1 className={styles.title}>Forgot password?</h1>
            <p className={styles.subtitle}>
              Enter your email and we'll send you a 6-digit code to reset it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                autoComplete="email"
                required
              />
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Sending code...
                </>
              ) : (
                <>
                  Send Reset Code <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.calloutWrapper}>
            <InfoCallout icon={<Info size={15} />}>
              <strong>Demo note.</strong> For this demo the reset code is shown
              on screen instead of being emailed.
            </InfoCallout>
          </div>
        </div>
      </div>
    </div>
  );
};
