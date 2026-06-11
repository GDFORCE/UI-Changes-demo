"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Send,
  Filter,
} from "lucide-react";

interface SupportTicketScreenProps {
  onBack?: () => void;
}

const tickets = [
  {
    id: "TKT-001",
    user: "Dr. Sarah Johnson",
    userType: "PI",
    category: "Login Issues",
    subject: "Cannot reset password",
    description: "I tried to reset my password but never received the email. Please help.",
    status: "Open",
    priority: "High",
    createdAt: "2024-03-15 09:30 AM",
    updatedAt: "2024-03-15 09:30 AM",
    notes: [],
  },
  {
    id: "TKT-002",
    user: "Michael Chen",
    userType: "Sponsor",
    category: "Notification Issues",
    subject: "Not receiving push notifications",
    description: "I have enabled notifications but am not receiving any push alerts on my device.",
    status: "In Progress",
    priority: "Medium",
    createdAt: "2024-03-14 02:15 PM",
    updatedAt: "2024-03-15 10:00 AM",
    notes: [
      { by: "Admin", at: "2024-03-15 10:00 AM", text: "Checking notification settings" },
    ],
  },
  {
    id: "TKT-003",
    user: "A*** K***",
    userType: "Patient",
    category: "Trial Access",
    subject: "Cannot see my trial schedule",
    description: "After logging in, my trial schedule page is empty. I should have Visit 3 coming up.",
    status: "Open",
    priority: "High",
    createdAt: "2024-03-15 08:45 AM",
    updatedAt: "2024-03-15 08:45 AM",
    notes: [],
  },
  {
    id: "TKT-004",
    user: "Emily Rodriguez",
    userType: "CRO",
    category: "Technical Issues",
    subject: "App crashes when uploading documents",
    description: "Every time I try to upload a PDF document, the app crashes and closes.",
    status: "Resolved",
    priority: "Medium",
    createdAt: "2024-03-13 11:20 AM",
    updatedAt: "2024-03-14 03:30 PM",
    notes: [
      { by: "Admin", at: "2024-03-13 02:00 PM", text: "Identified issue with large file uploads" },
      { by: "Admin", at: "2024-03-14 03:30 PM", text: "Fixed in app version 2.1.5. Please update." },
    ],
  },
  {
    id: "TKT-005",
    user: "James Wilson",
    userType: "Coordinator",
    category: "Account Recovery",
    subject: "Locked out of account",
    description: "My account got locked after multiple login attempts. Need to unlock it.",
    status: "Closed",
    priority: "Low",
    createdAt: "2024-03-12 04:00 PM",
    updatedAt: "2024-03-12 05:15 PM",
    notes: [
      { by: "Admin", at: "2024-03-12 05:15 PM", text: "Account unlocked. User can login now." },
    ],
  },
];

export function SupportTicketScreen({ onBack }: SupportTicketScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-destructive/10 text-destructive";
      case "In Progress":
        return "bg-warning/15 text-warning";
      case "Resolved":
        return "bg-success/15 text-success";
      case "Closed":
        return "bg-muted text-foreground/80";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-500 text-destructive";
      case "Medium":
        return "border-amber-500 text-warning";
      case "Low":
        return "border-gray-400 text-muted-foreground";
      default:
        return "border-gray-400 text-muted-foreground";
    }
  };

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;

  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const tiles = [
    { label: "Open", value: openCount, accent: "text-destructive" },
    { label: "In progress", value: inProgressCount, accent: "text-warning" },
    { label: "Resolved this week", value: resolvedCount, accent: "text-success" },
    { label: "Total this month", value: tickets.length, accent: "text-primary" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Issue tracker</h1>
        <p className="text-sm text-muted-foreground">Receive, track, action and close all user-reported issues.</p>
      </div>

      {/* Summary tiles (ADM-10 Section 1) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-card border border-border p-4">
            <div className={`text-2xl font-bold leading-none ${t.accent}`}>{t.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search by ticket ID, user, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`cursor-pointer h-9 px-3 ${statusFilter === "Open" ? "bg-destructive/5 border-red-500" : ""}`}
            onClick={() => setStatusFilter(statusFilter === "Open" ? "all" : "Open")}
          >
            <AlertCircle className="h-3 w-3 mr-1 text-destructive" /> Open ({openCount})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer h-9 px-3 ${statusFilter === "In Progress" ? "bg-warning/10 border-amber-500" : ""}`}
            onClick={() => setStatusFilter(statusFilter === "In Progress" ? "all" : "In Progress")}
          >
            <Clock className="h-3 w-3 mr-1 text-warning" /> In progress ({inProgressCount})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer h-9 px-3 ${statusFilter === "Resolved" ? "bg-success/10 border-green-500" : ""}`}
            onClick={() => setStatusFilter(statusFilter === "Resolved" ? "all" : "Resolved")}
          >
            <CheckCircle className="h-3 w-3 mr-1 text-success" /> Resolved
          </Badge>
        </div>
      </div>

      {/* Ticket tracker table (ADM-10 Section 3) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Reported by</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Raised</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-surface/70">
                  <td className="px-4 py-3 max-w-[300px]">
                    <div className="font-medium text-foreground">{ticket.subject}</div>
                    <div className="text-xs text-muted-foreground truncate">{ticket.id} · {ticket.category}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground/70" /> {ticket.user}
                    </div>
                    <Badge variant="outline" className="text-[10px] mt-0.5">{ticket.userType}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>{ticket.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ticket.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedTicket(ticket)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && (
          <p className="text-center text-sm text-muted-foreground/70 py-10">No tickets match the current filters.</p>
        )}
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Ticket Details</span>
              <Badge className={selectedTicket ? getStatusColor(selectedTicket.status) : ""}>
                {selectedTicket?.status}
              </Badge>
            </SheetTitle>
          </SheetHeader>
          {selectedTicket && (
            <div className="mt-4 flex flex-col h-[calc(100%-60px)]">
              <div className="space-y-4 flex-1 overflow-y-auto">
                {/* Ticket Info */}
                <div className="p-3 bg-surface rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{selectedTicket.id}</span>
                    <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority} Priority
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground/70" />
                    <span>{selectedTicket.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedTicket.userType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{selectedTicket.category}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Activity */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Activity</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground p-2 bg-surface rounded">
                      <span className="font-medium">{selectedTicket.user}</span> created ticket
                      <span className="float-right">{selectedTicket.createdAt}</span>
                    </div>
                    {selectedTicket.notes.map((note, idx) => (
                      <div key={idx} className="text-xs p-2 bg-info/5 rounded">
                        <span className="font-medium text-primary">{note.by}</span>: {note.text}
                        <span className="float-right text-muted-foreground">{note.at}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              {selectedTicket.status !== "Closed" && (
                <div className="pt-3 border-t space-y-3">
                  <Textarea
                    placeholder="Add a response or note..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Select defaultValue={selectedTicket.status}>
                      <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      className="flex-1 bg-primary"
                      disabled={!replyText.trim()}
                      onClick={() => {
                        toast.success(`Response sent for ${selectedTicket.id}`);
                        setReplyText("");
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
