"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";

const clientPriceMap = {
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
} as const;

const steps = ["Plan", "Contact", "Schedule"];

type Roommate = { name: string; email: string };

type FormState = {
  name: string;
  email: string;
  building: string;
  room: string;
  roommates: Roommate[];
  jugs: number;
  term: "semester" | "full-year";
  day: string;
  window: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  building: "",
  room: "",
  roommates: [{ name: "", email: "" }],
  jugs: 2,
  term: "full-year",
  day: "Monday",
  window: "6-8 PM",
};

const prices = {
  "full-year": {
    2: "$329.99",
    3: "$379.99",
    4: "$409.99",
  },
  semester: {
    2: "$249.99",
    3: "$299.99",
    4: "$324.99",
  },
} as const;

export default function SubscribeForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [checkoutPriceId, setCheckoutPriceId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const termParam = searchParams.get("term");
    const jugsParam = Number(searchParams.get("jugs"));
    const term =
      termParam === "semester" || termParam === "full-year"
        ? termParam
        : null;
    const jugs = [2, 3, 4].includes(jugsParam) ? jugsParam : null;

    if (term || jugs) {
      setForm((prev) => ({
        ...prev,
        ...(term ? { term } : null),
        ...(jugs ? { jugs } : null),
      }));
    }
  }, [searchParams]);

  const stepReady = useMemo(() => {
    if (step === 0) {
      return form.term && [2, 3, 4].includes(form.jugs);
    }
    if (step === 1) {
      return form.name.trim() && form.email.trim() && form.building.trim() && form.room.trim();
    }
    return form.term && form.day.trim() && form.window.trim();
  }, [form, step]);

  const setValue = (key: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addRoommate = () =>
    setForm((prev) => ({ ...prev, roommates: [...prev.roommates, { name: "", email: "" }] }));

  const removeRoommate = (i: number) =>
    setForm((prev) => ({ ...prev, roommates: prev.roommates.filter((_, idx) => idx !== i) }));

  const updateRoommate = (i: number, key: "name" | "email", value: string) =>
    setForm((prev) => ({
      ...prev,
      roommates: prev.roommates.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)),
    }));

  const priceForPlan =
    prices[form.term]?.[form.jugs as 2 | 3 | 4] ?? "Price varies";
  const termLabel = form.term === "full-year" ? "Full year" : "Semester";

  const activeRoommates = form.roommates.filter(r => r.name.trim() || r.email.trim());
  const totalPeople = 1 + activeRoommates.length;
  const rawPrice = parseFloat(priceForPlan.replace("$", "")) || 0;
  const perPersonPrice = totalPeople > 1 ? `$${(rawPrice / totalPeople).toFixed(2)}` : null;

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-sm uppercase tracking-[0.3em] text-aqua-600">
          Request received
        </p>
        <h3 className="mt-3 font-display text-3xl text-sea-900">
          You are on the AquaEase delivery list.
        </h3>
        <p className="mt-4 text-base text-slate-600">
          We will confirm your first delivery window and pricing over email.
          Expect a response within 24 hours on school days.
        </p>
        <div className="mt-6 rounded-2xl bg-aqua-50 p-4 text-sm text-slate-600">
          <strong className="text-sea-900">Summary:</strong> {form.jugs} jug
          {form.jugs > 1 ? "s" : ""} per month, {termLabel},{" "}
          {form.day} {form.window}.
        </div>
        <button
          className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-sea-900 transition hover:border-aqua-200 hover:text-aqua-600"
          onClick={() => {
            setForm(initialState);
            setStep(0);
            setSubmitted(false);
          }}
          type="button"
        >
          Start another request
        </button>
      </div>
    );
  }

  if (checkoutPriceId) {
    return (
      <div id="plan">
        <button
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua-600 hover:text-aqua-500 transition"
          onClick={() => setCheckoutPriceId(null)}
          type="button"
        >
          Back to plan
        </button>
        <CheckoutForm
          priceId={checkoutPriceId}
          initialName={form.name}
          initialEmail={form.email}
          initialBuilding={form.building}
          initialRoom={form.room}
          roommates={form.roommates.filter(r => r.name.trim() || r.email.trim())}
          autoStart
        />
      </div>
    );
  }

  return (
    <div
      id="plan"
      className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
            Subscribe
          </p>
          <h3 className="mt-2 font-display text-3xl text-sea-900">
            Build your delivery plan
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                index === step
                  ? "border-transparent bg-aqua-200 text-sea-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-aqua-300"
              }`}
            >
              <span className="text-[11px]">{index + 1}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Subscription term
                </label>
                <div className="flex w-full flex-nowrap items-stretch gap-4">
                  {[
                    ["semester", "Semester"],
                    ["full-year", "Year long"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`flex w-auto items-center justify-center rounded-2xl border px-4 py-2 text-center text-sm font-semibold transition whitespace-nowrap ${
                        form.term === value
                          ? "border-transparent bg-aqua-200 text-sea-900"
                          : "border-slate-200 bg-white text-sea-900"
                      }`}
                      onClick={() => setValue("term", value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Plan
                </label>
                <div className="flex w-full flex-nowrap items-stretch gap-4">
                {[
                  [2, "Base", "2 jugs/month"],
                  [3, "Standard", "3 jugs/month"],
                  [4, "Premium", "4 jugs/month"],
                ].map(([count, label, detail]) => (
                  <button
                    key={count}
                    type="button"
                      className={`flex min-h-[88px] flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1.5 text-center text-sm font-semibold transition ${
                        form.jugs === count
                          ? "bg-aqua-200 text-aqua-900"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                      onClick={() => setValue("jugs", Number(count))}
                    >
                    <span className="text-base text-sea-900">{label}</span>
                    <span className="text-xs leading-tight whitespace-nowrap text-sea-900">
                      {detail}
                    </span>
                    <span className="text-xs font-semibold mt-1 text-sea-900">
                      {priceForPlan}
                    </span>
                  </button>
                ))}
              </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                placeholder="Jordan Rivera"
                value={form.name}
                onChange={(event) => setValue("name", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">School email</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                placeholder="name@eagle.fgcu.edu"
                value={form.email}
                onChange={(event) => setValue("email", event.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Roommates <span className="font-normal text-slate-400">(optional — split the cost)</span>
                </label>
              </div>
              {form.roommates.map((roommate, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="grid flex-1 gap-2 md:grid-cols-2">
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="Roommate name"
                      value={roommate.name}
                      onChange={(e) => updateRoommate(i, "name", e.target.value)}
                    />
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                      placeholder="Roommate email"
                      value={roommate.email}
                      onChange={(e) => updateRoommate(i, "email", e.target.value)}
                    />
                  </div>
                  {form.roommates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoommate(i)}
                      className="mt-3 text-slate-400 hover:text-rose-500 transition text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={addRoommate}
                  className="text-sm font-semibold text-aqua-600 hover:text-aqua-500 transition"
                >
                  + Add another roommate
                </button>
                {perPersonPrice && (
                  <p className="text-sm font-semibold text-sea-900">
                    Each person pays <span className="text-aqua-600">{perPersonPrice}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Residence hall / apartment</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                placeholder="SoVi / North Lake Village"
                value={form.building}
                onChange={(event) => setValue("building", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Room or unit</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                placeholder="B-204"
                value={form.room}
                onChange={(event) => setValue("room", event.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Preferred day
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                value={form.day}
                onChange={(event) => setValue("day", event.target.value)}
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Delivery window
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-aqua-500 focus:outline-none"
                value={form.window}
                onChange={(event) => setValue("window", event.target.value)}
              >
                {[
                  "8-10 AM",
                  "11 AM-1 PM",
                  "2-4 PM",
                  "6-8 PM",
                ].map((window) => (
                  <option key={window} value={window}>
                    {window}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl bg-aqua-200 p-4 text-sm text-slate-600 md:col-span-2">
              <p className="font-semibold text-sea-900">Preview</p>
              <p className="mt-2">
                {form.jugs} jugs/month
              </p>
              <p>{termLabel}</p>
              <p>{form.day} {form.window}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-aqua-200 hover:text-aqua-600"
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          type="button"
          disabled={step === 0}
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {step < steps.length - 1 ? (
            <button
              className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                stepReady
                  ? "bg-aqua-600 shadow-[var(--shadow-soft)] hover:bg-aqua-500"
                : "bg-slate-300"
              }`}
              onClick={() => stepReady && setStep((prev) => prev + 1)}
              type="button"
            >
              Continue
            </button>
          ) : (
            <button
              className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                stepReady
                  ? "bg-aqua-600 shadow-[var(--shadow-soft)] hover:bg-aqua-500"
                : "bg-slate-300"
              }`}
              onClick={() => {
                if (!stepReady) return;
                const priceId = clientPriceMap[form.term]?.[form.jugs as 2 | 3 | 4] || "";
                setCheckoutPriceId(priceId);
              }}
              type="button"
            >
              Subscribe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
