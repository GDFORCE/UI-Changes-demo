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
  Filter,
  User,
  LogIn,
  LogOut,
  Key,
  FileText,
  Users,
  Bell,
  Shield,
  Calendar,
  Clock,
  Download,
} from "lucide-react";

interface AuditLogScreenProps {
  onBack?: () => void;
}

const auditLogs = [
  {
    id: "AUD-001",
    action: "User Login",
    icon: LogIn,
    user: "Dr. Sarah Johnson",
    userId: "USR-001",
    details: "Successful login from iOS device",
    timestamp: "2024-03-15 09:45:23 AM",
    status: "Success",
    ip: "192.168.1.100",
  },
  {
    id: "AUD-002",
    action: "Password Reset",
    icon: Key,
    user: "Michael Chen",
    userId: "USR-002",
    details: "Password reset initiated via email",
    timestamp: "2024-03-15 09:30:15 AM",
    status: "Success",
    ip: "192.168.1.101",
  },
  {
    id: "AUD-003",
    action: "Trial Created",
    icon: FileText,
    user: "Emily Rodriguez",
    userId: "USR-004",
    details: "New trial ONCO-2024-005 created",
    timestamp: "2024-03-15 09:15:42 AM",
    status: "Success",
    ip: "192.168.1.102",
  },
  {
    id: "AUD-004",
    action: "Patient Added",
    icon: Users,
    user: "Dr. James Wilson",
    userId: "USR-005",
    details: "Patient PAT-156 enrolled in CARDIO-2024-001",
    timestamp: "2024-03-15 09:00:11 AM",
    status: "Success",
    ip: "192.168.1.103",
  },
  {
    id: "AUD-005",
    action: "Visit Schedule Updated",
    icon: Calendar,
    user: "Dr. Sarah Johnson",
    userId: "USR-001",
    details: "Visit 5 procedures modified for CARDIO-2024-001",
    timestamp: "2024-03-15 08:45:30 AM",
    status: "Success",
    ip: "192.168.1.100",
  },
  {
    id: "AUD-006",
    action: "User Suspended",
    icon: Shield,
    user: "Platform Admin",
    userId: "ADMIN-001",
    details: "User USR-010 suspended due to suspicious activity",
    timestamp: "2024-03-15 08:30:00 AM",
    status: "Success",
    ip: "10.0.0.1",
  },
  {
    id: "AUD-007",
    action: "Login Failed",
    icon: LogIn,
    user: "Unknown",
    userId: "N/A",
    details: "Failed login attempt for account m.chen@pharma.com",
    timestamp: "2024-03-15 08:15:22 AM",
    status: "Failed",
    ip: "203.45.67.89",
  },
  {
    id: "AUD-008",
    action: "Notification Sent",
    icon: Bell,
    user: "System",
    userId: "SYSTEM",
    details: "Batch visit reminders sent to 245 patients",
    timestamp: "2024-03-15 08:00:00 AM",
    status: "Success",
    ip: "10.0.0.1",
  },
  {
    id: "AUD-009",
    action: "User Logout",
    icon: LogOut,
    user: "Emily Rodriguez",
    userId: "USR-004",
    details: "Manual logout",
    timestamp: "2024-03-14 06:30:45 PM",
    status: "Success",
    ip: "192.168.1.102",
  },
  {
    id: "AUD-010",
    action: "Trial Shared",
    icon: FileText,
    user: "Michael Chen",
    userId: "USR-002",
    details: "Trial CARDIO-2024-001 shared with Site: City General Hospital",
    timestamp: "2024-03-14 05:15:30 PM",
    status: "Success",
    ip: "192.168.1.101",
  },
];

export function AuditLogScreen({ onBack }: AuditLogScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter);
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const getActionColor = (action: string) => {
    if (action.includes("Login") || action.includes("Logout")) return "bg-blue-100 text-blue-700";
    if (action.includes("Created") || action.includes("Added")) return "bg-green-100 text-green-700";
    if (action.includes("Updated") || action.includes("Shared")) return "bg-amber-100 text-amber-700";
    if (action.includes("Suspended") || action.includes("Failed")) return "bg-red-100 text-red-700";
    if (action.includes("Notification")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white p-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-lg font-semibold">Audit Logs</h1>
              <p className="text-xs text-blue-200">System activity trail</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 bg-white border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Login">Login</SelectItem>
              <SelectItem value="Logout">Logout</SelectItem>
              <SelectItem value="Password">Password</SelectItem>
              <SelectItem value="Trial">Trial</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
              <SelectItem value="Visit">Visit</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${getActionColor(
                    log.action
                  )}`}
                >
                  <log.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`text-xs ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        log.status === "Success"
                          ? "border-green-500 text-green-700"
                          : "border-red-500 text-red-700"
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{log.details}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{log.user}</span>
                      {log.userId !== "N/A" && (
                        <span className="text-gray-300">({log.userId})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
