import type { SchemaDefinition } from '@/lib/types'
import { moduleLabels } from '@/lib/mock-data'

export function SchemaView({ schema }: { schema: SchemaDefinition }) {
  return (
    <div className="border border-foreground/10 rounded-lg overflow-hidden">
      <div className="bg-foreground/[0.04] px-4 py-3 border-b border-foreground/10">
        <h3 className="font-mono text-sm font-semibold">{schema.table}</h3>
        <p className="text-xs text-foreground/50 mt-0.5">
          {moduleLabels[schema.module]} module
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/10 text-left text-xs text-foreground/50">
            <th className="px-4 py-2 font-medium">Column</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Constraint</th>
          </tr>
        </thead>
        <tbody>
          {schema.fields.map((field) => (
            <tr
              key={field.name}
              className="border-b border-foreground/5 last:border-0"
            >
              <td className="px-4 py-2 font-mono text-xs">{field.name}</td>
              <td className="px-4 py-2 text-foreground/70 text-xs">
                {field.type}
              </td>
              <td className="px-4 py-2 text-foreground/50 text-xs">
                {field.constraint ?? '\u2014'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
