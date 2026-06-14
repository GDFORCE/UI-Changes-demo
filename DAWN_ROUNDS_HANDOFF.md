# Dawn Rounds — Ground-Up Screen Rebuild · HANDOFF

> Paste this whole file's contents into a fresh Claude Code session to continue
> exactly where the previous session left off.

## The task (verbatim intent)
Rebuild **every screen** of this clinical-trial app ground-up — redesign every
button and view with fresh, **real-world** UI ideas for the use case — while
**keeping all functionality and navigation flow identical**. Use the
`frontend-design` plugin aesthetic. **Leave the auth/registration screens
untouched.** Work **one screen at a time** (full ground-up rebuild, not
token/color polish), and type-check after each.

## How to verify after each screen
```bash
npx tsc --noEmit        # must stay clean
```
Project: `D:\MTB_Intern_work_folder\test_app_ui\APP` · Next.js + Tailwind v4 +
lucide-react. Screens render inside a phone `MobileFrame` driven by
`app/page.tsx` (a dev console that wires each screen via props).

## Design system = "Dawn Rounds" (defined in `app/globals.css`)
- **Identity:** warm sunrise over a clinical journey. Cream-blush paper, deep
  plum ink, raspberry-rose primary, apricot accent, ONE dawn gradient
  (apricot→rose) as the brand gesture.
- **Never hardcode hex.** Use semantic tokens: `bg-background` (cream page) →
  `bg-surface` → `bg-card`; `text-foreground` (plum ink); `primary`,
  `primary-deep`, `accent`, `info`, `violet`, `success`, `warning`,
  `destructive`, `muted`, `border`.
- **Fonts:** `font-heading` (Bricolage Grotesque) for display/headings,
  default sans (Figtree) for UI, `font-mono` (Spline Sans Mono) for numerals/data.
- **Helper classes:** `.display-serif`, `.eyebrow` (small-caps labels),
  `.dawn-gradient`, `.dawn-text`, `.hero-glow`, `.paper-grain`, `.dawn-ambient`,
  `.springy` (pair with `active:scale-[0.97]`), and animations
  `.animate-rise` (stagger via inline `animationDelay`), `.animate-fade-in`,
  `.animate-pop`, `.animate-fill-bar`, `.animate-arc`, `.animate-pulse-soft`,
  `.animate-drift`, `.scrollbar-hide`.
- **Radius:** cards `rounded-2xl/3xl`, inputs `rounded-xl`, pills `rounded-full`.
- Dark mode tokens exist ("dusk rounds") — keep using tokens so it just works.

## The rebuild "recipe" (the established pattern — match it)
1. **Read the existing screen first.** List every prop/callback, every
   `useState`, every tab, every data array, every export — these are CONTRACTS.
   Preserve all of them. Only the presentation changes.
2. **App bar:** `bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4
   dawn-ambient`, back button = `springy p-1.5 -ml-1.5 rounded-full
   active:scale-90 hover:bg-white/10` with `<ChevronLeft/>`. Eyebrow + title
   (`display-serif text-lg`). Wrap inner content in `relative` (dawn-ambient adds
   a `::before`).
3. **Hero / key action:** the single most important thing gets a
   `dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground`
   card with `animate-rise` (delay ~40ms). Frosted chips = `bg-white/15
   backdrop-blur-sm`.
4. **Tabs/segmented controls:** `flex rounded-full bg-muted p-1`; active =
   `bg-card text-foreground shadow-xs`, inactive = `text-muted-foreground`.
5. **Cards:** `rounded-2xl border border-border bg-card shadow-xs`. Status =
   tinted chips like `bg-success/15 text-success`, `bg-warning/15 text-warning`,
   `bg-info/10 text-info`, `bg-destructive/10 text-destructive`,
   `bg-accent/12 text-accent`.
6. **Real-world ideas, not generic lists:** prefer timelines/journeys, dose
   rails, streaks, severity bars, tappable `tel:`/`mailto:` actions, slide-up
   bottom sheets (absolute inset-0 scrim + `rounded-t-3xl` panel + `animate-rise`).
   Add a staggered load reveal. Avoid AI-slop (Inter, purple-on-white, flat lists).
7. **Stagger** sections with increasing `animationDelay` (40,110,200,280…ms).
8. **Type-check.** Watch for invalid Tailwind sizes — e.g. `h-4.5` is NOT a
   default class (use `h-4`/`h-5`).

## Architecture notes (preserve flow!)
- `app/page.tsx` owns navigation state and passes callbacks to each screen.
- **Self-nav screens** render their OWN `<BottomNav .../>` (patient-dashboard,
  my-trial, the dashboards, calendars). Keep the BottomNav + its `onTabChange`
  routing exactly.
- **Global-nav screens** get a nav injected by `page.tsx` — don't add one.
- Patient BottomNav tabs route: `dashboard`→patient-dashboard, `my-trial`→
  my-visits, `chat`→chat, `calendar`→patient-calendar, `me`→profile-settings.
- Some screens are SHARED across roles (e.g. `about-trial-screen.tsx` exports
  `TrialInfo`, `TrialContactPerson`, `TrialSummary`, `buildTrialInfo`, used by
  PI/CRC dashboards). NEVER change export names/shapes.

## STATUS

### ✅ Done this effort (ground-up rebuilt, type-clean)
- `components/clinical/screens/patient/medication-reminder-screen.tsx`
  — sunrise→night dosing rail, dawn "next dose" hero, adherence streak chip,
  slide-up action sheet. Preserved: `onBack`, tabs today/schedule/history,
  `updateMedicationStatus`, pending→Taken/Other → not_taken/skipped/remind_later.
- `components/clinical/screens/patient/my-trial-screen.tsx`
  — visits = vertical "trial journey" timeline; journey hero; med today/
  schedule/history; progress tab; visit-detail sub-view. Preserved: `onNavigate`
  (chat/patient-dashboard/patient-calendar/profile-settings), `handleMedAction`,
  `expandedMed`, `selectedVisit`, BottomNav.
- `components/clinical/screens/patient/about-trial-screen.tsx`
  — patient handbook: identity hero, stat tiles, schedule timeline, severity-
  coded risk bars, tappable tel:/mailto: contacts. Preserved ALL exports +
  `defaultTrialInfo` + `buildTrialInfo` + section nav + `info`/`title` props.

### ✓ Already at-bar (verified — DO NOT rebuild)
- `components/clinical/screens/patient-dashboard.tsx` (DawnRing, sunrise hero,
  numbered editorial sections, calendar mini, i18n) — complete already.
- `components/clinical/screens/patient/my-visits-screen.tsx` (recent commit).

### ▶ NEXT UP (remaining patient module)
1. `components/clinical/screens/patient/profile-settings-screen.tsx` (~681 lines)
2. `components/clinical/screens/patient-calendar-screen.tsx`
3. `components/clinical/screens/patient/chat-screen.tsx` (~688 lines; role-aware,
   has `onConversationOpenChange`, `userRole` prop — page.tsx hides nav when a
   conversation thread is open, so KEEP `onConversationOpenChange` calls).

### ⏭ Then (rest of app, one at a time)
- Dashboards: `sponsor-dashboard`, `pi-dashboard`, `research-team-dashboard`.
- Trial mgmt: `add-trial`, `visit-schedule`, `patient-list`, `add-patient`,
  `visit-detail`, `trial-summary-screen`, `schedule-review-screen`,
  `share-schedule-flow`, `invite-patient`.
- Calendars: `team-calendar-screen`, `calendar-settings-screen`.
- Notifications: `notification-screen`, `notification-detail-sheet`.
- Collaboration: `team-screen`, `site-user-profile`.
- Admin (17): everything in `components/clinical/screens/admin/`.
- Misc: `success-screen` (post-auth, ok to restyle).
- **SKIP (auth/registration):** welcome, entity-type, registration,
  security-questions, otp, password, sign-in, forgot-password,
  session-timeout, no-internet.

## Git
Branch `main`. The 3 rebuilt files + earlier patient WIP are UNCOMMITTED.
Suggested checkpoint commit (only if user asks):
`feat(patient): Dawn Rounds ground-up rebuild — Medication, My Trial, About Trial`

## First action in the new session
Read `app/globals.css` (skim tokens) and the target screen file, then rebuild
per the recipe above and run `npx tsc --noEmit`. Start with
`profile-settings-screen.tsx`.
