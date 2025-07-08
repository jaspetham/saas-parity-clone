import { env } from "@/data/env/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request:NextRequest){
    const event = await stripe.webhooks.constructEvent(
        request.headers.get("stripe-signature") as string,
        env.STRIPE_WEBHOOK_SECRET
    );
}