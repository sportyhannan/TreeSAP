import { WorkflowStepper } from '@/components/workflow-stepper'

export default function WorkflowPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workflow Demo</h2>
        <p className="text-sm text-foreground/50 mt-1">
          Step through the &quot;sending an order&quot; flow from the RFC. Each step shows what happens at that stage and the data involved.
        </p>
      </div>

      <WorkflowStepper />
    </div>
  )
}
