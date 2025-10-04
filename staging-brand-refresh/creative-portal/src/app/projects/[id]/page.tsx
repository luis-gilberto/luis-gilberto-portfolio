"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee: string
  due_date: string
  created_at: string
  completed_at?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  deadline: string
  client_name: string
  client_email: string
  team_members: string[]
  budget: number
  created_at: string
  updated_at: string
}

interface Comment {
  id: string
  author: string
  content: string
  created_at: string
  type: 'comment' | 'status_change' | 'file_upload'
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files'>('overview')
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Mock data for now - will be replaced with actual API calls
    const mockProject: Project = {
      id: params.id,
      name: 'Brand Redesign for TechCorp',
      description: 'Complete brand identity overhaul including logo design, color palette, typography guidelines, and brand application across all touchpoints.',
      status: 'in_progress',
      priority: 'high',
      progress: 65,
      deadline: '2024-02-15',
      client_name: 'TechCorp Inc.',
      client_email: 'contact@techcorp.com',
      team_members: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      budget: 25000,
      created_at: '2024-01-10',
      updated_at: '2024-01-25'
    }

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Logo Design Concepts',
        description: 'Create 3-5 initial logo concepts for client review',
        status: 'completed',
        priority: 'high',
        assignee: 'Jane Smith',
        due_date: '2024-01-20',
        created_at: '2024-01-10',
        completed_at: '2024-01-18'
      },
      {
        id: '2',
        title: 'Color Palette Development',
        description: 'Develop primary and secondary color palettes',
        status: 'completed',
        priority: 'high',
        assignee: 'Jane Smith',
        due_date: '2024-01-25',
        created_at: '2024-01-15',
        completed_at: '2024-01-24'
      },
      {
        id: '3',
        title: 'Typography Selection',
        description: 'Choose and define primary and secondary typefaces',
        status: 'in_progress',
        priority: 'medium',
        assignee: 'Mike Johnson',
        due_date: '2024-01-30',
        created_at: '2024-01-20'
      },
      {
        id: '4',
        title: 'Brand Guidelines Document',
        description: 'Create comprehensive brand guidelines PDF',
        status: 'todo',
        priority: 'medium',
        assignee: 'John Doe',
        due_date: '2024-02-05',
        created_at: '2024-01-22'
      },
      {
        id: '5',
        title: 'Business Card Design',
        description: 'Design business card templates',
        status: 'todo',
        priority: 'low',
        assignee: 'Sarah Wilson',
        due_date: '2024-02-10',
        created_at: '2024-01-22'
      }
    ]

    const mockComments: Comment[] = [
      {
        id: '1',
        author: 'Jane Smith',
        content: 'Logo concepts have been uploaded for client review. Waiting for feedback.',
        created_at: '2024-01-18T10:30:00Z',
        type: 'comment'
      },
      {
        id: '2',
        author: 'System',
        content: 'Task "Logo Design Concepts" marked as completed',
        created_at: '2024-01-18T10:32:00Z',
        type: 'status_change'
      },
      {
        id: '3',
        author: 'Mike Johnson',
        content: 'Started working on typography selection. Exploring modern sans-serif options.',
        created_at: '2024-01-24T14:15:00Z',
        type: 'comment'
      },
      {
        id: '4',
        author: 'Jane Smith',
        content: 'Color palette finalized and approved by client. Moving to next phase.',
        created_at: '2024-01-24T16:45:00Z',
        type: 'comment'
      }
    ]

    setProject(mockProject)
    setTasks(mockTasks)
    setComments(mockComments)
    setLoading(false)
  }, [session, status, router, params.id])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: session?.user?.name || 'You',
      content: newComment,
      created_at: new Date().toISOString(),
      type: 'comment'
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/projects">← Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/projects">← Back</Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Client: {project.client_name} • Created {formatDate(project.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={statusColors[project.status]}>
                {project.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={priorityColors[project.priority]}>
                {project.priority} priority
              </Badge>
              <Button>Edit Project</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'tasks', label: `Tasks (${completedTasks}/${totalTasks})` },
                { key: 'timeline', label: 'Timeline' },
                { key: 'files', label: 'Files' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                        <p className="mt-1 text-sm text-gray-900">{project.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Deadline</Label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(project.deadline)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                          <p className="mt-1 text-sm text-gray-900">${project.budget.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.team_members.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium">{member}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <Badge className={statusColors[task.status]}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={priorityColors[task.priority]}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <span>Assigned to: <span className="font-medium">{task.assignee}</span></span>
                            <span>Due: <span className="font-medium">{formatDate(task.due_date)}</span></span>
                            {task.completed_at && (
                              <span>Completed: <span className="font-medium">{formatDate(task.completed_at)}</span></span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'timeline' && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Activity feed and project updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(comment.created_at)}</span>
                            {comment.type === 'status_change' && (
                              <Badge variant="outline" className="text-xs">Status Change</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'files' && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Uploaded files and deliverables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                    <p className="text-muted-foreground mb-6">Upload project files and deliverables here.</p>
                    <Button>Upload Files</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
                    <span className="font-medium">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Days Remaining</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Team Size</span>
                    <span className="font-medium">{project.team_members.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Comment */}
            <Card>
              <CardHeader>
                <CardTitle>Add Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <textarea
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      rows={3}
                      placeholder="Add a comment..."
                    />
                  </div>
                  <Button onClick={handleAddComment} className="w-full">
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📋 Add Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📁 Upload File
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    ✉️ Email Client
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📊 Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}