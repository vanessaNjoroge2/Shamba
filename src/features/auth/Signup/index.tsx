import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UserPlus, ArrowRight, Info, Sprout, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks";
import { Button, EyebrowPill, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "../Login/Login.module.css";

/**
 * SignupPage: create a new account (name, email, password, confirm password).
 * On success the farmer is sent to the login screen to sign in.
 */
export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Full name is required";
    if (!isValidEmail(email)) next.email = "Please enter a valid email address";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const success = await signup(name.trim(), email, password);
    setLoading(false);

    if (success) {
      // Signup signs the farmer in automatically, so go straight to onboarding.
      toast.success("Account created! Welcome to Shamba.");
      navigate("/onboarding");
    }
    // failures (e.g. email already registered) are surfaced via toast in the store
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
              <Sprout size={11} /> Empowering East African farmers
            </EyebrowPill>
            <blockquote className={styles.quote}>
              Empowering East African farmers with AI-driven farm intelligence.
            </blockquote>
            <p className={styles.quoteAuthor}>Join thousands of smallholder farmers</p>
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
              <UserPlus size={11} /> Get Started
            </EyebrowPill>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>
              It only takes a minute to start tracking your farm.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Full name */}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Wanjiku Kamau"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.emailInput}
                autoComplete="name"
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
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
                autoComplete="email"
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  autoComplete="new-password"
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
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirm" className={styles.label}>
                Confirm password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={styles.passwordInput}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className={styles.eyeButton}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm && <span className={styles.fieldError}>{errors.confirm}</span>}
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <p className={styles.switchRow}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={styles.linkButton}
            >
              Log in
            </button>
          </p>

          <div className={styles.calloutWrapper}>
            <InfoCallout icon={<Info size={15} />}>
              <strong>Your privacy matters.</strong> We only use your details to
              save your farm reports across visits.
            </InfoCallout>
          </div>
        </div>
      </div>
    </div>
  );
};
