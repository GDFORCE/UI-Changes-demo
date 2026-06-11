"use client";

import { useState } from "react";
import { toast } from "sonner";
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
    message: "Your next is Visit No. 3 Follow-Up Visit at Apollo Hospital Mumbai, Maharashtra as scheduled on 16 Mar 2024, 14-18 Mar 2024",
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
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-warning" />;
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
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">Notification delivery</h1>
          <p className="text-sm text-muted-foreground">Delivery metadata only · message content &amp; patient identity are protected.</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("Notification settings")}>
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
      </div>

      {/* Summary tiles (ADM-07 Section 1) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-2xl font-bold text-success leading-none">{stats.delivered.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">Sent (7 days)</div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-2xl font-bold text-destructive leading-none">{stats.failed}</div>
          <div className="text-xs text-muted-foreground mt-2">Failed</div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-2xl font-bold text-warning leading-none">{stats.pending}</div>
          <div className="text-xs text-muted-foreground mt-2">Pending</div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-2xl font-bold text-primary leading-none">
            {Math.round((stats.delivered / stats.totalToday) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">Delivery rate</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border rounded-lg h-auto p-1">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="history" className="text-sm">Delivery log</TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-0">
          {/* Delivery Stats */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">Delivery Status</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.delivered}</span>
                    <div className="w-20 bg-border rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${(stats.delivered / stats.totalToday) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.pending}</span>
                    <div className="w-20 bg-border rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: `${(stats.pending / stats.totalToday) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.failed}</span>
                    <div className="w-20 bg-border rounded-full h-2">
                      <div
                        className="bg-destructive h-2 rounded-full"
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
                <div className="text-center p-2 bg-info/5 rounded-lg">
                  <Smartphone className="h-5 w-5 text-info mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.push}</div>
                  <div className="text-xs text-muted-foreground">Push</div>
                </div>
                <div className="text-center p-2 bg-success/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-success mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.sms}</div>
                  <div className="text-xs text-muted-foreground">SMS</div>
                </div>
                <div className="text-center p-2 bg-violet/5 rounded-lg">
                  <Mail className="h-5 w-5 text-violet mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats.email}</div>
                  <div className="text-xs text-muted-foreground">Email</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failed Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium text-destructive">Failed Notifications</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {notifications
                .filter((n) => n.status === "Failed")
                .map((notif) => (
                  <div key={notif.id} className="p-2 bg-destructive/5 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{notif.recipient}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => toast.success(`Retry queued for ${notif.recipient}`)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                    <p className="text-xs text-destructive mt-1">Error: {notif.error}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-0">
          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Search by recipient role or trigger event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-10 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-[130px] h-10 text-sm">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All channels</SelectItem>
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery log table (ADM-07 Section 3) */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Recipient role</th>
                    <th className="px-4 py-3 font-medium">Trigger event</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredNotifications.map((notif) => (
                    <tr key={notif.id} className="hover:bg-surface/70">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{notif.recipientType}</Badge>
                      </td>
                      <td className="px-4 py-3 max-w-[320px]">
                        <div className="font-medium text-foreground">{notif.type}</div>
                        {notif.status === "Failed" && (
                          <div className="text-xs text-destructive">Error: {notif.error}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          {getChannelIcon(notif.channel)} {notif.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{notif.sentAt}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(notif.status)}
                          <span className="text-xs text-muted-foreground">{notif.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {(notif.status === "Failed" || notif.status === "Pending") ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => toast.success(`Retry queued for ${notif.recipientType}`)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
                          </Button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredNotifications.length === 0 && (
              <p className="text-center text-sm text-muted-foreground/70 py-10">No notifications match the current filters.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-0">
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
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Badge className="bg-success/15 text-success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">SMS Notifications</span>
                </div>
                <Badge className="bg-success/15 text-success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Badge className="bg-success/15 text-success">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
