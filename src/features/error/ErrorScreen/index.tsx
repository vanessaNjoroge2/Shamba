import React from "react";
import { useNavigate } from "react-router";
import { WifiOff, CheckCircle, RefreshCw } from "lucide-react";
import { EyebrowPill, Button } from "../../../components/ui";
import styles from "./ErrorScreen.module.css";

/**
 * ErrorScreen component displaying simulated connection drop.
 */
export const ErrorScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/onboarding");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.iconBox} role="img" aria-label="Connection error">
          <WifiOff size={40} className={styles.icon} />
        </div>

        <EyebrowPill>Connection Interrupted</EyebrowPill>

        <h1 className={styles.title}>We lost the connection</h1>
        
        <p className={styles.description}>
          Shamba couldn't reach its servers. This usually happens with intermittent mobile data. Please check your connection and try again.
        </p>

        <div className={styles.callout}>
          <div className={styles.calloutHeader}>
            <CheckCircle size={18} className={styles.checkIcon} />
            <p className={styles.calloutTitle}>Your data is safe</p>
          </div>
          <p className={styles.calloutDesc}>
            Everything you entered - crop type, farm size, and irrigation method - is saved in your browser. You won't need to re-enter it when you reconnect.
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleRetry} fullWidth>
            <RefreshCw size={17} /> Try Again
          </Button>
          <div className={styles.errorCode}>
            Error code: NET_ERR_CONNECTION_LOST · {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className={styles.footer}>
          Still having trouble?{" "}
          <a href="tel:+254800000000" className={styles.helplineLink}>
            Call our helpline
          </a>{" "}
          (free, Safaricom &amp; Airtel)
        </div>
      </div>
    </div>
  );
};
