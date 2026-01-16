"use client";

import { useEffect, useRef } from "react";

export interface Attribution {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
}

const UTM_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
] as const;

const STORAGE_KEY = "__analytics_attribution";

/**
 * Capture UTM parameters and referrer on first landing
 * Stores in sessionStorage (not cookies) for the session duration
 */
export function useAttribution(): Attribution {
    const attributionRef = useRef<Attribution>({});

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        try {
            // Check if we already have attribution data
            const existing = sessionStorage.getItem(STORAGE_KEY);
            if (existing) {
                attributionRef.current = JSON.parse(existing);
                return;
            }

            // Capture new attribution data
            const url = new URL(window.location.href);
            const attribution: Attribution = {};

            // Capture UTM parameters
            for (const param of UTM_PARAMS) {
                const value = url.searchParams.get(param);
                if (value) {
                    attribution[param] = value;
                }
            }

            // Capture referrer (only if not from same origin)
            if (document.referrer) {
                try {
                    const referrerUrl = new URL(document.referrer);
                    if (referrerUrl.origin !== window.location.origin) {
                        attribution.referrer = document.referrer;
                    }
                } catch {
                    // Invalid referrer URL, skip
                }
            }

            // Store if we have any attribution data
            if (Object.keys(attribution).length > 0) {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
                attributionRef.current = attribution;
            }
        } catch {
            // Fail silently - sessionStorage might be unavailable
        }
    }, []);

    return attributionRef.current;
}

/**
 * Get stored attribution data synchronously
 * Use this in event handlers where hooks aren't available
 */
export function getStoredAttribution(): Attribution {
    if (typeof window === "undefined") return {};

    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}
