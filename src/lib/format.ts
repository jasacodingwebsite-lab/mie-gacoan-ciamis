export function formatRupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

export function formatRupiahShort(n: number): string {
  if (n >= 1000) return "Rp" + (n / 1000).toLocaleString("id-ID") + "K";
  return formatRupiah(n);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
