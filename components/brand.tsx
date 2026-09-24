import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Logo mark: an open "C" (a code bracket bent into a letter) with a
 * terminal cursor parked in its opening — code, and a proctor watching it.
 * Ink tile + emerald cursor; the tile inverts automatically in dark mode.
 */
export function LogoGlyph({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M21.9 10.6A7.6 7.6 0 1 0 21.9 21.4"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect
        x="20.6"
        y="14.1"
        width="4.6"
        height="3.8"
        rx="1"
        className={cn(
          "fill-brand",
          animated && "motion-safe:animate-[cursor-blink_1.1s_steps(1)_infinite]"
        )}
      />
    </svg>
  );
}

export function BrandMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[9px] bg-primary text-primary-foreground",
        "shadow-[0_1px_2px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)]",
        className
      )}
    >
      {/* soft top highlight for depth */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-black/5" />
      <LogoGlyph className="relative size-[78%]" animated={animated} />
    </span>
  );
}

export function Brand({
  href = "/",
  className,
  hideTextOnMobile = false,
}: {
  href?: string;
  className?: string;
  hideTextOnMobile?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("group flex items-center gap-2.5 rounded-md", className)}
    >
      <BrandMark animated />
      <span
        className={cn(
          "text-[17px] font-semibold tracking-[-0.03em]",
          hideTextOnMobile && "hidden sm:inline"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
