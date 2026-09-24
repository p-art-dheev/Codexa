import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none">
        <path
          d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5M13.5 5l-3 14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
      className={cn(
        "flex items-center gap-2.5 rounded-md font-semibold tracking-tight",
        className
      )}
    >
      <BrandMark />
      <span
        className={cn("text-[17px]", hideTextOnMobile && "hidden sm:inline")}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
