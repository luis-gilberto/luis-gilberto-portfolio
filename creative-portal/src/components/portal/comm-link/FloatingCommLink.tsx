'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, RefreshCw, ChevronUp, ChevronDown, Minus, Maximize2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender?: {
    name: string
    role: string
  }
  isClient?: boolean
  role?: string
  time?: string
}

export function FloatingCommLink() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [activeProject, setActiveProject] = useState<any>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/data')
      if (response.ok) {
        const data = await response.json()
        if (data.activeProject) {
          setActiveProject(data.activeProject)
          fetchMessages(data.activeProject.id)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data for Comm Link:', error)
    }
  }, [])

  const fetchMessages = useCallback(async (projectId: string) => {
    try {
      const msgResponse = await fetch(`/api/messages?projectId=${projectId}`)
      if (msgResponse.ok) {
        const msgs = await msgResponse.json()
        setMessages(msgs.map((m: any) => ({
          ...m,
          isClient: m.senderId === session?.user?.id,
          role: m.sender?.role,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session, fetchDashboardData])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeProject) return

    setIsSending(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          content: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(activeProject.id)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Hide on dashboard as it has an inline comm link
  if (!session || pathname === '/dashboard') return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "mb-4 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300",
              isMinimized ? "h-16" : "h-[500px]"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                <h3 className="text-sm font-bold tracking-widest text-white font-big-shoulders italic uppercase">
                  Comm Link <span className="text-white/20 ml-2">/ Direct alignment</span>
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={chatScrollRef} 
                  className="flex-grow overflow-y-auto p-4 space-y-4 bg-black/20"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-10">
                      <MessageSquare size={40} />
                      <p className="text-xs font-inter uppercase tracking-widest">
                        Secure line active.<br/>Awaiting transmission.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isStrategist = msg.role === 'ADMIN' || msg.role === 'TEAM_MEMBER' || msg.sender?.role === 'ADMIN' || msg.sender?.role === 'TEAM_MEMBER'
                      const isMe = msg.isClient
                      const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId
                      
                      return (
                        <div key={msg.id} className={cn(
                          "flex flex-col",
                          isMe ? 'items-end' : 'items-start',
                          !showHeader && "-mt-2"
                        )}>
                          {showHeader && (
                            <div className="flex items-center gap-2 mb-1 px-1">
                              <span className={cn(
                                "text-[9px] font-mono uppercase tracking-tight",
                                isStrategist ? "text-teal" : "text-white/40"
                              )}>
                                {isStrategist ? "Strategist" : "Partner"}
                                <span className="opacity-30 mx-2">//</span>
                                {msg.time || ""}
                              </span>
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[85%] p-3 rounded-xl text-[12px] leading-relaxed transition-all font-inter",
                            isMe 
                              ? "bg-[#1A1A1A] text-white border border-white/5 rounded-tr-none ml-auto text-right"
                              : "bg-[#0F1717] text-white border-l-[2px] border-l-teal rounded-tl-none mr-auto text-left shadow-lg shadow-teal/5" 
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isSending ? "Transmitting..." : "Secure transmission..."}
                    disabled={isSending || !activeProject}
                    className="bg-white/5 border-white/10 focus:border-coral/50 text-white placeholder:text-white/20 rounded-xl h-10 text-xs"
                  />
                  <Button 
                    type="submit"
                    disabled={isSending || !newMessage.trim() || !activeProject}
                    className="bg-coral hover:bg-coral/90 text-white w-10 h-10 rounded-xl p-0 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-coral/20 shrink-0"
                  >
                    {isSending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          isOpen ? "bg-white/10 text-white border border-white/20" : "bg-coral text-white shadow-coral/20"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
          </span>
        )}
      </motion.button>
    </div>
  )
}
