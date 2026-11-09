import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const fallbackReview = {
  source: 'local-fallback',
  review: 'Finding\nThe submitted proof supports the visual preview, but the editable source files are not attached.\n\nEvidence\nThe agreement requires editable source files, while the submission contains a PNG preview and color board.\n\nRecommendation\nPause this milestone and request the missing editable files before releasing payment.',
  milestones: [
    { id: 'concept', title: 'Concept sketches', amount: 750, status: 'approved', evidence: 'Concept preview attached' },
    { id: 'final', title: 'Final design', amount: 1500, status: 'in_review', evidence: 'Final preview attached' },
    { id: 'source', title: 'Editable source files', amount: 750, status: 'blocked', evidence: 'Source files missing' },
  ],
}

function localFallback() {
  return NextResponse.json(fallbackReview, { headers: { 'X-Pact-AI-Source': 'local-fallback' } })
}

export async function POST(request: Request) {
  try {
    const { agreement, evidence, feedback } = await request.json()
    if (![agreement, evidence, feedback].every((value) => typeof value === 'string' && value.trim().length > 0)) return NextResponse.json({ error: 'Agreement, evidence, and feedback are required' }, { status: 400 })
    if (!process.env.OPENAI_API_KEY) return localFallback()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are PayPal Pact, an impartial milestone review assistant. Return a concise decision with headings: Finding, Evidence, Recommendation. Do not claim to make legal or binding payment decisions.' },
        { role: 'user', content: `Original agreement: ${agreement}\nSubmitted evidence: ${evidence}\nClient feedback: ${feedback}` },
      ],
    })
    const review = completion.choices[0]?.message?.content
    return review ? NextResponse.json({ source: 'openai', review, milestones: fallbackReview.milestones }) : localFallback()
  } catch {
    return localFallback()
  }
}
