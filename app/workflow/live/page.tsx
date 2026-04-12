import { supabase } from '@/lib/supabase'
import { LiveWorkflow } from '@/components/live-workflow'
import type { ModuleSlug } from '@/lib/types'

const moduleToTable: Record<ModuleSlug, string> = {
  finance: 'finance_records',
  procurement: 'procurement_records',
  sales: 'sales_records',
  hr: 'hr_records',
  operations: 'operations_records',
}
const modules = Object.keys(moduleToTable) as ModuleSlug[]

export const dynamic = 'force-dynamic'

export default async function LiveWorkflowPage() {
  // Fetch all records from all module tables
  const recordPromises = modules.map(async (mod) => {
    const table = moduleToTable[mod]
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    console.log(`[supabase] ${table}:`, { count: data?.length ?? 0, error: error?.message ?? null })
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
  console.log(`[supabase] total records loaded: ${allRecords.length}`)

  // Fetch all action requests
  const { data: actionRequests, error: arError } = await supabase
    .from('action_requests')
    .select('*')
    .order('created_at', { ascending: false })
  console.log(`[supabase] action_requests:`, { count: actionRequests?.length ?? 0, error: arError?.message ?? null })

  return (
    <div className="space-y-6 h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Live Workflow
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
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
