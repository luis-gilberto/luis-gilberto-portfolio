"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/providers/toast-provider"

export function AddClientModal({ 
  onClientAdded, 
  isOpen: externalOpen, 
  onOpenChange: setExternalOpen,
  trigger // New prop for custom trigger
}: { 
  onClientAdded: () => void,
  isOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
  trigger?: React.ReactNode
}) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    company: "",
    status: "Active",
    projectType: "Brand Repositioning",
    budgetRange: "$25K - $50K",
    timeline: "3-6 months",
    companySize: "50-200 employees",
    password: "portal123" // Default temp password
  })
  const [successData, setSuccessData] = useState<{ email: string, tempPassword: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleClose = () => {
    setOpen(false)
    setSuccessData(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      // Task 2: Frontend Error Capture
      if (!response.ok) {
         console.error("[PROVISIONING_ERROR_RESPONSE]", data);
         throw new Error(data.message || data.error || "Failed to create client record")
      }

      // Success - Show Credential Card (Task 3)
      setSuccessData(data.user)
      toast("PROVISIONING COMPLETE", "Client organization, user, and project created.", "success")
      
      // Clear form but don't close modal yet
      setFormData({
        name: "",
        contact: "",
        email: "",
        company: "",
        status: "Active",
        projectType: "Brand Repositioning",
        budgetRange: "$25K - $50K",
        timeline: "3-6 months",
        companySize: "50-200 employees",
        password: "portal123"
      })
      onClientAdded()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to create client record. Please try again.")
      toast("ERROR", err.message || "Failed to create client record. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Task 3: Credential Card View
  if (successData) {
     return (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-teal/50 text-white">
             <DialogHeader>
                <DialogTitle className="text-teal font-display tracking-wider uppercase flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-teal text-black flex items-center justify-center text-xs">✓</div>
                   Provisioning Complete
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                   Secure credentials generated. Share these with the client securely.
                </DialogDescription>
             </DialogHeader>
             
             <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-4 my-4">
                <div>
                   <Label className="text-[10px] uppercase tracking-widest text-white/40">Access Email</Label>
                   <div className="font-mono text-white select-all">{successData.email}</div>
                </div>
                <div>
                   <Label className="text-[10px] uppercase tracking-widest text-white/40">Temporary Password</Label>
                   <div className="font-mono text-teal select-all">{successData.tempPassword}</div>
                </div>
             </div>

             <DialogFooter>
                <Button onClick={handleClose} className="w-full bg-teal text-black hover:bg-teal/90 font-bold">
                   Done
                </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>
     )
  }

  // Default Trigger Button if no custom trigger is provided
  const defaultTrigger = (
    <Button className="bg-white text-black hover:bg-gray-200">
      Add Client
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-[#1a1a1a] border-white/10 text-white p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="font-display text-2xl tracking-wider uppercase">Add New Client/Lead</DialogTitle>
          <DialogDescription className="text-gray-400 font-inter">
            Create a new client record. This will be available in StrategyIQ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-inter text-gray-400">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3 bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right font-inter text-gray-400">
              Company
            </Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="col-span-3 bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right font-inter text-gray-400">
              Contact person
            </Label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="col-span-3 bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right font-inter text-gray-400">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3 bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-inter text-gray-400">
              Status
            </Label>
            <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
              <SelectTrigger className="col-span-3 bg-[#0A0A0A] border-white/10 text-white h-12 text-base px-4 focus:ring-[#F96F6E] focus:border-[#F96F6E]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs italic">
            {error}
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="w-full bg-[#F96F6E] hover:bg-[#F96F6E]/90 text-black font-bold font-display uppercase tracking-wider h-14 text-lg shadow-[0_0_20px_rgba(249,111,110,0.3)] transition-all"
          >
            {isLoading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                 Provisioning...
               </div>
            ) : "Provision Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
