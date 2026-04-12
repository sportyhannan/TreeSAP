import { allRecordsByModule, sampleActionRequests, moduleLabels } from '@/lib/mock-data'
import { RecordCard } from '@/components/record-card'

const moduleAccents: Record<string, string> = {
  finance: 'from-emerald-400 to-green-400',
  procurement: 'from-orange-400 to-amber-400',
  sales: 'from-blue-400 to-cyan-400',
  hr: 'from-pink-400 to-rose-400',
  operations: 'from-amber-400 to-yellow-400',
}

export default function SampleDataPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Sample Data
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Hardcoded records used to demonstrate the guardrail workflow.
        </p>
      </div>

      {Object.entries(allRecordsByModule).map(([module, records]) => (
        <section key={module}>
          <h3 className={`text-lg font-semibold mb-3 bg-gradient-to-r ${moduleAccents[module] ?? 'from-white to-white'} bg-clip-text text-transparent`}>
            {moduleLabels[module]}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {records.map((record) => (
              <RecordCard key={record.id} record={record as unknown as Record<string, unknown>} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Action Requests
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {sampleActionRequests.map((ar) => (
            <RecordCard key={ar.id} record={ar as unknown as Record<string, unknown>} />
          ))}
        </div>
      </section>
    </div>
  )
}
