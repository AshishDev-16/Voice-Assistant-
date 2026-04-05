import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border px-4 py-3 text-sm flex gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500",
  {
    variants: {
      variant: {
        default: "bg-white/[0.03] text-zinc-300 border-white/10",
        destructive:
          "border-red-500/50 bg-red-500/10 text-red-400 [&>svg]:text-red-400",
        maroon: 
          "border-maroon-500/50 bg-maroon-500/10 text-maroon-400 [&>svg]:text-maroon-400",
        success:
          "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 [&>svg]:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-bold leading-none tracking-tight text-white/90", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[11px] leading-relaxed text-zinc-500 font-medium", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
