import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary: "border border-border bg-card text-foreground hover:bg-muted",
      ghost: "text-foreground hover:bg-muted",
      danger: "border border-destructive bg-card text-destructive hover:bg-destructive-soft",
      whatsapp: "bg-whatsapp text-primary-foreground hover:bg-whatsapp-hover",
      soft: "bg-primary-soft text-primary hover:bg-primary-soft-hover",
    },
    size: { default: "min-h-12", icon: "size-12 p-0", sm: "min-h-10 px-3" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
