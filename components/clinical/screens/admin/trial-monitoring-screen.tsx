"use client";

import { useState } from "react";
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
        return <Activity className="h-4 w-4 text-green-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "Suspended":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Trial Monitoring</h1>
            <p className="text-xs text-blue-200">Operational oversight only</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3 bg-white border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trial List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredTrials.map((trial) => (
          <Card key={trial.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(trial.status)}
                  <Badge className={`text-xs ${getStatusColor(trial.status)}`}>
                    {trial.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>

              <h3 className="font-medium text-sm mb-1">{trial.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{trial.id}</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-3 w-3 text-gray-400" />
                  <span>Sponsor: {trial.sponsor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-3 w-3 text-gray-400" />
                  <span>CRO: {trial.cro}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span>Site: {trial.site}</span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Enrollment Progress</span>
                  <span className="text-xs font-medium">
                    {trial.patients}/{trial.targetEnrollment}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#2563EB] h-2 rounded-full"
                    style={{
                      width: `${(trial.patients / trial.targetEnrollment) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span>Schedule Version: {trial.scheduleVersion}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {trial.lastModified}
                  </span>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Last change:</span> {trial.changeSummary}
                </p>
                <p className="text-gray-400 mt-1">Modified by: {trial.modifiedBy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
