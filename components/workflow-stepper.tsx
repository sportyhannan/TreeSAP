'use client'

import { useState } from 'react'

const steps = [
  {
    title: '1. User opens order page',
    description: 'User navigates to sales order SO-2026-001 for customer CUST-400.',
    data: { table: 'sales_records', record: 'SO-2026-001', status: 'pending', net_amount: 8750.00 },
    highlight: 'record',
  },
  {
    title: '2. User clicks "Send order"',
    description: 'The user initiates a send action on the order. The frontend prepares an action request.',
    data: { action: 'send', target: 'SO-2026-001' },
    highlight: 'action',
  },
  {
    title: '3. Action request written to Supabase',
    description: 'Frontend writes a new row to the action_requests table with status "pending".',
    data: {
      table: 'action_requests',
      source_record_id: 's1a2b3c4-...0001',
      action_type: 'send',
      status: 'pending',
    },
    highlight: 'database',
  },
  {
    title: '4. Edge function detects new request',
    description: 'A Supabase edge function trigger fires on the new action_requests insert.',
    data: { trigger: 'on_insert', table: 'action_requests', function: 'handle_action_request' },
    highlight: 'trigger',
  },
  {
    title: '5. Internal gateway classifies request',
    description: 'The gateway identifies this as a sales-domain request and selects the appropriate route based on sensitivity class (low) and action type (send).',
    data: { domain: 'sales', sensitivity: 'low', action: 'send', route: 'approved' },
    highlight: 'gateway',
  },
  {
    title: '6. Lava forwards to model',
    description: 'Lava routes the request to the approved model provider. The model generates a draft order email.',
    data: { provider: 'approved_model', input: 'SO-2026-001 send request', output: 'draft generated' },
    highlight: 'model',
  },
  {
    title: '7. Output stored in Supabase',
    description: 'The AI-generated draft is stored back in Supabase, linked to the action request.',
    data: {
      table: 'action_requests',
      status: 'pending → awaiting_review',
      ai_output: 'Dear CUST-400, your order #SO-2026-001 for $8,750.00 has been processed...',
    },
    highlight: 'database',
  },
  {
    title: '8. UI refreshes with output',
    description: 'The frontend subscribes to changes and renders the AI-generated content in the order page.',
    data: { subscription: 'realtime', table: 'action_requests', event: 'UPDATE' },
    highlight: 'ui',
  },
  {
    title: '9. User reviews generated content',
    description: 'The user reads the AI-generated order email draft and decides whether to approve or reject.',
    data: {
      draft: 'Dear CUST-400, your order #SO-2026-001 for $8,750.00 has been processed and is ready for shipment...',
      options: ['Approve', 'Reject'],
    },
    highlight: 'review',
  },
  {
    title: '10. User approves final send',
    description: 'User approves the draft. The action request status updates to "synced" and the order is sent.',
    data: { table: 'action_requests', status: 'synced', table2: 'sales_records', record_status: 'synced' },
    highlight: 'complete',
  },
]

const highlightColors: Record<string, string> = {
  record: 'border-blue-400 bg-blue-50',
  action: 'border-yellow-400 bg-yellow-50',
  database: 'border-green-400 bg-green-50',
  trigger: 'border-orange-400 bg-orange-50',
  gateway: 'border-purple-400 bg-purple-50',
  model: 'border-pink-400 bg-pink-50',
  ui: 'border-cyan-400 bg-cyan-50',
  review: 'border-amber-400 bg-amber-50',
  complete: 'border-emerald-400 bg-emerald-50',
}

export function WorkflowStepper() {
  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-foreground/70' : 'bg-foreground/10'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className={`border-2 rounded-lg p-6 transition-colors ${highlightColors[step.highlight] ?? 'border-foreground/10'}`}>
        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
        <p className="text-sm text-foreground/70 mb-4">{step.description}</p>

        {/* Data payload */}
        <div className="bg-white/80 rounded-md border border-foreground/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-medium">
            Data at this step
          </p>
          <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap">
            {JSON.stringify(step.data, null, 2)}
          </pre>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm rounded-md border border-foreground/10 disabled:opacity-30 hover:bg-foreground/5 transition-colors"
        >
          Previous
        </button>
        <span className="text-xs text-foreground/50">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 text-sm rounded-md border border-foreground/10 disabled:opacity-30 hover:bg-foreground/5 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
