"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, ShieldCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  title: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (title: string, message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((title: string, message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={cn(
                "w-96 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-stretch pointer-events-auto",
                "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1",
                t.type === "success" ? "before:bg-[#2ED3C6] border-l-0" : "before:bg-coral border-l-0"
              )}
            >
              <div className="p-5 flex items-start gap-4 flex-1">
                <div className={cn(
                  "mt-0.5 p-2 rounded-lg bg-white/5",
                  t.type === "success" ? "text-[#2ED3C6]" : "text-coral"
                )}>
                  {t.type === "success" ? <ShieldCheck size={20} /> : <CheckCircle size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-black tracking-[0.2em] uppercase font-big-shoulders italic text-white/90">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-white/40 mt-1 leading-relaxed font-inter">
                    {t.message}
                  </p>
                </div>
                <button 
                  onClick={() => removeToast(t.id)}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
