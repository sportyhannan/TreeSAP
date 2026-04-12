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
  finance: 'from-emerald-50 to-green-50 border-emerald-200',
  procurement: 'from-orange-50 to-amber-50 border-orange-200',
  sales: 'from-blue-50 to-cyan-50 border-blue-200',
  hr: 'from-pink-50 to-rose-50 border-pink-200',
  operations: 'from-amber-50 to-yellow-50 border-amber-200',
}

const moduleBadge: Record<string, string> = {
  finance: 'bg-emerald-100 text-emerald-700',
  procurement: 'bg-orange-100 text-orange-700',
  sales: 'bg-blue-100 text-blue-700',
  hr: 'bg-pink-100 text-pink-700',
  operations: 'bg-amber-100 text-amber-700',
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
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                className={`text-left p-4 rounded-xl border-2 transition-all bg-gradient-to-br ${
                  moduleColors[r.table_name] ?? 'from-gray-50 to-gray-50 border-gray-200'
                } ${isSelected ? 'ring-2 ring-violet-400 scale-[1.02] shadow-md' : 'hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-bold text-sm text-gray-900">
                    {r.sap_record_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${moduleBadge[r.table_name] ?? 'bg-gray-100 text-gray-600'}`}>
                    {r.table_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium border ${
                    r.status === 'synced' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    r.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {r.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium border ${
                    r.sensitivity_class === 'high'
                      ? 'bg-pink-50 text-pink-700 border-pink-200'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200'
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
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">
              Actions for {selectedRecord.sap_record_id}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      allowed
                        ? 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700 disabled:opacity-50'
                        : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {isPending ? 'Processing...' : at}
                  </button>
                )
              })}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Latest AI output */}
            {latestOutput && (
              <div className="p-4 rounded-lg bg-violet-50 border border-violet-200">
                <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-2 font-semibold">
                  AI Output (via Lava)
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {latestOutput}
                </p>
              </div>
            )}

            {/* Action history for this record */}
            {recordsForSelected.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                  Action History
                </p>
                <div className="space-y-2">
                  {recordsForSelected.map((ar) => (
                    <div
                      key={ar.id}
                      className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-700">{ar.action_type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          ar.status === 'synced' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          ar.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {ar.status}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(ar.created_at).toLocaleString()}
                        </span>
                      </div>
                      {ar.ai_output && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
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
