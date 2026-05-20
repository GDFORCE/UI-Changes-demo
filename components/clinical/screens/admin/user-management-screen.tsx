"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Key,
  Shield,
  Eye,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
} from "lucide-react";

interface UserManagementScreenProps {
  onBack?: () => void;
}

const users = [
  {
    id: "USR-001",
    name: "Dr. Sarah Johnson",
    email: "sarah.j@hospital.com",
    phone: "+1 555-0123",
    photo: null,
    organization: "City General Hospital",
    orgType: "Site",
    role: "Principal Investigator",
    registrationDate: "2024-01-15",
    lastLogin: "2024-03-15 09:45 AM",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Michael Chen",
    email: "m.chen@pharma.com",
    phone: "+1 555-0456",
    photo: null,
    organization: "PharmaCorp Inc",
    orgType: "Sponsor",
    role: "Clinical Operations Manager",
    registrationDate: "2024-02-01",
    lastLogin: "2024-03-14 02:30 PM",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "A*** K***",
    email: "a***@gmail.com",
    phone: "******4582",
    photo: null,
    organization: "Trial: CARDIO-2024",
    orgType: "Patient",
    role: "Patient",
    registrationDate: "2024-02-20",
    lastLogin: "2024-03-13 11:00 AM",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Emily Rodriguez",
    email: "e.rodriguez@cro.com",
    phone: "+1 555-0789",
    photo: null,
    organization: "Global CRO Partners",
    orgType: "CRO",
    role: "Project Manager",
    registrationDate: "2024-01-25",
    lastLogin: "2024-03-10 04:15 PM",
    status: "Pending Verification",
  },
  {
    id: "USR-005",
    name: "James Wilson",
    email: "j.wilson@site.com",
    phone: "+1 555-0321",
    photo: null,
    organization: "Research Medical Center",
    orgType: "Site",
    role: "Research Coordinator",
    registrationDate: "2024-03-01",
    lastLogin: "Never",
    status: "Suspended",
  },
];

export function UserManagementScreen({ onBack }: UserManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrgType = orgTypeFilter === "all" || user.orgType === orgTypeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesOrgType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending Verification":
        return "bg-amber-100 text-amber-700";
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
            <h1 className="text-lg font-semibold">User Management</h1>
            <p className="text-xs text-blue-200">{users.length} total users</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3 bg-white border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Select value={orgTypeFilter} onValueChange={setOrgTypeFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Org Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sponsor">Sponsor</SelectItem>
              <SelectItem value="CRO">CRO</SelectItem>
              <SelectItem value="SMO">SMO</SelectItem>
              <SelectItem value="Site">Site</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending Verification">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photo || undefined} />
                  <AvatarFallback className="bg-[#DBEAFE] text-[#1A3872] text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {user.status === "Active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : user.status === "Suspended" ? (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem>
                          <Key className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Force Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{user.organization}</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {user.orgType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Last login: {user.lastLogin}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Detail Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-[#DBEAFE] text-[#1A3872] text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.role}</p>
                  <Badge className={`mt-1 ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Organization</p>
                    <p className="text-sm">{selectedUser.organization}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {selectedUser.orgType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Registration Date</p>
                    <p className="text-sm">{selectedUser.registrationDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm">{selectedUser.lastLogin}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                {selectedUser.status === "Active" ? (
                  <Button variant="destructive" className="w-full">
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
