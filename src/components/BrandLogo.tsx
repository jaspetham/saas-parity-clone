import { env } from "@/data/env/client";
import { Globe2Icon } from "lucide-react";

export function BrandLogo() {
    return (
      <span className="flex items-center gap-2 font-semibold flex-shrink-0 text-lg">
        <Globe2Icon className="size-8" />
        <span>{env.NEXT_PUBLIC_PROJECT_TITLE}</span>
      </span>
    );
}