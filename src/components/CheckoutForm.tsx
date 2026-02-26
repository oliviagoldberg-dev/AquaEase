"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

type TermKey = "semester" | "full-year";
type JugCount = 2 | 3 | 4;

const clientPriceMap: Record<TermKey, Record<JugCount, string>> = {
  semester: {
    2: process.env.NEXT_PUBLIC_STRIPE_PRICE_SEMESTER_BASE || "price_1T4vFcJavtxDPv9qACaBc8tv",
    3: process.env.NEXT_PUBLIC_STRIPE_PRICE_SEMESTER_STANDARD || "price_1T4vFdJavtxDPv9qlDxe7AIR",
    4: process.env.NEXT_PUBLIC_STRIPE_PRICE_SEMESTER_PREMIUM || "price_1T4vFdJavtxDPv9qtSfzptte",
  },
  "full-year": {
    2: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEAR_BASE || "price_1T4vFiJavtxDPv9qMGYGuCHu",
    3: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEAR_STANDARD || "price_1T4vFcJavtxDPv9q1IFPEu67",
    4: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEAR_PREMIUM || "price_1T4vFcJavtxDPv9qT6tQTFrG",
  },
};

function getPriceId(term: TermKey, jugs: JugCount) {
  return clientPriceMap[term]?.[jugs] || "";
}

function ConfirmButton({
  onStart,
  disabled,
  loading,
  error,
}: {
  onStart: () => void;
  disabled: boolean;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="grid gap-4">
      <button
        className="rounded-full bg-aqua-600 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-aqua-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        onClick={onStart}
        disabled={disabled || loading}
        type="button"
      >
        {loading ? "Starting payment..." : "Continue to payment"}
      </button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function StripePayment({
  clientSecret,
  loading,
  error,
  setLoading,
  setError,
  onSuccess,
}: {
  clientSecret: string;
  loading: boolean;
  error: string | null;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  onSuccess: () => void;
}) {
  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#0EA5E9",
          colorBackground: "#ffffff",
          colorText: "#0b1b2b",
          colorDanger: "#e11d48",
          borderRadius: "16px",
        },
      },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentInner
        loading={loading}
        error={error}
        setLoading={setLoading}
        setError={setError}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

function StripePaymentInner({
  loading,
  error,
  setLoading,
  setError,
  onSuccess,
}: {
  loading: boolean;
  error: string | null;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?success=1`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <PaymentElement />
      <button
        className="rounded-full bg-aqua-600 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-aqua-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        onClick={handleConfirm}
        disabled={loading}
        type="button"
      >
        {loading ? "Processing..." : "Place order"}
      </button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

type Roommate = { name: string; email: string };

type CheckoutFormProps = {
  priceId?: string;
  initialName?: string;
  initialEmail?: string;
  initialBuilding?: string;
  initialRoom?: string;
  roommates?: Roommate[];
  autoStart?: boolean;
};

export default function CheckoutForm({
  priceId: priceIdProp,
  initialName = "",
  initialEmail = "",
  initialBuilding = "",
  initialRoom = "",
  roommates = [],
  autoStart = false,
}: CheckoutFormProps = {}) {
  const searchParams = useSearchParams();
  const term = (searchParams.get("term") || "semester") as TermKey;
  const jugs = Number(searchParams.get("jugs") || 2) as JugCount;
  const paramPriceId = useMemo(() => getPriceId(term, jugs), [term, jugs]);
  const priceId = priceIdProp ?? paramPriceId;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [roommatePaymentLinks, setRoommatePaymentLinks] = useState<{ name: string; url: string }[]>([]);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState({
    name: initialName,
    email: initialEmail,
    phone: "",
  });

  const canStartPayment = contact.name.trim() && contact.email.trim() && priceId;

  const createSubscription = async (name = contact.name, email = contact.email, phone = contact.phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          name,
          email,
          phone,
          roommates,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to start payment.");
      }

      setClientSecret(data.clientSecret);
      if (data.roommatePaymentLinks?.length) {
        setRoommatePaymentLinks(data.roommatePaymentLinks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoStart && initialName && initialEmail && priceId) {
      createSubscription(initialName, initialEmail, "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (paid) {
    return (
      <section className="pb-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-8 shadow-[var(--shadow-card)]">
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">Payment received</p>
            <h2 className="mt-3 font-display text-3xl text-sea-900">You are all set!</h2>
            <p className="mt-4 text-sm text-slate-600">
              We will be in touch to confirm your first delivery. Thank you for subscribing to AquaEase.
            </p>
            {roommatePaymentLinks.length > 0 && (
              <div className="mt-6 space-y-4">
                {roommatePaymentLinks.map((link) => (
                  <div key={link.url} className="rounded-2xl bg-aqua-50 p-5">
                    <p className="text-sm font-semibold text-sea-900">
                      Send this to {link.name || "your roommate"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">They can use this link to pay their share.</p>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        readOnly
                        value={link.url}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none"
                      />
                      <button
                        type="button"
                        className="shrink-0 rounded-full bg-aqua-600 px-4 py-2 text-sm font-semibold text-white hover:bg-aqua-500 transition"
                        onClick={() => navigator.clipboard.writeText(link.url)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <section className="pb-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-[var(--radius-xl)] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
          </div>
        </div>
      </section>
    );
  }

  if (!priceId) {
    return (
      <section className="pb-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-[var(--radius-xl)] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            Missing price configuration for this plan.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-8">
          {!autoStart && (
            <>
              <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                  Contact
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="Jordan Rivera"
                      value={contact.name}
                      onChange={(event) =>
                        setContact((prev) => ({ ...prev, name: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      School email
                    </label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="name@school.edu"
                      value={contact.email}
                      onChange={(event) =>
                        setContact((prev) => ({ ...prev, email: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone number
                    </label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="(239) 555-0123"
                      value={contact.phone}
                      onChange={(event) =>
                        setContact((prev) => ({ ...prev, phone: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
                  Delivery
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Dorm/Building or Address
                    </label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="SoVi / North Lake Village"
                      defaultValue={initialBuilding}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Room or Unit
                    </label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="B-204"
                      defaultValue={initialRoom}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Delivery instructions (optional)
                    </label>
                    <textarea
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="Gate code, preferred drop spot, etc."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="rounded-[var(--radius-xl)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
              Payment
            </p>
            <div className="mt-4">
              {!clientSecret ? (
                <ConfirmButton
                  onStart={createSubscription}
                  disabled={!canStartPayment}
                  loading={loading}
                  error={error}
                />
              ) : (
                <StripePayment
                  clientSecret={clientSecret}
                  loading={loading}
                  error={error}
                  setLoading={setLoading}
                  setError={setError}
                  onSuccess={() => setPaid(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
