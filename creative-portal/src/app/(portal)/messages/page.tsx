"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@supabase/supabase-js'

const mockMessages = [
  { id: 1, user: 'System', content: 'Welcome to the project communication channel. All key updates and quick questions can be posted here.', time: '10:00 AM', isClient: false },
  { id: 2, user: 'Client Partner', content: 'Thanks! Just confirming the kickoff call for tomorrow.', time: '10:05 AM', isClient: true },
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export default function MessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const email = session?.user?.email
        if (!email || !supabase) return
        const { data, error } = await supabase
          .from('messages')
          .select('id, user_name, content, created_at, is_client')
          .eq('user_email', email)
          .order('created_at', { ascending: true })

        if (error || !data) {
          // fall back silently to mock
          return
        }
        const mapped = data.map((m: any) => ({
          id: m.id,
          user: m.user_name || 'Partner',
          content: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isClient: !!m.is_client,
        }))
        setMessages([...mockMessages, ...mapped])
      } catch {}
    }
    fetchMessages()
  }, [session])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '') return
    const messageToSend = {
      id: Date.now(),
      user: session?.user?.name || 'Consultant',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isClient: false,
    }
    setMessages(prev => [...prev, messageToSend])
    setNewMessage('')
    // attempt Supabase insert (RLS must allow user)
    try {
      if (!supabase) return
      const email = session?.user?.email
      await supabase.from('messages').insert({
        user_email: email,
        user_name: session?.user?.name || 'Consultant',
        content: messageToSend.content,
        is_client: false,
      })
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders">
          Project Messages
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Direct line for quick feedback and strategic alignment.
        </p>
      </div>

      <div className="flex-grow flex flex-col p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
        <div className="flex-grow space-y-4 overflow-y-auto mb-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isClient ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs md:max-w-lg p-3 rounded-xl shadow-md ${
                msg.isClient
                  ? 'bg-[var(--bg-alt)] text-[var(--text-primary)]'
                  : 'bg-[var(--coral)] text-white'
              }`}>
                <p className="font-semibold text-sm mb-1">
                  {msg.isClient ? msg.user : session?.user?.name || 'You'}
                  <span className="text-xs ml-3 opacity-60 font-normal">{msg.time}</span>
                </p>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-[var(--bg-alt)] border-[var(--border-subtle)] focus:border-[var(--teal)] rounded-full h-12"
          />
          <Button
            type="submit"
            className="bg-[var(--teal)] hover:bg-[#20A29C] text-white rounded-full px-6 h-12 font-bold uppercase tracking-wider"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
