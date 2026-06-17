import { UserPlus, ArrowRight } from "lucide-react"

/**
 * Variant 3 — "Warm"
 * Soft organic linen/oat · earthy terracotta · sun-baked clay rose.
 * Display: Fraunces (warm serif) · Body: DM Sans.
 * Fully self-contained: scoped tokens, namespaced gradient ids + keyframes.
 */
export default function VariantWarm() {
  return (
    <div className="vwarm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
        .vwarm-root{
          --bg:#E9DFD0; --surface:#FBF6EE; --surface-2:#F2E8DA;
          --ink:#3A2A20; --muted:#8A6F5E; --line:#E4D6C4;
          --primary:#BC5A34; --primary-press:#A04A29; --on-primary:#FFF7F0;
          --secondary:#B97A72; --accent-from:#DE9358; --accent-to:#BC5A34;
          --font-display:'Fraunces',Georgia,serif; --font-body:'DM Sans',system-ui,sans-serif;
        }
        .vwarm-root .vw-rise{animation:vwRise 1100ms cubic-bezier(.2,.8,.2,1) both}
        .vwarm-root .vw-draw{stroke-dasharray:300;stroke-dashoffset:300;animation:vwDraw 1500ms ease-out .15s forwards}
        @keyframes vwRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vwDraw{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion:reduce){
          .vwarm-root .vw-rise,.vwarm-root .vw-draw{animation:none}
          .vwarm-root .vw-draw{stroke-dashoffset:0}
        }
      `}</style>

      <div
        className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[34px] border p-6 pb-7"
        style={{ background: "var(--surface)", borderColor: "var(--line)", fontFamily: "var(--font-body)", color: "var(--ink)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-display)" }}
            >
              M
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold tracking-wide">MY TRIAL BOARD</p>
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>Clinical visit scheduling</p>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest"
            style={{ background: "var(--surface-2)", color: "var(--secondary)" }}
          >
            EST. 2024
          </span>
        </div>

        {/* Hero */}
        <div className="vw-rise mt-9">
          <h1 className="text-[31px] font-semibold leading-[1.08] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Your trial,<br />one <span style={{ color: "var(--primary)", fontStyle: "italic" }}>sunrise</span><br />at a time.
          </h1>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            One calm place for sponsors, sites and patients to follow a clinical trial — visit by visit, morning by morning.
          </p>
        </div>

        {/* Sunrise timeline */}
        <div className="mt-7">
          <svg viewBox="0 0 300 92" className="w-full" role="img" aria-label="Trial progress sunrise from schedule to completion">
            <defs>
              <linearGradient id="vw-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <line x1="20" y1="74" x2="280" y2="74" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
            <path className="vw-draw" d="M28 74 Q150 2 272 74" fill="none" stroke="url(#vw-grad)" strokeWidth="3" strokeLinecap="round" />
            <circle className="vw-rise" cx="150" cy="20" r="9" fill="url(#vw-grad)" />
            {[28, 109, 191, 272].map((x) => (
              <circle key={x} cx={x} cy="74" r="3.5" fill="var(--surface)" stroke="var(--secondary)" strokeWidth="2" />
            ))}
          </svg>
          <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            <span>Schedule</span><span>Baseline</span><span>Follow-up</span><span>Done</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 space-y-3">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-colors"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <UserPlus size={17} strokeWidth={2} /> Create an account
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border text-[14px] font-semibold"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            Sign in <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button className="block w-full py-1 text-center text-[12px] font-medium" style={{ color: "var(--muted)" }}>
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  )
}
