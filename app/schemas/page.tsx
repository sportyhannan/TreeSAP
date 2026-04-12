import { schemas } from '@/lib/mock-data'
import { SchemaView } from '@/components/schema-view'

export default function SchemasPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Schemas
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Data models defined in the SAP guardrail RFC. Five module tables plus the action_requests table.
        </p>
      </div>

      <div className="grid gap-6">
        {schemas.map((schema) => (
          <SchemaView key={schema.table} schema={schema} />
        ))}
      </div>
    </div>
  )
}
