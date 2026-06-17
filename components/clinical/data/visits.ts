// Shared mock data for the patient trial/visit screens.
// Used by my-visits-screen (list) and visit-detail-screen (detail) so they stay in sync.

export interface Trial {
  id: string
  protocolId: string
  studyTitle: string
  diseaseIndication: string
  phase: string
  drugName: string
  scope: string
  department: string
  hospitalName: string
  piName: string
  status: string
}

export interface Visit {
  id: string
  trialId: string
  visitNumber: string
  visitName: string
  visitType: string
  scheduledDate: string
  scheduledTime: string
  duration: string
  visitWindow: string
  hospitalName: string
  piName: string
  status: "completed" | "upcoming" | "scheduled" | "missed"
  instructions: string
}

export const trials: Trial[] = [
  {
    id: "trial-1",
    protocolId: "ONCO-2024-001",
    studyTitle: "Phase III Study of Novel Cancer Treatment",
    diseaseIndication: "Non-Small Cell Lung Cancer",
    phase: "Phase III",
    drugName: "Pembrolizumab + Novel Agent",
    scope: "Global",
    department: "Oncology",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "active",
  },
  {
    id: "trial-2",
    protocolId: "CARD-2023-015",
    studyTitle: "Cardiovascular Risk Reduction Study",
    diseaseIndication: "Hypertension",
    phase: "Phase II",
    drugName: "Experimental Drug XYZ",
    scope: "Domestic",
    department: "Cardiology",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
  },
]

export const visits: Visit[] = [
  {
    id: "v1",
    trialId: "trial-1",
    visitNumber: "Visit 1",
    visitName: "Screening Visit",
    visitType: "Hospital",
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00 AM",
    duration: "approx. 60 min",
    visitWindow: "Jan 13 - Jan 17",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "completed",
    instructions: "Please fast for 12 hours before the visit. Bring all current medications.",
  },
  {
    id: "v2",
    trialId: "trial-1",
    visitNumber: "Visit 2",
    visitName: "Baseline Visit",
    visitType: "Hospital",
    scheduledDate: "2024-01-29",
    scheduledTime: "10:00 AM",
    duration: "approx. 45 min",
    visitWindow: "Jan 27 - Jan 31",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "completed",
    instructions: "Blood samples will be collected. ECG will be performed.",
  },
  {
    id: "v3",
    trialId: "trial-1",
    visitNumber: "Visit 3",
    visitName: "Week 4 Follow-up",
    visitType: "Telephonic",
    scheduledDate: "2024-02-26",
    scheduledTime: "02:00 PM",
    duration: "approx. 20 min",
    visitWindow: "Feb 24 - Feb 28",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "upcoming",
    instructions: "Research coordinator will call to check on your progress and any side effects.",
  },
  {
    id: "v4",
    trialId: "trial-1",
    visitNumber: "Visit 4",
    visitName: "Week 8 Assessment",
    visitType: "Hospital",
    scheduledDate: "2024-03-25",
    scheduledTime: "09:30 AM",
    duration: "approx. 45 min",
    visitWindow: "Mar 23 - Mar 27",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "scheduled",
    instructions: "Full physical examination and lab tests.",
  },
  {
    id: "v5",
    trialId: "trial-1",
    visitNumber: "Visit 5",
    visitName: "Week 12 Home Visit",
    visitType: "Home",
    scheduledDate: "2024-04-22",
    scheduledTime: "11:00 AM",
    duration: "approx. 30 min",
    visitWindow: "Apr 20 - Apr 24",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "scheduled",
    instructions: "Nurse will visit your home for routine checkup.",
  },
  // ── trial-2 (CARD-2023-015) — a completed study, full visit history ──
  {
    id: "c1",
    trialId: "trial-2",
    visitNumber: "Visit 1",
    visitName: "Screening Visit",
    visitType: "Hospital",
    scheduledDate: "2023-03-10",
    scheduledTime: "09:00 AM",
    duration: "approx. 60 min",
    visitWindow: "Mar 8 - Mar 12",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
    instructions: "Please fast for 12 hours before the visit. Bring all current medications.",
  },
  {
    id: "c2",
    trialId: "trial-2",
    visitNumber: "Visit 2",
    visitName: "Baseline & Randomisation",
    visitType: "Hospital",
    scheduledDate: "2023-04-07",
    scheduledTime: "10:30 AM",
    duration: "approx. 45 min",
    visitWindow: "Apr 5 - Apr 9",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
    instructions: "Blood pressure monitoring and ECG will be performed.",
  },
  {
    id: "c3",
    trialId: "trial-2",
    visitNumber: "Visit 3",
    visitName: "Week 12 Follow-up",
    visitType: "Telephonic",
    scheduledDate: "2023-06-30",
    scheduledTime: "03:00 PM",
    duration: "approx. 20 min",
    visitWindow: "Jun 28 - Jul 2",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
    instructions: "Coordinator will call to review your blood pressure log.",
  },
  {
    id: "c4",
    trialId: "trial-2",
    visitNumber: "Visit 4",
    visitName: "End of Study",
    visitType: "Hospital",
    scheduledDate: "2023-09-15",
    scheduledTime: "09:30 AM",
    duration: "approx. 45 min",
    visitWindow: "Sep 13 - Sep 17",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
    instructions: "Final assessment and lab tests. Discussion of study outcome.",
  },
]

/** Format an ISO date (yyyy-mm-dd) into a readable form like "15 Jan 2024". */
export function formatVisitDate(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}
