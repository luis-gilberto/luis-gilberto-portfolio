"use client"

import { useEffect } from "react"

type Props = {
  open: boolean
  onClose: () => void
  title: string
  points: string[]
}

export default function KBModal({ open, onClose, title, points }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-xl rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-big-shoulders text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--coral)]" aria-label="Close">✕</button>
          </div>
          <ul className="space-y-3">
            {points.map((p, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

