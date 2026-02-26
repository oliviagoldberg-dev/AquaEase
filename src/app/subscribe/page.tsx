import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const pricing = [
  {
    term: "Full year",
    termValue: "full-year",
    description: (
      <>
        This subscription is for the whole school year. The cost of this
        subscription can be divided between roommates.{" "}
        <span className="block mt-2">
          There are three different types of plans.
        </span>
      </>
    ),
    plans: [
      ["Base", "2 jugs/month", "$329.99"],
      ["Standard", "3 jugs/month", "$379.99"],
      ["Premium", "4 jugs/month", "$409.99"],
    ],
  },
  {
    term: "Single semester",
    termValue: "semester",
    description: (
      <>
        This subscription is for one semester. The cost of this subscription
        can be divided between roommates.{" "}
        <span className="block mt-2">
          There are three different types of plans.
        </span>
      </>
    ),
    plans: [
      ["Base", "2 jugs/month", "$249.99"],
      ["Standard", "3 jugs/month", "$299.99"],
      ["Premium", "4 jugs/month", "$324.99"],
    ],
  },
];

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-aqua-50 via-white to-aqua-100">
      <div className="relative overflow-hidden">
        <SiteHeader />

        <section className="relative z-10 pb-10 pt-6">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
              Subscribe
            </p>
            <h1 className="mt-3 font-display text-4xl text-sea-900 md:text-5xl">
              Choose a subscription
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
              Subscriptions are available for one semester or the full school
              year. Choose a monthly jug plan that fits your hydration routine.
            </p>
          </div>
        </section>
        <section className="pb-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2">
              {pricing.map((tier) => (
                <div key={tier.term} className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
                  <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                    {tier.term}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {tier.description}
                  </p>
                  <div className="mt-6 space-y-3">
                    {tier.plans.map(([plan, detail, price]) => (
                      <Link
                        key={plan}
                        href={`/subscribe?term=${tier.termValue}&jugs=${detail[0]}#plan`}
                        className="flex items-center justify-between rounded-2xl bg-aqua-200 px-4 py-3 text-sm font-semibold text-aqua-900 transition hover:bg-aqua-300"
                      >
                        <div>
                          <p className="font-semibold text-sea-900">{plan}</p>
                          <p className="text-xs text-slate-500">{detail}</p>
                        </div>
                      <span className="text-sm font-semibold text-sea-900">
                        {price}
                      </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                Delivery details
              </p>
              <h2 className="mt-3 font-display text-3xl text-sea-900">
                Build your AquaEase plan
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Tell us where you live, choose 2, 3, or 4 water jugs, and share
                your ideal delivery window. We will confirm pricing and get you
                set up.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  ["Semester or year", "Pick a term that matches your schedule."],
                  ["Roommate ready", "Split costs across your apartment."],
                  ["Support built-in", "Text our team any time on delivery day."],
                ].map(([title, copy]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border p-4 shadow-[var(--shadow-card)] ${
                      title === "Semester or year"
                        ? "border-slate-200 bg-white"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-sea-900">{title}</p>
                    <p className="mt-2 text-xs text-slate-600">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <SubscribeForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
