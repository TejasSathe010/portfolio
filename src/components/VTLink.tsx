"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { startViewTransition } from "@/lib/viewTransitions";

type Props = PropsWithChildren<
  LinkProps & {
    className?: string;
    ariaLabel?: string;
  }
>;

function shouldHandleClick(e: React.MouseEvent<HTMLAnchorElement>) {
  // only left-click, no modifiers, no prevented default
  if (e.defaultPrevented) return false;
  if (e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  return true;
}

export function VTLink({ href, className, children, ariaLabel, ...rest }: Props) {
  const router = useRouter();
  const to = typeof href === "string" ? href : href.pathname ?? "";

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!shouldHandleClick(e)) return;

        // Let external links behave normally (just in case)
        if (typeof to === "string" && (to.startsWith("http://") || to.startsWith("https://"))) return;

        e.preventDefault();
        startViewTransition(() => {
          router.push(to);
        });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
