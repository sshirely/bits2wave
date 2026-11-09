'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Headphones,
  Info,
  LockKeyhole,
  Menu,
  Mic,
  Pause,
  Play,
  QrCode,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Upload,
  UserRound,
  UsersRound,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type View = 'overview' | 'check'
type Scenario = 'utility' | 'qr' | 'invoice'

const scenarios = {
  utility: {
    label: 'Fake utility bill',
    merchant: 'MetroGrid Utilities',
    amount: '$287.40',
    recipient: 'billing.metrogrid-support.com',
    score: 86,
    severity: 'High risk',
    accent: 'red',
    reasons: [
      { title: 'High urgency detected', copy: '“Pay within 30 minutes” is a common pressure tactic.', weight: '31%' },
      { title: 'Recipient mismatch', copy: 'The payment address differs from MetroGrid’s verified domain.', weight: '27%' },
      { title: 'New payment relationship', copy: 'You have never paid this recipient before.', weight: '18%' },
    ],
    impact: 'Likely loss of $287.40',
  },
  qr: {
    label: 'Suspicious QR code',
    merchant: 'PrizePicks Rewards',
    amount: '$149.00',
    recipient: 'paypal.me/prize-claim-884',
    score: 94,
    severity: 'Critical risk',
    accent: 'red',
    reasons: [
      { title: 'Prize claim pattern', copy: 'The QR destination asks for a “refundable” processing fee.', weight: '38%' },
      { title: 'Unverified recipient', copy: 'This account has no trusted payment history.', weight: '34%' },
      { title: 'Link redirect detected', copy: 'The QR code passes through two unfamiliar domains.', weight: '22%' },
    ],
    impact: 'Likely loss of $149.00',
  },
  invoice: {
    label: 'Invoice impersonation',
    merchant: 'Northstar Design Co.',
    amount: '$1,240.00',
    recipient: 'northstar-payments.co',
    score: 72,
    severity: 'Elevated risk',
    accent: 'amber',
    reasons: [
      { title: 'Lookalike domain', copy: 'The sender uses a near-match domain with one extra character.', weight: '28%' },
      { title: 'Bank detail changed', copy: 'Payment instructions differ from your last invoice.', weight: '25%' },
      { title: 'Timing anomaly', copy: 'The invoice arrived outside the usual billing cycle.', weight: '19%' },
    ],
    impact: 'Potential loss of $1,240.00',
  },
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-[#35e0c0] text-[#08111b] shadow-[0_0_26px_rgba(53,224,192,0.25)]">
        <ShieldCheck className="size-5" strokeWidth={2.7} />
      </div>
      <div>
        <div className="text-[15px] font-bold tracking-[-0.03em] text-white">TrustLens</div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#718096]">Payment intelligence</div>
      </div>
    </div>
  )
}

function StatusBadge({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'red' | 'amber' }) {
  const styles = { teal: 'border-[#1c665f] bg-[#113a3b] text-[#7ee8d5]', red: 'border-[#6b3138] bg-[#351b27] text-[#ff9e9e]', amber: 'border-[#715323] bg-[#372c1a] text-[#f6cb76]' }
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}><span className="size-1.5 rounded-full bg-current" />{children}</span>
}

function Sidebar({ view, setView }: { view: View; setView: (view: View) => void }) {
  const items = [
    { id: 'overview' as View, label: 'Overview', icon: ShieldCheck },
    { id: 'check' as View, label: 'New safety check', icon: Zap },
  ]
  return (
    <aside className="hidden w-[236px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0b131d] px-4 py-5 lg:flex">
      <div className="px-2 pb-10"><Logo /></div>
      <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#526174]">Workspace</div>
      <nav className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${view === id ? 'bg-[#143b3c] text-[#7ee8d5]' : 'text-[#8190a3] hover:bg-white/[0.04] hover:text-white'}`}><Icon className="size-[17px]" />{label}</button>)}
      </nav>
      <div className="mt-auto flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#8190a3] hover:bg-white/[0.04] hover:text-white"><UsersRound className="size-[17px]" />Trusted contacts</button>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#8190a3] hover:bg-white/[0.04] hover:text-white"><CircleHelp className="size-[17px]" />Help center</button>
        <div className="my-4 h-px bg-white/[0.07]" />
        <div className="flex items-center gap-3 rounded-xl px-3 py-2"><div className="grid size-8 place-items-center rounded-full bg-[#24364b] text-[11px] font-bold text-[#b4c3d6]">JD</div><div className="min-w-0"><div className="truncate text-[12px] font-semibold text-white">Jordan Davis</div><div className="text-[10px] text-[#68788c]">Personal account</div></div></div>
      </div>
    </aside>
  )
}

function Topbar({ view, setView }: { view: View; setView: (view: View) => void }) {
  return <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8"><div className="flex items-center gap-3 lg:hidden"><Menu className="size-5 text-[#9aa8ba]" /><Logo /></div><div className="hidden text-[13px] font-medium text-[#7f8da1] lg:block">{view === 'overview' ? 'Overview' : 'New safety check'} <span className="px-2 text-[#344353]">/</span> <span className="text-[#dce5ed]">{view === 'overview' ? 'Protection center' : 'Analyze a payment'}</span></div><div className="flex items-center gap-3"><button className="relative grid size-9 place-items-center rounded-lg border border-white/[0.08] text-[#8190a3] hover:bg-white/[0.05]"><Bell className="size-[17px]" /><span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-[#35e0c0]" /></button><div className="hidden h-5 w-px bg-white/[0.08] sm:block" /><div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-full bg-[#24364b] text-[10px] font-bold text-[#b4c3d6]">JD</div><ChevronRight className="size-3.5 rotate-90 text-[#6f7d90]" /></div></div></header>
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof ShieldCheck; tone: 'teal' | 'blue' | 'amber' }) {
  const colors = { teal: 'bg-[#123b3c] text-[#72e2cf]', blue: 'bg-[#182c4a] text-[#79adff]', amber: 'bg-[#3b301c] text-[#e7bd68]' }
  return <div className="rounded-2xl border border-white/[0.07] bg-[#101b28] p-4 sm:p-5"><div className="flex items-start justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#77879a]">{label}</span><div className={`grid size-8 place-items-center rounded-lg ${colors[tone]}`}><Icon className="size-4" /></div></div><div className="mt-4 text-[27px] font-bold tracking-[-0.05em] text-white">{value}</div><div className="mt-1 text-[11px] text-[#6d7c8f]">{detail}</div></div>
}

function Overview({ onCheck }: { onCheck: () => void }) {
  return <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 sm:py-9"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2"><StatusBadge>Protected</StatusBadge><span className="text-[11px] text-[#69788c]">Last synced just now</span></div><h1 className="text-[27px] font-bold tracking-[-0.04em] text-white sm:text-[32px]">Good morning, Jordan.</h1><p className="mt-2 text-[13px] text-[#8290a2]">Your payment safety overview, at a glance.</p></div><Button onClick={onCheck} className="h-10 gap-2 rounded-xl bg-[#35e0c0] px-4 text-[12px] font-bold text-[#07151b] hover:bg-[#74f0d7]"><Zap className="size-4" />Test a new payment</Button></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><StatCard label="Payments protected" value="$12,840" detail="+18.4% from last month" icon={ShieldCheck} tone="teal" /><StatCard label="Threats intercepted" value="24" detail="3 high-risk this week" icon={ShieldAlert} tone="blue" /><StatCard label="Protection score" value="94 / 100" detail="Excellent account health" icon={LockKeyhole} tone="amber" /></div><div className="mt-8 grid gap-4 xl:grid-cols-[1.4fr_0.85fr]"><section className="rounded-2xl border border-white/[0.07] bg-[#101b28] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-[15px] font-bold text-white">Recent safety checks</h2><p className="mt-1 text-[11px] text-[#718196]">Activity across your protected payments</p></div><button className="text-[11px] font-semibold text-[#70dcca] hover:text-white">View all <ArrowUpRight className="ml-1 inline size-3.5" /></button></div><div className="mt-5 flex flex-col">{[['MetroGrid Utilities','Fake utility bill','$287.40','High risk','red','12 min ago'],['Maya Chen','Dinner split','$46.00','Safe','teal','Yesterday'],['Northstar Design Co.','Invoice payment','$1,240.00','Review needed','amber','Oct 30']].map(([name,type,amount,status,tone,time]) => <div key={name} className="flex items-center gap-3 border-t border-white/[0.06] py-3.5"><div className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone==='red'?'bg-[#351b27] text-[#ff9e9e]':tone==='amber'?'bg-[#372c1a] text-[#f6cb76]':'bg-[#123b3c] text-[#72e2cf]'}`}>{tone==='red'?<AlertTriangle className="size-4" />:tone==='amber'?<FileText className="size-4" />:<Check className="size-4" />}</div><div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold text-[#dfe7ee]">{name}</div><div className="mt-0.5 truncate text-[10px] text-[#718196]">{type} <span className="px-1 text-[#3f4c5e]">•</span> {time}</div></div><div className="text-right"><div className="text-[12px] font-semibold text-[#dfe7ee]">{amount}</div><div className={`mt-0.5 text-[10px] font-semibold ${tone==='red'?'text-[#ff9e9e]':tone==='amber'?'text-[#f6cb76]':'text-[#72e2cf]'}`}>{status}</div></div></div>)}</div></section><section className="relative overflow-hidden rounded-2xl border border-[#164d4e] bg-gradient-to-br from-[#123b3c] to-[#10242e] p-5 sm:p-6"><div className="absolute -right-12 -top-16 size-48 rounded-full border border-[#2bd6bb]/10" /><div className="absolute -right-2 -top-6 size-28 rounded-full border border-[#2bd6bb]/10" /><div className="relative"><div className="flex items-center gap-2 text-[#71e3d0]"><Sparkles className="size-4" /><span className="text-[11px] font-bold uppercase tracking-[0.14em]">TrustLens AI</span></div><h2 className="mt-5 max-w-[260px] text-[21px] font-bold leading-[1.15] tracking-[-0.04em] text-white">Stay one step ahead of the next scam.</h2><p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-[#a0c5c3]">Run a safety check on any payment before you confirm it. We explain the risk in plain language.</p><Button onClick={onCheck} variant="outline" className="mt-6 h-9 rounded-lg border-[#52d8c2]/40 bg-transparent px-3.5 text-[11px] font-bold text-[#8ce9d9] hover:bg-[#52d8c2]/10 hover:text-white">Start a check <ArrowUpRight className="ml-1.5 size-3.5" /></Button></div></section></div></div>
}

function Analysis({ scenario }: { scenario: (typeof scenarios)[Scenario] }) {
  return <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"><section className="rounded-2xl border border-[#6b3138] bg-[#1b1823] p-5 sm:p-6"><div className="flex items-start justify-between"><div><StatusBadge tone="red">{scenario.severity}</StatusBadge><h2 className="mt-4 text-[22px] font-bold tracking-[-0.04em] text-white">Pause before you pay.</h2><p className="mt-2 max-w-[340px] text-[12px] leading-relaxed text-[#a8a2ab]">TrustLens found signals that are not consistent with a safe payment.</p></div><div className="relative grid size-[82px] place-items-center rounded-full" style={{ background: `conic-gradient(#ff7777 ${scenario.score}%, #3a2731 0)` }}><div className="grid size-[68px] place-items-center rounded-full bg-[#1b1823]"><div className="text-center"><div className="text-[21px] font-bold text-[#ff9e9e]">{scenario.score}</div><div className="text-[8px] font-semibold uppercase tracking-wider text-[#94777f]">risk score</div></div></div></div></div><div className="mt-6 rounded-xl border border-white/[0.07] bg-[#11131d] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><AlertTriangle className="size-4 text-[#ff8e8e]" /><span className="text-[12px] font-bold text-[#ece1e4]">{scenario.impact}</span></div><span className="text-[10px] font-semibold text-[#ff9e9e]">If you pay today</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><div className="text-[16px] font-bold text-[#ff9e9e]">High</div><div className="mt-1 text-[9px] text-[#837781]">Loss likelihood</div></div><div><div className="text-[16px] font-bold text-[#f6cb76]">30 min</div><div className="mt-1 text-[9px] text-[#837781]">Recovery window</div></div><div><div className="text-[16px] font-bold text-[#ffb4a5]">Low</div><div className="mt-1 text-[9px] text-[#837781]">Refund chance</div></div></div></div></section><section className="rounded-2xl border border-white/[0.07] bg-[#101b28] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-[15px] font-bold text-white">Why this was flagged</h2><p className="mt-1 text-[11px] text-[#718196]">Signals TrustLens found in this payment</p></div><Info className="size-4 text-[#708195]" /></div><div className="mt-5 flex flex-col gap-4">{scenario.reasons.map((reason, index) => <div key={reason.title} className="flex gap-3"><div className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${index===0?'bg-[#351b27] text-[#ff9e9e]':'bg-[#243147] text-[#98b8ed]'}`}><span className="text-[11px] font-bold">{index+1}</span></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div className="text-[12px] font-bold text-[#e1e7ec]">{reason.title}</div><div className="text-[11px] font-bold text-[#7d8da2]">{reason.weight}</div></div><p className="mt-1 text-[11px] leading-relaxed text-[#7c8a9d]">{reason.copy}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-[#233044]"><div className={`h-full rounded-full ${index===0?'bg-[#ff7777]':index===1?'bg-[#e6b962]':'bg-[#6f9fe4]'}`} style={{ width: reason.weight }} /></div></div></div>)}</div></section></div>
}

function CheckFlow({ onBack }: { onBack: () => void }) {
  const [scenario, setScenario] = useState<Scenario>('utility')
  const [analyzing, setAnalyzing] = useState(false)
  const [checked, setChecked] = useState(true)
  const [paused, setPaused] = useState(false)
  const [voice, setVoice] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const current = scenarios[scenario]
  const runCheck = () => { setAnalyzing(true); setChecked(false); setTimeout(() => { setAnalyzing(false); setChecked(true) }, 1300) }
  const subtitle = useMemo(() => analyzing ? 'TrustLens AI inspecting transaction vectors...' : checked ? 'Analysis complete · Updated just now' : 'Ready to analyze', [analyzing, checked])
  return <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 sm:py-9"><button onClick={onBack} className="mb-5 flex items-center gap-2 text-[12px] font-semibold text-[#7f8da1] hover:text-white"><ArrowLeft className="size-4" /> Back to overview</button><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2"><StatusBadge tone="teal">Live simulation</StatusBadge><span className="text-[11px] text-[#69788c]">Sandbox mode</span></div><h1 className="text-[27px] font-bold tracking-[-0.04em] text-white sm:text-[32px]">Analyze a payment</h1><p className="mt-2 text-[13px] text-[#8290a2]">See the risk before your money moves.</p></div><div className="hidden items-center gap-2 text-[11px] text-[#6d7b8e] sm:flex"><LockKeyhole className="size-3.5 text-[#6fdac8]" /> Your data stays private</div></div><div className="mt-7 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]"><section className="rounded-2xl border border-white/[0.07] bg-[#101b28] p-5 sm:p-6"><div className="flex items-center gap-2"><div className="grid size-7 place-items-center rounded-lg bg-[#19344b] text-[#83b4ed]"><QrCode className="size-4" /></div><div><h2 className="text-[14px] font-bold text-white">Payment details</h2><p className="text-[10px] text-[#708095]">Choose a scenario to simulate</p></div></div><div className="mt-5 flex flex-col gap-2">{(Object.keys(scenarios) as Scenario[]).map((key) => <button key={key} onClick={() => { setScenario(key); setChecked(false); setPaused(false) }} className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${scenario===key?'border-[#2aa896] bg-[#123a3a]':'border-white/[0.07] bg-[#0c1622] hover:border-white/[0.18]'}`}><div className="flex items-center gap-3"><div className={`grid size-8 place-items-center rounded-lg ${scenario===key?'bg-[#1e5e5b] text-[#76ead6]':'bg-[#1d2a3a] text-[#8394aa]'}`}>{key==='qr'?<QrCode className="size-4" />:<FileText className="size-4" />}</div><div><div className="text-[12px] font-semibold text-[#e3e9ee]">{scenarios[key].label}</div><div className="mt-0.5 text-[10px] text-[#718196]">{scenarios[key].amount} · {scenarios[key].merchant}</div></div></div>{scenario===key && <Check className="size-4 text-[#6fe1ce]" />}</button>)}</div><div className="my-5 h-px bg-white/[0.06]" /><div className="rounded-xl border border-dashed border-[#344457] bg-[#0c1622] p-4 text-center"><div className="mx-auto grid size-9 place-items-center rounded-lg bg-[#1c2c40] text-[#93a9c3]"><Upload className="size-4" /></div><div className="mt-2 text-[11px] font-semibold text-[#c7d2dc]">Upload invoice or QR code</div><div className="mt-1 text-[10px] text-[#68788b]">PDF, PNG or JPG · up to 10 MB</div><button className="mt-3 text-[10px] font-bold text-[#6ee0cc] hover:text-white">Browse files</button></div><Button onClick={runCheck} disabled={analyzing} className="mt-5 h-10 w-full gap-2 rounded-xl bg-[#35e0c0] text-[12px] font-bold text-[#07151b] hover:bg-[#74f0d7] disabled:opacity-60">{analyzing ? <><span className="size-3.5 animate-spin rounded-full border-2 border-[#07151b]/30 border-t-[#07151b]" /> Analyzing payment...</> : <><Sparkles className="size-4" /> Run safety check</>}</Button></section><section><div className="rounded-2xl border border-white/[0.07] bg-[#0f1824] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#35e0c0] shadow-[0_0_10px_#35e0c0]" /><h2 className="text-[14px] font-bold text-white">TrustLens analysis</h2></div><p className="mt-1 text-[10px] text-[#718196]">{subtitle}</p></div><StatusBadge tone={analyzing?'amber':checked?'teal':'amber'}>{analyzing?'Scanning':'Protected view'}</StatusBadge></div>{analyzing ? <div className="grid min-h-[380px] place-items-center"><div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-full border border-[#35e0c0]/30 bg-[#123b3c] text-[#6fe1ce] shadow-[0_0_42px_rgba(53,224,192,0.18)]"><Sparkles className="size-7 animate-pulse" /></div><div className="mt-4 text-[13px] font-semibold text-white">Inspecting transaction vectors</div><div className="mt-1 text-[11px] text-[#718196]">Checking recipient, urgency, history, and intent</div></div></div> : checked ? <Analysis scenario={current} /> : <div className="grid min-h-[380px] place-items-center text-center"><div><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#1b2b3d] text-[#8296ae]"><Search className="size-6" /></div><div className="mt-4 text-[13px] font-semibold text-white">Ready when you are</div><div className="mt-1 text-[11px] text-[#718196]">Run a check to see the payment risk breakdown.</div></div></div>}</div>{checked && !analyzing && <div className="mt-4 grid gap-3 sm:grid-cols-2"><Button onClick={() => setPaused(true)} disabled={paused} className={`h-11 gap-2 rounded-xl text-[12px] font-bold ${paused?'border border-[#1c665f] bg-[#113a3b] text-[#7ee8d5]':'bg-[#ff7777] text-[#25151c] hover:bg-[#ff9696]'}`}><Pause className="size-4" />{paused?'Payment paused':'Pause payment & warn'}</Button><Button onClick={() => setContactOpen(true)} variant="outline" className="h-11 gap-2 rounded-xl border-white/[0.12] bg-[#101b28] text-[12px] font-bold text-[#d8e0e7] hover:bg-white/[0.06] hover:text-white"><UsersRound className="size-4" />Ask trusted contact</Button></div>}{checked && !analyzing && <div className="mt-3 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#101b28] px-4 py-3 sm:flex-row sm:items-center"><div className="flex items-center gap-2.5"><div className="grid size-7 place-items-center rounded-lg bg-[#25334a] text-[#9eb4d2]"><Headphones className="size-3.5" /></div><div><div className="text-[11px] font-semibold text-[#d8e1e8]">Need help understanding this?</div><div className="text-[10px] text-[#718196]">Get the breakdown read aloud in your language.</div></div></div><button onClick={() => setVoice(!voice)} className={`flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1.5 text-[10px] font-bold sm:self-auto ${voice?'bg-[#123b3c] text-[#7ee8d5]':'bg-white/[0.06] text-[#9eacbc]'}`}><Volume2 className="size-3.5" />{voice?'Voice guidance on':'Enable voice guidance'}</button></div>}</section></div>{contactOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#03070c]/70 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="w-full max-w-[420px] rounded-2xl border border-white/[0.1] bg-[#142131] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><div className="grid size-10 place-items-center rounded-xl bg-[#123b3c] text-[#6fe1ce]"><UsersRound className="size-5" /></div><h2 id="contact-title" className="mt-4 text-[18px] font-bold text-white">Ask a trusted contact</h2><p className="mt-1 text-[12px] leading-relaxed text-[#8392a4]">Send this risk breakdown to someone you trust before you decide.</p></div><button onClick={() => setContactOpen(false)} aria-label="Close dialog" className="text-[#77879a] hover:text-white"><X className="size-5" /></button></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1723] p-3"><div className="grid size-9 place-items-center rounded-full bg-[#2b415b] text-[11px] font-bold text-[#c1d1e2]">MC</div><div className="flex-1"><div className="text-[12px] font-semibold text-white">Maya Chen</div><div className="text-[10px] text-[#78889b]">Trusted contact · notified by SMS</div></div><Check className="size-4 text-[#6fe1ce]" /></div><Button onClick={() => setContactOpen(false)} className="mt-5 h-10 w-full rounded-xl bg-[#35e0c0] text-[12px] font-bold text-[#07151b] hover:bg-[#74f0d7]">Send approval request</Button></div></div>}</div>
}

export default function TrustLensDashboard() {
  const [view, setView] = useState<View>('overview')
  return <div className="min-h-screen bg-[#09111a] text-white"><div className="flex min-h-screen"><Sidebar view={view} setView={setView} /><div className="min-w-0 flex-1"><Topbar view={view} setView={setView} />{view === 'overview' ? <Overview onCheck={() => setView('check')} /> : <CheckFlow onBack={() => setView('overview')} />}</div></div></div>
}
