import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { serverAllowedPriceIds } from "@/lib/pricing";

type Roommate = { name: string; email: string };

type CreateSubscriptionPayload = {
  priceId: string;
  email: string;
  name: string;
  phone?: string;
  roommates?: Roommate[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSubscriptionPayload;

    console.error("Create subscription payload:", body);
    if (!body?.priceId || !serverAllowedPriceIds.has(body.priceId)) {
      console.error("Invalid price selection:", {
        priceId: body?.priceId,
        allowed: Array.from(serverAllowedPriceIds),
      });
      return NextResponse.json(
        {
          error: "Invalid price selection.",
          priceId: body?.priceId,
          allowed: Array.from(serverAllowedPriceIds),
        },
        { status: 400 }
      );
    }

    if (!body?.email || !body?.name) {
      return NextResponse.json(
        { error: "Missing required customer fields." },
        { status: 400 }
      );
    }

    const price = await stripe.prices.retrieve(body.priceId);

    if (!price.unit_amount) {
      return NextResponse.json(
        { error: "Unable to retrieve price amount." },
        { status: 500 }
      );
    }

    const roommates = (body.roommates ?? []).filter(r => r.name?.trim() || r.email?.trim());
    const totalPeople = 1 + roommates.length;
    const roommateShare = Math.floor(price.unit_amount / totalPeople);
    const person1Amount = price.unit_amount - roommateShare * roommates.length;

    const customer = await stripe.customers.create({
      email: body.email,
      name: body.name,
      phone: body.phone,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: person1Amount,
      currency: price.currency,
      customer: customer.id,
      payment_method_types: ["card"],
    });

    const roommatePaymentLinks: { name: string; url: string }[] = [];
    for (const roommate of roommates) {
      const roommatePrice = await stripe.prices.create({
        unit_amount: roommateShare,
        currency: price.currency,
        product_data: { name: "AquaEase – Roommate Share" },
      });
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: roommatePrice.id, quantity: 1 }],
      });
      roommatePaymentLinks.push({ name: roommate.name, url: link.url });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      ...(roommatePaymentLinks.length ? { roommatePaymentLinks } : {}),
    });
  } catch (error) {
    console.error("Stripe subscription failed:", error);
    const message =
      error instanceof Error ? error.message : "Stripe subscription failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
