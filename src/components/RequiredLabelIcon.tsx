import { AsteriskIcon } from "lucide-react";
import { ComponentPropsWithRef } from "react";
import { cn } from '../lib/utils';

export function RequiredLabelIcon({className,...props}:ComponentPropsWithRef<typeof AsteriskIcon>) {
    return (
        <AsteriskIcon
            className={cn("text-destructive inline size-3 align-top", className)}
            {...props}
        />
    );
}