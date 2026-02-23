import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import Image from "next/image"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "The Portal | Luis Gilberto",
  description: "Client Project Management Ecosystem",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased bg-portal-bg text-[var(--text-primary)] min-h-screen flex flex-col`}>
        {/* Cinematic Corridor Background */}
        <div className="fixed inset-0 z-[-1] h-screen w-full overflow-hidden">
          <Image
            src="/assets/images/portal-corridor-bg.jpg"
            alt="Portal Corridor"
            fill
            className="object-cover opacity-40 blur-xl scale-110"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

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
      </body>
    </html>
  )
}
