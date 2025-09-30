import type { Metadata } from "next"
import { Inter, Dancing_Script, Poppins } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { NavigationWrapper } from "../components/ui/navigation-wrapper"

// Brand Typography Setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const bigShoulders = Inter({ // Note: Big Shoulders Display not available in next/font/google, using Inter as fallback
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const generalSans = Inter({ // Note: General Sans not available in next/font/google, using Inter as fallback
  subsets: ["latin"],
  variable: "--font-general-sans",
  weight: ["400", "500", "600", "700"],
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  weight: ["400", "500", "600", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Creative Portal - Client Project Management",
  description: "Professional client project management platform for creative agencies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bigShoulders.variable} ${generalSans.variable} ${dancingScript.variable} ${poppins.variable} font-sans antialiased`}>
        <AuthSessionProvider>
          <NavigationWrapper />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
