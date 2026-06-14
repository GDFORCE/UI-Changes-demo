"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, FileText, MapPin, User, Phone, Mail, Calendar,
  AlertCircle, Download, Globe, Building2, ShieldCheck, Pill, HeartPulse,
  ClipboardList, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrialContactPerson {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface TrialInfo {
  title: string;
  protocolId: string;
  sponsor: string;
  // Optional staff/summary fields (shown in Overview when present)
  phase?: string;
  disease?: string;
  drug?: string;
  site?: string;
  pi?: string;
  department?: string;
  status?: string;
  purpose: string;
  summary: string;
  duration: string;
  totalVisits: number;
  visitSchedule: { visit: string; timepoint: string; type: string }[];
  responsibilities: string[];
  medication: { name: string; description: string; instructions: string[] };
  risks: { risk: string; frequency: string }[];
  benefits: string[];
  contacts: {
    pi: TrialContactPerson;
    coordinator: TrialContactPerson;
    site: { name: string; address: string; phone: string };
    emergency: { phone: string; available: string };
  };
  withdrawal: string;
}

interface AboutTrialScreenProps {
  onBack?: () => void;
  /** Trial to display. Defaults to the patient's enrolled trial. */
  info?: TrialInfo;
  /** Header title. Defaults to "About Trial". */
  title?: string;
}

type Section = "overview" | "purpose" | "schedule" | "responsibilities" | "medication" | "risks" | "benefits" | "contacts" | "withdrawal";

const defaultTrialInfo: TrialInfo = {
  title: "Phase III Study of Novel Cancer Treatment in Non-Small Cell Lung Cancer",
  protocolId: "ONCO-2024-001",
  sponsor: "PharmaCo Research Inc.",
  purpose: "This study is being conducted to evaluate the safety and effectiveness of a new combination treatment (Pembrolizumab + Novel Agent) for patients with non-small cell lung cancer (NSCLC). The study aims to determine if this combination can improve outcomes compared to standard treatment.",
  summary: "You are invited to participate in this research study because you have been diagnosed with non-small cell lung cancer. This study will compare a new combination of medications to the current standard treatment. The study will last approximately 12 months and will involve regular visits to the study site.",
  duration: "12 months (approximately 52 weeks)",
  totalVisits: 15,
  visitSchedule: [
    { visit: "Screening", timepoint: "Week -2 to 0", type: "Hospital" },
    { visit: "Baseline", timepoint: "Week 0", type: "Hospital" },
    { visit: "Week 2", timepoint: "Week 2", type: "Telephonic" },
    { visit: "Week 4", timepoint: "Week 4", type: "Hospital" },
    { visit: "Week 8", timepoint: "Week 8", type: "Hospital" },
    { visit: "Week 12", timepoint: "Week 12", type: "Home" },
    { visit: "Week 16", timepoint: "Week 16", type: "Hospital" },
    { visit: "Week 24", timepoint: "Week 24", type: "Hospital" },
    { visit: "Week 36", timepoint: "Week 36", type: "Hospital" },
    { visit: "Week 52", timepoint: "Week 52", type: "Hospital" },
  ],
  responsibilities: [
    "Attend all scheduled study visits",
    "Take study medication as directed",
    "Complete daily medication diary",
    "Report any side effects or health changes promptly",
    "Follow dietary and lifestyle guidelines provided",
    "Keep all study materials confidential",
    "Inform study team of any other medications",
    "Attend follow-up appointments after treatment",
  ],
  medication: {
    name: "Pembrolizumab + Novel Agent XY-123",
    description: "The study medication consists of two drugs: Pembrolizumab (an approved immunotherapy) and Novel Agent XY-123 (an investigational drug). You will receive both medications according to the dosing schedule provided by your study team.",
    instructions: [
      "Take Pembrolizumab 200mg orally once daily",
      "Take Novel Agent XY-123 50mg orally twice daily",
      "Take with food to minimize stomach upset",
      "Do not crush or chew tablets",
      "Store at room temperature away from moisture",
    ],
  },
  risks: [
    { risk: "Fatigue", frequency: "Common (>10%)" },
    { risk: "Nausea", frequency: "Common (>10%)" },
    { risk: "Decreased appetite", frequency: "Common (>10%)" },
    { risk: "Rash", frequency: "Uncommon (1-10%)" },
    { risk: "Diarrhea", frequency: "Uncommon (1-10%)" },
    { risk: "Liver enzyme changes", frequency: "Uncommon (1-10%)" },
    { risk: "Thyroid problems", frequency: "Rare (<1%)" },
    { risk: "Severe allergic reaction", frequency: "Rare (<1%)" },
  ],
  benefits: [
    "Access to a potentially effective new treatment",
    "Close medical monitoring throughout the study",
    "Regular health assessments at no cost",
    "Potential to help future patients with similar conditions",
    "Reimbursement for travel expenses",
  ],
  contacts: {
    pi: {
      name: "Dr. Sarah Johnson",
      role: "Principal Investigator",
      phone: "+1 (555) 123-4567",
      email: "s.johnson@citymedical.com",
    },
    coordinator: {
      name: "Emily Chen",
      role: "Research Coordinator",
      phone: "+1 (555) 234-5678",
      email: "e.chen@citymedical.com",
    },
    site: {
      name: "City Medical Center",
      address: "123 Medical Drive, Suite 500, New York, NY 10001",
      phone: "+1 (555) 345-6789",
    },
    emergency: {
      phone: "1-800-TRIAL-ER",
      available: "24/7",
    },
  },
  withdrawal: "Your participation in this study is completely voluntary. You may withdraw from the study at any time, for any reason, without penalty or loss of benefits. If you decide to withdraw, please inform your study team so they can ensure your safety and provide appropriate follow-up care. Withdrawing from the study will not affect your relationship with your healthcare providers or your access to standard medical care.",
};

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
  { id: "purpose", label: "Trial Purpose", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "schedule", label: "Visit Schedule", icon: <Calendar className="h-4 w-4" /> },
  { id: "responsibilities", label: "Your Responsibilities", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "medication", label: "Medication Info", icon: <Pill className="h-4 w-4" /> },
  { id: "risks", label: "Risks & Side Effects", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "benefits", label: "Benefits", icon: <Sparkles className="h-4 w-4" /> },
  { id: "contacts", label: "Contact Details", icon: <Phone className="h-4 w-4" /> },
  { id: "withdrawal", label: "Withdrawal Info", icon: <ShieldCheck className="h-4 w-4" /> },
];

const VISIT_TYPE_ICON: Record<string, typeof Building2> = {
  Hospital: Building2,
  Telephonic: Phone,
  Home: MapPin,
};
function visitTypeChip(type: string) {
  return type === "Hospital" ? "bg-info/10 text-info"
    : type === "Telephonic" ? "bg-success/15 text-success"
    : "bg-warning/15 text-warning";
}
function riskTone(freq: string) {
  return freq.includes("Common") ? { chip: "bg-warning/15 text-warning", bar: "bg-warning", w: "w-full" }
    : freq.includes("Uncommon") ? { chip: "bg-info/10 text-info", bar: "bg-info", w: "w-2/3" }
    : { chip: "bg-muted text-foreground/70", bar: "bg-foreground/40", w: "w-1/4" };
}

export function AboutTrialScreen({ onBack, info = defaultTrialInfo, title = "About Trial" }: AboutTrialScreenProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const trialInfo = info;

  const detailRows: [string, string | undefined, boolean?][] = [
    ["Phase", trialInfo.phase],
    ["Disease", trialInfo.disease],
    ["Drug", trialInfo.drug],
    ["Site", trialInfo.site],
    ["Principal Investigator", trialInfo.pi],
    ["Department", trialInfo.department],
    ["Status", trialInfo.status, true],
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Identity hero — the dawn gesture */}
            <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-xs tabular-nums rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-sm">{trialInfo.protocolId}</span>
                {trialInfo.status && (
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">{trialInfo.status}</span>
                )}
              </div>
              <h3 className="relative mt-3 font-heading text-xl leading-snug">{trialInfo.title}</h3>
              <p className="relative mt-2 text-sm text-white/85 inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {trialInfo.sponsor}
              </p>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <Calendar className="h-4 w-4 text-accent" />
                <p className="mt-2 font-heading text-base leading-tight text-foreground">{trialInfo.duration}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <ClipboardList className="h-4 w-4 text-accent" />
                <p className="mt-2 font-heading text-2xl tabular-nums text-foreground">{trialInfo.totalVisits}</p>
                <p className="text-xs text-muted-foreground">Total visits</p>
              </div>
            </div>

            {/* Optional detail rows (PI / CRC view) */}
            {detailRows.some(([, v]) => v) && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <p className="eyebrow text-muted-foreground mb-3">Trial details</p>
                <div className="divide-y divide-border/60">
                  {detailRows.filter(([, v]) => v).map(([label, value, success]) => (
                    <div key={label} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={cn("font-medium text-right", success ? "text-success" : "text-foreground")}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="eyebrow text-muted-foreground mb-2">Study summary</p>
              <p className="text-sm leading-relaxed text-foreground/80">{trialInfo.summary}</p>
            </div>

            {/* PDF */}
            <button className="springy flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Patient Information Sheet</p>
                  <p className="text-xs text-muted-foreground">Full document (PDF)</p>
                </div>
              </div>
              <Download className="h-5 w-5 text-muted-foreground/70" />
            </button>
          </div>
        );

      case "purpose":
        return (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/12">
                <HeartPulse className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-heading text-base text-foreground">Why this study is being conducted</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{trialInfo.purpose}</p>
          </div>
        );

      case "schedule":
        return (
          <div>
            <p className="eyebrow text-muted-foreground mb-3">Visit schedule overview</p>
            <div className="relative">
              {trialInfo.visitSchedule.map((visit, index) => {
                const TypeIcon = VISIT_TYPE_ICON[visit.type] ?? Building2;
                const isLast = index === trialInfo.visitSchedule.length - 1;
                return (
                  <div key={index} className="relative flex gap-3 pb-3 last:pb-0">
                    <div className="relative flex w-6 shrink-0 flex-col items-center">
                      {!isLast && <span className="absolute top-6 bottom-[-12px] w-px bg-border" />}
                      <span className="z-10 grid h-6 w-6 place-items-center rounded-full bg-secondary/70 ring-4 ring-surface">
                        <TypeIcon className="h-3 w-3 text-primary" />
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-xs">
                      <div>
                        <p className="text-sm font-medium text-foreground">{visit.visit}</p>
                        <p className="text-xs text-muted-foreground">{visit.timepoint}</p>
                      </div>
                      <span className={cn("rounded-full px-2 py-1 text-[11px] font-medium", visitTypeChip(visit.type))}>
                        {visit.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "responsibilities":
        return (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h3 className="font-heading text-base text-foreground mb-3">Your responsibilities</h3>
            <ul className="space-y-3">
              {trialInfo.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary/70 text-xs font-bold text-primary">{index + 1}</span>
                  <p className="text-sm text-foreground/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "medication":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary/70">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-base text-foreground">{trialInfo.medication.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{trialInfo.medication.description}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="eyebrow text-muted-foreground mb-3">Dosing instructions</p>
              <ul className="space-y-2.5">
                {trialInfo.medication.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
                    <p className="text-sm text-foreground/80">{instruction}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "risks":
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning/8 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm text-warning">
                Please report any side effects to your study team immediately. Contact emergency services if you experience severe symptoms.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="eyebrow text-destructive mb-3">Possible side effects</p>
              <div className="space-y-3">
                {trialInfo.risks.map((item, index) => {
                  const tone = riskTone(item.frequency);
                  return (
                    <div key={index}>
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm text-foreground">{item.risk}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", tone.chip)}>{item.frequency}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", tone.bar, tone.w)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h3 className="font-heading text-base text-foreground mb-3">Potential benefits</h3>
            <ul className="space-y-3">
              {trialInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15">
                    <span className="h-2 w-2 rounded-full bg-success" />
                  </span>
                  <p className="text-sm text-foreground/80">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-3">
            {[
              { person: trialInfo.contacts.pi, tint: "bg-secondary/70 text-primary" },
              { person: trialInfo.contacts.coordinator, tint: "bg-success/15 text-success" },
            ].map(({ person, tint }, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <div className="mb-3 flex items-center gap-3">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-full", tint)}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a href={`tel:${person.phone}`} className="springy flex items-center justify-center gap-1.5 rounded-xl bg-primary/8 py-2 text-xs font-medium text-primary active:scale-[0.97]">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a href={`mailto:${person.email}`} className="springy flex items-center justify-center gap-1.5 rounded-xl bg-info/10 py-2 text-xs font-medium text-info active:scale-[0.97]">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                </div>
              </div>
            ))}

            {/* Site */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-info/10">
                  <MapPin className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{trialInfo.contacts.site.name}</p>
                  <p className="text-xs text-muted-foreground">Study site</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80">{trialInfo.contacts.site.address}</p>
              <a href={`tel:${trialInfo.contacts.site.phone}`} className="mt-2 inline-flex items-center gap-2 text-sm text-primary">
                <Phone className="h-4 w-4" /> {trialInfo.contacts.site.phone}
              </a>
            </div>

            {/* Emergency */}
            <a href={`tel:${trialInfo.contacts.emergency.phone}`} className="springy flex items-center justify-between rounded-2xl border border-destructive/25 bg-destructive/8 p-4 active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-destructive/12">
                  <Phone className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs font-medium text-destructive">{trialInfo.contacts.emergency.available} Emergency line</p>
                  <p className="font-heading text-lg text-destructive">{trialInfo.contacts.emergency.phone}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-destructive/60" />
            </a>
          </div>
        );

      case "withdrawal":
        return (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-info/10">
                <ShieldCheck className="h-5 w-5 text-info" />
              </div>
              <h3 className="font-heading text-base text-foreground">Withdrawal information</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{trialInfo.withdrawal}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="eyebrow text-primary-foreground/55">Trial information</p>
            <h1 className="display-serif text-lg leading-tight">{title}</h1>
          </div>
        </div>
      </div>

      {/* Section navigation */}
      <div className="bg-card border-b border-border px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderContent()}
      </div>

      {/* Language selector */}
      <div className="bg-card border-t border-border p-3">
        <button className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Change language</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Shape of a trial row from the PI / Research Team dashboards. */
export interface TrialSummary {
  id: string;
  title: string;
  phase: string;
  disease: string;
  drug: string;
  sponsor: string;
  site: string;
  pi: string;
  department: string;
  status: string;
}

/**
 * Build the rich About-Trial content from a dashboard trial summary so the PI
 * and Research Team can open the same detailed page patients see.
 */
export function buildTrialInfo(tr: TrialSummary): TrialInfo {
  return {
    title: tr.title,
    protocolId: tr.id,
    sponsor: tr.sponsor,
    phase: tr.phase,
    disease: tr.disease,
    drug: tr.drug,
    site: tr.site,
    pi: tr.pi,
    department: tr.department,
    status: tr.status,
    purpose: `This ${tr.phase} study evaluates the safety and effectiveness of ${tr.drug} in patients with ${tr.disease}. The trial aims to determine whether this treatment improves outcomes compared to standard care.`,
    summary: `${tr.title} (${tr.id}) is a ${tr.phase} clinical trial sponsored by ${tr.sponsor}, conducted at ${tr.site} under the supervision of ${tr.pi}, ${tr.department}. The study evaluates ${tr.drug} for the treatment of ${tr.disease}.`,
    duration: "12 months (approximately 52 weeks)",
    totalVisits: 8,
    visitSchedule: [
      { visit: "Screening", timepoint: "Week -2 to 0", type: "Hospital" },
      { visit: "Baseline", timepoint: "Week 0", type: "Hospital" },
      { visit: "Visit 1", timepoint: "Week 4", type: "Hospital" },
      { visit: "Visit 2", timepoint: "Week 8", type: "Telephonic" },
      { visit: "Visit 3", timepoint: "Week 12", type: "Hospital" },
      { visit: "Visit 4", timepoint: "Week 24", type: "Hospital" },
      { visit: "Visit 5", timepoint: "Week 36", type: "Telephonic" },
      { visit: "End of Study", timepoint: "Week 52", type: "Hospital" },
    ],
    responsibilities: [
      "Ensure all visits are conducted within the protocol window",
      "Confirm informed consent is documented before any procedure",
      "Record visit data and adverse events in the eCRF promptly",
      "Maintain source documents and study drug accountability",
      "Report protocol deviations and SAEs to the sponsor",
      "Follow GCP and the approved protocol at all times",
    ],
    medication: {
      name: tr.drug,
      description: `${tr.drug} is the investigational product under study for ${tr.disease}. Dispense and administer strictly per the protocol dosing schedule.`,
      instructions: [
        "Dispense only to randomized, eligible participants",
        "Follow the protocol-specified dose and titration",
        "Counsel the patient to take with food to reduce GI upset",
        "Record each dispensation in the drug accountability log",
        "Store as per the product label and temperature log",
      ],
    },
    risks: [
      { risk: "Gastrointestinal upset", frequency: "Common (>10%)" },
      { risk: "Headache", frequency: "Common (>10%)" },
      { risk: "Dizziness", frequency: "Uncommon (1-10%)" },
      { risk: "Hypoglycaemia", frequency: "Uncommon (1-10%)" },
      { risk: "Allergic reaction", frequency: "Rare (<1%)" },
    ],
    benefits: [
      "Access to a potentially effective new treatment",
      "Close medical monitoring throughout the study",
      "Regular health assessments at no cost",
      "Contribution to advancing care for future patients",
    ],
    contacts: {
      pi: {
        name: tr.pi,
        role: "Principal Investigator",
        phone: "+91 98765 43210",
        email: "pi@apollochennai.com",
      },
      coordinator: {
        name: "Meera",
        role: "Clinical Research Coordinator",
        phone: "+91 98765 11223",
        email: "crc@apollochennai.com",
      },
      site: {
        name: tr.site,
        address: "Apollo Hospital, Greams Road, Chennai, Tamil Nadu 600006",
        phone: "+91 44 2829 3333",
      },
      emergency: {
        phone: "1800-CTMS-ER",
        available: "24/7",
      },
    },
    withdrawal:
      "Participation is voluntary. A participant may withdraw at any time, for any reason, without penalty. On withdrawal, ensure end-of-study procedures and appropriate follow-up care are arranged, and document the withdrawal in the eCRF.",
  };
}
