"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/providers/toast-provider"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

export function AddProjectModal({ 
  isOpen, 
  onOpenChange,
}: { 
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    status: "DISCOVERY",
    description: ""
  })

  useEffect(() => {
    if (isOpen) {
      fetchClients()
    }
  }, [isOpen])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.clientId) {
      toast("VALIDATION ERROR", "Project title and client are required.", "error")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create project")
      }

      toast("PROJECT INITIALIZED", "New strategic initiative created and assessment sessions seeded.", "success")
      onOpenChange(false)
      
      // Reset form
      setFormData({
        title: "",
        clientId: "",
        status: "DISCOVERY",
        description: ""
      })

      // Redirect to the new project
      router.push(`/admin/projects/${data.project.id}`)
    } catch (err: any) {
      console.error("PROJECT_INIT_FAILED:", err)
      toast("ERROR", err.message || "Failed to create project record.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-[#1a1a1a] border-white/10 text-white p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="font-big-shoulders text-3xl tracking-widest uppercase italic">Initialize New Project</DialogTitle>
          <DialogDescription className="text-gray-400 font-inter">
            Create a new project record and seed the StrategyIQ assessment pillars.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Project Name
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]"
              placeholder="e.g. Brand Evolution 2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Assign Client
            </Label>
            <Select name="clientId" value={formData.clientId} onValueChange={(val) => handleSelectChange("clientId", val)}>
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]">
                <SelectValue placeholder="Select an existing client" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-[200px]">
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company || client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Initial Phase
            </Label>
            <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]">
                <SelectValue placeholder="Select initial phase" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="DISCOVERY">DISCOVERY</SelectItem>
                <SelectItem value="PLANNING">PLANNING</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-[#F96F6E] hover:bg-[#F96F6E]/90 text-black font-black font-big-shoulders italic uppercase tracking-widest h-14 text-xl shadow-[0_0_20px_rgba(249,111,110,0.3)] transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={20} className="animate-spin" />
                  INITIALIZING...
                </div>
              ) : "CREATE PROJECT"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
