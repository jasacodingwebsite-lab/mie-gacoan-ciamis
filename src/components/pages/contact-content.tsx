"use client";

import { useState } from "react";
import {
  Clock,
  Facebook,
  Instagram,
  Loader2,
  MessageCircle,
  Music2,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { OpenStatusBadge } from "@/components/shared/open-status";
import { site } from "@/lib/data/site";

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
};

const faqs = [
  {
    q: "Bisa reservasi untuk rombongan?",
    a: "Bisa banget! Buat rombongan besar — apalagi mau meja panjang — kabarin kami via WhatsApp minimal sehari sebelumnya, biar meja dan kursinya kami siapin pas kamu datang.",
  },
  {
    q: "Level pedas paling tinggi berapa?",
    a: "Level 8 alias GACOAN MODE 🔥 — level tertinggi yang cuma buat para legenda. Kalau ragu, mulai dari level 3 dulu, naik pelan-pelan. Tisu siapin dari sekarang.",
  },
  {
    q: "Ada area parkir?",
    a: "Ada! Parkir motor dan mobil luas dan gratis, persis di depan outlet. Datang rame-rame juga muat kok.",
  },
  {
    q: "Bisa pesan antar?",
    a: "Bisa! Pesan lewat website ini — buka halaman Menu, masukkan keranjang, lanjut ke Checkout. Nanti pesananmu diproses outlet. Mau ambil sendiri juga boleh, biar makin fresh.",
  },
];

type FormState = { name: string; contact: string; message: string };
const emptyForm: FormState = { name: "", contact: "", message: "" };

export function ContactContent() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sending, setSending] = useState(false);
  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Halo Mie Gacoan Ciamis!"
  )}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      toast.error("Lengkapi dulu nama, kontak, dan pesannya ya 🙏");
      return;
    }

    setSending(true);
    // Demo: simulasi kirim pesan.
    setTimeout(() => {
      setSending(false);
      setForm(emptyForm);
      toast.success("Pesan terkirim! Kami balas secepatnya. (demo)");
    }, 800);
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading
          kicker="KONTAK"
          title="HUBUNGI KAMI"
          subtitle="Ada pertanyaan, pesanan besar, atau acara? Sapa kami!"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* ===== Kiri: kartu kontak ===== */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gacoan-cream text-gacoan">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">WhatsApp</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Paling cepat dibalas — tanya menu, promo, atau
                      reservasi.
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  className="mt-4 h-11 min-h-11 w-full rounded-full bg-gacoan font-bold text-white shadow-md shadow-gacoan/25 hover:bg-gacoan-dark"
                >
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Chat WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gacoan-cream text-gacoan">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">Telepon</p>
                    <a
                      href={telHref}
                      className="mt-0.5 inline-block text-xs text-muted-foreground transition-colors hover:text-gacoan"
                    >
                      {site.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Sosial Media</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Mampir juga ke akun kami, ada konten seru 🍜
                </p>
                <div className="mt-4 flex gap-2.5">
                  {site.socials.map((s) => {
                    const Icon = socialIcons[s.icon] ?? Instagram;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={`${s.label} Mie Gacoan Ciamis`}
                        title={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full border border-border text-ink/70 transition-all hover:-translate-y-0.5 hover:border-gacoan hover:bg-gacoan hover:text-white"
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-auto">
              <div className="flex items-center justify-between gap-3 rounded-3xl bg-gacoan-cream p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-gacoan shadow-sm">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">
                      Senin — Minggu
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {site.hoursLabel} WIB
                    </p>
                  </div>
                </div>
                <OpenStatusBadge />
              </div>
            </Reveal>
          </div>

          {/* ===== Kanan: form kirim pesan ===== */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-xl text-ink">Kirim Pesan</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Isi form di bawah — kami balas via WhatsApp atau email.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">
                    Nama <span className="text-gacoan">*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    name="name"
                    placeholder="Nama kamu"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="h-11 rounded-xl"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-channel">
                    Email / WhatsApp <span className="text-gacoan">*</span>
                  </Label>
                  <Input
                    id="contact-channel"
                    name="contact"
                    placeholder="email@kamu.com atau 08xx-xxxx-xxxx"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    className="h-11 rounded-xl"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">
                    Pesan <span className="text-gacoan">*</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    placeholder="Mau tanya apa? Reservasi, pesanan besar, kerja sama — tulis aja di sini…"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="min-h-28 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="h-11 min-h-11 w-full rounded-full bg-gacoan font-bold text-white shadow-md shadow-gacoan/25 hover:bg-gacoan-dark sm:w-auto sm:px-8"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Mengirim…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
          <h3 className="mb-5 text-center font-display text-2xl text-ink">
            PERTANYAAN YANG SERING DITANYA 💬
          </h3>
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-6 shadow-sm">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-bold text-ink hover:text-gacoan hover:no-underline sm:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
    </div>
  );
}
