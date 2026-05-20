"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Search,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Filter,
} from "lucide-react";

interface NotificationMonitoringScreenProps {
  onBack?: () => void;
}

const notifications = [
  {
    id: "NOT-001",
    type: "Visit Reminder",
    channel: "Push",
    recipient: "A*** K***",
    recipientType: "Patient",
    message: "Your Visit 3 is scheduled for tomorrow at 10:00 AM",
    status: "Delivered",
    sentAt: "2024-03-15 08:00 AM",
    deliveredAt: "2024-03-15 08:00 AM",
  },
  {
    id: "NOT-002",
    type: "Medication Reminder",
    channel: "SMS",
    recipient: "D*** Y***",
    recipientType: "Patient",
    message: "Time to take your morning medication",
    status: "Delivered",
    sentAt: "2024-03-15 07:30 AM",
    deliveredAt: "2024-03-15 07:30 AM",
  },
  {
    id: "NOT-003",
    type: "Trial Sharing",
    channel: "Email",
    recipient: "Dr. Sarah Johnson",
    recipientType: "PI",
    message: "New trial CARDIO-2024-001 has been shared with you",
    status: "Failed",
    sentAt: "2024-03-15 09:15 AM",
    error: "Invalid email address",
  },
  {
    id: "NOT-004",
    type: "System Alert",
    channel: "Push",
    recipient: "Michael Chen",
    recipientType: "Sponsor",
    message: "Protocol deviation reported at Site 12",
    status: "Pending",
    sentAt: "2024-03-15 10:00 AM",
  },
  {
    id: "NOT-005",
    type: "Visit Reminder",
    channel: "SMS",
    recipient: "R*** P***",
    recipientType: "Patient",
    message: "Reminder: Please fast for 12 hours before your visit",
    status: "Delivered",
    sentAt: "2024-03-14 06:00 PM",
    deliveredAt: "2024-03-14 06:00 PM",
  },
];

const stats = {
  totalToday: 1847,
  delivered: 1789,
  failed: 23,
  pending: 35,
  push: 892,
  sms: 645,
  email: 310,
};

export function NotificationMonitoringScreen({ onBack }: NotificationMonitoringScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || notif.status === statusFilter;
    const matchesChannel = channelFilter === "all" || notif.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Push":
        return <Smartphone className="h-4 w-4" />;
      case "SMS":
        return <MessageSquare className="h-4 w-4" />;
      case "Email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
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
              <h1 className="text-lg font-semibold">Notifications</h1>
              <p className="text-xs text-blue-200">Monitoring & Configuration</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-3 pt-2 bg-white border-b rounded-none h-auto">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-y-auto p-3 space-y-3 mt-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-[#1A3872]">{stats.totalToday.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Sent Today</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">Delivery Status</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.delivered}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(stats.delivered / stats.totalToday) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.pending}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(stats.pending / stats.totalToday) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.failed}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(stats.failed / stats.totalToday) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">By Channel</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <Smartphone className="h-5 w-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.push}</div>
                  <div className="text-xs text-gray-500">Push</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.sms}</div>
                  <div className="text-xs text-gray-500">SMS</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.email}</div>
                  <div className="text-xs text-gray-500">Email</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failed Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium text-red-600">Failed Notifications</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {notifications
                .filter((n) => n.status === "Failed")
                .map((notif) => (
                  <div key={notif.id} className="p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{notif.recipient}</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{notif.message}</p>
                    <p className="text-xs text-red-500 mt-1">Error: {notif.error}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="flex-1 flex flex-col mt-0">
          {/* Filters */}
          <div className="p-3 bg-white border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotifications.map((notif) => (
              <Card key={notif.id} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getChannelIcon(notif.channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{notif.recipient}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {notif.recipientType}
                          </Badge>
                        </div>
                        {getStatusIcon(notif.status)}
                      </div>
                      <p className="text-xs text-gray-600 truncate">{notif.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {notif.type}
                        </Badge>
                        <span className="text-xs text-gray-400">{notif.sentAt}</span>
                      </div>
                      {notif.status === "Failed" && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-red-500">Error: {notif.error}</span>
                          <Button size="sm" variant="ghost" className="h-6 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 overflow-y-auto p-3 space-y-3 mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">Reminder Timing</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Visit Reminder (Before)</span>
                <Select defaultValue="24">
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medication Reminder</span>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 mins</SelectItem>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">Channel Settings</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Badge className="bg-green-100 text-green-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">SMS Notifications</span>
                </div>
                <Badge className="bg-green-100 text-green-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Badge className="bg-green-100 text-green-700">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
