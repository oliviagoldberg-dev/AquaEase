import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { benefits, steps } from "@/components/content";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[480px] w-[480px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-aqua-200/50 blur-3xl" />
        <div className="absolute right-0 top-24 h-[360px] w-[360px] translate-x-1/3 rounded-full bg-aqua-500/30 blur-3xl" />

        <SiteHeader />

        <section className="relative z-10 pb-20 pt-10">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                About Us
              </p>
              <h1 className="mt-3 font-display text-4xl text-sea-900 md:text-5xl">
                A student-built answer to campus hydration
              </h1>
              <div className="mt-4 space-y-4 text-sm text-slate-600 md:text-base">
                <p>
                  Aqua Ease was founded in 2025 by students who noticed a
                  common problem, staying hydrated on campus was often
                  inconvenient, expensive, and wasteful. With so many students
                  relying on single-use plastic bottles, it was clear there
                  needed to be a smarter, more sustainable way to access clean
                  drinking water.
                </p>
                <p>
                  Aqua Ease makes hydration effortless by delivering purified
                  5-gallon water jugs and dispensers straight to dorms and
                  apartments through flexible semester or yearly subscriptions.
                  No more carrying cases of bottles or creating plastic waste,
                  just fresh, reliable water on demand.
                </p>
                <p>
                  As a student-run company, we embody the values of
                  sustainability, convenience, and innovation. Every jug we
                  deliver replaces dozens of disposable bottles, helping our
                  campus stay hydrated while protecting the environment. Aqua
                  Ease is proud to serve fellow Eagles, making clean water easy,
                  affordable, and eco-friendly.
                </p>
              </div>
              <div className="mt-6 grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className={`rounded-2xl border border-slate-100 p-4 ${
                      benefit.tone === "highlight"
                        ? "bg-gradient-to-br from-aqua-200 via-aqua-50 to-aqua-50"
                        : "bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-sea-900">
                      {benefit.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-aqua-500 via-aqua-200 to-aqua-300/50 p-8 shadow-[var(--shadow-soft)]">
              <div className="rounded-[var(--radius-xl)] bg-white/85 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                  How it works
                </p>
                <div className="mt-6 space-y-6">
                  {steps.map(([step, title, body]) => (
                    <div key={title} className="flex gap-4">
                      <p className="text-base font-bold text-sea-900">
                        {step}
                      </p>
                      <div>
                        <p className="text-base font-semibold text-sea-900">
                          {title}
                        </p>
                        <p className="text-sm text-slate-600">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-[var(--radius-xl)] bg-white/85 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                  Our Founder
                </p>
                <p className="mt-4 text-base font-semibold text-sea-900">
                  Evan Goldberg
                </p>
                <p className="mt-1 text-sm text-slate-600">Class of 2029</p>
                <p className="mt-2 text-sm text-slate-600">
                  Evan Goldberg created AquaEase after seeing how difficult it
                  was for students to access reliable water delivery on campus.
                  As a student-focused entrepreneur, he built AquaEase to make
                  hydration more convenient, affordable, and accessible for
                  college communities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
