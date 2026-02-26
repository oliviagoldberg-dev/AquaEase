import CheckoutForm from "@/components/CheckoutForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-aqua-50 via-white to-aqua-100">
      <div className="relative overflow-hidden">
        <SiteHeader />

        <section className="relative z-10 pb-12 pt-10">
          <div className="mx-auto w-full max-w-5xl px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
              Checkout
            </p>
            <h1 className="mt-3 font-display text-4xl text-sea-900 md:text-5xl">
              Complete your subscription
            </h1>
            <p className="mt-4 text-sm text-slate-600 md:text-base">
              Add your contact and delivery details, then enter payment
              information to finish your subscription.
            </p>
          </div>
        </section>
      </div>

      <CheckoutForm />

      <SiteFooter />
    </main>
  );
}
