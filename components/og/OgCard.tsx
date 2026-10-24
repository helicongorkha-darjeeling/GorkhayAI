/* Shared layout for generated Open Graph images (rendered by next/og). */
export const ogSize = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#f4f7fb",
        background: "linear-gradient(180deg, #050b18 0%, #13244a 62%, #7a4a5c 88%, #ff8a3d 100%)",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <svg width="1200" height="210" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0 }}>
        <path d="M0 300 L0 230 L160 150 L260 190 L420 70 L520 120 L600 40 L700 110 L820 60 L960 170 L1080 120 L1200 200 L1200 300 Z" fill="#0a1428" />
        <path d="M420 70 L455 100 L430 104 L410 88 Z M600 40 L640 80 L610 84 L590 64 Z M820 60 L850 92 L826 92 Z" fill="#f4f7fb" />
        <path d="M0 300 L0 270 L220 230 L420 260 L640 220 L900 255 L1200 230 L1200 300 Z" fill="#050b18" />
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#101d38", display: "flex", position: "relative" }}>
          <div style={{ position: "absolute", right: 7, top: 8, width: 12, height: 12, borderRadius: 6, background: "#ff8a3d" }} />
          <div style={{ position: "absolute", left: 5, bottom: 7, width: 0, height: 0, borderLeft: "17px solid transparent", borderRight: "17px solid transparent", borderBottom: "20px solid #f4f7fb" }} />
        </div>
        GorkhayAI
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980, marginBottom: 150 }}>
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#ff8a3d" }}>{eyebrow}</div>
        <div style={{ fontSize: title.length > 60 ? 54 : 68, fontWeight: 700, lineHeight: 1.08, marginTop: 18 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 28, color: "#b9c5da", marginTop: 20 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
