import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function OG() {
  const initials = site.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  const bg = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    padding: 64,
    color: "rgba(226,232,240,0.96)",
    backgroundColor: "rgb(9,11,16)",
    backgroundImage:
      "radial-gradient(900px circle at 14% 10%, rgba(124,58,237,0.22), transparent 48%)," +
      "radial-gradient(900px circle at 86% 12%, rgba(217,70,239,0.18), transparent 52%)," +
      "radial-gradient(900px circle at 50% 110%, rgba(37,99,235,0.18), transparent 52%)," +
      "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.55))"
  };

  const chip = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(226,232,240,0.14)",
    backgroundColor: "rgba(16,19,28,0.55)",
    color: "rgba(226,232,240,0.78)",
    fontSize: 14,
    fontWeight: 700 as const
  };

  const miniTag = {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(226,232,240,0.14)",
    backgroundColor: "rgba(16,19,28,0.45)",
    color: "rgba(226,232,240,0.74)",
    fontSize: 13,
    fontWeight: 650 as const
  };

  return new ImageResponse(
    (
      <div style={bg}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundImage:
                  "linear-gradient(90deg, rgb(124,58,237), rgb(217,70,239), rgb(37,99,235))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
              }}
            >
              {initials}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "rgba(226,232,240,0.96)" }}>
                {site.name}
              </div>
              <div style={{ fontSize: 15, color: "rgba(226,232,240,0.68)" }}>
                Portfolio • systems • measurable outcomes
              </div>
            </div>
          </div>

          <div style={chip}>Case studies • receipts • live metrics</div>
        </div>

        {/* Title block */}
        <div style={{ marginTop: 62, display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: -1,
              maxWidth: 1040
            }}
          >
            {site.tagline}
          </div>

          <div style={{ fontSize: 26, lineHeight: 1.35, color: "rgba(226,232,240,0.74)", maxWidth: 980 }}>
            Clear narrative, progressive disclosure, and verifiable artifacts — without fluff.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, color: "rgba(226,232,240,0.60)" }}>{site.url}</div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={miniTag}>Reliability</div>
            <div style={miniTag}>Observability</div>
            <div style={miniTag}>Performance</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
