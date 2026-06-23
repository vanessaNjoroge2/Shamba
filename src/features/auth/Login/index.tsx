import React, { useState } from "react";
import { useNavigate } from "react-router";
import { User, ArrowRight, Info, Sprout } from "lucide-react";
import { useAuth } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "./Login.module.css";

/**
 * Login component for collecting phone and email, simulating OTP send.
 */
export const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setLoading(true);
    
    // Simulate API latency
    setTimeout(() => {
      setLoading(false);
      login(phone, email);
      navigate("/otp");
    }, 1000);
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
            <EyebrowPill>
              <User size={11} /> Welcome Back
            </EyebrowPill>
            <h1 className={styles.title}>
              Log in to your farm
            </h1>
            <p className={styles.subtitle}>
              Enter your phone number and email address. We will send a 6-digit one-time code to both.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            {/* Phone */}
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone number
              </label>
              <div className={styles.phoneInputWrapper}>
                <div className={styles.countryCode}>🇰🇪 +254</div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className={styles.phoneInput}
                  aria-label="Phone number"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                aria-label="Email address"
                autoComplete="email"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!phone.trim() || !email.trim() || loading}
              fullWidth
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Sending code…
                </>
              ) : (
                <>
                  Send One-Time Code <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.calloutWrapper}>
            <InfoCallout icon={<Info size={15} />}>
              <strong>No password required.</strong> We send a 6-digit code via
              SMS and email. Standard rates apply.
            </InfoCallout>
          </div>
        </div>
      </div>
    </div>
  );
};
