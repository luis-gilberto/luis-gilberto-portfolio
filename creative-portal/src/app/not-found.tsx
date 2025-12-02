"use client";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <Link href="/" aria-label="Go home" className="inline-flex" />

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-gray-500 max-w-prose text-center">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-100">
        Return home
      </Link>
    </main>
  );
}
