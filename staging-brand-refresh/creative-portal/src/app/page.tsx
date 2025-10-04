"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      // Redirect authenticated users to their appropriate dashboard
      if (session.user.role === "CLIENT") {
        router.push("/dashboard")
      } else if (session.user.role === "ADMIN" || session.user.role === "TEAM_MEMBER") {
        router.push("/admin")
      }
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-red/5 to-warm-cream/20 pt-20">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="text-primary block">Creative Vision</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional creative services that bring your ideas to life. From concept to completion,
            we deliver exceptional results that exceed expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-4 text-lg">
              <Link href="/auth/signup">
                Start Your Project
              </Link>
            </Button>
            <Button variant="secondary" asChild size="lg" className="px-8 py-4 text-lg">
              <Link href="#services">
                View Our Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Creative Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive creative solutions tailored to your unique needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🎨</div>
                <CardTitle className="text-xl mb-4">Brand Design</CardTitle>
                <CardDescription>
                  Complete brand identity solutions including logos, color schemes, and brand guidelines.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💻</div>
                <CardTitle className="text-xl mb-4">Web Development</CardTitle>
                <CardDescription>
                  Modern, responsive websites and web applications built with cutting-edge technology.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">📱</div>
                <CardTitle className="text-xl mb-4">Digital Marketing</CardTitle>
                <CardDescription>
                  Strategic digital marketing campaigns that drive engagement and growth.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined approach that ensures quality results and client satisfaction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle className="text-lg mb-2">Discovery</CardTitle>
                <CardDescription>Understanding your vision and requirements</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle className="text-lg mb-2">Planning</CardTitle>
                <CardDescription>Strategic planning and project roadmap</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle className="text-lg mb-2">Creation</CardTitle>
                <CardDescription>Bringing your vision to life with expertise</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <CardTitle className="text-lg mb-2">Delivery</CardTitle>
                <CardDescription>Final delivery and ongoing support</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of satisfied clients who have transformed their creative vision into reality.
          </p>
          <Button variant="secondary" asChild size="lg" className="px-8 py-4 text-lg">
            <Link href="/auth/signup">
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">Creative Portal</h3>
              <p className="text-gray-400 mb-4">
                Professional creative services that bring your ideas to life.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Brand Design</li>
                <li>Web Development</li>
                <li>Digital Marketing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>hello@creativeportal.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Creative Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
