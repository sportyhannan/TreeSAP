'use client'

import { useState } from 'react'

const layerLabels = {
  user: 'User',
  frontend: 'Frontend',
  supabase: 'Supabase',
  edge: 'Edge Function',
  gateway: 'Internal Gateway',
  lava: 'Lava / Model',
} as const

type Layer = keyof typeof layerLabels

const steps = [
  {
    title: 'User opens order page',
    description: 'User navigates to sales order SO-2026-001 for customer CUST-400.',
    layer: 'user' as Layer,
    data: { table: 'sales_records', record: 'SO-2026-001', status: 'pending', net_amount: 8750.00 },
  },
  {
    title: 'User clicks "Send order"',
    description: 'The user initiates a send action on the order. The frontend prepares an action request.',
    layer: 'frontend' as Layer,
    data: { action: 'send', target: 'SO-2026-001' },
  },
  {
    title: 'Action request written to Supabase',
    description: 'Frontend writes a new row to the action_requests table with status "pending".',
    layer: 'supabase' as Layer,
    data: {
      table: 'action_requests',
      source_record_id: 's1a2b3c4-...0001',
      action_type: 'send',
      status: 'pending',
    },
  },
  {
    title: 'Edge function detects new request',
    description: 'A Supabase edge function trigger fires on the new action_requests insert.',
    layer: 'edge' as Layer,
    data: { trigger: 'on_insert', table: 'action_requests', function: 'handle_action_request' },
  },
  {
    title: 'Internal gateway classifies request',
    description: 'The gateway identifies this as a sales-domain request and selects the appropriate route based on sensitivity class (low) and action type (send).',
    layer: 'gateway' as Layer,
    data: { domain: 'sales', sensitivity: 'low', action: 'send', route: 'approved' },
  },
  {
    title: 'Lava forwards to model',
    description: 'Lava routes the request to the approved model provider. The model generates a draft order email.',
    layer: 'lava' as Layer,
    data: { provider: 'approved_model', input: 'SO-2026-001 send request', output: 'draft generated' },
  },
  {
    title: 'Output stored in Supabase',
    description: 'The AI-generated draft is stored back in Supabase, linked to the action request.',
    layer: 'supabase' as Layer,
    data: {
      table: 'action_requests',
      status: 'pending → awaiting_review',
      ai_output: 'Dear CUST-400, your order #SO-2026-001 for $8,750.00 has been processed...',
    },
  },
  {
    title: 'UI refreshes with output',
    description: 'The frontend subscribes to changes and renders the AI-generated content in the order page.',
    layer: 'frontend' as Layer,
    data: { subscription: 'realtime', table: 'action_requests', event: 'UPDATE' },
  },
  {
    title: 'User reviews generated content',
    description: 'The user reads the AI-generated order email draft and decides whether to approve or reject.',
    layer: 'user' as Layer,
    data: {
      draft: 'Dear CUST-400, your order #SO-2026-001 for $8,750.00 has been processed and is ready for shipment...',
      options: ['Approve', 'Reject'],
    },
  },
  {
    title: 'User approves final send',
    description: 'User approves the draft. The action request status updates to "synced" and the order is sent.',
    layer: 'supabase' as Layer,
    data: { table: 'action_requests', status: 'synced', table2: 'sales_records', record_status: 'synced' },
  },
]

const layerColors: Record<Layer, { bg: string; border: string; badge: string; text: string }> = {
  user:     { bg: 'bg-blue-950',   border: 'border-blue-500',   badge: 'bg-blue-500',   text: 'text-blue-300' },
  frontend: { bg: 'bg-amber-950',  border: 'border-amber-500',  badge: 'bg-amber-500',  text: 'text-amber-300' },
  supabase: { bg: 'bg-green-950',  border: 'border-green-500',  badge: 'bg-green-500',  text: 'text-green-300' },
  edge:     { bg: 'bg-orange-950', border: 'border-orange-500', badge: 'bg-orange-500', text: 'text-orange-300' },
  gateway:  { bg: 'bg-purple-950', border: 'border-purple-500', badge: 'bg-purple-500', text: 'text-purple-300' },
  lava:     { bg: 'bg-pink-950',   border: 'border-pink-500',   badge: 'bg-pink-500',   text: 'text-pink-300' },
}

const allLayers: Layer[] = ['user', 'frontend', 'supabase', 'edge', 'gateway', 'lava']

export function WorkflowStepper() {
  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]
  const colors = layerColors[step.layer]

  return (
    <div className="space-y-8">
      {/* Architecture layers - shows which layer is active */}
      <div className="flex gap-2 flex-wrap">
        {allLayers.map((layer) => {
          const isActive = step.layer === layer
          const c = layerColors[layer]
          return (
            <span
              key={layer}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                isActive
                  ? `${c.badge} text-white border-transparent scale-105 shadow-lg`
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {layerLabels[layer]}
            </span>
          )
        })}
      </div>

      {/* Progress steps - numbered circles */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => {
          const c = layerColors[s.layer]
          const isActive = i === currentStep
          const isPast = i < currentStep
          return (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setCurrentStep(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isActive
                    ? `${c.badge} text-white border-transparent shadow-lg scale-110`
                    : isPast
                      ? `bg-neutral-800 text-neutral-300 border-neutral-600`
                      : 'bg-neutral-900 text-neutral-600 border-neutral-800'
                }`}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    isPast ? 'bg-neutral-600' : 'bg-neutral-800'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Current step card */}
      <div className={`border-2 rounded-xl overflow-hidden ${colors.border} ${colors.bg}`}>
        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-3xl font-black ${colors.text}`}>
                {String(currentStep + 1).padStart(2, '0')}
              </span>
              <h3 className="font-semibold text-lg text-white">{step.title}</h3>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {step.description}
            </p>
          </div>
          <span className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold ${colors.badge} text-white`}>
            {layerLabels[step.layer]}
          </span>
        </div>

        {/* Data payload */}
        <div className="mx-6 mb-6 rounded-lg bg-black/40 border border-white/10 p-5">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3 font-semibold">
            Data at this step
          </p>
          <pre className="text-sm font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(step.data, null, 2)}
          </pre>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 disabled:opacity-20 hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-neutral-500 font-medium">
          {currentStep + 1} / {steps.length}
        </span>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg border-0 text-white disabled:opacity-20 transition-colors ${colors.badge} hover:opacity-90`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
