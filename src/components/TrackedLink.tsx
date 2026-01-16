"use client";

import Link from "next/link";
import { forwardRef, useCallback } from "react";
import { trackOutbound, trackCTA } from "@/lib/analytics";

type LinkProps = React.ComponentProps<typeof Link>;
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface TrackedLinkProps extends Omit<LinkProps, "href"> {
    href: string;
    label?: string;
    category?: "outbound" | "cta" | "nav";
    location?: string;
    external?: boolean;
}

/**
 * TrackedLink — A link wrapper that fires analytics events on click
 * 
 * Preserves all existing styling and behavior.
 * Works with both internal Next.js routes and external URLs.
 * 
 * @example
 * <TrackedLink href="https://github.com/..." label="GitHub" category="outbound" external>
 *   GitHub
 * </TrackedLink>
 * 
 * @example
 * <TrackedLink href="/start" label="Start Tour" category="cta" location="hero">
 *   Take the 2-minute tour
 * </TrackedLink>
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
    function TrackedLink(
        { href, label, category = "nav", location, external, onClick, children, ...props },
        ref
    ) {
        const handleClick = useCallback(
            (e: React.MouseEvent<HTMLAnchorElement>) => {
                try {
                    const linkLabel = label || (typeof children === "string" ? children : href);

                    if (category === "outbound" || external) {
                        trackOutbound(href, linkLabel);
                    } else if (category === "cta") {
                        trackCTA(linkLabel, location);
                    }
                    // "nav" category is handled by Cloudflare page view tracking
                } catch {
                    // Never break navigation
                }

                // Call original onClick if provided
                onClick?.(e);
            },
            [href, label, category, location, external, onClick, children]
        );

        // External links use regular anchor tags
        if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return (
                <a
                    ref={ref}
                    href={href}
                    onClick={handleClick}
                    target={external || href.startsWith("http") ? "_blank" : undefined}
                    rel={external || href.startsWith("http") ? "noopener noreferrer" : undefined}
                    {...(props as AnchorProps)}
                >
                    {children}
                </a>
            );
        }

        // Internal links use Next.js Link
        return (
            <Link ref={ref} href={href} onClick={handleClick} {...props}>
                {children}
            </Link>
        );
    }
);
