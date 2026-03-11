import pkg from '../../../package.json'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-static'

export default function ChangelogPage() {
  const version = pkg.version || '0.0.0'
  const deployTarget = 'Cloudflare Workers (OpenNext)'
  const timeline = [
    { title: 'Global navigation polish and mobile drawer', benefit: 'Clear ecosystem links and streamlined Portal access on mobile' },
    { title: 'Authentication flows (sign in, sign up, verify)', benefit: 'Secure access with NextAuth + Prisma adapter' },
    { title: 'Dashboard overview', benefit: 'At-a-glance status with navigation to key areas' },
    { title: 'Projects: list, detail, and create', benefit: 'Organize initiatives and track work by project' },
    { title: 'Documents area', benefit: 'Centralized client assets with consistent UI' },
    { title: 'Messages module', benefit: 'Consolidated communication surface inside Portal' },
    { title: 'StrategyIQ assessments + KB modal', benefit: 'Structured evaluation with contextual knowledge base' },
    { title: 'Admin surface', benefit: 'Administrative controls for accounts and platform' },
    { title: 'Session provider and middleware', benefit: 'Stable auth context and protected routes' },
    { title: 'Deployment config and scripts', benefit: 'Repeatable builds and worker deployment via OpenNext' },
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Portal Changelog</h1>
        <p className="text-[var(--text-secondary)]">Version {version}&nbsp;&nbsp;·&nbsp;&nbsp;Deployed to {deployTarget}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
          <h2 className="text-xl font-semibold mb-2">Highlights</h2>
          <ul className="space-y-2">
            {timeline.map((t, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{t.title}</span>
                <span className="text-[var(--text-secondary)]">: {t.benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 flex items-center justify-center">
          <Image src="/assets/images/The_Portal_Logo.png" alt="Portal" width={280} height={80} />
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
        <h2 className="text-xl font-semibold mb-2">Screens & Examples</h2>
        <ul className="text-sm space-y-2">
          <li><Link className="text-[var(--coral)]" href="/dashboard">Dashboard</Link>: overview and quick navigation</li>
          <li><Link className="text-[var(--coral)]" href="/projects">Projects</Link>: active projects list</li>
          <li><Link className="text-[var(--coral)]" href="/documents">Documents</Link>: client assets</li>
          <li><Link className="text-[var(--coral)]" href="/strategyiq">StrategyIQ</Link>: assessments and KB modal</li>
          <li><Link className="text-[var(--coral)]" href="/admin">Admin</Link>: admin controls</li>
          <li><Link className="text-[var(--coral)]" href="/auth/signin">Sign In</Link>: authentication entry</li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
        <h2 className="text-xl font-semibold mb-2">Deployment</h2>
        <ul className="text-sm space-y-2">
          <li>Target: {deployTarget} via <code>@opennextjs/cloudflare</code> and <code>wrangler</code></li>
          <li>Scripts: <code>npm run preview</code>, <code>npm run deploy</code></li>
          <li>Auth & data: NextAuth + Prisma (see <code>lib/auth.ts</code>, <code>prisma/schema.prisma</code>)</li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
        <h2 className="text-xl font-semibold mb-2">Known Issues</h2>
        <ul className="text-sm space-y-2">
          <li>Autoplay limitations for media, depending on browser policies</li>
          <li>Edge cases in project detail routes when unauthenticated</li>
          <li>Deployment preview may differ from local dev styling due to worker runtime</li>
        </ul>
      </section>
    </main>
  )
}

