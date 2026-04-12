export function RecordCard({
  record,
}: {
  record: Record<string, unknown>
}) {
  return (
    <div className="border border-foreground/10 rounded-lg p-4 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono font-semibold text-xs">
          {String(record.sap_record_id ?? record.id)}
        </span>
        <StatusBadge status={String(record.status)} />
        {'sensitivity_class' in record && (
          <SensitivityBadge level={String(record.sensitivity_class)} />
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {Object.entries(record)
          .filter(([key]) => !['id', 'sap_record_id', 'status', 'sensitivity_class'].includes(key))
          .map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-foreground/50">{key}</dt>
              <dd className="font-mono text-foreground/80">{String(value)}</dd>
            </div>
          ))}
      </dl>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    synced: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function SensitivityBadge({ level }: { level: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
        level === 'high'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      {level}
    </span>
  )
}
