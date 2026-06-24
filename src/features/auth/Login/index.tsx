import React, { useState } from "react";
import { useNavigate } from "react-router";
import { User, ArrowRight, Info, Sprout, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "./Login.module.css";

/**
 * Login component: email + password sign-in. On success the farmer continues
 * to onboarding. OTP is no longer part of this flow (it now lives in the
 * forgot-password journey).
 */
export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/onboarding");
    } else {
      setError("Invalid email or password");
    }
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
            <p className={styles.quoteAuthor}>Agnes W., Kisii County</p>
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
            <EyebrowPill>
              <User size={11} /> Welcome Back
            </EyebrowPill>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Log in to view your farm analysis and recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

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

            {/* Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  aria-label="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className={styles.eyeButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <button
                type="button"
                onClick={() => navigate("/forgot")}
                className={styles.linkButton}
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Logging in...
                </>
              ) : (
                <>
                  Log In <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <p className={styles.switchRow}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className={styles.linkButton}
            >
              Sign up
            </button>
          </p>

          <div className={styles.calloutWrapper}>
            <InfoCallout icon={<Info size={15} />}>
              <strong>New to Shamba?</strong> Create a free account to analyse
              your farm and track its health over time.
            </InfoCallout>
          </div>
        </div>
      </div>
    </div>
  );
};
