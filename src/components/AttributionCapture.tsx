"use client";

import { useAttribution } from "@/lib/analytics/attribution";

/**
 * AttributionCapture — Captures UTM parameters and referrer on page load
 * 
 * This is a renderless component that runs the attribution capture hook.
 * It must be included once in the app layout to capture attribution data
 * from the initial landing URL.
 */
export function AttributionCapture() {
    useAttribution();
    return null;
}
