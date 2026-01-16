"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IntentSwitch } from "./IntentSwitch";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function Header() {
  const pathname = usePathname();

  const links = useMemo(
    () => [
      { href: "/start", label: "Start" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/work", label: "Work" },
      { href: "/evidence", label: "Evidence" }
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const activeLinkRef = useRef<HTMLElement | null>(null);

  const menuId = "mobile-nav-panel";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (buttonRef.current?.contains(t)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    } else {
      buttonRef.current?.focus?.();
    }
  }, [open]);

  useLayoutEffect(() => {
    const updateIndicator = (el: HTMLElement | null, opacity = 1) => {
      if (!indicatorRef.current || !navRef.current || !el) {
        if (indicatorRef.current) indicatorRef.current.style.opacity = "0";
        return;
      }
      const navRect = navRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const left = rect.left - navRect.left;
      indicatorRef.current.style.width = `${rect.width}px`;
      indicatorRef.current.style.transform = `translate3d(${left}px, 0, 0)`;
      indicatorRef.current.style.opacity = `${opacity}`;
    };

    const updateActive = () => {
      const active = navRef.current?.querySelector('[data-nav-link][aria-current="page"]') as HTMLElement | null;
      activeLinkRef.current = active;
      updateIndicator(active, 1);
    };

    updateActive();
    window.addEventListener("resize", updateActive);
    return () => window.removeEventListener("resize", updateActive);
  }, [pathname]);

  const handleIndicatorPreview = (el: HTMLElement | null) => {
    if (!el) return;
    if (indicatorRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const left = rect.left - navRect.left;
      indicatorRef.current.style.width = `${rect.width}px`;
      indicatorRef.current.style.transform = `translate3d(${left}px, 0, 0)`;
      indicatorRef.current.style.opacity = "0.5";
    }
  };

  const handleIndicatorReset = () => {
    if (activeLinkRef.current) {
      if (indicatorRef.current && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const rect = activeLinkRef.current.getBoundingClientRect();
        const left = rect.left - navRect.left;
        indicatorRef.current.style.width = `${rect.width}px`;
        indicatorRef.current.style.transform = `translate3d(${left}px, 0, 0)`;
        indicatorRef.current.style.opacity = "1";
      }
    } else if (indicatorRef.current) {
      indicatorRef.current.style.opacity = "0";
    }
  };

  return (
    <>
      <header
        id="top"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-med ease-out"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-med ease-out",
            "bg-surface/95 backdrop-blur-md",
            "border-b border-border",
            scrolled && "border-border2 shadow-sm"
          )}
        />

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[1px]",
            "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
            "transition-opacity duration-med ease-out",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-[1px]",
            "bg-gradient-to-r from-transparent via-white/30 to-transparent",
            "pointer-events-none"
          )}
        />

        <a
          href="#content"
          className="sr-only focus:not-sr-only absolute left-4 top-3 z-[60] rounded-r-btn bg-surface px-4 py-2 text-sm font-semibold shadow-lg border border-border"
        >
          Skip to content
        </a>

        <div
          className={cn(
            "relative mx-auto flex w-full max-w-container items-center justify-between",
            "px-4 sm:px-6 lg:px-8",
            "transition-all duration-med ease-out",
            "h-16 sm:h-20"
          )}
        >
          <Link
            href="/"
            className={cn(
              "group relative flex items-center gap-2.5 sm:gap-3 rounded-xl",
              "transition-all duration-fast ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
            aria-label={`${site.name} — Home`}
          >
            <div
              className={cn(
                "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl shrink-0",
                "bg-gradient-to-br from-primary via-primary to-secondary",
                "shadow-sm",
                "transition-all duration-fast ease-out",
                "group-hover:shadow-md group-hover:shadow-primary/20 group-hover:scale-[1.02]"
              )}
            >
              <span className="font-bold text-white text-xs leading-none">
                {site.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-med ease-out" />
            </div>

            <div className="flex flex-col leading-tight min-w-0">
              <span
                className={cn(
                  "text-sm font-semibold truncate",
                  "text-fg",
                  "group-hover:text-primary",
                  "transition-colors duration-fast ease-out"
                )}
              >
                {site.name}
              </span>
              <span className="hidden sm:block text-[10px] text-muted leading-tight truncate">
                {site.tagline}
              </span>
            </div>
          </Link>

          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-0.5 relative pb-2"
            aria-label="Primary"
            onMouseLeave={handleIndicatorReset}
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className={cn(
                "absolute -bottom-[1px] left-0 h-[2px] rounded-full z-20",
                "bg-gradient-to-r from-primary to-secondary",
                "opacity-0 transition-[transform,width,opacity] duration-med ease-out"
              )}
              style={{ width: 0, transform: "translate3d(0, 0, 0)" }}
            />
            {links.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-nav-link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg group",
                    "transition-all duration-fast ease-out",
                    "overflow-hidden",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    active
                      ? "text-primary"
                      : "text-muted hover:text-fg"
                  )}
                  onMouseEnter={(e) => handleIndicatorPreview(e.currentTarget)}
                  onFocus={(e) => handleIndicatorPreview(e.currentTarget)}
                  onBlur={handleIndicatorReset}
                >
                  <span className="relative z-10">{l.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 z-0 rounded-lg bg-surface-2 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <IntentSwitch />
            </div>

            <button
              ref={buttonRef}
              type="button"
              className={cn(
                "md:hidden",
                "relative flex h-10 w-10 items-center justify-center rounded-lg",
                "bg-surface border border-border",
                "transition-all duration-fast ease-out",
                "hover:bg-surface-2 hover:border-primary/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                open && "bg-surface-2 border-primary/30"
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <div className="relative w-5 h-5">
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 rounded-full bg-fg/70",
                    "transition-all duration-med ease-out",
                    open ? "top-[9px] rotate-45" : "top-[4px]"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-fg/70",
                    "transition-all duration-med ease-out",
                    open ? "opacity-0 scale-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 rounded-full bg-fg/70",
                    "transition-all duration-med ease-out",
                    open ? "top-[9px] -rotate-45" : "top-[14px]"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          "transition-all duration-med ease-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-fg/10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label="Mobile navigation"
          className={cn(
            "absolute top-0 right-0 h-full w-full max-w-sm",
            "bg-surface border-l border-border",
            "shadow-lg",
            "transition-transform duration-med ease-out",
            "flex flex-col",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm font-semibold text-fg">Navigation</span>
            <button
              onClick={() => setOpen(false)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                "text-muted hover:text-fg hover:bg-surface-2",
                "transition-colors duration-fast ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              )}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 icon-nav" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {links.map((l, idx) => {
                const active = isActivePath(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    ref={idx === 0 ? (el) => { firstItemRef.current = el; } : undefined}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl min-h-[44px]",
                      "text-base font-medium",
                      "transition-all duration-fast ease-out",
                      active
                        ? "bg-primary-tint/10 text-primary border border-primary/20"
                        : "text-muted hover:text-fg hover:bg-surface-2 border border-transparent",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    )}
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-secondary shrink-0" />
                    )}
                    {l.label}
                  </Link>
                );
              })}
            </div>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="sm:hidden">
              <div className="text-xs font-medium text-muted mb-3 px-4">
                Viewing mode
              </div>
              <IntentSwitch />
            </div>
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-xl min-h-[44px]",
                "text-sm font-semibold text-white",
                "bg-gradient-to-r from-primary to-secondary",
                "shadow-sm",
                "transition-all duration-fast ease-out",
                "hover:shadow-md hover:shadow-primary/20 motion-safe:hover:-translate-y-0.5",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
              )}
            >
              Go to Home
              <svg className="w-4 h-4 icon-inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-20" />

      <div id="content" tabIndex={-1} className="sr-only" />
    </>
  );
}
