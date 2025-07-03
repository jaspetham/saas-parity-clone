import { subscriptionTiers } from "@/data/subscriptionsTier";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache";
import { get } from "http";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const { clerkUserId, tier } = data;
  if (!clerkUserId || !tier) {
    throw new Error(
      "clerkUserId and tier are required to create a user subscription"
    );
  }

  const [newSubscriptions] = await db
    .insert(UserSubscriptionTable)
    .values({
      clerkUserId,
      tier,
    })
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscriptions != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscriptions.id,
      userId: newSubscriptions.userId,
    });
  }

  return newSubscriptions
}

export function getUserSubscription(userId:string){
    const cacheFn = dbCache(getUserSubscriptionInternal,{
        tags:[getUserTag(userId, CACHE_TAGS.subscription)],
    })

    return cacheFn(userId)
}

export async function getUserSubscriptionTier(userId:string){
    const subscription = await getUserSubscription(userId);
    if(subscription == null) throw new Error("User subscription not found");
    return subscriptionTiers[subscription.tier]
}

function getUserSubscriptionInternal(userId:string){
    return db.query.UserSubscriptionTable.findFirst({
        where: ({clerkUserId}, { eq }) => eq(clerkUserId, userId),
        with: {
            user: true,
        },
    });
}
