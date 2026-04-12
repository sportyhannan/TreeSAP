import { supabase } from '@/lib/supabase'
import { LiveWorkflow } from '@/components/live-workflow'
import type { ModuleSlug } from '@/lib/types'

const modules: ModuleSlug[] = ['finance', 'procurement', 'sales', 'hr', 'operations']

export const dynamic = 'force-dynamic'

export default async function LiveWorkflowPage() {
  // Fetch all records from all module tables
  const recordPromises = modules.map(async (mod) => {
    const { data, error } = await supabase.from(mod).select('*').order('created_at', { ascending: false })
    if (error) return []
    return (data ?? []).map((r) => ({
      id: String(r.id),
      sap_record_id: String(r.sap_record_id),
      status: String(r.status),
      sensitivity_class: String(r.sensitivity_class),
      created_at: String(r.created_at),
      table_name: mod,
    }))
  })

  const allRecordArrays = await Promise.all(recordPromises)
  const allRecords = allRecordArrays.flat()

  // Fetch all action requests
  const { data: actionRequests } = await supabase
    .from('action_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          Live Workflow
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Select a record and trigger AI actions routed through Lava. High-sensitivity records are restricted to summarize and review only.
        </p>
      </div>

      <LiveWorkflow
        records={allRecords}
        actionRequests={actionRequests ?? []}
      />
    </div>
  )
}
