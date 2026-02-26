import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { faqs, services } from "@/components/content";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[520px] w-[520px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-aqua-200/50 blur-3xl" />
        <div className="absolute right-0 top-20 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-aqua-500/30 blur-3xl" />

        <SiteHeader />

        <section className="relative z-10">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                To your door
              </p>
              <h1 className="mt-4 font-display text-4xl text-sea-900 md:text-5xl">
                Hydrate, with ease.
              </h1>
              <p className="mt-4 text-base text-slate-600 md:text-lg">
                AquaEase delivers purified 5-gallon water jugs with an easy-to-use
                dispenser straight to your dorm or off-campus housing. Enjoy clean,
                refreshing water anytime, without the hassle.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center rounded-full bg-aqua-200 px-6 py-3 text-sm font-semibold text-aqua-900 transition hover:bg-aqua-300"
                >
                  Build my plan
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-aqua-200 px-6 py-3 text-sm font-semibold text-aqua-900 transition hover:bg-aqua-300"
                >
                  See how it works
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["5-gal", "purified jugs"],
                  ["Roommate", "split friendly"],
                  ["Campus", "focused"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/80 p-4 text-center shadow-[var(--shadow-card)]"
                  >
                    <p className="text-xl font-display text-sea-900 text-center">{value}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="rounded-3xl bg-aqua-200 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-aqua-600 font-semibold">
                  Next delivery
                </p>
                <h2 className="mt-3 font-display text-2xl text-sea-900">
                  Wednesday 6-8 PM
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  North Lake Village
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["Order", "3 jugs", "", "bg-aqua-50"],
                  ["Status", "Packed", "Delivery crew assigned", "bg-aqua-50"],
                  ["ETA", "On time", "Text updates enabled", "bg-aqua-50"],
                ].map(([title, primary, secondary, bg]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border border-slate-100 p-4 ${bg}`}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
                      {title}
                    </p>
                    <p className="mt-2 text-base font-semibold text-sea-900">
                      {primary}
                    </p>
                    {secondary ? (
                      <p className="text-sm text-slate-500">{secondary}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                Services preview
              </p>
              <h2 className="mt-3 font-display text-3xl text-sea-900">
                A delivery experience designed for students
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-aqua-600 hover:text-aqua-500"
            >
              See full services
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-[var(--radius-xl)] bg-aqua-200 p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-xl font-semibold text-sea-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                FAQ preview
              </p>
              <h2 className="mt-3 font-display text-3xl text-sea-900">
                Questions students ask first
              </h2>
            </div>
            <Link
              href="/faq"
              className="text-sm font-semibold text-aqua-600 hover:text-aqua-500"
            >
              View all FAQs
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[var(--radius-xl)] border border-slate-100 bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-lg font-semibold text-sea-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
