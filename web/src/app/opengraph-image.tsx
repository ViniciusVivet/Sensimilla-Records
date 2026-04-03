import { ImageResponse } from "next/og";

export const alt = "Sensimilla Records — gravadora independente";
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
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            fontSize: 108,
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
            fontSize: 36,
            color: "#f4f4f0",
            marginTop: 20,
            letterSpacing: "0.35em",
            opacity: 0.9,
          }}
        >
          RECORDS
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#9a9a94",
            marginTop: 32,
            letterSpacing: "0.15em",
          }}
        >
          Gravadora independente
        </div>
      </div>
    ),
    { ...size },
  );
}
