import React from "react";
import { FarmInfo, HealthStatus } from "../../../types";

const REGION_NAMES: Record<string, string> = {
  nairobi: "Nairobi",
  central: "Central Kenya",
  rift: "Rift Valley",
  western: "Western Kenya",
  coast: "Coast",
  eastern: "Eastern Kenya",
};

const HEALTH_LABEL: Record<HealthStatus, string> = {
  healthy: "Good",
  moderate: "Warning",
  dry: "Critical",
};

const STATUS_COLOR: Record<HealthStatus, string> = {
  healthy: "#2D6A4F",
  moderate: "#C8823E",
  dry: "#C44B2B",
};

const GRADE_COLOR: Record<string, string> = {
  A: "#2D6A4F",
  B: "#C8823E",
  C: "#C44B2B",
};

function normalizeHealth(info: FarmInfo): HealthStatus {
  const api = info.health_status;
  if (api && ["healthy", "moderate", "dry"].includes(api)) return api as HealthStatus;
  return info.healthStatus ?? "moderate";
}

function buildRecommendations(info: FarmInfo, health: HealthStatus): string[] {
  if (info.recommendations) {
    const parsed = info.recommendations
      .split(/\n+/)
      .map((l) => l.replace(/^\s*\d+[.)]\s*/, "").replace(/[‒-―]/g, "-").trim())
      .filter(Boolean);
    if (parsed.length) return parsed;
  }
  return health === "healthy"
    ? [
        "Continue crop monitoring every 2 weeks",
        "Add compost or leaf mold to topsoil",
        "Avoid over-watering in low-lying quadrants",
      ]
    : [
        "Use 50 kg CAN per acre, applied at base of plants",
        "Add 5 cm organic mulch layer to retain moisture",
        "Avoid irrigation during hottest part of day (11am to 3pm)",
      ];
}

/**
 * Print-only farm report. Hidden on screen, revealed by the global print
 * stylesheet (.printable-report in index.css) when window.print() is called.
 * Shared by the dashboard and the Save page so "Download PDF" works from both.
 */
export const PrintableReport: React.FC<{ farmInfo: FarmInfo | null }> = ({ farmInfo }) => {
  if (!farmInfo) return null;

  const health = normalizeHealth(farmInfo);
  const cropLabel = farmInfo.cropType
    ? farmInfo.cropType.charAt(0).toUpperCase() + farmInfo.cropType.slice(1)
    : "-";
  const sizeLabel = farmInfo.farmSize ? `${farmInfo.farmSize} ${farmInfo.sizeUnit}` : "-";
  const irrigationLabel = farmInfo.irrigation
    ? farmInfo.irrigation === "rainfall"
      ? "Rainfall-fed"
      : farmInfo.irrigation.charAt(0).toUpperCase() + farmInfo.irrigation.slice(1)
    : "-";
  const rawRegion = REGION_NAMES[farmInfo.region] || "Central Kenya";
  const regionLabel = rawRegion.includes("Kenya") ? rawRegion : `${rawRegion}, Kenya`;

  const carbonValue = farmInfo.carbon_estimate ?? farmInfo.carbonValue ?? 0;
  const carbonGrade = farmInfo.carbon_grade ?? farmInfo.carbonGrade ?? "C";
  const recommendations = buildRecommendations(farmInfo, health);
  const dateTime = farmInfo.assessment_timestamp
    ? new Date(farmInfo.assessment_timestamp).toLocaleString()
    : new Date().toLocaleString();

  const td: React.CSSProperties = { padding: "5px 0", borderBottom: "1px solid #D8EBD8", color: "#2D3B30" };
  const keyTd: React.CSSProperties = { ...td, width: "35%", fontWeight: 600, color: "#5E7265" };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 17,
    color: "#1A3C2E",
    margin: "18px 0 6px",
  };

  return (
    <div className="printable-report" aria-hidden="true">
      <div style={{ borderBottom: "3px solid #1A3C2E", paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A3C2E", margin: 0 }}>
          Shamba OS
        </h1>
        <p style={{ fontSize: 13, color: "#5E7265", margin: "4px 0 0" }}>Farm Analysis Report</p>
      </div>

      <h2 style={sectionTitle}>Farm Details</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          <tr><td style={keyTd}>Region</td><td style={td}>{regionLabel}</td></tr>
          <tr><td style={keyTd}>Crop type</td><td style={td}>{cropLabel}</td></tr>
          <tr><td style={keyTd}>Farm size</td><td style={td}>{sizeLabel}</td></tr>
          <tr><td style={keyTd}>Irrigation</td><td style={td}>{irrigationLabel}</td></tr>
        </tbody>
      </table>

      <h2 style={sectionTitle}>Farm Health</h2>
      <p style={{ fontSize: 14, color: "#2D3B30", margin: "4px 0" }}>
        Status: <strong style={{ color: STATUS_COLOR[health] }}>{HEALTH_LABEL[health]}</strong>
      </p>

      <h2 style={sectionTitle}>Carbon Footprint</h2>
      <p style={{ fontSize: 14, color: "#2D3B30", margin: "4px 0" }}>
        <strong>{carbonValue} kg CO2</strong> &nbsp;·&nbsp; Grade{" "}
        <strong style={{ color: GRADE_COLOR[carbonGrade] ?? "#1A3C2E" }}>{carbonGrade}</strong>
      </p>

      <h2 style={sectionTitle}>Recommendations</h2>
      <ol style={{ fontSize: 14, color: "#2D3B30", margin: "6px 0", paddingLeft: 20, lineHeight: 1.6 }}>
        {recommendations.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ol>

      <p style={{ fontSize: 12, color: "#5E7265", margin: "16px 0 0" }}>Assessment date: {dateTime}</p>
      <p style={{ fontSize: 12, color: "#5E7265", margin: "4px 0 0" }}>
        Generated by Shamba OS - Agricultural intelligence for East African farmers.
      </p>
    </div>
  );
};
