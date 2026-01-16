/**
 * Analytics wrapper for Cloudflare Web Analytics
 * 
 * Cloudflare handles page views automatically.
 * This module provides event tracking utilities for:
 * - Outbound link clicks
 * - CTA button clicks
 * - Custom events
 * 
 * In development: console.log for debugging
 * In production: fire-and-forget (gracefully handles adblockers)
 */

const isDev = process.env.NODE_ENV !== "production";

export interface TrackingProps {
    [key: string]: string | number | boolean | undefined;
}

export interface Attribution {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
}

/**
 * Get stored attribution data from sessionStorage
 */
function getAttribution(): Attribution {
    if (typeof window === "undefined") return {};

    try {
        const stored = sessionStorage.getItem("__analytics_attribution");
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Track a generic event
 * @param eventName - Name of the event
 * @param props - Optional properties to attach
 */
export function track(eventName: string, props?: TrackingProps): void {
    try {
        const attribution = getAttribution();
        const payload = { event: eventName, ...attribution, ...props };

        if (isDev) {
            console.log("[Analytics] track:", eventName, payload);
            return;
        }

        // In production, Cloudflare doesn't support custom events in free tier
        // This is a placeholder for future event tracking integration (PostHog, etc.)
        // For now, we silently capture for potential beacon/localStorage analysis
    } catch {
        // Never break navigation due to analytics
    }
}

/**
 * Track an outbound link click
 * @param url - The destination URL
 * @param label - Optional label for the link (e.g., "GitHub", "Resume")
 */
export function trackOutbound(url: string, label?: string): void {
    try {
        const attribution = getAttribution();
        const payload = {
            event: "outbound_click",
            url,
            label: label || url,
            ...attribution
        };

        if (isDev) {
            console.log("[Analytics] trackOutbound:", url, payload);
            return;
        }

        // Fire outbound beacon - use sendBeacon for reliability on navigation
        if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
            // Placeholder for future analytics endpoint
            // navigator.sendBeacon("/api/analytics", JSON.stringify(payload));
        }
    } catch {
        // Never break navigation due to analytics
    }
}

/**
 * Track a CTA button click
 * @param name - CTA name (e.g., "Start Tour", "View Case Study")
 * @param location - Optional location context (e.g., "hero", "footer")
 */
export function trackCTA(name: string, location?: string): void {
    try {
        const attribution = getAttribution();
        const payload = {
            event: "cta_click",
            name,
            location: location || "unknown",
            ...attribution
        };

        if (isDev) {
            console.log("[Analytics] trackCTA:", name, payload);
            return;
        }

        // Placeholder for future CTA tracking
    } catch {
        // Never break navigation due to analytics
    }
}

/**
 * Track scroll depth milestones
 * @param depth - Scroll depth percentage (25, 50, 75, 100)
 * @param page - Optional page identifier
 */
export function trackScroll(depth: 25 | 50 | 75 | 100, page?: string): void {
    try {
        const key = `__scroll_${depth}_${page || window.location.pathname}`;

        // Only fire once per session per milestone
        if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
            return;
        }

        const attribution = getAttribution();
        const payload = {
            event: "scroll_depth",
            depth,
            page: page || window.location.pathname,
            ...attribution
        };

        if (isDev) {
            console.log("[Analytics] trackScroll:", depth, payload);
        }

        // Mark as tracked
        if (typeof window !== "undefined") {
            sessionStorage.setItem(key, "1");
        }
    } catch {
        // Never break navigation due to analytics
    }
}
