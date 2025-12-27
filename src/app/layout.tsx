import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { IntentProvider } from "@/components/IntentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { VitalsReporter } from "@/components/telemetry/VitalsReporter";
import { TelemetryOverlay } from "@/components/telemetry/TelemetryOverlay";
import { StructuredData } from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased min-h-dvh">
        <IntentProvider>
          <Header />
          {/* a11y anchor for skip-to-content */}
          <main id="content" className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10">
            {children}
          </main>
          <Footer />

          <StructuredData />
          <CommandPalette />
          <VitalsReporter />
          <TelemetryOverlay />
        </IntentProvider>
      </body>
    </html>
  );
}
