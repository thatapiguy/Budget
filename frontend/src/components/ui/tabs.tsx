import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

export const Tabs = TabsPrimitive.Root
export const TabsList = React.forwardRef<HTMLDivElement, TabsPrimitive.TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={`flex border-b ${className}`} {...props} />
  )
)

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsPrimitive.TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`px-3 py-2 border-b-2 border-transparent data-[state=active]:border-indigo-500 ${className}`}
      {...props}
    />
  )
)

export const TabsContent = TabsPrimitive.Content
