import type { SchemaDefinition } from '@/lib/types'
import { moduleLabels } from '@/lib/mock-data'

const moduleColors: Record<string, { gradient: string; accent: string }> = {
  finance: { gradient: 'from-emerald-500/10 to-emerald-500/5', accent: 'text-emerald-400' },
  procurement: { gradient: 'from-orange-500/10 to-orange-500/5', accent: 'text-orange-400' },
  sales: { gradient: 'from-blue-500/10 to-blue-500/5', accent: 'text-blue-400' },
  hr: { gradient: 'from-pink-500/10 to-pink-500/5', accent: 'text-pink-400' },
  operations: { gradient: 'from-amber-500/10 to-amber-500/5', accent: 'text-amber-400' },
  action_requests: { gradient: 'from-violet-500/10 to-violet-500/5', accent: 'text-violet-400' },
}

export function SchemaView({ schema }: { schema: SchemaDefinition }) {
  const colors = moduleColors[schema.module] ?? moduleColors.action_requests

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
      <div className={`bg-gradient-to-r ${colors.gradient} px-5 py-4 border-b border-white/[0.06]`}>
        <h3 className={`font-mono text-sm font-bold ${colors.accent}`}>{schema.table}</h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          {moduleLabels[schema.module]} module
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] text-neutral-500 uppercase tracking-wider">
            <th className="px-5 py-2.5 font-medium">Column</th>
            <th className="px-5 py-2.5 font-medium">Type</th>
            <th className="px-5 py-2.5 font-medium">Constraint</th>
          </tr>
        </thead>
        <tbody>
          {schema.fields.map((field) => (
            <tr
              key={field.name}
              className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <td className={`px-5 py-2.5 font-mono text-xs font-medium ${colors.accent}`}>{field.name}</td>
              <td className="px-5 py-2.5 text-neutral-400 text-xs">{field.type}</td>
              <td className="px-5 py-2.5 text-neutral-500 text-xs font-mono">
                {field.constraint ?? '\u2014'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
