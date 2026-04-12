export function RecordCard({
  record,
}: {
  record: Record<string, unknown>
}) {
  return (
    <div className="border border-white/[0.06] rounded-xl p-4 text-sm bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="font-mono font-bold text-xs text-white">
          {String(record.sap_record_id ?? record.id)}
        </span>
        <StatusBadge status={String(record.status)} />
        {'sensitivity_class' in record && (
          <SensitivityBadge level={String(record.sensitivity_class)} />
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {Object.entries(record)
          .filter(([key]) => !['id', 'sap_record_id', 'status', 'sensitivity_class'].includes(key))
          .map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-neutral-500">{key}</dt>
              <dd className="font-mono text-neutral-300">{String(value)}</dd>
            </div>
          ))}
      </dl>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    synced: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    error: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status] ?? 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
      {status}
    </span>
  )
}

function SensitivityBadge({ level }: { level: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        level === 'high'
          ? 'bg-pink-500/15 text-pink-400 border-pink-500/20'
          : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
      }`}
    >
      {level}
    </span>
  )
}
