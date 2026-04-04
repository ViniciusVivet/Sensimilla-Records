import { ImageResponse } from "next/og";

export const alt = "Sensimilla Records — selo independente · rap & trap · ZL SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, #1a1f10 0%, #0a0a0a 70%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(200,242,74,0.06)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(200,242,74,0.04)",
            filter: "blur(50px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 60,
              height: 2,
              background: "rgba(200,242,74,0.4)",
            }}
          />
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.45em",
              color: "#9a9a94",
              textTransform: "uppercase" as const,
            }}
          >
            @sensi.rec
          </div>
          <div
            style={{
              width: 60,
              height: 2,
              background: "rgba(200,242,74,0.4)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 120,
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: "#c8f24a",
            lineHeight: 1,
          }}
        >
          SENSIMILLA
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#f4f4f0",
            marginTop: 16,
            letterSpacing: "0.4em",
            opacity: 0.9,
          }}
        >
          RECORDS
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 40,
            fontSize: 15,
            letterSpacing: "0.2em",
            color: "#9a9a94",
          }}
        >
          <span>RAP</span>
          <span style={{ color: "rgba(200,242,74,0.5)" }}>·</span>
          <span>TRAP</span>
          <span style={{ color: "rgba(200,242,74,0.5)" }}>·</span>
          <span>ZONA LESTE SP</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
