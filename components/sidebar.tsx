'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'RFC Document' },
  { href: '/schemas', label: 'Schemas' },
  { href: '/sample-data', label: 'Sample Data' },
  { href: '/workflow', label: 'Workflow Demo' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r border-white/5 bg-[#13131a] p-5 flex flex-col gap-1">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
          TreeSAP
        </h1>
        <p className="text-[11px] text-neutral-500 mt-0.5">Guardrail Architecture</p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white font-medium border border-violet-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
