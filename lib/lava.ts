const LAVA_API_KEY = process.env.LAVA_API_KEY!

interface LavaForwardOptions {
  providerUrl: string
  body: Record<string, unknown>
  headers?: Record<string, string>
}

export async function lavaForward({ providerUrl, body, headers = {} }: LavaForwardOptions) {
  const encodedUrl = encodeURIComponent(providerUrl)

  const token = Buffer.from(
    JSON.stringify({ secret_key: LAVA_API_KEY })
  ).toString('base64')

  const res = await fetch(`https://api.lava.so/v1/forward?u=${encodedUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Lava request failed: ${res.status}`)
  }

  return res.json()
}

export async function generateAIResponse(module: string, actionType: string, recordData: Record<string, unknown>) {
  const prompt = buildPrompt(module, actionType, recordData)

  const result = await lavaForward({
    providerUrl: 'https://api.anthropic.com/v1/messages',
    body: {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    },
    headers: {
      'anthropic-version': '2023-06-01',
    },
  })

  const content = result?.content?.[0]?.text ?? 'No response generated.'
  return content
}

function buildPrompt(module: string, actionType: string, recordData: Record<string, unknown>): string {
  const recordStr = JSON.stringify(recordData, null, 2)

  switch (actionType) {
    case 'summarize':
      return `Summarize this ${module} SAP record in 2-3 sentences:\n${recordStr}`
    case 'draft':
      return `Draft a professional business communication for this ${module} SAP record:\n${recordStr}`
    case 'send':
      return `Generate a final send-ready message for this ${module} SAP record. Include all relevant details:\n${recordStr}`
    case 'review':
      return `Review this ${module} SAP record for compliance and flag any issues:\n${recordStr}`
    default:
      return `Process this ${module} SAP record:\n${recordStr}`
  }
}
