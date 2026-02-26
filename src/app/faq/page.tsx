import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { faqs } from "@/components/content";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[480px] w-[480px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-aqua-200/50 blur-3xl" />
        <div className="absolute right-0 top-24 h-[360px] w-[360px] translate-x-1/3 rounded-full bg-aqua-500/30 blur-3xl" />

        <SiteHeader />

        <section className="relative z-10 pb-20 pt-10">
          <div className="mx-auto w-full max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                FAQ
              </p>
            <h1 className="mt-3 font-display text-4xl text-sea-900 md:text-5xl">
              Answers before you subscribe
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
              Here is what students ask most often. Still have questions? We are
              happy to help.
            </p>
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
      </div>

      <SiteFooter />
    </main>
  );
}
