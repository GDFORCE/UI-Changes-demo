"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Download,
  FileText,
  Users,
  Building2,
  Activity,
  Calendar,
  Filter,
  FileSpreadsheet,
  File,
} from "lucide-react";

interface ReportsScreenProps {
  onBack?: () => void;
}

const reportTypes = [
  {
    id: "users",
    name: "Registered Users Report",
    description: "Complete list of registered users with status and details",
    icon: Users,
    color: "text-info",
    bgColor: "bg-info/5",
    filters: ["Date Range", "Organization", "User Role", "Status"],
  },
  {
    id: "org-users",
    name: "Organization-wise User Report",
    description: "Users grouped by organization with role breakdown",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-violet/5",
    filters: ["Date Range", "Organization Type"],
  },
  {
    id: "user-status",
    name: "User Status Report",
    description: "Active, suspended, and pending verification users",
    icon: Activity,
    color: "text-success",
    bgColor: "bg-success/10",
    filters: ["Date Range", "Status"],
  },
  {
    id: "login-activity",
    name: "Login Activity Report",
    description: "User login history and patterns",
    icon: Calendar,
    color: "text-warning",
    bgColor: "bg-warning/10",
    filters: ["Date Range", "User Type"],
  },
  {
    id: "trial-summary",
    name: "Trial Summary Report",
    description: "Overview of all trials with enrollment status",
    icon: FileText,
    color: "text-teal-500",
    bgColor: "bg-accent/5",
    filters: ["Date Range", "Trial Status", "Sponsor"],
  },
];

export function ReportsScreen({ onBack }: ReportsScreenProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("last-30-days");
  const [exportFormat, setExportFormat] = useState("excel");

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export platform reports.</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Quick Filters */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Export Format</label>
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === "excel" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${exportFormat === "excel" ? "bg-primary" : ""}`}
                  onClick={() => setExportFormat("excel")}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Excel
                </Button>
                <Button
                  variant={exportFormat === "pdf" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${exportFormat === "pdf" ? "bg-primary" : ""}`}
                  onClick={() => setExportFormat("pdf")}
                >
                  <File className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reportTypes.map((report) => (
            <Card
              key={report.id}
              className={`border border-border shadow-sm cursor-pointer transition-all ${
                selectedReport === report.id
                  ? "ring-2 ring-info bg-info/5"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg ${report.bgColor} flex items-center justify-center`}
                  >
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{report.name}</h3>
                      <Checkbox
                        checked={selectedReport === report.id}
                        className="data-[state=checked]:bg-info"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {report.filters.map((filter) => (
                        <Badge
                          key={filter}
                          variant="outline"
                          className="text-xs px-1.5 py-0 text-muted-foreground"
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Recently Generated */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium">Recently Generated</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {[
              { name: "Users Report - Mar 2024", date: "Mar 15, 2024", format: "xlsx" },
              { name: "Login Activity - Feb 2024", date: "Mar 01, 2024", format: "pdf" },
              { name: "Trial Summary Q1", date: "Feb 28, 2024", format: "xlsx" },
            ].map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-surface rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {report.format === "xlsx" ? (
                    <FileSpreadsheet className="h-4 w-4 text-success" />
                  ) : (
                    <File className="h-4 w-4 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground/70">{report.date}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={() => toast.success(`Downloading ${report.name}`)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button
            className="bg-primary hover:bg-primary/90"
            disabled={!selectedReport}
            onClick={() => {
              const name = reportTypes.find((r) => r.id === selectedReport)?.name;
              toast.success(`Generating ${name} (${exportFormat === "pdf" ? "PDF" : "Excel"})`);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate{" "}
            {selectedReport
              ? reportTypes.find((r) => r.id === selectedReport)?.name
              : "Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
