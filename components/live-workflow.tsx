'use client'

import { useState, useTransition } from 'react'
import { triggerAction } from '@/lib/actions'
import type { ModuleSlug, ActionType } from '@/lib/types'

interface SapRecord {
  id: string
  sap_record_id: string
  status: string
  sensitivity_class: string
  created_at: string
  table_name: ModuleSlug
}

interface ActionRequestRow {
  id: string
  source_record_id: string
  action_type: string
  status: string
  ai_output: string | null
  created_at: string
}

const actionTypes: ActionType[] = ['summarize', 'draft', 'send', 'review']

const sensitivityAllowed: Record<string, ActionType[]> = {
  low: ['summarize', 'draft', 'send', 'review'],
  high: ['summarize', 'review'],
}

const moduleColors: Record<string, string> = {
  finance: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
  procurement: 'from-orange-500/10 to-orange-500/5 border-orange-500/30',
  sales: 'from-blue-500/10 to-blue-500/5 border-blue-500/30',
  hr: 'from-pink-500/10 to-pink-500/5 border-pink-500/30',
  operations: 'from-amber-500/10 to-amber-500/5 border-amber-500/30',
}

const moduleBadge: Record<string, string> = {
  finance: 'bg-emerald-500/15 text-emerald-400',
  procurement: 'bg-orange-500/15 text-orange-400',
  sales: 'bg-blue-500/15 text-blue-400',
  hr: 'bg-pink-500/15 text-pink-400',
  operations: 'bg-amber-500/15 text-amber-400',
}

export function LiveWorkflow({
  records,
  actionRequests: initialActionRequests,
}: {
  records: SapRecord[]
  actionRequests: ActionRequestRow[]
}) {
  const [selectedRecord, setSelectedRecord] = useState<SapRecord | null>(null)
  const [actionRequests, setActionRequests] = useState(initialActionRequests)
  const [latestOutput, setLatestOutput] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleTrigger(actionType: ActionType) {
    if (!selectedRecord) return
    setError(null)
    setLatestOutput(null)

    startTransition(async () => {
      try {
        const result = await triggerAction(
          selectedRecord.id,
          selectedRecord.table_name,
          actionType
        )
        setLatestOutput(result.ai_output)
        setActionRequests((prev) => [
          {
            id: result.id,
            source_record_id: selectedRecord.id,
            action_type: actionType,
            status: result.status,
            ai_output: result.ai_output,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed')
      }
    })
  }

  const recordsForSelected = selectedRecord
    ? actionRequests.filter((ar) => ar.source_record_id === selectedRecord.id)
    : []

  const allowedActions = selectedRecord
    ? sensitivityAllowed[selectedRecord.sensitivity_class] ?? []
    : []

  return (
    <div className="space-y-8">
      {/* Records grid */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Select a record
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => {
            const isSelected = selectedRecord?.id === r.id
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRecord(r)
                  setLatestOutput(null)
                  setError(null)
                }}
                className={`text-left p-4 rounded-xl border transition-all bg-gradient-to-br ${
                  moduleColors[r.table_name] ?? 'from-neutral-800 to-neutral-900 border-neutral-700'
                } ${isSelected ? 'ring-2 ring-violet-500 scale-[1.02] shadow-lg shadow-violet-500/10' : 'hover:shadow-md hover:shadow-white/5'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-bold text-sm text-white">
                    {r.sap_record_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${moduleBadge[r.table_name] ?? 'bg-neutral-800 text-neutral-400'}`}>
                    {r.table_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium border ${
                    r.status === 'synced' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                    r.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                    'bg-red-500/15 text-red-400 border-red-500/20'
                  }`}>
                    {r.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium border ${
                    r.sensitivity_class === 'high'
                      ? 'bg-pink-500/15 text-pink-400 border-pink-500/20'
                      : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {r.sensitivity_class}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action panel */}
      {selectedRecord && (
        <div className="border border-white/[0.08] rounded-xl bg-white/[0.03] shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <h3 className="font-semibold text-white">
              Actions for {selectedRecord.sap_record_id}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Sensitivity: {selectedRecord.sensitivity_class} — {
                selectedRecord.sensitivity_class === 'high'
                  ? 'restricted to summarize & review only'
                  : 'all actions available'
              }
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {actionTypes.map((at) => {
                const allowed = allowedActions.includes(at)
                return (
                  <button
                    key={at}
                    onClick={() => handleTrigger(at)}
                    disabled={!allowed || isPending}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      allowed
                        ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-500/20 disabled:opacity-50'
                        : 'bg-white/[0.04] text-neutral-600 border border-white/[0.06] cursor-not-allowed'
                    }`}
                  >
                    {isPending ? 'Processing...' : at}
                  </button>
                )
              })}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Latest AI output */}
            {latestOutput && (
              <div className="p-5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-2 font-semibold">
                  AI Output (via Lava)
                </p>
                <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {latestOutput}
                </p>
              </div>
            )}

            {/* Action history for this record */}
            {recordsForSelected.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-semibold">
                  Action History
                </p>
                <div className="space-y-2">
                  {recordsForSelected.map((ar) => (
                    <div
                      key={ar.id}
                      className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-neutral-300">{ar.action_type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          ar.status === 'synced' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                          ar.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                          'bg-red-500/15 text-red-400 border-red-500/20'
                        }`}>
                          {ar.status}
                        </span>
                        <span className="text-xs text-neutral-600 ml-auto">
                          {new Date(ar.created_at).toLocaleString()}
                        </span>
                      </div>
                      {ar.ai_output && (
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                          {ar.ai_output}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
