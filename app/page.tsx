export default function RfcPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          RFC: SAP
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Context-aware guardrail architecture for AI-enhanced SAP workflows.
        </p>
      </div>

      <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
        <iframe
          src="/RFC-SAP.pdf"
          className="w-full h-[calc(100vh-12rem)]"
          title="RFC-SAP Document"
        />
      </div>
    </div>
  )
}
