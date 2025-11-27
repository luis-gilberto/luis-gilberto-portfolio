import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})
const bigShoulders = Inter({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
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
    <html lang="en">
      <body className={`${inter.variable} ${bigShoulders.variable} font-sans antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex flex-col`}>
        <AuthSessionProvider>
          <Navigation />
          <main className="flex-grow pt-[112px] flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
