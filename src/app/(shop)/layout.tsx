import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { FloatingCart } from "@/components/layout/floating-cart";

/**
 * Layout seluruh halaman pelanggan: navbar sticky di atas,
 * konten flex-1, footer otomatis menempel di bawah (sticky footer),
 * plus cart drawer & floating cart global.
 */
export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingCart />
    </div>
  );
}
