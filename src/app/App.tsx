import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import farmerPhoto from "@/imports/african_farmer.jpg";
import {
  Leaf,
  Droplets,
  RefreshCw,
  MapPin,
  BarChart2,
  TreePine,
  Phone,
  User,
  ArrowRight,
  TrendingUp,
  Globe,
  Zap,
  CheckCircle,
  Activity,
  ChevronRight,
  WifiOff,
  Sprout,
  Award,
  ThermometerSun,
  Info,
  Clock,
  Flame,
  CloudRain,
  Wheat,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "landing"
  | "login"
  | "signup"
  | "mapping"
  | "analysis"
  | "dashboard"
  | "save"
  | "trends"
  | "error"
  | "design";

type HealthStatus = "healthy" | "moderate" | "dry";

const STEPS = [
  { id: 1, label: "Visit Website", shortLabel: "Visit", Icon: Globe },
  { id: 2, label: "Enter Farm Info", shortLabel: "Farm Info", Icon: MapPin },
  { id: 3, label: "AI Analysis", shortLabel: "Analysis", Icon: Zap },
  { id: 4, label: "View Dashboard", shortLabel: "Dashboard", Icon: BarChart2 },
  { id: 5, label: "Track Progress", shortLabel: "Progress", Icon: TrendingUp },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function EyebrowPill({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.1em] uppercase"
      style={{
        backgroundColor: dark ? "rgba(163,203,176,0.15)" : "#E3F3E6",
        color: dark ? "#A8CBB0" : "#163C2D",
      }}
    >
      {children}
    </span>
  );
}

function NumberedCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-6 flex gap-5 transition-shadow hover:shadow-sm"
      style={{
        backgroundColor: "#E3F3E6",
        borderLeft: "4px solid #163C2D",
      }}
    >
      <span
        className="text-5xl font-bold leading-none shrink-0 select-none"
        style={{
          fontFamily: "var(--font-display)",
          color: "#163C2D",
          opacity: 0.18,
        }}
      >
        {String(number).padStart(2, "0")}
      </span>
      <div>
        <h4
          className="font-semibold text-base mb-1.5"
          style={{ color: "#163C2D", fontFamily: "var(--font-body)" }}
        >
          {title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "#5E7265" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ChevronStepTracker({
  currentStep,
  compact = false,
}: {
  currentStep: number;
  compact?: boolean;
}) {
  return (
    <div
      className="flex items-stretch w-full overflow-hidden rounded-lg"
      role="list"
      aria-label="Progress steps"
    >
      {STEPS.map((step, i) => {
        const isComplete = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isFirst = i === 0;
        const isLast = i === STEPS.length - 1;

        const clipPath = isFirst
          ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
          : isLast
            ? "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 50%)"
            : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 14px 50%)";

        const bg =
          isComplete ? "#163C2D" : isCurrent ? "#2D7A4F" : "#D4EBD8";
        const fg =
          isComplete ? "#A8CBB0" : isCurrent ? "#E3F3E6" : "#8BAA8F";

        const Icon = step.Icon;

        return (
          <div
            key={step.id}
            role="listitem"
            aria-current={isCurrent ? "step" : undefined}
            aria-label={`Step ${step.id}: ${step.label}${isComplete ? " (complete)" : isCurrent ? " (current)" : ""}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors select-none"
            style={{
              clipPath,
              backgroundColor: bg,
              color: fg,
              minHeight: "44px",
              paddingLeft: i === 0 ? "12px" : "18px",
              paddingRight: i === STEPS.length - 1 ? "12px" : "18px",
              marginLeft: i > 0 ? "-2px" : 0,
            }}
          >
            {isComplete ? (
              <CheckCircle size={13} strokeWidth={2.5} />
            ) : (
              <Icon size={13} strokeWidth={2.5} />
            )}
            {!compact && (
              <span className="hidden md:inline truncate">{step.label}</span>
            )}
            {!compact && (
              <span className="md:hidden font-semibold">{step.id}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoCallout({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex gap-3 rounded-xl p-4 text-sm leading-relaxed"
      style={{
        backgroundColor: "#E3F3E6",
        border: "1px solid #A8CBB0",
      }}
    >
      {icon && (
        <span className="shrink-0 mt-0.5" style={{ color: "#163C2D" }}>
          {icon}
        </span>
      )}
      <div style={{ color: "#2D3B30" }}>{children}</div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  fullWidth = false,
  accent = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-[0.97] ${fullWidth ? "w-full" : ""}`}
      style={{
        backgroundColor: accent ? "#C8823E" : "#163C2D",
        color: "#F8F6F2",
        minHeight: "44px",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all hover:bg-[#D4EBD8] ${fullWidth ? "w-full" : ""}`}
      style={{
        border: "1.5px solid #A8CBB0",
        color: "#163C2D",
        minHeight: "44px",
        backgroundColor: "transparent",
      }}
    >
      {children}
    </button>
  );
}

// ─── Hero Illustration SVG ────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 700 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="A farmer stands confidently in a maize field at golden hour sunset, with rolling green hills behind her"
    >
      <defs>
        <radialGradient id="sunGlow" cx="68%" cy="40%" r="38%">
          <stop offset="0%" stopColor="#FFE566" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#F5A623" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B1E00" />
          <stop offset="30%" stopColor="#B84C12" />
          <stop offset="60%" stopColor="#E07828" />
          <stop offset="85%" stopColor="#F5A84A" />
          <stop offset="100%" stopColor="#FFD080" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D6B2A" />
          <stop offset="100%" stopColor="#163C12" />
        </linearGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A4A18" />
          <stop offset="100%" stopColor="#0F2C0E" />
        </linearGradient>
        <radialGradient id="sunDisk" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="60%" stopColor="#FFD000" />
          <stop offset="100%" stopColor="#F5A200" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="700" height="520" fill="url(#sky)" />
      <rect width="700" height="520" fill="url(#sunGlow)" />

      {/* Sun disk */}
      <circle cx="470" cy="200" r="54" fill="url(#sunDisk)" opacity="0.85" />
      <circle cx="470" cy="200" r="38" fill="#FFD000" opacity="0.95" />

      {/* Birds */}
      <path d="M160 148 Q168 142 176 148" stroke="#8B3A00" strokeWidth="1.8" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M198 132 Q207 126 216 132" stroke="#8B3A00" strokeWidth="1.8" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M240 165 Q247 160 254 165" stroke="#8B3A00" strokeWidth="1.5" fill="none" opacity="0.38" strokeLinecap="round" />
      <path d="M580 170 Q587 165 594 170" stroke="#8B3A00" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* Far hills */}
      <path d="M0 330 Q80 285 190 308 Q290 328 400 295 Q500 262 600 285 Q660 300 700 290 L700 520 L0 520 Z" fill="url(#hillFar)" opacity="0.55" />
      <path d="M0 352 Q130 312 260 338 Q380 360 510 328 Q620 300 700 322 L700 520 L0 520 Z" fill="#2A5C28" opacity="0.7" />

      {/* Ground plane */}
      <path d="M0 375 Q350 363 700 377 L700 520 L0 520 Z" fill="url(#ground)" />

      {/* Soil row lines */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${394 + i * 18} Q350 ${390 + i * 18} 700 ${396 + i * 18}`}
          stroke="#163C2D"
          strokeWidth="0.8"
          opacity="0.28"
          fill="none"
        />
      ))}

      {/* Maize left cluster */}
      {(
        [
          [88, -2],
          [122, 6],
          [68, 12],
          [152, -4],
        ] as number[][]
      ).map(([x, off], i) => (
        <g key={`ml${i}`}>
          <line
            x1={x}
            y1="520"
            x2={x + off}
            y2={318 + i * 9}
            stroke="#2D6B2A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d={`M${x} ${420} Q${x - 30} ${402} ${x - 46} ${386}`}
            stroke="#3D8A35"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${x} ${440} Q${x + 33} ${422} ${x + 50} ${408}`}
            stroke="#3D8A35"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx={x + off}
            cy={350 + i * 9}
            rx={7}
            ry={17}
            fill="#C8823E"
            opacity={0.88}
          />
          <line
            x1={x + off}
            y1={333 + i * 9}
            x2={x + off}
            y2={367 + i * 9}
            stroke="#9A5A1A"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>
      ))}

      {/* Maize right cluster */}
      {(
        [
          [570, 2],
          [606, -4],
          [552, 8],
          [625, 0],
        ] as number[][]
      ).map(([x, off], i) => (
        <g key={`mr${i}`}>
          <line
            x1={x}
            y1="520"
            x2={x + off}
            y2={324 + i * 8}
            stroke="#2D6B2A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d={`M${x} ${425} Q${x - 32} ${407} ${x - 48} ${392}`}
            stroke="#3D8A35"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${x} ${445} Q${x + 28} ${428} ${x + 44} ${414}`}
            stroke="#3D8A35"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx={x + off}
            cy={355 + i * 8}
            rx={6.5}
            ry={15}
            fill="#C8823E"
            opacity={0.82}
          />
        </g>
      ))}

      {/* Farmer figure */}
      {/* Shadow */}
      <ellipse cx="348" cy="472" rx="48" ry="9" fill="#163C2D" opacity="0.22" />
      {/* Skirt/dress lower */}
      <path
        d="M316 368 Q302 415 290 466 Q312 474 348 471 Q382 474 406 466 Q394 415 380 368 Z"
        fill="#163C2D"
      />
      {/* Dress pattern bands */}
      <path d="M298 393 Q348 391 398 393" stroke="#1E5C3A" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M293 418 Q348 416 403 418" stroke="#1E5C3A" strokeWidth="1.5" fill="none" opacity="0.55" />
      <path d="M290 444 Q348 442 406 444" stroke="#1E5C3A" strokeWidth="1.5" fill="none" opacity="0.45" />
      {/* Torso */}
      <path d="M315 314 Q300 340 304 368 L392 368 Q396 340 381 314 Z" fill="#163C2D" />
      {/* Neck */}
      <rect x="337" y="300" width="14" height="19" rx="6" fill="#8B5E3C" />
      {/* Head */}
      <circle cx="344" cy="286" r="23" fill="#8B5E3C" />
      {/* Head wrap fabric */}
      <path
        d="M320 276 Q322 250 344 246 Q366 250 368 276 Q360 264 344 262 Q328 264 320 276 Z"
        fill="#C8823E"
      />
      {/* Wrap top knot */}
      <ellipse cx="344" cy="249" rx="9.5" ry="6" fill="#C8823E" />
      <ellipse cx="344" cy="246" rx="5.5" ry="4" fill="#E09A55" />
      {/* Face - minimal, warm */}
      <circle cx="337" cy="284" r="2" fill="#5A3020" opacity="0.45" />
      <circle cx="351" cy="284" r="2" fill="#5A3020" opacity="0.45" />
      <path d="M338 294 Q344 299 350 294" stroke="#5A3020" strokeWidth="1.2" fill="none" opacity="0.38" />
      {/* Arm holding hoe - raised confidently */}
      <path d="M378 330 Q402 312 418 294" stroke="#8B5E3C" strokeWidth="7.5" strokeLinecap="round" />
      {/* Hoe handle */}
      <line x1="418" y1="294" x2="432" y2="262" stroke="#6B4A1E" strokeWidth="4.5" strokeLinecap="round" />
      {/* Hoe blade */}
      <path d="M432 262 Q447 249 452 268 Q446 277 432 262 Z" fill="#8BAA8F" />
      {/* Other arm relaxed */}
      <path d="M315 330 Q294 348 286 362" stroke="#8B5E3C" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Screen: Landing ──────────────────────────────────────────────────────────
function LandingScreen({
  onStart,
  onJump,
}: {
  onStart: () => void;
  onJump: (s: Screen) => void;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F6F2" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 lg:px-12"
        style={{ backgroundColor: "#163C2D" }}
      >
        <span
          className="text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "#E3F3E6",
            letterSpacing: "-0.01em",
          }}
        >
          Shamba
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onJump("design")}
            className="hidden sm:block text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-white/10"
            style={{ color: "#8BAA8F" }}
          >
            Design System
          </button>
          <button
            onClick={() => onJump("login")}
            className="text-sm font-medium px-4 py-2.5 rounded-full transition-all hover:bg-white/10 border"
            style={{
              color: "#E3F3E6",
              borderColor: "rgba(163,203,176,0.35)",
              minHeight: "44px",
            }}
          >
            Log In
          </button>
          <button
            onClick={() => onJump("signup")}
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-90"
            style={{
              backgroundColor: "#C8823E",
              color: "#F8F6F2",
              minHeight: "44px",
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero — real photo */}
      <section className="relative grid lg:grid-cols-[1fr_1.15fr] min-h-[88vh] items-stretch overflow-hidden">
        {/* Text column */}
        <div className="px-6 py-14 lg:px-16 lg:py-24 flex flex-col justify-center order-2 lg:order-1 relative z-10">
          <EyebrowPill>
            <Sprout size={11} />
            AI Agricultural Intelligence
          </EyebrowPill>
          <h1
            className="mt-5 text-5xl lg:text-[3.6rem] font-bold leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Farming{" "}
            <em className="not-italic" style={{ color: "#C8823E" }}>
              in the Dark
            </em>
            ?
          </h1>
          <p
            className="mt-5 text-lg leading-relaxed max-w-[420px]"
            style={{ color: "#5E7265" }}
          >
            Smallholder farmers manage 80% of Africa's food supply — yet most
            lack access to soil data, weather insights, or carbon credits.
            Shamba changes that. No app download. Just answers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton onClick={onStart}>
              Analyze My Farm <ArrowRight size={17} />
            </PrimaryButton>
            <GhostButton onClick={() => onJump("signup")}>
              Create Free Account
            </GhostButton>
          </div>
          <p className="mt-5 text-xs font-medium" style={{ color: "#8BAA8F" }}>
            Free · No password · Works on 2G · Available in Swahili
          </p>
        </div>

        {/* Photo column */}
        <div
          className="order-1 lg:order-2 h-72 sm:h-96 lg:h-auto relative"
          style={{ backgroundColor: "#2A4A20" }}
        >
          <ImageWithFallback
            src={farmerPhoto}
            alt="A smiling African farmer in a traditional straw hat holds freshly harvested tomatoes in a lush green field"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient fade on the left edge so text side bleeds softly on desktop */}
          <div
            className="absolute inset-y-0 left-0 w-24 hidden lg:block pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #F8F6F2 0%, transparent 100%)",
            }}
          />
          {/* Bottom quote overlay */}
          <div
            className="absolute bottom-0 inset-x-0 p-6 lg:p-8"
            style={{
              background:
                "linear-gradient(to top, rgba(22,60,45,0.88) 0%, transparent 100%)",
            }}
          >
            <p
              className="text-base font-medium italic leading-snug max-w-xs"
              style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
            >
              "Now I know exactly what my soil needs, before the season starts."
            </p>
            <p className="mt-1.5 text-xs font-medium" style={{ color: "#A8CBB0" }}>
              — James M., Smallholder farmer, Murang'a
            </p>
          </div>
        </div>
      </section>

      {/* Step tracker */}
      <section
        className="px-6 py-14 lg:px-16"
        style={{ backgroundColor: "#163C2D" }}
      >
        <div className="max-w-5xl mx-auto">
          <EyebrowPill dark>Your Journey</EyebrowPill>
          <h2
            className="mt-4 mb-8 text-2xl lg:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
          >
            From field to insight in 5 steps
          </h2>
          <ChevronStepTracker currentStep={1} />
          <div className="mt-6 grid sm:grid-cols-5 gap-4 pt-2">
            {STEPS.map((s) => (
              <div key={s.id} className="text-center">
                <p
                  className="text-xs leading-snug"
                  style={{ color: "#8BAA8F" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-14 lg:px-16"
        style={{ backgroundColor: "#EBF5ED" }}
      >
        <div className="max-w-5xl mx-auto">
          <EyebrowPill>How Shamba Works</EyebrowPill>
          <h2
            className="mt-4 mb-8 text-2xl lg:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Three phases, one platform
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <NumberedCard
              number={1}
              title="Map Your Farm"
              description="Tell us your crop type, acreage, and water access. Takes under 2 minutes on any phone."
            />
            <NumberedCard
              number={2}
              title="AI Assessment"
              description="Our model cross-references satellite NDVI, soil moisture indices, and 30-day rainfall data for your exact GPS location."
            />
            <NumberedCard
              number={3}
              title="Act on Insights"
              description="Receive plain-language recommendations and a carbon sequestration score you can track over seasons."
            />
          </div>
          <div className="mt-6">
            <InfoCallout icon={<Info size={15} />}>
              <strong>Works offline-first.</strong> If your connection drops
              mid-session, your entered data is saved locally and will sync
              automatically when you reconnect.
            </InfoCallout>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section
        className="px-6 py-14 lg:px-16"
        style={{ backgroundColor: "#163C2D" }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { stat: "14,200+", label: "Farmers analyzed" },
            { stat: "3 countries", label: "Kenya · Uganda · Tanzania" },
            { stat: "Avg. 23%", label: "Yield improvement reported" },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div
                className="text-3xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#E3F3E6",
                }}
              >
                {stat}
              </div>
              <div className="mt-1 text-sm" style={{ color: "#8BAA8F" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-6 py-16 lg:px-16 text-center"
        style={{ backgroundColor: "#F8F6F2" }}
      >
        <h2
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
        >
          Your soil has a story.
          <br />
          Let's read it.
        </h2>
        <p className="mt-3 text-base" style={{ color: "#5E7265" }}>
          No sign-up. No password. Results in under 30 seconds.
        </p>
        <div className="mt-6 flex justify-center">
          <PrimaryButton onClick={onStart} accent>
            Get My Farm Report — Free <ArrowRight size={17} />
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}

// ─── Auth: shared split-panel wrapper ────────────────────────────────────────
function AuthShell({
  children,
  onLogoClick,
}: {
  children: React.ReactNode;
  onLogoClick: () => void;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">
      {/* Left — photo panel (hidden on mobile, shown on lg) */}
      <div className="hidden lg:block relative" style={{ backgroundColor: "#2A4A20" }}>
        <ImageWithFallback
          src={farmerPhoto}
          alt="A smiling African farmer in a traditional straw hat holds freshly harvested tomatoes in a lush green field"
          className="w-full h-full object-cover object-center absolute inset-0"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(22,60,45,0.72) 0%, rgba(22,60,45,0.45) 60%, transparent 100%)" }}
        />
        {/* Brand mark + quote */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <button
            onClick={onLogoClick}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <span
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
            >
              Shamba
            </span>
          </button>
          <div>
            <EyebrowPill dark>
              <Sprout size={11} /> 14,200+ farmers served
            </EyebrowPill>
            <blockquote
              className="mt-4 text-2xl font-bold leading-tight max-w-sm"
              style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
            >
              "The best tool a smallholder farmer has ever had."
            </blockquote>
            <p className="mt-3 text-sm" style={{ color: "#A8CBB0" }}>
              — Agnes W., Kisii County
            </p>
            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["NDVI Satellite Data", "Carbon Monitoring", "Free &amp; Offline-First"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "rgba(163,203,176,0.18)", color: "#A8CBB0", border: "1px solid rgba(163,203,176,0.3)" }}
                  dangerouslySetInnerHTML={{ __html: b }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#EBF5ED" }}
      >
        {/* Mobile-only header */}
        <div
          className="lg:hidden px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: "#163C2D" }}
        >
          <button onClick={onLogoClick}>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
            >
              Shamba
            </span>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20 max-w-lg w-full mx-auto lg:max-w-none lg:mx-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Log In ───────────────────────────────────────────────────────────
function LoginScreen({
  onBack,
  onSignUp,
  onSuccess,
}: {
  onBack: () => void;
  onSignUp: () => void;
  onSuccess: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const otpComplete = otp.every((d) => d !== "");

  return (
    <AuthShell onLogoClick={onBack}>
      {step === "phone" ? (
        <>
          <div className="mb-8">
            <EyebrowPill>
              <User size={11} /> Welcome Back
            </EyebrowPill>
            <h1
              className="mt-4 text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Log in to
              <br />
              your farm
            </h1>
            <p className="mt-3 text-base" style={{ color: "#5E7265" }}>
              Enter your phone number and we'll send a one-time code. No
              password needed.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="login-phone"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#163C2D" }}
              >
                Phone number
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-sm font-medium shrink-0"
                  style={{
                    backgroundColor: "#D4EBD8",
                    border: "2px solid #A8CBB0",
                    color: "#163C2D",
                    minHeight: "52px",
                  }}
                >
                  🇰🇪 +254
                </div>
                <input
                  id="login-phone"
                  type="tel"
                  placeholder="712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className="flex-1 px-4 py-4 rounded-xl text-base font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#E3F3E6",
                    border: "2px solid #A8CBB0",
                    color: "#163C2D",
                    minHeight: "52px",
                  }}
                  autoComplete="tel"
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={!phone.trim() || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 disabled:opacity-40"
              style={{
                backgroundColor: "#163C2D",
                color: "#F8F6F2",
                minHeight: "52px",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  />
                  Sending code…
                </>
              ) : (
                <>
                  Send One-Time Code <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          <InfoCallout icon={<Info size={15} />}>
            <strong>No password required.</strong> We send a 6-digit code via
            SMS. Standard Safaricom &amp; Airtel rates apply.
          </InfoCallout>

          <p className="mt-6 text-sm text-center" style={{ color: "#5E7265" }}>
            Don't have an account?{" "}
            <button
              onClick={onSignUp}
              className="font-semibold underline underline-offset-2"
              style={{ color: "#163C2D" }}
            >
              Create one free
            </button>
          </p>
        </>
      ) : (
        /* OTP step */
        <>
          <div className="mb-8">
            <button
              onClick={() => setStep("phone")}
              className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
              style={{ color: "#5E7265" }}
            >
              <ChevronRight size={15} className="rotate-180" /> Change number
            </button>
            <EyebrowPill>
              <Phone size={11} /> Code Sent
            </EyebrowPill>
            <h1
              className="mt-4 text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Enter your
              <br />
              6-digit code
            </h1>
            <p className="mt-3 text-base" style={{ color: "#5E7265" }}>
              We sent a code to <strong style={{ color: "#163C2D" }}>+254 {phone}</strong>.
              It expires in 10 minutes.
            </p>
          </div>

          {/* OTP boxes */}
          <div
            className="flex gap-2 sm:gap-3 justify-between"
            role="group"
            aria-label="One-time password digits"
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="flex-1 text-center text-2xl font-bold rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  height: "60px",
                  maxWidth: "60px",
                  backgroundColor: digit ? "#163C2D" : "#E3F3E6",
                  border: `2px solid ${digit ? "#163C2D" : "#A8CBB0"}`,
                  color: digit ? "#E3F3E6" : "#163C2D",
                  fontFamily: "var(--font-display)",
                }}
                aria-label={`Digit ${i + 1}`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onSuccess}
              disabled={!otpComplete}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 disabled:opacity-35"
              style={{
                backgroundColor: "#163C2D",
                color: "#F8F6F2",
                minHeight: "52px",
              }}
            >
              Verify &amp; Log In <ArrowRight size={17} />
            </button>
            <button
              onClick={() => { setOtp(["","","","","",""]); setStep("phone"); }}
              className="w-full py-3 text-sm font-medium rounded-full hover:bg-[#D4EBD8] transition-colors"
              style={{ color: "#5E7265", minHeight: "44px" }}
            >
              Resend code
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}

// ─── Screen: Sign Up ──────────────────────────────────────────────────────────
function SignUpScreen({
  onBack,
  onLogin,
  onSuccess,
}: {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const REGIONS = [
    "Nairobi", "Central", "Coast", "Eastern", "Nyanza",
    "Rift Valley", "Western", "North Eastern",
  ];

  const handleCreate = () => {
    if (!name.trim() || !phone.trim() || !agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`sotp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`sotp-${index - 1}`)?.focus();
    }
  };

  const otpComplete = otp.every((d) => d !== "");

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#E3F3E6",
    border: "2px solid #A8CBB0",
    color: "#163C2D",
    minHeight: "52px",
  };

  return (
    <AuthShell onLogoClick={onBack}>
      {step === "details" ? (
        <>
          <div className="mb-8">
            <EyebrowPill>
              <Sprout size={11} /> Free Account
            </EyebrowPill>
            <h1
              className="mt-4 text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Create your
              <br />
              Shamba account
            </h1>
            <p className="mt-3 text-base" style={{ color: "#5E7265" }}>
              Unlock farm history, seasonal trends, and carbon tracking. Takes
              30 seconds. No password ever.
            </p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#163C2D" }}
              >
                Your full name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Wanjiku Kamau"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-xl text-base focus:outline-none focus:ring-2"
                style={inputStyle}
                autoComplete="name"
                autoFocus
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#163C2D" }}
              >
                Phone number
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-sm font-medium shrink-0"
                  style={{
                    backgroundColor: "#D4EBD8",
                    border: "2px solid #A8CBB0",
                    color: "#163C2D",
                    minHeight: "52px",
                  }}
                >
                  🇰🇪 +254
                </div>
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-4 rounded-xl text-base focus:outline-none focus:ring-2"
                  style={inputStyle}
                  autoComplete="tel"
                />
              </div>
              <p className="mt-1.5 text-xs" style={{ color: "#8BAA8F" }}>
                Used for your private farm link — never shared or sold.
              </p>
            </div>

            {/* Region (optional) */}
            <div>
              <label
                htmlFor="signup-region"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#163C2D" }}
              >
                Region{" "}
                <span className="font-normal" style={{ color: "#8BAA8F" }}>
                  (optional — improves accuracy)
                </span>
              </label>
              <select
                id="signup-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-4 rounded-xl text-base focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                style={{
                  ...inputStyle,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238BAA8F' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: "40px",
                }}
              >
                <option value="">Select your region…</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <button
                role="checkbox"
                aria-checked={agreed}
                onClick={() => setAgreed(!agreed)}
                className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center transition-colors mt-0.5"
                style={{
                  backgroundColor: agreed ? "#163C2D" : "#E3F3E6",
                  border: `2px solid ${agreed ? "#163C2D" : "#A8CBB0"}`,
                  minWidth: "24px",
                  minHeight: "24px",
                }}
                aria-label="I agree to the terms"
              >
                {agreed && (
                  <CheckCircle size={13} style={{ color: "#E3F3E6" }} strokeWidth={3} />
                )}
              </button>
              <p className="text-sm leading-relaxed" style={{ color: "#5E7265" }}>
                I agree that Shamba may use my farm data (anonymised) to improve
                AI accuracy. I can delete my data at any time.{" "}
                <a
                  href="#"
                  className="underline font-medium"
                  style={{ color: "#163C2D" }}
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim() || !phone.trim() || !agreed || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 disabled:opacity-40"
              style={{
                backgroundColor: "#163C2D",
                color: "#F8F6F2",
                minHeight: "52px",
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account — Free <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-sm text-center" style={{ color: "#5E7265" }}>
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="font-semibold underline underline-offset-2"
              style={{ color: "#163C2D" }}
            >
              Log in
            </button>
          </p>
        </>
      ) : (
        /* OTP verification */
        <>
          <div className="mb-8">
            <button
              onClick={() => setStep("details")}
              className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
              style={{ color: "#5E7265" }}
            >
              <ChevronRight size={15} className="rotate-180" /> Edit details
            </button>
            <EyebrowPill>
              <CheckCircle size={11} /> Almost done
            </EyebrowPill>
            <h1
              className="mt-4 text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Verify your
              <br />
              number
            </h1>
            <p className="mt-3 text-base" style={{ color: "#5E7265" }}>
              We sent a 6-digit code to{" "}
              <strong style={{ color: "#163C2D" }}>+254 {phone}</strong>. Enter
              it below to activate your account.
            </p>
          </div>

          {/* OTP boxes */}
          <div
            className="flex gap-2 sm:gap-3 justify-between mb-6"
            role="group"
            aria-label="Verification code"
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`sotp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKey(i, e)}
                className="flex-1 text-center text-2xl font-bold rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  height: "60px",
                  maxWidth: "60px",
                  backgroundColor: digit ? "#163C2D" : "#E3F3E6",
                  border: `2px solid ${digit ? "#163C2D" : "#A8CBB0"}`,
                  color: digit ? "#E3F3E6" : "#163C2D",
                  fontFamily: "var(--font-display)",
                }}
                aria-label={`Verification digit ${i + 1}`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <InfoCallout icon={<CheckCircle size={15} />}>
            <strong>Account ready in seconds.</strong> Once verified, your farm
            profile is live and your first report will be saved automatically.
          </InfoCallout>

          <div className="mt-5 space-y-3">
            <button
              onClick={onSuccess}
              disabled={!otpComplete}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 disabled:opacity-35"
              style={{
                backgroundColor: "#163C2D",
                color: "#F8F6F2",
                minHeight: "52px",
              }}
            >
              Confirm &amp; Start Farming <ArrowRight size={17} />
            </button>
            <button
              onClick={() => setOtp(["","","","","",""])}
              className="w-full py-3 text-sm font-medium rounded-full hover:bg-[#D4EBD8] transition-colors"
              style={{ color: "#5E7265", minHeight: "44px" }}
            >
              Resend code
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}

// ─── Screen: Farm Mapping Form ────────────────────────────────────────────────
const CROPS = [
  { id: "maize", label: "Maize", Icon: Wheat },
  { id: "beans", label: "Beans", Icon: Sprout },
  { id: "coffee", label: "Coffee", Icon: Leaf },
  { id: "vegetables", label: "Vegetables", Icon: Leaf },
  { id: "sorghum", label: "Sorghum", Icon: Wheat },
  { id: "cassava", label: "Cassava", Icon: Sprout },
];

const IRRIGATION = [
  {
    id: "rainfall",
    label: "Rainfall only",
    desc: "No added irrigation",
    Icon: CloudRain,
  },
  {
    id: "drip",
    label: "Drip irrigation",
    desc: "Tubes or trickle lines",
    Icon: Droplets,
  },
  {
    id: "furrow",
    label: "Furrow / flood",
    desc: "Channels cut between rows",
    Icon: Activity,
  },
  {
    id: "sprinkler",
    label: "Sprinkler",
    desc: "Overhead water spray",
    Icon: CloudRain,
  },
];

function MappingScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [mobileStep, setMobileStep] = useState(1);
  const [cropType, setCropType] = useState("maize");
  const [farmSize, setFarmSize] = useState("1.5");
  const [sizeUnit, setSizeUnit] = useState("acres");
  const [irrigation, setIrrigation] = useState("rainfall");

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const handleMobileNext = () => {
    if (mobileStep < 3) setMobileStep(mobileStep + 1);
    else onSubmit();
  };

  const handleMobilePrev = () => {
    if (mobileStep > 1) setMobileStep(mobileStep - 1);
    else onBack();
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#EBF5ED" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 lg:px-12 flex items-center gap-4"
        style={{ backgroundColor: "#163C2D" }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: "#A8CBB0", minHeight: "44px", minWidth: "44px" }}
          aria-label="Go back"
        >
          <ChevronRight size={18} className="rotate-180" />
        </button>
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba
        </span>
      </div>

      {/* Step tracker */}
      <div className="px-5 pt-5 lg:px-12">
        <ChevronStepTracker currentStep={2} />
      </div>

      <div className="px-5 py-8 lg:px-12 max-w-3xl mx-auto">
        <EyebrowPill>
          <MapPin size={11} /> Step 2 of 5
        </EyebrowPill>
        <h1
          className="mt-3 text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
        >
          Tell us about your farm
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#5E7265" }}>
          We use this to calibrate the AI model to your exact conditions.
        </p>

        {/* Mobile step indicator */}
        <div className="mt-6 flex gap-2 md:hidden">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor:
                  s <= mobileStep ? "#163C2D" : "#A8CBB0",
              }}
            />
          ))}
        </div>

        {/* Desktop: all fields visible */}
        <div className="hidden md:block mt-8 space-y-8">
          <FieldCropType value={cropType} onChange={setCropType} />
          <FieldFarmSize
            value={farmSize}
            unit={sizeUnit}
            onValueChange={setFarmSize}
            onUnitChange={setSizeUnit}
          />
          <FieldIrrigation value={irrigation} onChange={setIrrigation} />
          <div className="pt-2">
            <PrimaryButton onClick={onSubmit} fullWidth>
              Analyze My Farm <ArrowRight size={17} />
            </PrimaryButton>
          </div>
        </div>

        {/* Mobile: one field at a time */}
        <div className="md:hidden mt-8">
          {mobileStep === 1 && (
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: "#8BAA8F" }}>
                1 of 3 — Crop Type
              </p>
              <FieldCropType value={cropType} onChange={setCropType} />
            </div>
          )}
          {mobileStep === 2 && (
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: "#8BAA8F" }}>
                2 of 3 — Farm Size
              </p>
              <FieldFarmSize
                value={farmSize}
                unit={sizeUnit}
                onValueChange={setFarmSize}
                onUnitChange={setSizeUnit}
              />
            </div>
          )}
          {mobileStep === 3 && (
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: "#8BAA8F" }}>
                3 of 3 — Irrigation Method
              </p>
              <FieldIrrigation value={irrigation} onChange={setIrrigation} />
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <GhostButton onClick={handleMobilePrev}>
              {mobileStep === 1 ? "Back" : "Previous"}
            </GhostButton>
            <PrimaryButton onClick={handleMobileNext} fullWidth>
              {mobileStep < 3 ? (
                <>
                  Next <ArrowRight size={17} />
                </>
              ) : (
                <>
                  Analyze My Farm <ArrowRight size={17} />
                </>
              )}
            </PrimaryButton>
          </div>
        </div>

        <div className="mt-8">
          <InfoCallout icon={<Info size={15} />}>
            <strong>Your privacy matters.</strong> We don't store precise GPS
            coordinates or personally identifiable data without your permission.
            Only region-level data is used for analysis.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
}

function FieldCropType({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend
        className="block text-sm font-semibold mb-3"
        style={{ color: "#163C2D" }}
      >
        What is your primary crop?
      </legend>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CROPS.map(({ id, label, Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: selected ? "#163C2D" : "#E3F3E6",
                color: selected ? "#E3F3E6" : "#2D3B30",
                border: `2px solid ${selected ? "#163C2D" : "#A8CBB0"}`,
                minHeight: "44px",
              }}
              aria-pressed={selected}
            >
              <Icon
                size={20}
                style={{ color: selected ? "#A8CBB0" : "#8BAA8F" }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function FieldFarmSize({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  value: string;
  unit: string;
  onValueChange: (v: string) => void;
  onUnitChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor="farm-size"
        className="block text-sm font-semibold mb-3"
        style={{ color: "#163C2D" }}
      >
        How large is your farm?
      </label>
      <div className="flex gap-3">
        <input
          id="farm-size"
          type="number"
          min="0.1"
          max="5"
          step="0.1"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1 px-4 py-3.5 rounded-xl text-base font-medium focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "#E3F3E6",
            border: "2px solid #A8CBB0",
            color: "#163C2D",
            minHeight: "44px",
          }}
          aria-label="Farm size number"
        />
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "2px solid #A8CBB0" }}
          role="group"
          aria-label="Size unit"
        >
          {["acres", "hectares"].map((u) => (
            <button
              key={u}
              onClick={() => onUnitChange(u)}
              className="px-4 py-3 text-sm font-semibold capitalize transition-colors"
              style={{
                backgroundColor: unit === u ? "#163C2D" : "#E3F3E6",
                color: unit === u ? "#E3F3E6" : "#5E7265",
                minHeight: "44px",
              }}
              aria-pressed={unit === u}
            >
              {u.slice(0, u === "hectares" ? 2 : 2)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs" style={{ color: "#8BAA8F" }}>
        Shamba is optimised for farms 0.5–5 acres (0.2–2 ha)
      </p>
    </div>
  );
}

function FieldIrrigation({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend
        className="block text-sm font-semibold mb-3"
        style={{ color: "#163C2D" }}
      >
        How do you water your crops?
      </legend>
      <div className="grid sm:grid-cols-2 gap-3">
        {IRRIGATION.map(({ id, label, desc, Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
              style={{
                backgroundColor: selected ? "#163C2D" : "#E3F3E6",
                border: `2px solid ${selected ? "#163C2D" : "#A8CBB0"}`,
                minHeight: "44px",
              }}
              aria-pressed={selected}
            >
              <Icon
                size={20}
                style={{ color: selected ? "#A8CBB0" : "#8BAA8F", flexShrink: 0 }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: selected ? "#E3F3E6" : "#163C2D" }}
                >
                  {label}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: selected ? "#8BAA8F" : "#5E7265" }}
                >
                  {desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ─── Screen: AI Analysis Loading ──────────────────────────────────────────────
function AnalysisScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = [
    "Locating satellite imagery…",
    "Calculating NDVI soil index…",
    "Cross-referencing rainfall data…",
    "Generating recommendations…",
    "Estimating carbon footprint…",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + Math.random() * 4 + 1;
      });
    }, 280);
    const phaseInterval = setInterval(() => {
      setPhase((p) => (p < phases.length - 1 ? p + 1 : p));
    }, 1400);
    return () => {
      clearInterval(interval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#EBF5ED" }}
    >
      <div
        className="px-5 py-4 lg:px-12"
        style={{ backgroundColor: "#163C2D" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba
        </span>
      </div>

      <div className="px-5 pt-5 lg:px-12">
        <ChevronStepTracker currentStep={3} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center max-w-lg mx-auto w-full">
        {/* Animated icon cluster */}
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: "#E3F3E6", border: "2px solid #A8CBB0" }}
          role="status"
          aria-label="Analysis in progress"
        >
          <Leaf
            size={40}
            style={{ color: "#163C2D" }}
            className="animate-pulse"
          />
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: i === 0 ? "#163C2D" : i === 1 ? "#C8823E" : "#8BAA8F",
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 120}deg) translateX(52px) translateY(-50%)`,
                animation: `spin 2.4s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        <EyebrowPill>
          <Activity size={11} /> AI Analysis Running
        </EyebrowPill>
        <h2
          className="mt-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
        >
          Analyzing your farm conditions…
        </h2>
        <p
          className="mt-3 text-base h-6 transition-all duration-500"
          style={{ color: "#5E7265" }}
        >
          {phases[phase]}
        </p>

        {/* Progress bar */}
        <div
          className="mt-8 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: "#C8DFCB", height: "8px" }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: "#163C2D",
            }}
          />
        </div>
        <p className="mt-3 text-xs tabular-nums" style={{ color: "#8BAA8F" }}>
          {Math.round(progress)}% complete · Usually takes 15–30 seconds
        </p>

        <InfoCallout icon={<Clock size={15} />}>
          <strong>Did you know?</strong> Shamba analyzes over 40 satellite data
          points per farm, including soil carbon density, cloud-cover adjusted
          NDVI, and 90-day precipitation trends.
        </InfoCallout>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(var(--start-deg, 0deg)) translateX(52px) translateY(-50%); } to { transform: rotate(calc(var(--start-deg, 0deg) + 360deg)) translateX(52px) translateY(-50%); } }
      `}</style>
    </div>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────
const HEALTH_CONFIG: Record<
  HealthStatus,
  {
    label: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    color: string;
    bg: string;
    border: string;
    iconLabel: string;
  }
> = {
  healthy: {
    label: "Healthy",
    Icon: Leaf,
    color: "#2D7A4F",
    bg: "#D6F0E0",
    border: "#7DCCA0",
    iconLabel: "Green leaf — farm is healthy",
  },
  moderate: {
    label: "Moderate Stress",
    Icon: ThermometerSun,
    color: "#C8823E",
    bg: "#FDF0E3",
    border: "#E8B078",
    iconLabel: "Thermometer — moderate heat stress",
  },
  dry: {
    label: "Drought Risk",
    Icon: Flame,
    color: "#C44B2B",
    bg: "#FDEAE6",
    border: "#E89080",
    iconLabel: "Flame — high drought risk",
  },
};

function DashboardScreen({
  onSave,
  onTrends,
  onError,
}: {
  onSave: () => void;
  onTrends: () => void;
  onError: () => void;
}) {
  const health: HealthStatus = "moderate";
  const cfg = HEALTH_CONFIG[health];
  const HealthIcon = cfg.Icon;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#EBF5ED" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 lg:px-12"
        style={{ backgroundColor: "#163C2D" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
          >
            Shamba
          </span>
          <div className="flex gap-2">
            <button
              onClick={onTrends}
              className="text-xs font-medium px-3 py-2 rounded-full hover:bg-white/10"
              style={{ color: "#A8CBB0", minHeight: "44px" }}
            >
              <TrendingUp size={14} className="inline mr-1.5" />
              Trends
            </button>
            <button
              onClick={onError}
              className="text-xs font-medium px-3 py-2 rounded-full hover:bg-white/10"
              style={{ color: "#A8CBB0", minHeight: "44px" }}
            >
              <WifiOff size={14} className="inline mr-1.5" />
              Error demo
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 lg:px-12">
        <ChevronStepTracker currentStep={4} />
      </div>

      <div className="px-5 py-8 lg:px-12 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <EyebrowPill>
              <BarChart2 size={11} /> Your Farm Report
            </EyebrowPill>
            <h1
              className="mt-2 text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Farm Analysis
            </h1>
            <p className="text-sm mt-1" style={{ color: "#5E7265" }}>
              Maize · 1.5 acres · Rainfall-fed · Murang'a, Kenya
            </p>
          </div>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: "#C8823E",
              color: "#F8F6F2",
              minHeight: "44px",
            }}
          >
            <User size={15} /> Save My Farm
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Card 1: Farm Health */}
          <div
            className="rounded-2xl p-6 flex flex-col"
            style={{
              backgroundColor: "#E3F3E6",
              border: "1.5px solid #A8CBB0",
            }}
          >
            <EyebrowPill>Farm Health Status</EyebrowPill>
            <div className="mt-5 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: cfg.bg, border: `2px solid ${cfg.border}` }}
                aria-label={cfg.iconLabel}
                role="img"
              >
                <HealthIcon size={26} style={{ color: cfg.color }} />
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: cfg.color }}
                >
                  {cfg.label}
                </div>
                <div
                  className="text-xs mt-0.5 font-medium"
                  style={{ color: "#5E7265" }}
                >
                  NDVI score: 0.42 / 1.00
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#2D3B30" }}>
              Your maize shows signs of mild heat stress. Soil moisture is below
              the seasonal average for Murang'a region. Action recommended
              within 2 weeks.
            </p>
            <div
              className="mt-4 rounded-lg overflow-hidden"
              style={{ backgroundColor: "#C8DFCB", height: "6px" }}
            >
              <div
                className="h-full rounded-lg"
                style={{ width: "42%", backgroundColor: cfg.color }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs" style={{ color: "#8BAA8F" }}>
              <span>Critical</span>
              <span>42 / 100</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Card 2: Recommendation */}
          <div
            className="rounded-2xl p-6 flex flex-col"
            style={{
              backgroundColor: "#E3F3E6",
              border: "1.5px solid #A8CBB0",
            }}
          >
            <EyebrowPill>
              <Sprout size={11} /> Top Recommendation
            </EyebrowPill>
            <h3
              className="mt-5 text-lg font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Apply nitrogen-rich mulch within 14 days
            </h3>

            {/* Why — visible by default, not hidden */}
            <div
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: "#D4EBD8", border: "1px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#5E7265" }}>
                Why this recommendation
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#2D3B30" }}>
                Satellite imagery shows reduced leaf greenness (NDVI: 0.42 vs
                regional baseline 0.61). Nitrogen deficiency is the most likely
                cause given current rainfall patterns.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Use 50 kg CAN per acre, applied at base of plants",
                "Add 5 cm organic mulch layer to retain moisture",
                "Avoid irrigation during hottest part of day (11am–3pm)",
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-sm" style={{ color: "#2D3B30" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: "#163C2D", color: "#E3F3E6" }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Carbon */}
          <div
            className="rounded-2xl p-6 flex flex-col"
            style={{
              backgroundColor: "#E3F3E6",
              border: "1.5px solid #A8CBB0",
            }}
          >
            <EyebrowPill>
              <TreePine size={11} /> Carbon Monitoring
            </EyebrowPill>
            <div className="mt-5">
              <div className="flex items-end gap-2">
                <span
                  className="text-5xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
                >
                  38
                </span>
                <span className="text-lg font-medium mb-2" style={{ color: "#8BAA8F" }}>
                  / 100
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: "#5E7265" }}>
                Carbon Sequestration Score
              </p>
            </div>

            <div
              className="mt-4 p-3 rounded-lg flex items-start gap-3"
              style={{ backgroundColor: "#D4EBD8", border: "1px solid #A8CBB0" }}
            >
              <TreePine size={18} style={{ color: "#2D7A4F", flexShrink: 0, marginTop: "2px" }} />
              <p className="text-sm" style={{ color: "#2D3B30" }}>
                Your farm is sequestering carbon equivalent to{" "}
                <strong>4.2 trees planted this year</strong> — below the
                potential of 11 trees for a healthy 1.5-acre maize plot.
              </p>
            </div>

            <div
              className="mt-4 rounded-lg overflow-hidden"
              style={{ backgroundColor: "#C8DFCB", height: "6px" }}
            >
              <div
                className="h-full rounded-lg"
                style={{ width: "38%", backgroundColor: "#2D7A4F" }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs" style={{ color: "#8BAA8F" }}>
              <span>Low</span>
              <span>Score: 38</span>
              <span>High</span>
            </div>

            <button
              onClick={onTrends}
              className="mt-5 text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
              style={{ color: "#163C2D" }}
            >
              <TrendingUp size={14} />
              View carbon trend history
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Lower callout */}
        <div className="mt-6">
          <InfoCallout icon={<Award size={15} />}>
            <strong>Carbon credit eligibility.</strong> Once your score reaches
            55+, you may qualify for micro carbon credit programs through our
            partner network. Improve soil health to unlock this benefit.
          </InfoCallout>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Save Farm (Optional) ─────────────────────────────────────────────
function SaveFarmScreen({
  onSave,
  onSkip,
}: {
  onSave: () => void;
  onSkip: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#EBF5ED" }}
    >
      <div
        className="px-5 py-4 lg:px-12 flex items-center justify-between"
        style={{ backgroundColor: "#163C2D" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba
        </span>
        <button
          onClick={onSkip}
          className="text-sm px-4 py-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5"
          style={{ color: "#8BAA8F", minHeight: "44px" }}
        >
          Skip for now <ChevronRight size={15} />
        </button>
      </div>

      <div className="px-5 pt-5 lg:px-12">
        <ChevronStepTracker currentStep={5} />
      </div>

      <div className="px-5 py-10 lg:px-12 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#E3F3E6", border: "2px solid #A8CBB0" }}
          >
            <TrendingUp size={28} style={{ color: "#163C2D" }} />
          </div>
          <EyebrowPill>Optional Step</EyebrowPill>
          <h1
            className="mt-3 text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Save your farm report
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: "#5E7265" }}>
            Get a shareable link and unlock <strong>Historical Trends</strong> —
            see how your farm's health and carbon score change over time.
          </p>
        </div>

        <InfoCallout icon={<Info size={15} />}>
          <strong>No password. No account required.</strong> We send you a
          private link by SMS. Your phone number is only used to identify your
          farm across visits — never sold or shared.
        </InfoCallout>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="farmer-name"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#163C2D" }}
            >
              Your name
            </label>
            <input
              id="farmer-name"
              type="text"
              placeholder="e.g. Wanjiku Kamau"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-base focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "#E3F3E6",
                border: "2px solid #A8CBB0",
                color: "#163C2D",
                minHeight: "44px",
              }}
              autoComplete="name"
            />
          </div>
          <div>
            <label
              htmlFor="farmer-phone"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#163C2D" }}
            >
              Phone number
            </label>
            <div className="flex gap-2">
              <div
                className="flex items-center px-3 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: "#D4EBD8",
                  border: "2px solid #A8CBB0",
                  color: "#163C2D",
                  minHeight: "44px",
                }}
              >
                🇰🇪 +254
              </div>
              <input
                id="farmer-phone"
                type="tel"
                placeholder="712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl text-base focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#E3F3E6",
                  border: "2px solid #A8CBB0",
                  color: "#163C2D",
                  minHeight: "44px",
                }}
                autoComplete="tel"
              />
            </div>
          </div>

          <PrimaryButton
            onClick={onSave}
            fullWidth
          >
            Save &amp; Get My Trend Link <ArrowRight size={17} />
          </PrimaryButton>
          <button
            onClick={onSkip}
            className="w-full py-3 text-sm font-medium rounded-full hover:bg-[#D4EBD8] transition-colors"
            style={{ color: "#5E7265", minHeight: "44px" }}
          >
            Maybe later — skip this step
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Historical Trends ────────────────────────────────────────────────
const TREND_DATA = [
  { visit: "Oct 23", health: 65, carbon: 30 },
  { visit: "Dec 23", health: 70, carbon: 34 },
  { visit: "Feb 24", health: 62, carbon: 29 },
  { visit: "Apr 24", health: 75, carbon: 38 },
  { visit: "Jun 24", health: 78, carbon: 41 },
  { visit: "Aug 24", health: 80, carbon: 38 },
];

function TrendsScreen({
  hasTrends,
  onBack,
}: {
  hasTrends: boolean;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EBF5ED" }}>
      <div
        className="px-5 py-4 lg:px-12 flex items-center gap-3"
        style={{ backgroundColor: "#163C2D" }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: "#A8CBB0", minHeight: "44px", minWidth: "44px" }}
          aria-label="Go back to dashboard"
        >
          <ChevronRight size={18} className="rotate-180" />
        </button>
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba
        </span>
      </div>

      <div className="px-5 pt-5 lg:px-12">
        <ChevronStepTracker currentStep={5} />
      </div>

      <div className="px-5 py-8 lg:px-12 max-w-5xl mx-auto">
        <EyebrowPill>
          <TrendingUp size={11} /> Historical Trends
        </EyebrowPill>
        <h1
          className="mt-3 text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
        >
          Your farm over time
        </h1>

        {hasTrends ? (
          <>
            <p className="mt-2 text-sm mb-8" style={{ color: "#5E7265" }}>
              Wanjiku Kamau · Murang'a, Kenya · 6 visits since October 2023
            </p>

            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <h2
                className="text-lg font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
              >
                Farm Health &amp; Carbon Score
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB0" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="visit"
                    tick={{ fill: "#5E7265", fontSize: 12 }}
                    axisLine={{ stroke: "#A8CBB0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#5E7265", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#163C2D",
                      border: "none",
                      borderRadius: "10px",
                      color: "#E3F3E6",
                      fontSize: 13,
                    }}
                    labelStyle={{ color: "#A8CBB0", fontWeight: 600 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ color: "#5E7265", fontSize: 13 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="health"
                    name="Farm Health"
                    stroke="#163C2D"
                    strokeWidth={2.5}
                    dot={{ fill: "#163C2D", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="carbon"
                    name="Carbon Score"
                    stroke="#C8823E"
                    strokeWidth={2.5}
                    dot={{ fill: "#C8823E", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              {[
                { label: "Best Health Score", value: "80", sub: "August 2024", color: "#2D7A4F" },
                { label: "Best Carbon Score", value: "41", sub: "June 2024", color: "#C8823E" },
                { label: "Total Improvement", value: "+23%", sub: "Since first visit", color: "#163C2D" },
              ].map(({ label, value, sub, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-5"
                  style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
                >
                  <p className="text-xs font-semibold" style={{ color: "#8BAA8F" }}>
                    {label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ fontFamily: "var(--font-display)", color }}
                  >
                    {value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#5E7265" }}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div
            className="mt-8 rounded-2xl p-10 text-center"
            style={{ backgroundColor: "#E3F3E6", border: "1.5px dashed #A8CBB0" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "#D4EBD8" }}
            >
              <TrendingUp size={36} style={{ color: "#8BAA8F" }} />
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
            >
              Your trend chart is waiting
            </h2>
            <p
              className="mt-3 text-base leading-relaxed max-w-sm mx-auto"
              style={{ color: "#5E7265" }}
            >
              Trends appear after your <strong>second visit</strong>. Come back
              after trying our recommendations — you'll see your farm's health
              and carbon score change over time.
            </p>
            <div className="mt-8 p-5 rounded-xl text-left" style={{ backgroundColor: "#D4EBD8" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#163C2D" }}>
                What you'll unlock on your next visit:
              </p>
              <div className="space-y-2">
                {[
                  "Farm health score trend line",
                  "Carbon sequestration progress",
                  "Seasonal comparisons",
                  "Recommendation impact tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#2D3B30" }}>
                    <CheckCircle size={14} style={{ color: "#2D7A4F" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <PrimaryButton onClick={onBack}>
                Return to My Dashboard <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Error State ──────────────────────────────────────────────────────
function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EBF5ED" }}>
      <div
        className="px-5 py-4 lg:px-12"
        style={{ backgroundColor: "#163C2D" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center max-w-md mx-auto">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: "#FDEAE6", border: "2px solid #E89080" }}
          role="img"
          aria-label="Connection error"
        >
          <WifiOff size={40} style={{ color: "#C44B2B" }} />
        </div>

        <EyebrowPill>Connection Interrupted</EyebrowPill>

        <h1
          className="mt-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
        >
          We lost the connection
        </h1>
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "#5E7265" }}
        >
          Shamba couldn't reach its servers. This usually happens with
          intermittent mobile data. Please check your connection and try again.
        </p>

        <div
          className="mt-6 p-5 rounded-xl text-left w-full"
          style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={18} style={{ color: "#2D7A4F", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#163C2D" }}>
                Your data is safe
              </p>
              <p className="text-sm mt-1" style={{ color: "#5E7265" }}>
                Everything you entered — crop type, farm size, and irrigation
                method — is saved in your browser. You won't need to re-enter
                it when you reconnect.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
          <PrimaryButton onClick={onRetry} fullWidth>
            <RefreshCw size={17} /> Try Again
          </PrimaryButton>
          <div className="text-xs" style={{ color: "#8BAA8F" }}>
            Error code: NET_ERR_CONNECTION_LOST · {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="mt-6 text-sm" style={{ color: "#5E7265" }}>
          Still having trouble?{" "}
          <a
            href="tel:+254800000000"
            className="font-semibold underline"
            style={{ color: "#163C2D" }}
          >
            Call our helpline
          </a>{" "}
          (free, Safaricom &amp; Airtel)
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Design System Reference ─────────────────────────────────────────
function DesignSystemScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F6F2" }}>
      <div
        className="px-5 py-4 lg:px-12 flex items-center justify-between sticky top-0 z-20"
        style={{ backgroundColor: "#163C2D" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#E3F3E6" }}
        >
          Shamba Design System
        </span>
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 rounded-full hover:bg-white/10"
          style={{ color: "#A8CBB0", minHeight: "44px" }}
        >
          ← Back
        </button>
      </div>

      <div className="px-5 py-10 lg:px-12 max-w-5xl mx-auto space-y-14">

        {/* Color Tokens */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Color Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Forest Green", hex: "#163C2D", role: "Primary, Headlines" },
              { name: "Dark Green", hex: "#2D7A4F", role: "Healthy status" },
              { name: "Mint", hex: "#E3F3E6", role: "Card backgrounds" },
              { name: "Mint BG", hex: "#EBF5ED", role: "Page background" },
              { name: "Sage", hex: "#8BAA8F", role: "Muted text, icons" },
              { name: "Sage Border", hex: "#A8CBB0", role: "Card borders" },
              { name: "Off-White", hex: "#F8F6F2", role: "Base/hero backgrounds" },
              { name: "Charcoal", hex: "#2D3B30", role: "Body text" },
              { name: "Muted Text", hex: "#5E7265", role: "Captions, labels" },
              { name: "Ochre", hex: "#C8823E", role: "Accent / CTA" },
              { name: "Ochre BG", hex: "#FDF0E3", role: "Accent backgrounds" },
              { name: "Dry Red", hex: "#C44B2B", role: "Drought risk status" },
            ].map(({ name, hex, role }) => (
              <div key={hex} className="space-y-2">
                <div
                  className="h-16 rounded-xl border"
                  style={{
                    backgroundColor: hex,
                    borderColor: hex === "#F8F6F2" || hex === "#E3F3E6" || hex === "#EBF5ED" || hex === "#FDF0E3"
                      ? "#A8CBB0"
                      : "transparent",
                  }}
                />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#163C2D" }}>
                    {name}
                  </p>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "#8BAA8F" }}
                  >
                    {hex}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5E7265" }}>
                    {role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Typography Scale
          </h2>
          <div
            className="rounded-2xl p-8 space-y-6"
            style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
          >
            {[
              {
                label: "Display / H1",
                size: "3.6rem",
                weight: "700",
                family: "Playfair Display",
                sample: "Farming in the Dark?",
                meta: "Playfair Display 700 · 3.6rem / 1.08 · Headlines only",
              },
              {
                label: "H2",
                size: "1.875rem",
                weight: "700",
                family: "Playfair Display",
                sample: "Three phases, one platform",
                meta: "Playfair Display 700 · 1.875rem",
              },
              {
                label: "H3",
                size: "1.25rem",
                weight: "700",
                family: "Playfair Display",
                sample: "Apply nitrogen-rich mulch within 14 days",
                meta: "Playfair Display 700 · 1.25rem",
              },
              {
                label: "Body",
                size: "1rem",
                weight: "400",
                family: "DM Sans",
                sample:
                  "Your maize shows signs of mild heat stress. Soil moisture is below the seasonal average for Murang'a region.",
                meta: "DM Sans 400 · 1rem / 1.625",
              },
              {
                label: "Body Small",
                size: "0.875rem",
                weight: "400",
                family: "DM Sans",
                sample:
                  "Satellite imagery shows reduced leaf greenness (NDVI: 0.42 vs regional baseline 0.61).",
                meta: "DM Sans 400 · 0.875rem / 1.625",
              },
              {
                label: "Label / Caption",
                size: "0.75rem",
                weight: "500",
                family: "DM Sans",
                sample: "NDVI score: 0.42 / 1.00",
                meta: "DM Sans 500 · 0.75rem / uppercase tracking for eyebrows",
              },
            ].map(({ label, size, weight, family, sample, meta }) => (
              <div
                key={label}
                className="pb-6 border-b last:border-0 last:pb-0"
                style={{ borderColor: "#A8CBB0" }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <p
                    style={{
                      fontSize: size,
                      fontWeight: weight,
                      fontFamily:
                        family === "Playfair Display"
                          ? "var(--font-display)"
                          : "var(--font-body)",
                      color: "#163C2D",
                      lineHeight: 1.2,
                      maxWidth: "500px",
                    }}
                  >
                    {sample}
                  </p>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold" style={{ color: "#163C2D" }}>
                      {label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#8BAA8F", fontFamily: "monospace" }}>
                      {meta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Spacing Scale
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96].map((px) => (
              <div key={px} className="flex flex-col items-center gap-2">
                <div
                  className="rounded"
                  style={{
                    width: `${px}px`,
                    height: `${px}px`,
                    backgroundColor: "#163C2D",
                    minWidth: "4px",
                    minHeight: "4px",
                  }}
                />
                <span
                  className="text-xs tabular-nums"
                  style={{ color: "#8BAA8F", fontFamily: "monospace" }}
                >
                  {px}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#163C2D" }}
          >
            Reusable Components
          </h2>

          <div className="space-y-8">
            {/* Eyebrow pills */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Eyebrow Pills
              </p>
              <div className="flex flex-wrap gap-3">
                <EyebrowPill>AI Agricultural Platform</EyebrowPill>
                <EyebrowPill><Sprout size={11} /> Farm Health Status</EyebrowPill>
                <EyebrowPill><TrendingUp size={11} /> Historical Trends</EyebrowPill>
                <EyebrowPill dark><Activity size={11} /> Analysis Running</EyebrowPill>
              </div>
              <p className="text-xs mt-4" style={{ color: "#8BAA8F" }}>
                Use for section labels, status indicators. Always uppercase + tracked. Never for primary content.
              </p>
            </div>

            {/* Numbered cards */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Numbered Cards — Use ONLY for ordered phases/steps
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberedCard number={1} title="Map Your Farm" description="Tell us your crop type, acreage, and water access. Takes under 2 minutes on any phone." />
                <NumberedCard number={2} title="AI Assessment" description="Cross-references satellite NDVI, soil moisture indices, and 30-day rainfall data." />
              </div>
            </div>

            {/* Chevron step tracker */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Chevron Step Tracker — Sequential flows only
              </p>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step}>
                    <p className="text-xs mb-2" style={{ color: "#8BAA8F" }}>
                      Step {step} active
                    </p>
                    <ChevronStepTracker currentStep={step} />
                  </div>
                ))}
              </div>
            </div>

            {/* Info callouts */}
            <div
              className="rounded-2xl p-6 space-y-3"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Info Callout — Contextual help only
              </p>
              <InfoCallout icon={<Info size={15} />}>
                <strong>Works offline-first.</strong> If your connection drops mid-session, your entered data is saved locally.
              </InfoCallout>
              <InfoCallout icon={<Award size={15} />}>
                <strong>Carbon credit eligibility.</strong> Once your score reaches 55+, you may qualify for micro carbon credit programs.
              </InfoCallout>
            </div>

            {/* Buttons */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Buttons — Min 44px tap target
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton>Primary Action <ArrowRight size={17} /></PrimaryButton>
                <PrimaryButton accent>Accent CTA <ArrowRight size={17} /></PrimaryButton>
                <GhostButton>Secondary</GhostButton>
              </div>
            </div>

            {/* Health status variants */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E3F3E6", border: "1.5px solid #A8CBB0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8BAA8F" }}>
                Health Status — Icon + color + text (never color alone)
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {(["healthy", "moderate", "dry"] as HealthStatus[]).map((status) => {
                  const c = HEALTH_CONFIG[status];
                  const Icon = c.Icon;
                  return (
                    <div
                      key={status}
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{ backgroundColor: c.bg, border: `2px solid ${c.border}` }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${c.color}22` }}
                      >
                        <Icon size={20} style={{ color: c.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.color }}>
                          {c.label}
                        </p>
                        <p className="text-xs" style={{ color: "#5E7265" }}>
                          {status === "healthy" ? "NDVI: 0.72" : status === "moderate" ? "NDVI: 0.42" : "NDVI: 0.21"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [hasTrends] = useState(false);
  const [analysisTimer, setAnalysisTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const goto = (s: Screen) => setScreen(s);

  const startAnalysis = () => {
    goto("analysis");
    const t = setTimeout(() => goto("dashboard"), 4200);
    setAnalysisTimer(t);
  };

  useEffect(() => {
    return () => {
      if (analysisTimer) clearTimeout(analysisTimer);
    };
  }, [analysisTimer]);

  return (
    <div className="min-h-screen">
      {screen === "landing" && (
        <LandingScreen onStart={() => goto("mapping")} onJump={goto} />
      )}
      {screen === "login" && (
        <LoginScreen
          onBack={() => goto("landing")}
          onSignUp={() => goto("signup")}
          onSuccess={() => goto("dashboard")}
        />
      )}
      {screen === "signup" && (
        <SignUpScreen
          onBack={() => goto("landing")}
          onLogin={() => goto("login")}
          onSuccess={() => goto("mapping")}
        />
      )}
      {screen === "mapping" && (
        <MappingScreen onBack={() => goto("landing")} onSubmit={startAnalysis} />
      )}
      {screen === "analysis" && <AnalysisScreen />}
      {screen === "dashboard" && (
        <DashboardScreen
          onSave={() => goto("save")}
          onTrends={() => goto("trends")}
          onError={() => goto("error")}
        />
      )}
      {screen === "save" && (
        <SaveFarmScreen
          onSave={() => goto("trends")}
          onSkip={() => goto("trends")}
        />
      )}
      {screen === "trends" && (
        <TrendsScreen hasTrends={hasTrends} onBack={() => goto("dashboard")} />
      )}
      {screen === "error" && (
        <ErrorScreen onRetry={() => goto("analysis")} />
      )}
      {screen === "design" && (
        <DesignSystemScreen onBack={() => goto("landing")} />
      )}
    </div>
  );
}
