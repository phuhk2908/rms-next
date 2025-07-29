"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function Collapsible({
   ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
   return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
   ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
   return (
      <CollapsiblePrimitive.CollapsibleTrigger
         data-slot="collapsible-trigger"
         {...props}
      />
   );
}

function CollapsibleContent({
   ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
   return (
      <CollapsiblePrimitive.CollapsibleContent
         data-slot="collapsible-content"
         className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all"
         {...props}
      />
   );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
