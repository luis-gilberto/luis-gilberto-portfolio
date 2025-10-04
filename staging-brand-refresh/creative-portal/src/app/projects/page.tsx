"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  deadline: string
  client_name: string
  team_members: number
  tasks_completed: number
  tasks_total: number
  created_at: string
}

const statusColors = {
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
}

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'planning' | 'in_progress' | 'review' | 'completed'>('all')

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Mock data for now - will be replaced with actual API calls
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Brand Redesign for TechCorp',
        description: 'Complete brand identity overhaul including logo, colors, and guidelines',
        status: 'in_progress',
        priority: 'high',
        progress: 65,
        deadline: '2024-02-15',
        client_name: 'TechCorp Inc.',
        team_members: 4,
        tasks_completed: 13,
        tasks_total: 20,
        created_at: '2024-01-10'
      },
      {
        id: '2',
        name: 'E-commerce Website Development',
        description: 'Modern e-commerce platform with payment integration',
        status: 'planning',
        priority: 'medium',
        progress: 15,
        deadline: '2024-03-01',
        client_name: 'Fashion Forward',
        team_members: 6,
        tasks_completed: 3,
        tasks_total: 25,
        created_at: '2024-01-15'
      },
      {
        id: '3',
        name: 'Marketing Campaign Assets',
        description: 'Social media graphics and promotional materials',
        status: 'review',
        priority: 'medium',
        progress: 90,
        deadline: '2024-01-30',
        client_name: 'StartupXYZ',
        team_members: 2,
        tasks_completed: 18,
        tasks_total: 20,
        created_at: '2024-01-05'
      },
      {
        id: '4',
        name: 'Mobile App UI Design',
        description: 'Complete UI/UX design for iOS and Android app',
        status: 'completed',
        priority: 'high',
        progress: 100,
        deadline: '2024-01-20',
        client_name: 'HealthTech Solutions',
        team_members: 3,
        tasks_completed: 15,
        tasks_total: 15,
        created_at: '2023-12-15'
      }
    ]

    setProjects(mockProjects)
    setLoading(false)
  }, [session, status, router])

  const filteredProjects = projects.filter(project => 
    filter === 'all' ? true : project.status === filter
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && deadline !== ''
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your creative projects and track progress
              </p>
            </div>
            <Button asChild>
              <Link href="/projects/new">
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Projects', count: projects.length },
                { key: 'planning', label: 'Planning', count: projects.filter(p => p.status === 'planning').length },
                { key: 'in_progress', label: 'In Progress', count: projects.filter(p => p.status === 'in_progress').length },
                { key: 'review', label: 'Review', count: projects.filter(p => p.status === 'review').length },
                { key: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <Link href={`/projects/${project.id}`} className="hover:text-primary">
                        {project.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Badge className={statusColors[project.status]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[project.priority]}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Tasks */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasks</span>
                    <span className="font-medium">
                      {project.tasks_completed}/{project.tasks_total}
                    </span>
                  </div>

                  {/* Client & Team */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-medium">{project.client_name}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team</span>
                    <span className="font-medium">{project.team_members} members</span>
                  </div>

                  {/* Deadline */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className={`font-medium ${
                      isOverdue(project.deadline) ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {formatDate(project.deadline)}
                      {isOverdue(project.deadline) && (
                        <span className="ml-1 text-red-600">⚠️</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/projects/${project.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/projects/${project.id}/tasks`}>
                      Manage Tasks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You haven't created any projects yet."
                : `No projects with status "${filter.replace('_', ' ')}".`
              }
            </p>
            <Button asChild>
              <Link href="/projects/new">
                Create Your First Project
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}