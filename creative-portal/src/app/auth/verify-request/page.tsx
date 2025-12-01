import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border-strong)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-big-shoulders text-[var(--coral)] mb-2">Check Your Email</h1>
          <p className="text-[var(--text-secondary)]">A sign-in link has been sent to your inbox.</p>
        </div>
        <p className="text-sm text-[var(--text-muted)]">(In development mode, copy the link from your terminal.)</p>
        <Link href="/" className="mt-6 inline-block text-[var(--teal)] hover:text-[var(--text-primary)] transition-colors">Return to Portal Home</Link>
      </div>
    </div>
  )
}
