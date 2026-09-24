import { BrandMark } from "@/components/brand";

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-1 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <BrandMark className="size-11 rounded-xl" />
          <span className="absolute -inset-1.5 animate-ping rounded-2xl border border-primary/40" />
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
