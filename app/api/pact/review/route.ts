import { gateway, generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { agreement, evidence, feedback } = await request.json()
    if (![agreement, evidence, feedback].every((value) => typeof value === 'string' && value.trim().length > 0)) return NextResponse.json({ error: 'Agreement, evidence, and feedback are required' }, { status: 400 })
    const { text } = await generateText({ model: gateway('openai/gpt-4o-mini'), system: 'You are PayPal Pact, an impartial milestone review assistant. Return a concise decision with headings: Finding, Evidence, Recommendation. Do not claim to make legal or binding payment decisions.', prompt: `Original agreement: ${agreement}\nSubmitted evidence: ${evidence}\nClient feedback: ${feedback}` })
    return NextResponse.json({ review: text })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'AI review failed' }, { status: 500 }) }
}
