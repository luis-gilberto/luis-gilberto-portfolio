import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Image from "next/image"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
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
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-portal-bg text-[var(--text-primary)] min-h-screen flex flex-col`}>
        {/* Cinematic Corridor Background */}
        <div className="fixed inset-0 z-[-1] h-screen w-full">
          <Image
            src="/assets/images/portal-corridor-bg.jpg"
            alt="Portal Corridor"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />
        </div>

        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <main className="flex-grow pt-16 flex flex-col relative z-10">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
