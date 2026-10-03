"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/store/admin";

export type OpenStatus = {
  isOpen: boolean;
  label: string;
  /** jam sekarang: HH.MM */
  nowLabel: string;
};

/**
 * Status BUKA/TUTUP otomatis berdasarkan jam operasional di
 * settings (default 08.00–23.00, senin–minggu) memakai waktu browser.
 */
export function useOpenStatus(): OpenStatus {
  const openHour = useAdmin((s) => s.settings.openHour);
  const closeHour = useAdmin((s) => s.settings.closeHour);
  const [status, setStatus] = useState<OpenStatus>({
    isOpen: true,
    label: "Memuat…",
    nowLabel: "",
  });

  useEffect(() => {
    function compute() {
      const now = new Date();
      const h = now.getHours() + now.getMinutes() / 60;
      const isOpen = h >= openHour && h < closeHour;
      const p = (n: number) => String(n).padStart(2, "0");
      setStatus({
        isOpen,
        label: isOpen ? "BUKA" : "TUTUP",
        nowLabel: `${p(now.getHours())}.${p(now.getMinutes())}`,
      });
    }
    compute();
    const t = setInterval(compute, 30_000);
    return () => clearInterval(t);
  }, [openHour, closeHour]);

  return status;
}
