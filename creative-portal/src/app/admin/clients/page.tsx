"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { AddClientModal } from "@/components/admin/add-client-modal"

type Client = {
  id: string
  name: string
  contact: string | null
  email: string | null
  status: string
  company: string | null
}

export default function AdminClientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      } else {
        console.error("Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "CONSULTANT" && session.user.role !== "TEAM_MEMBER")) {
      // Allow consultants to access this page too
       if (session?.user.role !== "CONSULTANT") {
          router.push("/auth/signin")
       }
    }
    fetchClients()
  }, [session, status, router, fetchClients])

  if (status === "loading") return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact && client.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={() => router.push('/admin')} className="text-gray-400 hover:text-white">
               ← Back
             </Button>
             <h1 className="text-2xl font-bold font-big-shoulders tracking-wide">Manage Clients</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
           <Input 
             placeholder="Search clients..." 
             className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-lg md:max-w-md w-full"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <AddClientModal onClientAdded={fetchClients} />
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No clients found. Add one to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <span className="text-xl font-bold font-big-shoulders tracking-wide block">{client.name}</span>
                      {client.company && <span className="text-sm text-gray-400 font-normal">{client.company}</span>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                      client.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {client.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>👤 {client.contact || 'No contact'}</p>
                    <p>✉️ {client.email || 'No email'}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                     <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 hover:text-white">
                       View Details
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}