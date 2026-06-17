import Link from "next/link"
import LoginScreen from "@/components/variants/LoginScreen"
import { THEMES } from "@/components/variants/themes"

export default function VariantsPage() {
  return (
    <main className="min-h-dvh bg-neutral-100 px-4 py-10">
      <header className="mx-auto mb-8 max-w-5xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Login — {THEMES.length} colorways</h1>
        <p className="mt-1 text-sm text-neutral-500">Same component structure · {THEMES.length} distinct token profiles. Compare side by side.</p>
        <nav className="mt-4 flex justify-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-white">Login</span>
          <Link href="/dashboard-variants" className="rounded-full bg-white px-3 py-1.5 text-neutral-700 ring-1 ring-neutral-200">Dashboard</Link>
          <Link href="/signup-variants" className="rounded-full bg-white px-3 py-1.5 text-neutral-700 ring-1 ring-neutral-200">Signup</Link>
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
              <LoginScreen theme={t} />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
