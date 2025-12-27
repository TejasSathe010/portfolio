import Script from "next/script";
import { site } from "@/lib/site";

function safeSameAs(urls: Array<string | undefined>) {
  return urls
    .filter(Boolean)
    .filter((u) => u !== "https://www.linkedin.com/") // avoid placeholder
    .filter((u) => typeof u === "string" && (u.startsWith("http://") || u.startsWith("https://")));
}

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url.replace(/\/$/, "")}/#person`,
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": site.url
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US"
    },
    jobTitle: "Software Engineer",
    sameAs: safeSameAs([site.socials.github, site.socials.linkedin])
  };

  return (
    <Script
      id="jsonld-person"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
