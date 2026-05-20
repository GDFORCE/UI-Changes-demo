"use client";

import { useState } from "react";
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
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-amber-100 text-amber-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-500 text-red-700";
      case "Medium":
        return "border-amber-500 text-amber-700";
      case "Low":
        return "border-gray-400 text-gray-600";
      default:
        return "border-gray-400 text-gray-600";
    }
  };

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;

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
            <h1 className="text-lg font-semibold">Support Tickets</h1>
            <p className="text-xs text-blue-200">
              {openCount} open, {inProgressCount} in progress
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-3 bg-white border-b flex gap-2">
        <Badge
          variant="outline"
          className={`cursor-pointer ${
            statusFilter === "Open" ? "bg-red-50 border-red-500" : ""
          }`}
          onClick={() => setStatusFilter(statusFilter === "Open" ? "all" : "Open")}
        >
          <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
          Open ({openCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer ${
            statusFilter === "In Progress" ? "bg-amber-50 border-amber-500" : ""
          }`}
          onClick={() => setStatusFilter(statusFilter === "In Progress" ? "all" : "In Progress")}
        >
          <Clock className="h-3 w-3 mr-1 text-amber-500" />
          In Progress ({inProgressCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer ${
            statusFilter === "Resolved" ? "bg-green-50 border-green-500" : ""
          }`}
          onClick={() => setStatusFilter(statusFilter === "Resolved" ? "all" : "Resolved")}
        >
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          Resolved
        </Badge>
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTicket(ticket)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">{ticket.id}</span>
              </div>
              <h3 className="font-medium text-sm mb-1">{ticket.subject}</h3>
              <p className="text-xs text-gray-500 truncate mb-2">{ticket.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{ticket.user}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0 ml-1">
                    {ticket.userType}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{ticket.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
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
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{selectedTicket.id}</span>
                    <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority} Priority
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{selectedTicket.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedTicket.userType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{selectedTicket.category}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Activity */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Activity</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                      <span className="font-medium">{selectedTicket.user}</span> created ticket
                      <span className="float-right">{selectedTicket.createdAt}</span>
                    </div>
                    {selectedTicket.notes.map((note, idx) => (
                      <div key={idx} className="text-xs p-2 bg-blue-50 rounded">
                        <span className="font-medium text-[#1A3872]">{note.by}</span>: {note.text}
                        <span className="float-right text-gray-500">{note.at}</span>
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
                    <Button className="flex-1 bg-[#1A3872]">
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
