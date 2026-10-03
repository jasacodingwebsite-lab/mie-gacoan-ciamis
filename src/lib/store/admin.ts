"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { site } from "@/lib/data/site";
import type { MenuItem } from "@/lib/data/menu";
import type { PromoItem } from "@/lib/data/promos";
import type { GalleryItem } from "@/lib/data/gallery";

export type MenuOverride = Partial<MenuItem> & { deleted?: boolean };

export type Settings = {
  outletName: string;
  address: string;
  serviceFee: number;
  openHour: number;
  closeHour: number;
  whatsapp: string;
};

type AdminState = {
  menuOverrides: Record<string, MenuOverride>;
  customItems: MenuItem[];
  promoOverrides: Record<string, Partial<PromoItem>>;
  customPromos: PromoItem[];
  galleryItems: GalleryItem[] | null;
  settings: Settings;
  setMenuOverride: (id: string, patch: MenuOverride) => void;
  removeMenuOverride: (id: string) => void;
  addCustomItem: (item: MenuItem) => void;
  updateCustomItem: (id: string, patch: Partial<MenuItem>) => void;
  removeCustomItem: (id: string) => void;
  setPromoOverride: (id: string, patch: Partial<PromoItem>) => void;
  removePromoOverride: (id: string) => void;
  addCustomPromo: (p: PromoItem) => void;
  updateCustomPromo: (id: string, patch: Partial<PromoItem>) => void;
  removeCustomPromo: (id: string) => void;
  setGalleryItems: (items: GalleryItem[] | null) => void;
  setSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
};

const defaultSettings: Settings = {
  outletName: site.outletName,
  address: site.address,
  serviceFee: 2000,
  openHour: site.openHour,
  closeHour: site.closeHour,
  whatsapp: site.whatsapp,
};

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      menuOverrides: {},
      customItems: [],
      promoOverrides: {},
      customPromos: [],
      galleryItems: null,
      settings: defaultSettings,
      setMenuOverride: (id, patch) =>
        set({
          menuOverrides: { ...get().menuOverrides, [id]: { ...get().menuOverrides[id], ...patch } },
        }),
      removeMenuOverride: (id) => {
        const next = { ...get().menuOverrides };
        delete next[id];
        set({ menuOverrides: next });
      },
      addCustomItem: (item) => set({ customItems: [item, ...get().customItems] }),
      updateCustomItem: (id, patch) =>
        set({
          customItems: get().customItems.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        }),
      removeCustomItem: (id) =>
        set({ customItems: get().customItems.filter((i) => i.id !== id) }),
      setPromoOverride: (id, patch) =>
        set({
          promoOverrides: { ...get().promoOverrides, [id]: { ...get().promoOverrides[id], ...patch } },
        }),
      removePromoOverride: (id) => {
        const next = { ...get().promoOverrides };
        delete next[id];
        set({ promoOverrides: next });
      },
      addCustomPromo: (p) => set({ customPromos: [p, ...get().customPromos] }),
      updateCustomPromo: (id, patch) =>
        set({
          customPromos: get().customPromos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }),
      removeCustomPromo: (id) =>
        set({ customPromos: get().customPromos.filter((p) => p.id !== id) }),
      setGalleryItems: (items) => set({ galleryItems: items }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      resetAll: () =>
        set({
          menuOverrides: {},
          customItems: [],
          promoOverrides: {},
          customPromos: [],
          galleryItems: null,
          settings: defaultSettings,
        }),
    }),
    {
      name: "gacoan-admin-v1",
      version: 1,
      // v1: reset galeri ke default supaya batch foto asli terbaru tampil
      // untuk pengunjung lama yang punya state galeri tersimpan.
      // Settings selalu diisi ulang supaya state lama yang rusak tidak
      // membuat halaman error.
      migrate: (persisted) => {
        const prev = (persisted ?? {}) as Partial<AdminState>;
        return {
          ...prev,
          galleryItems: null,
          settings: { ...defaultSettings, ...prev.settings },
        };
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
