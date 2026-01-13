import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/20 bg-black/95 backdrop-blur-xl shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-big-shoulders text-white mb-2">Check Your Email</h1>
          <p className="text-gray-300">A sign-in link has been sent to your inbox.</p>
        </div>
        <p className="text-sm text-gray-400 mb-6">(In development mode, copy the link from your terminal.)</p>
        <Link href="/" className="text-sm font-medium text-[var(--teal)] hover:text-white transition-colors uppercase tracking-wider">Return to Portal Home</Link>
      </div>
    </div>
  )
}
