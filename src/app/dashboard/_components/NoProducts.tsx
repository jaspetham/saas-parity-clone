import { Button } from "@/components/ui/button";
import { env } from "@/data/env/client";
import Link from "next/link";

export function NoProducts() {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">You have no products</h1>
      <p className="mb-4">
        Get started with {env.NEXT_PUBLIC_PROJECT_TITLE} discounts by creating a product
      </p>
      <Button size="lg" asChild>
        <Link href="/dashboard/products/new">Add Product</Link>
      </Button>
    </div>
  );
}
