import type { MetadataRoute } from "next";
import { MENU_ITEMS } from "@/lib/data/menu";

const baseUrl = "https://mie-gacoan-ciamis.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicPages = [
    "",
    "/menu",
    "/promo",
    "/gallery",
    "/about",
    "/location",
    "/contact",
  ];

  const pages = publicPages.map((path, index) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: index === 0 ? "daily" as const : "weekly" as const,
    priority: index === 0 ? 1 : path === "/menu" ? 0.9 : 0.7,
  }));

  const menuPages = MENU_ITEMS.map((item) => ({
    url: `${baseUrl}/menu/${item.id}`,
    lastModified: new Date(item.addedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...pages, ...menuPages];
}

