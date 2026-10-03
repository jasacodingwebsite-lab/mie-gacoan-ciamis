"use client";

import { cn } from "@/lib/utils";
import { useOpenStatus } from "@/lib/hooks/use-open-status";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useAdmin } from "@/lib/store/admin";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Badge status BUKA/TUTUP — otomatis berdasarkan jam browser
 * dan jam operasional dari settings (default 08.00–23.00).
 */
export function OpenStatusBadge({
  dark = false,
  showTime = false,
}: {
  dark?: boolean;
  showTime?: boolean;
}) {
  const mounted = useMounted();
  const status = useOpenStatus();
  const openHour = useAdmin((s) => s.settings.openHour);
  const closeHour = useAdmin((s) => s.settings.closeHour);

  if (!mounted) {
    return <Skeleton className="h-7 w-32 rounded-full" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide",
          status.isOpen
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700",
          dark && (status.isOpen ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")
        )}
      >
        <span className="relative flex h-2 w-2" role="img" aria-label={status.isOpen ? "Buka" : "Tutup"}>
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              status.isOpen ? "bg-emerald-500" : "bg-red-500"
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              status.isOpen ? "bg-emerald-500" : "bg-red-500"
            )}
          />
        </span>
        {status.label}
      </span>
      {showTime && (
        <span className={cn("text-xs text-muted-foreground", dark && "text-white/50")}>
          {status.isOpen
            ? `· tutup pukul ${String(closeHour).padStart(2, "0")}.00`
            : `· buka pukul ${String(openHour).padStart(2, "0")}.00`}
        </span>
      )}
    </div>
  );
}
