export default function RfcPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">RFC: SAP</h2>
        <p className="text-sm text-foreground/50 mt-1">
          Context-aware guardrail architecture for AI-enhanced SAP workflows.
        </p>
      </div>

      <div className="border border-foreground/10 rounded-lg overflow-hidden bg-foreground/[0.02]">
        <iframe
          src="/RFC-SAP.pdf"
          className="w-full h-[calc(100vh-12rem)]"
          title="RFC-SAP Document"
        />
      </div>
    </div>
  )
}
