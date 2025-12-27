// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { IntentSwitch } from "./IntentSwitch";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
  role
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  role?: "menuitem" | undefined;
}) {
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      role={role}
      className={cn(
        "relative inline-flex min-h-[40px] items-center rounded-xl px-3 py-2 text-sm font-medium transition",
        // Material-ish state layer
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition",
        "after:bg-fg/[0.05] hover:after:opacity-100 active:after:bg-fg/[0.08]",
        active ? "text-fg" : "text-fg/70 hover:text-fg"
      )}
    >
      {label}
      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-brand via-brand2 to-brand3"
        />
      )}
    </Link>
  );
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
  const [elevated, setElevated] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  const menuId = "mobile-nav-panel";

  useEffect(() => {
    // Close on route change
    setOpen(false);
  }, [pathname]);

  // Elevation on scroll (subtle “app bar” feel)
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Outside click + Escape to close
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

  // Focus management for the mobile popover
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    } else {
      // restore focus to the menu button when closing
      buttonRef.current?.focus?.();
    }
  }, [open]);

  return (
    <>
      <header
        id="top"
        className={cn(
          "sticky top-0 z-50 border-b border-border/60 bg-card/60 backdrop-blur",
          elevated ? "shadow-soft" : "shadow-none"
        )}
      >
        {/* Skip link (keyboard users) */}
        <a
          href="#content"
          className={cn(
            "sr-only focus:not-sr-only",
            "absolute left-4 top-2 z-[60] rounded-xl bg-card px-3 py-2 text-sm font-semibold text-fg shadow-soft",
            "border border-border/70"
          )}
        >
          Skip to content
        </a>

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className={cn(
              "group inline-flex items-center gap-3 rounded-2xl",
              "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
            )}
            aria-label={`${site.name} — Home`}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-2xl text-white shadow-soft">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand via-brand2 to-brand3" />
              <span className="relative font-semibold">
                {site.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-fg">{site.name}</div>
              <div className="hidden text-xs text-muted sm:block">{site.tagline}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} pathname={pathname} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              ref={buttonRef}
              type="button"
              className={cn(
                "md:hidden",
                "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 text-sm font-semibold text-fg",
                "shadow-soft transition",
                "hover:bg-fg/[0.03] active:bg-fg/[0.06]",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {open ? "×" : "≡"}
              </span>
              <span className="text-sm">Menu</span>
            </button>

            <IntentSwitch />
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden">
            <div
              ref={panelRef}
              id={menuId}
              role="menu"
              aria-label="Mobile navigation"
              className={cn("mx-auto w-full max-w-6xl px-4 pb-3", "motion-safe:animate-fade-up")}
            >
              <div className="rounded-2xl border border-border/70 bg-card/80 shadow-soft backdrop-blur">
                <div className="flex flex-col p-2">
                  {links.map((l, idx) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      ref={idx === 0 ? (el) => { firstItemRef.current = el; } : undefined}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      aria-current={isActivePath(pathname, l.href) ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-[40px] items-center rounded-xl px-3 py-2 text-sm font-medium transition",
                        "after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition",
                        "after:bg-fg/[0.05] hover:after:opacity-100 active:after:bg-fg/[0.08]",
                        isActivePath(pathname, l.href) ? "text-fg" : "text-fg/70 hover:text-fg",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                      )}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Real skip target (so #content always exists without touching layout.tsx) */}
      <div id="content" tabIndex={-1} className="sr-only" />
    </>
  );
}
