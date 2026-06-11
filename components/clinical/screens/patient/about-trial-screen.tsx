"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, MapPin, User, Phone, Mail, Calendar, Clock, AlertCircle, Download, Globe } from "lucide-react";
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
  { id: "responsibilities", label: "Your Responsibilities", icon: <User className="h-4 w-4" /> },
  { id: "medication", label: "Medication Info", icon: <FileText className="h-4 w-4" /> },
  { id: "risks", label: "Risks & Side Effects", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "benefits", label: "Benefits", icon: <FileText className="h-4 w-4" /> },
  { id: "contacts", label: "Contact Details", icon: <Phone className="h-4 w-4" /> },
  { id: "withdrawal", label: "Withdrawal Info", icon: <FileText className="h-4 w-4" /> },
];

export function AboutTrialScreen({ onBack, info = defaultTrialInfo, title = "About Trial" }: AboutTrialScreenProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const trialInfo = info;

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <h3 className="font-semibold text-foreground mb-3">{trialInfo.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Protocol ID</span>
                  <span className="font-medium text-info">{trialInfo.protocolId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sponsor</span>
                  <span className="text-foreground">{trialInfo.sponsor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{trialInfo.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Visits</span>
                  <span className="text-foreground">{trialInfo.totalVisits}</span>
                </div>
                {trialInfo.phase && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phase</span>
                    <span className="text-foreground">{trialInfo.phase}</span>
                  </div>
                )}
                {trialInfo.disease && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Disease</span>
                    <span className="text-foreground">{trialInfo.disease}</span>
                  </div>
                )}
                {trialInfo.drug && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Drug</span>
                    <span className="text-foreground">{trialInfo.drug}</span>
                  </div>
                )}
                {trialInfo.site && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Site</span>
                    <span className="text-foreground">{trialInfo.site}</span>
                  </div>
                )}
                {trialInfo.pi && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Principal Investigator</span>
                    <span className="text-foreground">{trialInfo.pi}</span>
                  </div>
                )}
                {trialInfo.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span className="text-foreground">{trialInfo.department}</span>
                  </div>
                )}
                {trialInfo.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-success">{trialInfo.status}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <h4 className="font-medium text-foreground mb-2">Study Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{trialInfo.summary}</p>
            </div>

            <button className="w-full bg-card rounded-xl border border-border shadow-xs p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
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
          <div className="bg-card rounded-xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Why This Study Is Being Conducted</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{trialInfo.purpose}</p>
          </div>
        );

      case "schedule":
        return (
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="bg-secondary px-4 py-2">
              <h3 className="font-semibold text-primary">Visit Schedule Overview</h3>
            </div>
            <div className="divide-y divide-border">
              {trialInfo.visitSchedule.map((visit, index) => (
                <div key={index} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{visit.visit}</p>
                    <p className="text-xs text-muted-foreground">{visit.timepoint}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    visit.type === "Hospital" ? "bg-info/10 text-info" :
                    visit.type === "Telephonic" ? "bg-success/15 text-success" :
                    "bg-warning/15 text-warning"
                  )}>
                    {visit.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "responsibilities":
        return (
          <div className="bg-card rounded-xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Your Responsibilities</h3>
            <ul className="space-y-3">
              {trialInfo.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "medication":
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <h3 className="font-semibold text-foreground mb-2">{trialInfo.medication.name}</h3>
              <p className="text-sm text-muted-foreground">{trialInfo.medication.description}</p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <h4 className="font-medium text-foreground mb-3">Dosing Instructions</h4>
              <ul className="space-y-2">
                {trialInfo.medication.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-info mt-2" />
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
            <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                Please report any side effects to your study team immediately. Contact emergency services if you experience severe symptoms.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="bg-destructive/5 px-4 py-2">
                <h3 className="font-semibold text-red-800">Possible Side Effects</h3>
              </div>
              <div className="divide-y divide-border">
                {trialInfo.risks.map((item, index) => (
                  <div key={index} className="p-3 flex items-center justify-between">
                    <p className="text-sm text-foreground">{item.risk}</p>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      item.frequency.includes("Common") ? "bg-warning/15 text-warning" :
                      item.frequency.includes("Uncommon") ? "bg-info/10 text-info" :
                      "bg-muted text-foreground/80"
                    )}>
                      {item.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="bg-card rounded-xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Potential Benefits</h3>
            <ul className="space-y-3">
              {trialInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  <p className="text-sm text-foreground/80">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-4">
            {/* PI Contact */}
            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{trialInfo.contacts.pi.name}</p>
                  <p className="text-xs text-muted-foreground">{trialInfo.contacts.pi.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{trialInfo.contacts.pi.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{trialInfo.contacts.pi.email}</span>
                </div>
              </div>
            </div>

            {/* Coordinator Contact */}
            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                  <User className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{trialInfo.contacts.coordinator.name}</p>
                  <p className="text-xs text-muted-foreground">{trialInfo.contacts.coordinator.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{trialInfo.contacts.coordinator.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{trialInfo.contacts.coordinator.email}</span>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="bg-card rounded-xl border border-border shadow-xs p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{trialInfo.contacts.site.name}</p>
                  <p className="text-xs text-muted-foreground">Study Site</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-foreground/80">{trialInfo.contacts.site.address}</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{trialInfo.contacts.site.phone}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-destructive/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-red-800">24/7 Emergency Line</p>
                  <p className="text-lg font-bold text-destructive">{trialInfo.contacts.emergency.phone}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "withdrawal":
        return (
          <div className="bg-card rounded-xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Withdrawal Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{trialInfo.withdrawal}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-card border-b border-border px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                activeSection === section.id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
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

      {/* Language Selector */}
      <div className="bg-card border-t border-border p-3">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Change Language</span>
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
