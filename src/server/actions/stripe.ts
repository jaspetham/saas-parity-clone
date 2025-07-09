"use server";

import { PaidTierNames, subscriptionTiers } from "@/data/subscriptionsTier";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "../db/subscriptions";
import { Stripe } from "stripe";
import { env as ServerEnv } from "@/data/env/server";
import { env as ClientEnv } from "@/data/env/client";
import { redirect } from "next/navigation";

const stripe = new Stripe(ServerEnv.STRIPE_SECRET_KEY);

export async function createCancelSession() {
  const user = await currentUser();
  if (user == null) return { error: true };

  const subscription = await getUserSubscription(user.id);

  if (subscription == null) return { error: true };

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null
  ) {
    return new Response(null, { status: 500 });
  } else {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: subscription.stripeSubscriptionId,
        },
      },
    });

    redirect(portalSession.url);
  }
}

export async function createCustomerPortalSession() {
  const { userId } = await auth();
  if (userId == null) return { error: true };
  const subscription = await getUserSubscription(userId);

  if (subscription?.stripeCustomerId == null) {
    return { error: true };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });

  redirect(portalSession.url);
}

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
    const url = await getSubscriptionUpgradeSession(tier, subscription);
    redirect(url);
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

export async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error("No subscription");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}
