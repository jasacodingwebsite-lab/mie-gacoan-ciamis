"use client";

import { useMemo } from "react";
import { MENU_ITEMS, type MenuItem } from "@/lib/data/menu";
import { PROMOS, type PromoItem } from "@/lib/data/promos";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/data/gallery";
import { useAdmin } from "@/lib/store/admin";

/**
 * Data menu final = MENU_ITEMS (default, dari file) yang ditimpa
 * override dari Admin Panel + item custom tambahan.
 */
export function useMenuData(): MenuItem[] {
  const menuOverrides = useAdmin((s) => s.menuOverrides);
  const customItems = useAdmin((s) => s.customItems);

  return useMemo(() => {
    const base = MENU_ITEMS.map((item) => {
      const ov = menuOverrides[item.id];
      if (!ov) return item;
      const { deleted, ...patch } = ov;
      if (deleted) return null;
      return { ...item, ...patch } as MenuItem;
    }).filter(Boolean) as MenuItem[];

    return [...base, ...customItems];
  }, [menuOverrides, customItems]);
}

export function usePromoData(): PromoItem[] {
  const promoOverrides = useAdmin((s) => s.promoOverrides);
  const customPromos = useAdmin((s) => s.customPromos);

  return useMemo(() => {
    const base = PROMOS.map((p) => {
      const ov = promoOverrides[p.id];
      if (!ov) return p;
      const { deleted, ...patch } = ov as Partial<PromoItem> & { deleted?: boolean };
      if (deleted) return null;
      return { ...p, ...patch } as PromoItem;
    }).filter(Boolean) as PromoItem[];
    return [...base, ...customPromos];
  }, [promoOverrides, customPromos]);
}

export function useGalleryData(): GalleryItem[] {
  const galleryItems = useAdmin((s) => s.galleryItems);
  return galleryItems ?? GALLERY_ITEMS;
}
