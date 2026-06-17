import { UserPlus, ArrowRight } from "lucide-react"

/**
 * Variant 2 — "Luxury"
 * Midnight obsidian dark mode · glowing bioluminescent neon coral sunrise.
 * Display: Cormorant Garamond (high-contrast serif) · Body: Sora.
 * Fully self-contained: scoped tokens, namespaced gradient ids + keyframes.
 */
export default function VariantLuxury() {
  return (
    <div className="vlux-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Sora:wght@400;500;600&display=swap');
        .vlux-root{
          --bg:#06070B; --surface:#0E1118; --surface-2:#171C27;
          --ink:#F2F4FA; --muted:#9AA3B5; --line:rgba(255,255,255,.09);
          --primary:#FF6B5A; --primary-press:#FF8473; --on-primary:#1A0B08;
          --secondary:#FF9D6C; --accent-from:#FF5E7D; --accent-to:#FFA85C;
          --glow:rgba(255,107,90,.45);
          --font-display:'Cormorant Garamond',Georgia,serif; --font-body:'Sora',system-ui,sans-serif;
        }
        .vlux-root .vl-rise{animation:vlRise 1100ms cubic-bezier(.2,.8,.2,1) both}
        .vlux-root .vl-draw{stroke-dasharray:300;stroke-dashoffset:300;animation:vlDraw 1500ms ease-out .15s forwards}
        .vlux-root .vl-glow{filter:drop-shadow(0 0 10px var(--glow))}
        @keyframes vlRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vlDraw{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion:reduce){
          .vlux-root .vl-rise,.vlux-root .vl-draw{animation:none}
          .vlux-root .vl-draw{stroke-dashoffset:0}
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
              className="vl-glow flex h-10 w-10 items-center justify-center rounded-full text-base font-bold"
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
            style={{ background: "var(--surface-2)", color: "var(--secondary)" }}
          >
            EST. 2024
          </span>
        </div>

        {/* Hero */}
        <div className="vl-rise mt-9">
          <h1 className="text-[36px] font-semibold leading-[1.02] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
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
              <linearGradient id="vl-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <line x1="20" y1="74" x2="280" y2="74" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
            <path className="vl-draw vl-glow" d="M28 74 Q150 2 272 74" fill="none" stroke="url(#vl-grad)" strokeWidth="3" strokeLinecap="round" />
            <circle className="vl-rise vl-glow" cx="150" cy="20" r="9" fill="url(#vl-grad)" />
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
            className="vl-glow flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-colors"
            style={{ background: "linear-gradient(135deg,var(--accent-from),var(--accent-to))", color: "var(--on-primary)" }}
          >
            <UserPlus size={17} strokeWidth={2.2} /> Create an account
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border text-[14px] font-semibold"
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
