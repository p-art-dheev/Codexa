import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** Brand asset paths (files live in /public/brand). */
export const brandAssets = {
  mark: "/brand/codexa-mark.png",
  logo: "/brand/codexa-logo.png",
  logoDark: "/brand/codexa-logo-dark.png",
};

/**
 * The Codexa app icon — the gradient "C" tile. Use anywhere a square logo is
 * needed (collapsed sidebar, loaders, avatars for the product itself).
 * `animated` is kept for API compatibility and adds a subtle hover lift.
 */
export function BrandMark({
  className,
  animated = false,
  priority = false,
}: {
  className?: string;
  animated?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block size-8 shrink-0 overflow-hidden rounded-[9px]",
        "shadow-[0_1px_2px_rgb(0_0_0/0.18),0_0_0_1px_rgb(0_0_0/0.04)]",
        animated &&
          "transition-transform duration-200 motion-safe:group-hover:-translate-y-px",
        className
      )}
    >
      <Image
        src={brandAssets.mark}
        alt=""
        fill
        sizes="64px"
        priority={priority}
        className="object-cover"
      />
    </span>
  );
}

/** Wordmark: "Code" in the foreground colour + "xa" in the brand gradient. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-[18px] font-bold leading-none tracking-[-0.035em]",
        className
      )}
    >
      Code<span className="text-brand-gradient">xa</span>
    </span>
  );
}

/** Mark + wordmark, linked. Used in the navbar, sidebar and footer. */
export function Brand({
  href = "/",
  className,
  hideTextOnMobile = false,
  subtitle = false,
}: {
  href?: string;
  className?: string;
  hideTextOnMobile?: boolean;
  /** Show the "University Coding Platform" line under the name. */
  subtitle?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("group flex items-center gap-2.5 rounded-md", className)}
    >
      <BrandMark animated priority />
      <span
        className={cn(
          "flex flex-col gap-1",
          hideTextOnMobile && "hidden sm:flex"
        )}
      >
        <Wordmark />
        {subtitle && (
          <span className="hidden text-[9px] font-semibold sm:block uppercase leading-none tracking-[0.22em] text-muted-foreground">
            {siteConfig.subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}

/**
 * Full raster logo (tile + wordmark + subtitle) that swaps for a light-text
 * version in dark mode. For large placements only — the navbar uses <Brand/>.
 */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("relative block aspect-[1200/291] w-56", className)}>
      <Image
        src={brandAssets.logo}
        alt={siteConfig.name}
        fill
        sizes="(max-width: 640px) 80vw, 480px"
        priority={priority}
        className="object-contain dark:hidden"
      />
      <Image
        src={brandAssets.logoDark}
        alt={siteConfig.name}
        fill
        sizes="(max-width: 640px) 80vw, 480px"
        priority={priority}
        className="hidden object-contain dark:block"
      />
    </span>
  );
}

/** @deprecated Old SVG glyph — now an alias of the image mark. */
export const LogoGlyph = BrandMark;
