import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Brand Technology — Computer Hardware Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "linear-gradient(135deg, #12331a 0%, #1c4d1f 45%, #2e7d32 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #4caf50, #2e7d32)",
            fontSize: "48px",
            fontWeight: 900,
          }}
        >
          BT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "40px", fontWeight: 800 }}>
            Brand Technology
          </div>
          <div style={{ fontSize: "24px", color: "#8bc34a" }}>
            Computer Hardware Store
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "64px", fontWeight: 900, lineHeight: 1.05 }}>
          SSD · RAM · GPU · CPU
        </div>
        <div style={{ fontSize: "64px", fontWeight: 900, lineHeight: 1.05 }}>
          Monitor · Laptop · Gaming
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.12)",
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          Original products · Warranty · Fast delivery
        </div>
      </div>
    </div>,
    { ...size },
  );
}
