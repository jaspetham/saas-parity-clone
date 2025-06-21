import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

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
      tag: CACHE_TAGS.subscriptions,
      id: newSubscriptions.id,
      userId: newSubscriptions.userId,
    });
  }

  return newSubscriptions
}
