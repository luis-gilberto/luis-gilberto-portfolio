"use client"

import React from "react"
import { AuthSessionProvider } from "./session-provider"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}
