import "./globals.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { IntentProvider } from "@/components/IntentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { VitalsReporter } from "@/components/telemetry/VitalsReporter";
import { TelemetryOverlay } from "@/components/telemetry/TelemetryOverlay";
import { StructuredData } from "@/components/StructuredData";
import { AttributionCapture } from "@/components/AttributionCapture";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const EngineeringMode = dynamic(
  () => import("@/components/EngineeringMode").then((m) => m.EngineeringMode),
  { ssr: false }
);

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className="antialiased min-h-dvh">
        <IntentProvider>
          <Header />
          {/* a11y anchor for skip-to-content */}
          <main id="content" className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 pb-14 pt-10">
            {children}
          </main>
          <Footer />

          <StructuredData />
          <CommandPalette />
          <VitalsReporter />
          <TelemetryOverlay />
          <EngineeringMode />
          <AttributionCapture />

          {/* Cloudflare Web Analytics - production only, non-blocking */}
          {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
            <Script
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
              strategy="afterInteractive"
            />
          )}
        </IntentProvider>
      </body>
    </html>
  );
}
