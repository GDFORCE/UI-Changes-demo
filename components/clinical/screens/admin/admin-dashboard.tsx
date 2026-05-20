"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Users,
  Building2,
  FileText,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Filter,
  TrendingUp,
  Activity,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

interface AdminDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [orgType, setOrgType] = useState("all");

  const stats = {
    totalUsers: 2847,
    sponsors: 45,
    cros: 38,
    pis: 156,
    researchTeam: 423,
    patients: 2185,
    totalOrganizations: 89,
    sponsorOrgs: 12,
    croOrgs: 8,
    smoOrgs: 15,
    siteOrgs: 54,
    totalTrials: 127,
    activeTrials: 89,
    completedTrials: 31,
    terminatedTrials: 7,
    notificationsSentToday: 1847,
    failedNotifications: 23,
    pendingSupport: 12,
    pendingActivities: 8,
    storageUsed: 67,
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Platform Admin</h1>
            <p className="text-xs text-blue-200">Dashboard Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => onNavigate?.("admin-support")}
            >
              <HelpCircle className="h-5 w-5" />
              <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5">
                {stats.pendingSupport}
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 bg-white border-b flex gap-2 overflow-x-auto">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        <Select value={orgType} onValueChange={setOrgType}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            <SelectItem value="sponsor">Sponsors</SelectItem>
            <SelectItem value="cro">CROs</SelectItem>
            <SelectItem value="smo">SMOs</SelectItem>
            <SelectItem value="site">Sites</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Filter className="h-3 w-3 mr-1" />
          More
        </Button>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* User Statistics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2563EB]" />
              Registered Users
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-2xl font-bold text-[#1A3872] mb-3">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-[#1A3872]">{stats.sponsors}</div>
                <div className="text-xs text-gray-500">Sponsors</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-[#1A3872]">{stats.cros}</div>
                <div className="text-xs text-gray-500">CROs</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-[#1A3872]">{stats.pis}</div>
                <div className="text-xs text-gray-500">PIs</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold text-[#0D9488]">{stats.researchTeam}</div>
                <div className="text-xs text-gray-500">Research Team</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-2 text-center col-span-2">
                <div className="text-lg font-semibold text-[#0D9488]">{stats.patients.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Patients</div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 text-xs text-[#2563EB]"
              onClick={() => onNavigate?.("admin-users")}
            >
              View All Users
            </Button>
          </CardContent>
        </Card>

        {/* Organizations */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#2563EB]" />
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-2xl font-bold text-[#1A3872] mb-3">
              {stats.totalOrganizations}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-base font-semibold">{stats.sponsorOrgs}</div>
                <div className="text-xs text-gray-500">Sponsors</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold">{stats.croOrgs}</div>
                <div className="text-xs text-gray-500">CROs</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold">{stats.smoOrgs}</div>
                <div className="text-xs text-gray-500">SMOs</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold">{stats.siteOrgs}</div>
                <div className="text-xs text-gray-500">Sites</div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 text-xs text-[#2563EB]"
              onClick={() => onNavigate?.("admin-organizations")}
            >
              Manage Organizations
            </Button>
          </CardContent>
        </Card>

        {/* Trials */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#2563EB]" />
              Clinical Trials
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-2xl font-bold text-[#1A3872] mb-3">
              {stats.totalTrials}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Active</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.activeTrials}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {stats.completedTrials}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Terminated/Suspended</span>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {stats.terminatedTrials}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 text-xs text-[#2563EB]"
              onClick={() => onNavigate?.("admin-trials")}
            >
              Monitor Trials
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#2563EB]" />
              Notifications Today
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-bold text-[#1A3872]">
                  {stats.notificationsSentToday.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Sent Today</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-red-500">{stats.failedNotifications}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full text-xs text-[#2563EB]"
              onClick={() => onNavigate?.("admin-notifications")}
            >
              View Notification Status
            </Button>
          </CardContent>
        </Card>

        {/* Support & Storage */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium">Pending Support</span>
              </div>
              <div className="text-xl font-bold text-[#1A3872]">{stats.pendingSupport}</div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-[#2563EB] h-7"
                onClick={() => onNavigate?.("admin-support")}
              >
                View Tickets
              </Button>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-[#2563EB]" />
                <span className="text-xs font-medium">Storage Used</span>
              </div>
              <div className="text-xl font-bold text-[#1A3872]">{stats.storageUsed}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-[#2563EB] h-2 rounded-full"
                  style={{ width: `${stats.storageUsed}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => onNavigate?.("admin-invitations")}
              >
                <Users className="h-5 w-5 text-[#2563EB]" />
                <span className="text-xs">Invitations</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => onNavigate?.("admin-audit")}
              >
                <FileText className="h-5 w-5 text-[#2563EB]" />
                <span className="text-xs">Audit Logs</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => onNavigate?.("admin-terms")}
              >
                <FileText className="h-5 w-5 text-[#2563EB]" />
                <span className="text-xs">Terms & Policy</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => onNavigate?.("admin-reports")}
              >
                <TrendingUp className="h-5 w-5 text-[#2563EB]" />
                <span className="text-xs">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
