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
  onOpenChange: setExternalOpen 
}: { 
  onClientAdded: () => void,
  isOpen?: boolean,
  onOpenChange?: (open: boolean) => void
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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
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

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create client")
      }

      setOpen(false)
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
      })
      toast("CLIENT ADDED", "New lead record successfully created.", "success")
      onClientAdded()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to create client record. Please try again.")
      toast("ERROR", err.message || "Failed to create client record. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--coral)] hover:bg-[#e55a5a] text-white">
          <i className="fas fa-plus mr-2"></i> Add New Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Add New Client/Lead</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new client record. This will be available in StrategyIQ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3 bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="col-span-3 bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact Person
            </Label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="col-span-3 bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3 bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
              <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
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
          <div className="px-4 py-2 mb-4 mx-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs italic">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="bg-[var(--coral)] hover:bg-[#e55a5a] text-white">
            {isLoading ? "Saving..." : "Save Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
