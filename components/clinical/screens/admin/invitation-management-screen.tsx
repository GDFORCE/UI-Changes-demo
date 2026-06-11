"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Mail,
  MoreVertical,
  Send,
  XCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  User,
  Building2,
  Phone,
  Calendar,
} from "lucide-react";

interface InvitationManagementScreenProps {
  onBack?: () => void;
}

const invitations = [
  {
    id: "INV-001",
    name: "Dr. Robert Miller",
    designation: "Principal Investigator",
    email: "r.miller@hospital.org",
    phone: "+1 555-0111",
    entityType: "Site",
    organization: "Metro Health Center",
    address: "456 Health Ave, Miami, FL 33101",
    role: "PI",
    status: "Sent",
    sentAt: "2024-03-15 09:00 AM",
    expiresAt: "2024-03-22 09:00 AM",
  },
  {
    id: "INV-002",
    name: "Jennifer Lee",
    designation: "Clinical Operations Director",
    email: "j.lee@pharma.com",
    phone: "+1 555-0222",
    entityType: "Sponsor",
    organization: "BioGen Labs",
    address: "789 Pharma Blvd, Boston, MA 02101",
    role: "Admin",
    status: "Accepted",
    sentAt: "2024-03-10 02:30 PM",
    acceptedAt: "2024-03-11 10:15 AM",
  },
  {
    id: "INV-003",
    name: "David Park",
    designation: "Research Coordinator",
    email: "d.park@research.org",
    phone: "+1 555-0333",
    entityType: "Site",
    organization: "University Research Hospital",
    address: "123 Research Dr, Chicago, IL 60601",
    role: "Coordinator",
    status: "Expired",
    sentAt: "2024-02-20 11:00 AM",
    expiresAt: "2024-02-27 11:00 AM",
  },
  {
    id: "INV-004",
    name: "Maria Garcia",
    designation: "Project Manager",
    email: "m.garcia@cro.com",
    phone: "+1 555-0444",
    entityType: "CRO",
    organization: "Clinical Trials Inc",
    address: "321 Trial St, San Diego, CA 92101",
    role: "Project Manager",
    status: "Sent",
    sentAt: "2024-03-14 04:00 PM",
    expiresAt: "2024-03-21 04:00 PM",
  },
  {
    id: "INV-005",
    name: "Thomas Brown",
    designation: "Site Manager",
    email: "t.brown@smo.com",
    phone: "+1 555-0555",
    entityType: "SMO",
    organization: "HealthSite Management",
    address: "567 Site Ave, Houston, TX 77001",
    role: "Site Manager",
    status: "Cancelled",
    sentAt: "2024-03-12 01:30 PM",
    cancelledAt: "2024-03-13 09:00 AM",
  },
];

export function InvitationManagementScreen({ onBack }: InvitationManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesEntity = entityFilter === "all" || inv.entityType === entityFilter;
    return matchesSearch && matchesStatus && matchesEntity;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sent":
        return <Clock className="h-4 w-4 text-info" />;
      case "Accepted":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Expired":
        return <Clock className="h-4 w-4 text-muted-foreground/70" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-info/10 text-info";
      case "Accepted":
        return "bg-success/15 text-success";
      case "Expired":
        return "bg-muted text-muted-foreground";
      case "Cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  const pendingCount = invitations.filter((i) => i.status === "Sent").length;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">User invitations</h1>
        <p className="text-sm text-muted-foreground">{pendingCount} pending · track sent, accepted, expired and cancelled invites.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search by name, email, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[140px] h-10 text-sm">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Sponsor">Sponsor</SelectItem>
              <SelectItem value="CRO">CRO</SelectItem>
              <SelectItem value="SMO">SMO</SelectItem>
              <SelectItem value="Site">Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invitation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredInvitations.map((inv) => (
          <Card key={inv.id} className="border border-border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(inv.status)}
                  <Badge className={`text-xs ${getStatusColor(inv.status)}`}>
                    {inv.status}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(inv.status === "Sent" || inv.status === "Expired") && (
                      <DropdownMenuItem
                        onClick={() => toast.success(`Invitation resent to ${inv.email}`)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Invitation
                      </DropdownMenuItem>
                    )}
                    {inv.status === "Sent" && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => toast.success(`Invitation to ${inv.email} cancelled`)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Invitation
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{inv.name}</h3>
                  <p className="text-xs text-muted-foreground">{inv.designation}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {inv.role}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{inv.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{inv.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3 w-3" />
                  <span>{inv.organization}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {inv.entityType}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t flex items-center justify-between text-xs text-muted-foreground/70">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Sent: {inv.sentAt}</span>
                </div>
                {inv.status === "Sent" && inv.expiresAt && (
                  <span className="text-warning">Expires: {inv.expiresAt.split(" ")[0]}</span>
                )}
                {inv.status === "Accepted" && inv.acceptedAt && (
                  <span className="text-success">Accepted: {inv.acceptedAt}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
