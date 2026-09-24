"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/**
 * Avatar with graceful fallback to initials (Google avatars occasionally 403
 * or are blocked on campus networks). Uses a plain <img> so remote Google
 * image hosts don't need to be whitelisted in next.config.
 */
export function UserAvatar({
  name,
  email,
  image,
  className,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [image]);

  return (
    <span
      className={cn(
        "relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-accent-foreground ring-1 ring-border",
        className
      )}
    >
      {image && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{initials(name, email)}</span>
      )}
      <span className="sr-only">{name || email}</span>
    </span>
  );
}
