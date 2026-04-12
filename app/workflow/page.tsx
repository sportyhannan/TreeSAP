import { WorkflowStepper } from '@/components/workflow-stepper'

export default function WorkflowPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
          Workflow Demo
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Step through the &quot;sending an order&quot; flow from the RFC.
        </p>
      </div>

      <WorkflowStepper />
    </div>
  )
}
