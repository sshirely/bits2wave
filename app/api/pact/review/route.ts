import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const { agreement, evidence, feedback } = await request.json()
    if (![agreement, evidence, feedback].every((value) => typeof value === 'string' && value.trim().length > 0)) return NextResponse.json({ error: 'Agreement, evidence, and feedback are required' }, { status: 400 })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are PayPal Pact, an impartial milestone review assistant. Return a concise decision with headings: Finding, Evidence, Recommendation. Do not claim to make legal or binding payment decisions.' },
        { role: 'user', content: `Original agreement: ${agreement}\nSubmitted evidence: ${evidence}\nClient feedback: ${feedback}` },
      ],
    })
    return NextResponse.json({ review: completion.choices[0]?.message?.content ?? 'AI review returned no content' })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'AI review failed' }, { status: 500 }) }
}
