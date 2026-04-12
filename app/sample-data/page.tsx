import { allRecordsByModule, sampleActionRequests, moduleLabels } from '@/lib/mock-data'
import { RecordCard } from '@/components/record-card'

export default function SampleDataPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sample Data</h2>
        <p className="text-sm text-foreground/50 mt-1">
          Hardcoded records used to demonstrate the guardrail workflow.
        </p>
      </div>

      {Object.entries(allRecordsByModule).map(([module, records]) => (
        <section key={module}>
          <h3 className="text-lg font-semibold mb-3">{moduleLabels[module]}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {records.map((record) => (
              <RecordCard key={record.id} record={record as unknown as Record<string, unknown>} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="text-lg font-semibold mb-3">Action Requests</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {sampleActionRequests.map((ar) => (
            <RecordCard key={ar.id} record={ar as unknown as Record<string, unknown>} />
          ))}
        </div>
      </section>
    </div>
  )
}
