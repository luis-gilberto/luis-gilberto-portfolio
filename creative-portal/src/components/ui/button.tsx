"use client"

import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "strategy-primary" | "strategy-secondary"
  size?: "sm" | "md" | "lg" | "icon"
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-general-sans"
    
    const variants = {
      default: "bg-coral-red text-white hover:bg-coral-red/90",
      primary: "bg-coral-red text-white hover:bg-coral-red/90 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0",
      secondary: "bg-warm-cream text-deep-black hover:bg-warm-cream/80 border border-cool-gray/20",
      outline: "border-2 border-coral-red text-coral-red bg-transparent hover:bg-coral-red hover:text-white",
      ghost: "text-cool-gray hover:bg-warm-cream/50 hover:text-deep-black",
      destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg",
      "strategy-primary": "bg-[#F96F6E] text-[#050505] hover:bg-[#F96F6E]/90 rounded-full border-0 font-bold uppercase tracking-widest",
      "strategy-secondary": "bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full uppercase tracking-widest"
    }
    
    const sizes = {
      sm: "h-9 px-3 text-sm font-medium",
      md: "h-10 px-4 py-2 text-base font-medium",
      lg: "h-12 px-8 text-lg font-semibold",
      icon: "h-10 w-10 p-0"
    }
    
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }