"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  FileText,
  Users,
  Building2,
  Calendar,
  Eye,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface TrialMonitoringScreenProps {
  onBack?: () => void;
}

const trials = [
  {
    id: "CARDIO-2024-001",
    title: "Phase III Cardiovascular Outcomes Study",
    sponsor: "PharmaCorp Inc",
    cro: "Global CRO Partners",
    site: "City General Hospital",
    status: "Active",
    patients: 245,
    targetEnrollment: 300,
    scheduleVersion: "v3.2",
    lastModified: "2024-03-10",
    modifiedBy: "Dr. Sarah Johnson",
    changeSummary: "Updated Visit 5 procedures",
  },
  {
    id: "ONCO-2024-002",
    title: "Phase II Oncology Immunotherapy Trial",
    sponsor: "BioGen Labs",
    cro: "MedResearch CRO",
    site: "Cancer Research Institute",
    status: "Active",
    patients: 89,
    targetEnrollment: 150,
    scheduleVersion: "v2.1",
    lastModified: "2024-03-08",
    modifiedBy: "Dr. Michael Chen",
    changeSummary: "Added biomarker assessments",
  },
  {
    id: "NEURO-2023-003",
    title: "Alzheimers Disease Prevention Study",
    sponsor: "NeuroScience Corp",
    cro: "Global CRO Partners",
    site: "Memory Care Center",
    status: "Completed",
    patients: 500,
    targetEnrollment: 500,
    scheduleVersion: "v4.0",
    lastModified: "2024-02-28",
    modifiedBy: "Dr. Emily Rodriguez",
    changeSummary: "Final closeout procedures",
  },
  {
    id: "ENDO-2024-004",
    title: "Diabetes Management Intervention Trial",
    sponsor: "EndoCare Pharma",
    cro: "Clinical Trials Inc",
    site: "Research Medical Center",
    status: "Suspended",
    patients: 45,
    targetEnrollment: 200,
    scheduleVersion: "v1.3",
    lastModified: "2024-03-01",
    modifiedBy: "System Admin",
    changeSummary: "Trial suspended - safety review",
  },
];

export function TrialMonitoringScreen({ onBack }: TrialMonitoringScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTrials = trials.filter((trial) => {
    const matchesSearch =
      trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Activity className="h-4 w-4 text-success" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-info" />;
      case "Suspended":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/15 text-success";
      case "Completed":
        return "bg-info/10 text-info";
      case "Suspended":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  const tiles = [
    { label: "Total trials", value: trials.length, accent: "text-primary" },
    { label: "Active", value: trials.filter((t) => t.status === "Active").length, accent: "text-success" },
    { label: "Completed", value: trials.filter((t) => t.status === "Completed").length, accent: "text-info" },
    { label: "Suspended", value: trials.filter((t) => t.status === "Suspended").length, accent: "text-destructive" },
    { label: "Total enrolled", value: trials.reduce((n, t) => n + t.patients, 0), accent: "text-primary" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Trial metadata & recruitment</h1>
        <p className="text-sm text-muted-foreground">
          Operational oversight only · aggregate counts · no subject-level data (BTG required).
        </p>
      </div>

      {/* Summary tiles (ADM-06 Section 1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-card border border-border p-4">
            <div className={`text-2xl font-bold leading-none ${t.accent}`}>{t.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search by protocol ID, title, or sponsor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-10 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trial metadata table (ADM-06 Section 2) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Protocol / Study</th>
                <th className="px-4 py-3 font-medium">Sponsor / CRO</th>
                <th className="px-4 py-3 font-medium">Enrollment</th>
                <th className="px-4 py-3 font-medium">Last modified</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTrials.map((trial) => (
                <tr key={trial.id} className="hover:bg-surface/70 align-top">
                  <td className="px-4 py-3 max-w-[280px]">
                    <div className="font-medium text-foreground">{trial.title}</div>
                    <div className="text-xs text-muted-foreground">{trial.id}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1"><Building2 className="h-3 w-3 text-muted-foreground/70" /> {trial.sponsor}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><FileText className="h-3 w-3 text-muted-foreground/70" /> {trial.cro}</div>
                  </td>
                  <td className="px-4 py-3 w-[180px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="font-medium">{trial.patients}/{trial.targetEnrollment}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-info h-2 rounded-full"
                        style={{ width: `${(trial.patients / trial.targetEnrollment) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {trial.lastModified}</div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">{trial.changeSummary}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(trial.status)}
                      <Badge className={`text-xs ${getStatusColor(trial.status)}`}>{trial.status}</Badge>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => toast.info(`${trial.id} — ${trial.title}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTrials.length === 0 && (
          <p className="text-center text-sm text-muted-foreground/70 py-10">No trials match the current filters.</p>
        )}
      </div>
    </div>
  );
}
