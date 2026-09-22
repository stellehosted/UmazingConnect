import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-avenir font-bold tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-default)] text-white hover:brightness-110 active:brightness-95",
        destructive:
          "bg-[var(--button-destructive)] text-white hover:brightness-110 active:brightness-95",
        outline:
          "bg-[var(--button-outline)] text-black hover:brightness-95 active:brightness-90",
        secondary:
          "bg-[var(--button-secondary)] text-black hover:brightness-105 active:brightness-95",
        ghost:
          "hover:bg-secondary/20 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2 text-xl",
        sm: "h-10 gap-1.5 px-4 text-sm",
        lg: "h-14 px-8 text-2xl",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
