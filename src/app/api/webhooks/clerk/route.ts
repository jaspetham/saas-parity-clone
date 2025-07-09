import { env } from "@/data/env/server";
import {
  createUserSubscription,
  getUserSubscription,
} from "@/server/db/subscriptions";
import { deleteUser } from "@/server/db/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    const { id } = event.data;
    const eventType = event.type;

    if (id === undefined) {
      console.error("Webhook event ID is undefined");
      return;
    }

    switch (eventType) {
      case "user.created": {
        await createUserSubscription({
          clerkUserId: id,
          tier: "Free",
        });
        break;
      }

      case "user.deleted": {
        if (id != null) {
          const userSubscription = await getUserSubscription(id);
          if (userSubscription?.stripeCustomerId != null) {
            await stripe.subscriptions.cancel(userSubscription.stripeCustomerId);
          }
          await deleteUser(id);
        }
        break;
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
