import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Sprout, Globe, Info, Award } from "lucide-react";
import { useAuth, useStep } from "../../../hooks";
import { Button, EyebrowPill, NumberedCard, InfoCallout } from "../../../components/ui";
import farmerPhoto from "../../../assets/african_farmer.jpg";
import styles from "./LandingScreen.module.css";

/**
 * LandingScreen component displays the public home/marketing page.
 */
export const LandingScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { setCurrentStepId } = useStep();
  const navigate = useNavigate();

  // Set the current step ID to 1 (Visit Website) on page mount
  useEffect(() => {
    setCurrentStepId(1);
  }, [setCurrentStepId]);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/onboarding");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.nav} role="navigation" aria-label="Landing navigation">
        <span className={styles.logo}>Shamba</span>
        <div className={styles.navActions}>
          {isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")} aria-label="Go to dashboard">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={styles.loginBtn}
                aria-label="Log in to account"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={styles.signUpBtn}
                aria-label="Sign up for free account"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroTextCol}>
          <EyebrowPill>
            <Sprout size={11} /> AI Agricultural Intelligence
          </EyebrowPill>
          <h1 className={styles.heroTitle}>
            Farming <em className={styles.heroEm}>in the Dark</em>?
          </h1>
          <p className={styles.heroDesc}>
            Smallholder farmers manage 80% of Africa's food supply - yet most
            lack access to soil data, weather insights, or carbon credits.
            Shamba changes that. No app download. Just answers.
          </p>
          <div className={styles.heroButtons}>
            <Button onClick={handleStart} variant="primary">
              Analyze My Farm <ArrowRight size={17} />
            </Button>
            <Button onClick={() => navigate("/signup")} variant="ghost">
              Create Free Account
            </Button>
          </div>
        </div>

        <div className={styles.heroPhotoCol}>
          <img
            src={farmerPhoto}
            alt="Smiling African farmer in tomatoes field"
            className={styles.heroImg}
          />
          <div className={styles.heroImgOverlay} />
          <div className={styles.quoteBlock}>
            <p className={styles.quoteText}>
              "Now I know exactly what my soil needs, before the season starts."
            </p>
            <p className={styles.quoteAuthor}>
              - James M., Smallholder farmer, Murang'a
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorksSection}>
        <div className={styles.journeyContainer}>
          <EyebrowPill>How Shamba Works</EyebrowPill>
          <h2 className={styles.howItWorksTitle}>
            Three phases, one platform
          </h2>
          <div className={styles.numberedGrid}>
            <NumberedCard
              number={1}
              title="Map Your Farm"
              description="Tell us your crop type, acreage, and water access. Takes under 2 minutes on any phone."
            />
            <NumberedCard
              number={2}
              title="AI Assessment"
              description="Our model cross-references satellite imagery, soil moisture indices, and 30-day rainfall data for your exact GPS location."
            />
            <NumberedCard
              number={3}
              title="Act on Insights"
              description="Receive plain-language recommendations and a carbon sequestration score you can track over seasons."
            />
          </div>
          <div className={styles.howCallout}>
            <InfoCallout icon={<Info size={15} />}>
              <strong>Works offline-first.</strong> If your connection drops
              mid-session, your entered data is saved locally and will sync
              automatically when you reconnect.
            </InfoCallout>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className={styles.socialProofSection}>
        <div className={styles.socialProofGrid}>
          {[
            { stat: "14,200+", label: "Farmers analyzed" },
            { stat: "6 regions", label: "Across Kenya" },
            { stat: "Avg. 23%", label: "Yield improvement reported" },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div className={styles.statNumber}>{stat}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Your soil has a story.
          <br />
          Let's read it.
        </h2>
        <p className={styles.ctaDesc}>
          Free to start. Get your farm insights in under a minute.
        </p>
        <div className={styles.ctaButtonWrapper}>
          <Button onClick={handleStart} variant="accent">
            Get My Farm Report - Free <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </div>
  );
};
