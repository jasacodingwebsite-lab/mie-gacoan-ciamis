import { cn } from "@/lib/utils";

/** Indikator visual cabai 🌶️ sesuai level pedas */
export function SpicyMeter({
  level,
  size = "md",
  showLabel = false,
  className,
}: {
  level: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const emojiSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-xl" : "text-xs";
  const label =
    level === 0
      ? "Tidak Pedas"
      : level <= 2
        ? "Ringan"
        : level <= 4
          ? "Pedas"
          : level <= 6
            ? "Sangat Pedas"
            : "GACOAN 🔥";

  return (
    <span className={cn("inline-flex items-center gap-1", className)} title={`Level ${level} — ${label}`}>
      <span className={cn("leading-none tracking-tight", emojiSize)} aria-hidden>
        {level === 0 ? (
          <span className="text-muted-foreground">◦</span>
        ) : (
          "🌶️".repeat(Math.min(level, 8))
        )}
      </span>
      {showLabel && (
        <span className={cn("font-semibold", size === "sm" ? "text-[10px]" : "text-xs")}>
          Level {level} · {label}
        </span>
      )}
    </span>
  );
}
