/**
 * Animasi "fly to cart": gambar produk terbang dari elemen trigger
 * menuju ikon keranjang di navbar (elemen dengan [data-cart-icon]).
 */
export function flyToCart(fromEl: HTMLElement | null, imgSrc: string) {
  if (!fromEl || typeof window === "undefined") return;
  const target = document.querySelector<HTMLElement>("[data-cart-icon]");
  if (!target) return;

  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const el = document.createElement("div");
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  el.appendChild(img);

  Object.assign(el.style, {
    position: "fixed",
    zIndex: "9999",
    left: `${from.left + from.width / 2 - 24}px`,
    top: `${from.top + from.height / 2 - 24}px`,
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #e2242c",
    boxShadow: "0 8px 24px rgba(0,0,0,.3)",
    pointerEvents: "none",
  });
  document.body.appendChild(el);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const anim = el.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy - 90}px) scale(0.75)`,
        opacity: 1,
        offset: 0.65,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0.3 },
    ],
    { duration: 750, easing: "cubic-bezier(.22,.9,.35,1)" }
  );
  anim.onfinish = () => el.remove();
  anim.oncancel = () => el.remove();
}
