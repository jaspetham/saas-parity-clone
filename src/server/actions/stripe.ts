"use server";

import { PaidTierNames, subscriptionTiers } from "@/data/subscriptionsTier";
import { currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "../db/subscriptions";
import { Stripe } from "stripe";
import { env as ServerEnv } from "@/data/env/server";
import { env as ClientEnv } from "@/data/env/client";
import { redirect } from "next/navigation";

const stripe = new Stripe(ServerEnv.STRIPE_SECRET_KEY);

export async function createCancelSession() {}

export async function createCustomerPortalSession() {}

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (user == null) return { error: true };

  const subscription = await getUserSubscription(user.id);

  if (subscription == null) return { error: true };

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) return { error: true };
    redirect(url);
  } else {
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });
  return session.url;
}
