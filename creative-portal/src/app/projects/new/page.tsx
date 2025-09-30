"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectForm {
  name: string
  description: string
  client_name: string
  client_email: string
  deadline: string
  budget: string
  priority: 'low' | 'medium' | 'high'
  team_members: string[]
}

export default function NewProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teamMemberInput, setTeamMemberInput] = useState('')
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    client_name: '',
    client_email: '',
    deadline: '',
    budget: '',
    priority: 'medium',
    team_members: []
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addTeamMember = () => {
    if (teamMemberInput.trim() && !formData.team_members.includes(teamMemberInput.trim())) {
      setFormData(prev => ({
        ...prev,
        team_members: [...prev.team_members, teamMemberInput.trim()]
      }))
      setTeamMemberInput('')
    }
  }

  const removeTeamMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.filter(m => m !== member)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Project name is required')
      }
      if (!formData.client_name.trim()) {
        throw new Error('Client name is required')
      }
      if (!formData.client_email.trim()) {
        throw new Error('Client email is required')
      }
      if (!formData.deadline) {
        throw new Error('Deadline is required')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.client_email)) {
        throw new Error('Please enter a valid email address')
      }

      // Validate deadline is in the future
      if (new Date(formData.deadline) <= new Date()) {
        throw new Error('Deadline must be in the future')
      }

      // Validate budget if provided
      if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) < 0)) {
        throw new Error('Budget must be a valid positive number')
      }

      // Here you would typically make an API call to create the project
      // For now, we'll simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to projects page or the new project page
      router.push('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Set up a new project with timeline, team, and deliverables
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects">
                ← Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Basic details about the project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Describe the project scope, objectives, and deliverables..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Details about the client for this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    name="client_name"
                    type="text"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    placeholder="Enter client or company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">Client Email *</Label>
                  <Input
                    id="client_email"
                    name="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={handleInputChange}
                    placeholder="client@example.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Add team members who will work on this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Input
                  value={teamMemberInput}
                  onChange={(e) => setTeamMemberInput(e.target.value)}
                  placeholder="Enter team member name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTeamMember()
                    }
                  }}
                />
                <Button type="button" onClick={addTeamMember}>
                  Add
                </Button>
              </div>
              {formData.team_members.length > 0 && (
                <div>
                  <Label>Team Members ({formData.team_members.length})</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.team_members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{member}</span>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/projects">
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}