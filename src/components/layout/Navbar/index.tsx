import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home,
  LayoutDashboard,
  TrendingUp,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAppStore } from "../../../store";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/onboarding", label: "My Farm", Icon: Home },
  { to: "/progress", label: "Progress", Icon: TrendingUp },
];

/** Builds up to two initials from a name or email for the avatar. */
function getInitials(name?: string, email?: string): string {
  const source = (name && name.trim()) || (email ? email.split("@")[0] : "");
  if (!source) return "F";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0]).join("");
  return initials.toUpperCase() || "F";
}

/**
 * Persistent top navigation for authenticated pages. Responsive: the centre
 * links collapse into a hamburger menu on small screens, and the profile
 * actions live in a dropdown (desktop) or inside the mobile menu.
 */
export const Navbar: React.FC = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Farmer");
  const initials = getInitials(user?.name, user?.email);

  // Close the profile dropdown on outside click / Escape.
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const comingSoon = (label: string) => {
    setProfileOpen(false);
    setMobileOpen(false);
    toast.info(`${label} is coming soon.`);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navContainer}>
        {/* Left: home icon + wordmark, both go to the landing page */}
        <div className={styles.brandGroup}>
          <Link to="/" className={styles.homeButton} aria-label="Go to home page">
            <Home size={20} />
          </Link>
          <Link to="/" className={styles.logoLink} aria-label="Shamba home">
            <span className={styles.logo}>Shamba</span>
          </Link>
        </div>

        {/* Center: primary navigation (desktop) */}
        <div className={styles.centerLinks}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={linkClass} end>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right: profile dropdown (desktop) */}
        <div className={styles.rightGroup}>
          <div className={styles.profileWrap} ref={profileRef}>
            <button
              type="button"
              className={styles.profileTrigger}
              onClick={() => setProfileOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <span className={styles.avatar}>{initials}</span>
              <span className={styles.profileName}>{displayName}</span>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ""}`}
              />
            </button>

            {profileOpen && (
              <div className={styles.dropdown} role="menu">
                <button className={styles.dropdownItem} role="menuitem" onClick={() => comingSoon("My Profile")}>
                  <User size={16} /> My Profile
                </button>
                <button className={styles.dropdownItem} role="menuitem" onClick={() => comingSoon("Settings")}>
                  <Settings size={16} /> Settings
                </button>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.dropdownDanger}`} role="menuitem" onClick={handleLogout}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`
              }
              end
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <div className={styles.mobileDivider} />
          <button className={styles.mobileLink} onClick={() => comingSoon("My Profile")}>
            <User size={18} /> My Profile
          </button>
          <button className={styles.mobileLink} onClick={() => comingSoon("Settings")}>
            <Settings size={18} /> Settings
          </button>
          <button className={`${styles.mobileLink} ${styles.dropdownDanger}`} onClick={handleLogout}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      )}
    </nav>
  );
};
