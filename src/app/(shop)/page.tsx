import { Hero } from "@/components/home/hero";
import { QuickOrder } from "@/components/home/quick-order";
import { FavoriteMenu } from "@/components/home/favorite-menu";
import { SpicyLevels } from "@/components/home/spicy-levels";
import { AboutPreview } from "@/components/home/about-preview";
import { PromoSection } from "@/components/home/promo-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { LocationSection } from "@/components/home/location-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata = {
  title: "Mie Gacoan Ciamis | Mie Pedas, Dimsum & Minuman",
  description:
    "Rasakan mie pedas level 0–8, dimsum gurih, dan minuman segar di Mie Gacoan Ciamis. Pesan ambil atau antar, buka setiap hari 08.00–23.00.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickOrder />
      <FavoriteMenu />
      <SpicyLevels />
      <AboutPreview />
      <PromoSection />
      <GalleryPreview />
      <LocationSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}
