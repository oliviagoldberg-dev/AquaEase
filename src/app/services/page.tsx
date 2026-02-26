import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { services } from "@/components/content";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[480px] w-[480px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-aqua-200/50 blur-3xl" />
        <div className="absolute right-0 top-24 h-[360px] w-[360px] translate-x-1/3 rounded-full bg-aqua-500/30 blur-3xl" />

        <SiteHeader />

        <section className="relative z-10 pb-20 pt-10">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
              Services
            </p>
            <h1 className="mt-4 font-display text-4xl text-sea-900 md:text-5xl">
              Everything you need to stay hydrated
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
              AquaEase is built for students who want consistent water
              deliveries without the hassle. We handle scheduling, routing, and
              communication so you can focus on campus life.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)]"
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
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                [
                  "Coverage",
                  "Residence halls, SoVi, North Lake Village, and nearby apartments.",
                ],
                [
                  "Windows",
                  "Delivery windows match class schedules and quiet hours.",
                ],
                [
                  "Support",
                  "Text updates before arrival with a secure handoff.",
                ],
                [
                  "Flex",
                  "Adjust delivery windows with support to match your schedule.",
                ],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-100 bg-white shadow-[var(--shadow-card)] p-5"
                >
                  <p className="text-sm font-semibold text-sea-900">{title}</p>
                  <p className="mt-2 text-sm text-slate-600">{body}</p>
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
