'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Schemas' },
  { href: '/sample-data', label: 'Sample Data' },
  { href: '/workflow', label: 'Workflow Demo' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-foreground/10 bg-foreground/[0.02] p-4 flex flex-col gap-1">
      <h1 className="text-lg font-bold mb-4 tracking-tight">TreeSAP</h1>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-foreground/10 font-medium'
                  : 'hover:bg-foreground/5'
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
