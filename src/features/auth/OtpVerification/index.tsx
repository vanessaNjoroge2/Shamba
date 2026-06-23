import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Phone, ChevronRight, ArrowRight, Sprout } from "lucide-react";
import { useAuth } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "./OtpVerification.module.css";

/**
 * OtpVerification component validates the 6-digit verification code sent to phone and email.
 */
export const OtpVerification: React.FC = () => {
  const { user, mockOtp, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // 60-second cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // If user somehow gets to OTP without typing credentials, send them to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpComplete = otp.every((d) => d !== "");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpComplete) return;

    setLoading(true);
    const enteredCode = otp.join("");
    
    setTimeout(() => {
      setLoading(false);
      const isOk = verifyOtp(enteredCode);
      if (isOk) {
        // Successful login, always redirect to /onboarding (Step 2: Enter Farm Info)
        navigate("/onboarding");
      } else {
        setError("Invalid code. Please try again.");
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }, 800);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    resendOtp();
    setCooldown(60);
    setError("");
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
              <Sprout size={11} /> 14,200+ farmers served
            </EyebrowPill>
            <blockquote className={styles.quote}>
              "The best tool a smallholder farmer has ever had."
            </blockquote>
            <p className={styles.quoteAuthor}>— Agnes W., Kisii County</p>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className={styles.formPanel}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <span className={styles.brandLogo}>Shamba</span>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.headerBlock}>
            <button
              onClick={() => navigate("/login")}
              className={styles.backButton}
              aria-label="Change phone number and email"
            >
              <ChevronRight size={15} className={styles.rotateBack} /> Change contact details
            </button>
            <div className={styles.pillWrapper}>
              <EyebrowPill>
                <Phone size={11} /> Code Sent
              </EyebrowPill>
            </div>
            <h1 className={styles.title}>
              Enter your 6-digit code
            </h1>
            <p className={styles.subtitle}>
              We sent a code to <strong className={styles.strongText}>+254 {user?.phone}</strong> and <strong className={styles.strongText}>{user?.email}</strong>.
            </p>
          </div>

          <form onSubmit={handleVerify} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* OTP Boxes */}
            <div className={styles.otpGrid} role="group" aria-label="One-time password digits">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el as HTMLInputElement)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`${styles.otpInput} ${digit ? styles.otpInputActive : ""}`}
                  aria-label={`Digit ${i + 1}`}
                  autoFocus={i === 0}
                  required
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={!otpComplete || loading}
              fullWidth
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Verifying code…
                </>
              ) : (
                <>
                  Verify &amp; Log In <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.footerActions}>
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`${styles.resendButton} ${cooldown > 0 ? styles.resendDisabled : ""}`}
              aria-label="Resend verification code"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>

          <div className={styles.calloutWrapper}>
            <InfoCallout icon={<Phone size={15} />}>
              <strong>Didn't get the code?</strong> Check your spam folder or make sure your phone number is correct and has a cellular signal.
            </InfoCallout>
          </div>
        </div>
      </div>
    </div>
  );
};
