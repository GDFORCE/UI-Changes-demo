"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  UserPlus,
  Key,
  Shield,
  Eye,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Download,
} from "lucide-react";

interface UserManagementScreenProps {
  onBack?: () => void;
  initialFilter?: string;
}

interface LockInfo {
  lockedAt: string;
  failedAttempts: number;
  lastIp: string;
  device: string;
  repeatedIp: boolean;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  organization: string;
  orgType: string;
  role: string;
  registrationDate: string;
  lastLogin: string;
  status: string;
  lockInfo?: LockInfo;
}

const users: UserRecord[] = [
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
  {
    id: "USR-006",
    name: "Mark Johnson",
    email: "mark.j@trialpharma.com",
    phone: "+1 555-0654",
    photo: null,
    organization: "TrialPharma",
    orgType: "Sponsor",
    role: "Sponsor Representative",
    registrationDate: "2024-02-18",
    lastLogin: "2024-06-05 12:04 PM",
    status: "Locked",
    lockInfo: {
      lockedAt: "05-Jun-2026 12:04 IST",
      failedAttempts: 5,
      lastIp: "192.168.4.21",
      device: "Chrome · Windows 11",
      repeatedIp: true,
    },
  },
];

export function UserManagementScreen({ onBack, initialFilter }: UserManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState(initialFilter || "all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const emptyForm = { name: "", email: "", phone: "", entity: "Sponsor", designation: "", org: "", sendInvite: true };
  const [form, setForm] = useState(emptyForm);

  const canAdd = form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
  const handleAddUser = () => {
    if (!canAdd) {
      toast.error("Valid name and email are required");
      return;
    }
    setUserList((prev) => [
      {
        id: `USR-${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name,
        email: form.email,
        phone: form.phone || "—",
        photo: null,
        organization: form.org || "—",
        orgType: form.entity,
        role: form.designation || "—",
        registrationDate: new Date().toISOString().slice(0, 10),
        lastLogin: "Never",
        status: "Pending Verification",
      },
      ...prev,
    ]);
    toast.success(`${form.name} added${form.sendInvite ? " · invite sent" : ""}`);
    setForm(emptyForm);
    setAddOpen(false);
  };

  // ── ADM-02-F4 Unlock Account workflow ────────────────────────────
  const [unlockUser, setUnlockUser] = useState<UserRecord | null>(null);
  const [checks, setChecks] = useState({ email: false, orgId: false, ticket: false });
  const [unlockReason, setUnlockReason] = useState("");
  const [forceReset, setForceReset] = useState(true);
  const checkedCount = [checks.email, checks.orgId, checks.ticket].filter(Boolean).length;
  const canUnlock = checkedCount >= 2 && unlockReason.trim().length >= 10;

  const openUnlock = (u: UserRecord) => {
    setUnlockUser(u);
    setChecks({ email: false, orgId: false, ticket: false });
    setUnlockReason("");
    setForceReset(true);
  };

  const handleConfirmUnlock = () => {
    if (!unlockUser || !canUnlock) return;
    changeStatus(unlockUser.id, "Active");
    toast.success(`${unlockUser.name} unlocked${forceReset ? " · password reset required" : ""}`);
    setUnlockUser(null);
    setSelectedUser(null);
  };

  // ── ADM-02 Section 2 summary tiles ───────────────────────────────
  const tiles = [
    { label: "Total users", value: userList.length },
    { label: "Sponsors", value: userList.filter((u) => u.orgType === "Sponsor").length },
    { label: "CROs", value: userList.filter((u) => u.orgType === "CRO").length },
    { label: "PIs", value: userList.filter((u) => u.role.includes("Investigator")).length },
    { label: "Research Team", value: userList.filter((u) => u.role.includes("Coordinator") || u.role.includes("Research")).length },
    { label: "Locked", value: userList.filter((u) => u.status === "Locked").length },
  ];

  const changeStatus = (id: string, status: string) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const resetPasswordFor = (u: UserRecord) => toast.success(`Password reset link sent to ${u.email}`);
  const suspendUser = (u: UserRecord) => {
    changeStatus(u.id, "Suspended");
    toast.success(`${u.name} suspended`);
  };
  const activateUser = (u: UserRecord) => {
    changeStatus(u.id, "Active");
    toast.success(`${u.name} activated`);
  };
  const forceLogout = (u: UserRecord) => toast.success(`${u.name} signed out of all sessions`);

  const filteredUsers = userList.filter((user) => {
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
        return "bg-success/15 text-success";
      case "Pending Verification":
        return "bg-warning/15 text-warning";
      case "Suspended":
        return "bg-destructive/10 text-destructive";
      case "Locked":
        return "bg-warning/15 text-warning";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">All registered users</h1>
          <p className="text-sm text-muted-foreground">
            Manage accounts, roles, status and entity assignments. Patient records are pseudonymized.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success("Filtered user list exported (CSV)")}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" /> Add user
          </Button>
        </div>
      </div>

      {/* Summary tiles (ADM-02 Section 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-card border border-border p-4">
            <div className="text-2xl font-bold text-primary leading-none">{t.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search by name, email, phone, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={orgTypeFilter} onValueChange={setOrgTypeFilter}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="Entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              <SelectItem value="Sponsor">Sponsor</SelectItem>
              <SelectItem value="CRO">CRO</SelectItem>
              <SelectItem value="SMO">SMO</SelectItem>
              <SelectItem value="Site">Site</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending Verification">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Locked">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User table (ADM-02 Section 4) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email / contact</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium">Last login</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photo || undefined} />
                        <AvatarFallback className="bg-secondary text-primary text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{user.orgType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.orgType === "Patient" ? <span className="text-muted-foreground/70">—</span> : user.organization}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.registrationDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${getStatusColor(user.status)}`}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUser(user)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.status === "Locked" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-orange-300 text-warning hover:bg-warning/10"
                          onClick={() => openUnlock(user)}
                        >
                          <Key className="h-3.5 w-3.5 mr-1" /> Unlock
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" /> View details
                          </DropdownMenuItem>
                          {user.status === "Active" ? (
                            <DropdownMenuItem className="text-destructive" onClick={() => suspendUser(user)}>
                              <UserX className="h-4 w-4 mr-2" /> Suspend user
                            </DropdownMenuItem>
                          ) : user.status === "Suspended" ? (
                            <DropdownMenuItem className="text-success" onClick={() => activateUser(user)}>
                              <UserCheck className="h-4 w-4 mr-2" /> Activate user
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => resetPasswordFor(user)}>
                            <Key className="h-4 w-4 mr-2" /> Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => forceLogout(user)}>
                            <Shield className="h-4 w-4 mr-2" /> Force logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <p className="text-center text-sm text-muted-foreground/70 py-10">No users match the current filters.</p>
        )}
      </div>

      {/* User Detail Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-secondary text-primary text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                  <Badge className={`mt-1 ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Building2 className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Organization</p>
                    <p className="text-sm">{selectedUser.organization}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {selectedUser.orgType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Registration Date</p>
                    <p className="text-sm">{selectedUser.registrationDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm">{selectedUser.lastLogin}</p>
                  </div>
                </div>
              </div>

              {selectedUser.status === "Locked" && (
                <Button
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                  onClick={() => openUnlock(selectedUser)}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Unlock account
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" className="w-full" onClick={() => resetPasswordFor(selectedUser)}>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                {selectedUser.status === "Active" ? (
                  <Button variant="destructive" className="w-full" onClick={() => suspendUser(selectedUser)}>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button className="w-full bg-success hover:bg-green-700" onClick={() => activateUser(selectedUser)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add User form overlay (ADM-02-F1) */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add user</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <Field label="Full name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email ID">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone number">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91-XXXXXXXXXX" />
            </Field>
            <Field label="Entity type">
              <Select value={form.entity} onValueChange={(v) => setForm({ ...form, entity: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sponsor">Sponsor</SelectItem>
                  <SelectItem value="CRO">CRO</SelectItem>
                  <SelectItem value="SMO">SMO</SelectItem>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Designation">
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </Field>
            <Field label="Organization name">
              <Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Join existing or create new" />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.sendInvite} onCheckedChange={(v) => setForm({ ...form, sendInvite: !!v })} />
              Send onboarding invitation
            </label>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-primary" disabled={!canAdd} onClick={handleAddUser}>
                Save
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Unlock Account workflow (ADM-02-F4) */}
      <Sheet open={!!unlockUser} onOpenChange={(o) => !o && setUnlockUser(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Unlock account</SheetTitle>
          </SheetHeader>
          {unlockUser && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-surface p-3 space-y-1 text-xs">
                <p className="text-sm font-semibold text-primary">{unlockUser.name}</p>
                <p className="text-muted-foreground">Locked at: {unlockUser.lockInfo?.lockedAt}</p>
                <p className="text-muted-foreground">
                  Failed attempts: {unlockUser.lockInfo?.failedAttempts} of 5
                </p>
                <p className="text-muted-foreground">Last IP: {unlockUser.lockInfo?.lastIp}</p>
                <p className="text-muted-foreground">Device: {unlockUser.lockInfo?.device}</p>
                {unlockUser.lockInfo?.repeatedIp && (
                  <p className="text-destructive font-medium">⚠ Same IP caused multiple lockouts in 24h</p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Identity verification (at least 2 required)
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checks.email} onCheckedChange={(v) => setChecks({ ...checks, email: !!v })} />
                    Verified via registered email
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checks.orgId} onCheckedChange={(v) => setChecks({ ...checks, orgId: !!v })} />
                    Verified via organization ID
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checks.ticket} onCheckedChange={(v) => setChecks({ ...checks, ticket: !!v })} />
                    Verified via support ticket reference
                  </label>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Reason for unlock (min 10 chars, permanently logged)
                </p>
                <Textarea value={unlockReason} onChange={(e) => setUnlockReason(e.target.value)} className="min-h-[70px]" />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={forceReset} onCheckedChange={(v) => setForceReset(!!v)} />
                Force password reset on next login
              </label>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setUnlockUser(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-green-700"
                  disabled={!canUnlock}
                  onClick={handleConfirmUnlock}
                >
                  Confirm unlock
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}
