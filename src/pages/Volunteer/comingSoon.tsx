import { useNavigate } from "react-router-dom";
import type { ComingSoonProps } from "../../interface/interfaces";


export default function ComingSoon({
  title = "Coming Soon",
  subtitle = "We're working on something great. Stay tuned and check back soon.",
  primaryColor = "#1A73E8",
  dashboardPath = "/dashboard",
  buttonLabel = "Go to Dashboard",
}: ComingSoonProps) {
  const navigate = useNavigate();

  const accentLight = `${primaryColor}12`;
  const accentMid = `${primaryColor}28`;

  const handleNavigate = (): void => {
    navigate(dashboardPath);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background circle decorations */}
      <div
        style={{
          position: "absolute",
          top: "-140px",
          right: "-140px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: accentLight,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: accentLight,
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: accentLight,
            border: `1.5px solid ${accentMid}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1.5"
              stroke={primaryColor}
              strokeWidth="2"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1.5"
              stroke={primaryColor}
              strokeWidth="2"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1.5"
              stroke={primaryColor}
              strokeWidth="2"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1.5"
              stroke={primaryColor}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(34px, 7vw, 56px)",
            fontWeight: 800,
            color: "#0d0d0d",
            margin: "0 0 14px",
            letterSpacing: "-2px",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "15px",
            color: "#6b7280",
            lineHeight: 1.75,
            maxWidth: "360px",
            margin: "0 auto 36px",
          }}
        >
          {subtitle}
        </p>

        {/* Dashboard button */}
        <button
          onClick={handleNavigate}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 32px",
            background: primaryColor,
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.18s",
            letterSpacing: "-0.2px",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1.5"
              stroke="white"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1.5"
              stroke="white"
              strokeWidth="2"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1.5"
              stroke="white"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1.5"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
