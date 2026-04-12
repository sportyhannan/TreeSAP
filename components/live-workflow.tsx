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

const moduleLabels: Record<string, string> = {
  finance: 'Finance',
  procurement: 'Procurement',
  sales: 'Sales',
  hr: 'HR',
  operations: 'Operations',
}

const moduleAccent: Record<string, { border: string; text: string; bg: string }> = {
  finance:     { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  procurement: { border: 'border-orange-500/30',  text: 'text-orange-400',  bg: 'bg-orange-500/10' },
  sales:       { border: 'border-blue-500/30',    text: 'text-blue-400',    bg: 'bg-blue-500/10' },
  hr:          { border: 'border-pink-500/30',     text: 'text-pink-400',    bg: 'bg-pink-500/10' },
  operations:  { border: 'border-amber-500/30',   text: 'text-amber-400',   bg: 'bg-amber-500/10' },
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

  const allowedActions = selectedRecord
    ? sensitivityAllowed[selectedRecord.sensitivity_class] ?? []
    : []

  const recordsForSelected = selectedRecord
    ? actionRequests.filter((ar) => ar.source_record_id === selectedRecord.id)
    : []

  // Group records by module
  const grouped = records.reduce<Record<string, SapRecord[]>>((acc, r) => {
    ;(acc[r.table_name] ??= []).push(r)
    return acc
  }, {})

  return (
    <div className="flex gap-6 items-stretch min-h-[calc(100vh-10rem)]">
      {/* Left: records list */}
      <div className="flex-1 min-w-0 space-y-6">
        {Object.entries(grouped).map(([mod, recs]) => {
          const accent = moduleAccent[mod] ?? moduleAccent.finance
          return (
            <section key={mod}>
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${accent.text}`}>
                {moduleLabels[mod] ?? mod}
              </h3>
              <div className="space-y-2">
                {recs.map((r) => {
                  const isSelected = selectedRecord?.id === r.id
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRecord(r)
                        setLatestOutput(null)
                        setError(null)
                      }}
                      className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg border transition-all ${
                        isSelected
                          ? `${accent.border} ${accent.bg} ring-1 ring-violet-500/40`
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="font-mono font-bold text-sm text-white w-28 shrink-0">
                        {r.sap_record_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.status === 'synced' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                        r.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                        'bg-red-500/15 text-red-400 border-red-500/20'
                      }`}>
                        {r.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.sensitivity_class === 'high'
                          ? 'bg-pink-500/15 text-pink-400 border-pink-500/20'
                          : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {r.sensitivity_class}
                      </span>
                      <span className="text-[11px] text-neutral-600 ml-auto">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Right: action panel */}
      <div className="w-[28rem] shrink-0 sticky top-8 self-start">
        {selectedRecord ? (
          <div className="border border-white/[0.08] rounded-xl bg-white/[0.03] shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold text-base ${moduleAccent[selectedRecord.table_name]?.text ?? 'text-white'}`}>
                  {selectedRecord.sap_record_id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  moduleAccent[selectedRecord.table_name]?.bg ?? ''
                } ${moduleAccent[selectedRecord.table_name]?.text ?? ''}`}>
                  {moduleLabels[selectedRecord.table_name]}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                {selectedRecord.sensitivity_class === 'high'
                  ? 'High sensitivity — summarize & review only'
                  : 'Low sensitivity — all actions available'}
              </p>
            </div>

            <div className="p-5 space-y-4">
              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                {actionTypes.map((at) => {
                  const allowed = allowedActions.includes(at)
                  return (
                    <button
                      key={at}
                      onClick={() => handleTrigger(at)}
                      disabled={!allowed || isPending}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        allowed
                          ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-500/20 disabled:opacity-50'
                          : 'bg-white/[0.04] text-neutral-600 border border-white/[0.06] cursor-not-allowed'
                      }`}
                    >
                      {isPending ? '...' : at}
                    </button>
                  )
                })}
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Latest AI output */}
              {latestOutput && (
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-2 font-semibold">
                    AI Output
                  </p>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {latestOutput}
                  </p>
                </div>
              )}

              {/* Action history */}
              {recordsForSelected.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-semibold">
                    History
                  </p>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                    {recordsForSelected.map((ar) => (
                      <div
                        key={ar.id}
                        className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-300 text-xs">{ar.action_type}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${
                            ar.status === 'synced' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                            ar.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                            'bg-red-500/15 text-red-400 border-red-500/20'
                          }`}>
                            {ar.status}
                          </span>
                        </div>
                        {ar.ai_output && (
                          <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
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
        ) : (
          <div className="border border-white/[0.06] rounded-xl bg-white/[0.02] p-8 text-center min-h-[24rem] flex items-center justify-center">
            <p className="text-neutral-500 text-sm">Select a record to view actions</p>
          </div>
        )}
      </div>
    </div>
  )
}
