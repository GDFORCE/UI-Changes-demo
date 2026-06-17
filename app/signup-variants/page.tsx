import Link from "next/link"
import SignupScreen from "@/components/variants/SignupScreen"
import { THEMES } from "@/components/variants/themes"

export default function SignupVariantsPage() {
  return (
    <main className="min-h-dvh bg-neutral-100 px-4 py-10">
      <header className="mx-auto mb-8 max-w-5xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Signup — four colorways</h1>
        <p className="mt-1 text-sm text-neutral-500">Account creation form across the four token profiles. Inputs and toggles are live.</p>
        <nav className="mt-4 flex justify-center gap-2 text-xs font-medium">
          <Link href="/variants" className="rounded-full bg-white px-3 py-1.5 text-neutral-700 ring-1 ring-neutral-200">Login</Link>
          <Link href="/dashboard-variants" className="rounded-full bg-white px-3 py-1.5 text-neutral-700 ring-1 ring-neutral-200">Dashboard</Link>
          <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-white">Signup</span>
        </nav>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        {THEMES.map((t) => (
          <section key={t.key} className="overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-baseline justify-between px-5 py-3" style={{ background: t.vars["--bg"], color: t.vars["--ink"] }}>
              <h2 className="text-sm font-bold">{t.name}</h2>
              <p className="text-[11px] opacity-70">{t.note}</p>
            </div>
            <div className="flex justify-center p-8" style={{ background: t.vars["--bg"] }}>
              <SignupScreen theme={t} />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
