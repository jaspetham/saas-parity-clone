import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

export function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const { clerkUserId, tier } = data;
  if (!clerkUserId || !tier) {
    throw new Error(
      "clerkUserId and tier are required to create a user subscription"
    );
  }
  return db.insert(UserSubscriptionTable).values({
    clerkUserId,
    tier,
  }).onConflictDoNothing({
    target: UserSubscriptionTable.clerkUserId
  });
}