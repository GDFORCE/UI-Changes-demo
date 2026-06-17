import { UserPlus, ArrowRight } from "lucide-react"

/**
 * Variant 4 — "Vibrant"
 * Clean high-contrast white · energetic digital peach · hyper-orange highlights.
 * Display: Space Grotesk (geometric) · Body: Sora.
 * Fully self-contained: scoped tokens, namespaced gradient ids + keyframes.
 */
export default function VariantVibrant() {
  return (
    <div className="vvib-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Sora:wght@400;500;600&display=swap');
        .vvib-root{
          --bg:#FFF1E9; --surface:#FFFFFF; --surface-2:#FFF6F1;
          --ink:#1A130E; --muted:#7C6A5E; --line:#FFE0D1;
          --primary:#FF5A1F; --primary-press:#E64A12; --on-primary:#FFFFFF;
          --secondary:#FF9E7A; --accent-from:#FFB088; --accent-to:#FF5A1F;
          --font-display:'Space Grotesk',system-ui,sans-serif; --font-body:'Sora',system-ui,sans-serif;
        }
        .vvib-root .vv-rise{animation:vvRise 1100ms cubic-bezier(.2,.8,.2,1) both}
        .vvib-root .vv-draw{stroke-dasharray:300;stroke-dashoffset:300;animation:vvDraw 1500ms ease-out .15s forwards}
        @keyframes vvRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vvDraw{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion:reduce){
          .vvib-root .vv-rise,.vvib-root .vv-draw{animation:none}
          .vvib-root .vv-draw{stroke-dashoffset:0}
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
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
              style={{ background: "linear-gradient(135deg,var(--accent-from),var(--accent-to))", color: "var(--on-primary)", fontFamily: "var(--font-display)" }}
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
            style={{ background: "var(--surface-2)", color: "var(--primary)" }}
          >
            EST. 2024
          </span>
        </div>

        {/* Hero */}
        <div className="vv-rise mt-9">
          <h1 className="text-[31px] font-bold leading-[1.05] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Your trial,<br />one <span style={{ color: "var(--primary)" }}>sunrise</span><br />at a time.
          </h1>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            One calm place for sponsors, sites and patients to follow a clinical trial — visit by visit, morning by morning.
          </p>
        </div>

        {/* Sunrise timeline */}
        <div className="mt-7">
          <svg viewBox="0 0 300 92" className="w-full" role="img" aria-label="Trial progress sunrise from schedule to completion">
            <defs>
              <linearGradient id="vv-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <line x1="20" y1="74" x2="280" y2="74" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
            <path className="vv-draw" d="M28 74 Q150 2 272 74" fill="none" stroke="url(#vv-grad)" strokeWidth="3.5" strokeLinecap="round" />
            <circle className="vv-rise" cx="150" cy="20" r="9" fill="url(#vv-grad)" />
            {[28, 109, 191, 272].map((x) => (
              <circle key={x} cx={x} cy="74" r="3.5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
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
            <UserPlus size={17} strokeWidth={2.2} /> Create an account
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 text-[14px] font-semibold"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            Sign in <ArrowRight size={16} strokeWidth={2.2} />
          </button>
          <button className="block w-full py-1 text-center text-[12px] font-medium" style={{ color: "var(--muted)" }}>
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  )
}
