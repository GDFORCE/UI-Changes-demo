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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Building2,
  Users,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  Merge,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

interface OrganizationManagementScreenProps {
  onBack?: () => void;
}

const organizations = [
  {
    id: "ORG-001",
    name: "PharmaCorp Inc",
    type: "Sponsor",
    address: "123 Pharma Street, Boston, MA 02101",
    contact: "+1 555-0100",
    email: "contact@pharmacorp.com",
    website: "www.pharmacorp.com",
    users: 45,
    trials: 12,
    status: "Active",
  },
  {
    id: "ORG-002",
    name: "Global CRO Partners",
    type: "CRO",
    address: "456 Research Ave, San Francisco, CA 94102",
    contact: "+1 555-0200",
    email: "info@globalcro.com",
    website: "www.globalcro.com",
    users: 128,
    trials: 28,
    status: "Active",
  },
  {
    id: "ORG-003",
    name: "HealthSite Management",
    type: "SMO",
    address: "789 Health Blvd, Chicago, IL 60601",
    contact: "+1 555-0300",
    email: "admin@healthsite.com",
    website: "www.healthsite.com",
    users: 67,
    trials: 15,
    status: "Active",
  },
  {
    id: "ORG-004",
    name: "City General Hospital",
    type: "Site",
    address: "321 Hospital Drive, New York, NY 10001",
    contact: "+1 555-0400",
    email: "research@citygeneral.org",
    website: "www.citygeneral.org",
    users: 23,
    trials: 8,
    status: "Active",
  },
  {
    id: "ORG-005",
    name: "Research Medical Center",
    type: "Site",
    address: "654 Medical Plaza, Los Angeles, CA 90001",
    contact: "+1 555-0500",
    email: "trials@researchmed.com",
    website: "www.researchmed.com",
    users: 18,
    trials: 6,
    status: "Suspended",
  },
];

interface NameRequest {
  id: string;
  requestedBy: string;
  current: string;
  requested: string;
  type: string;
  usersAffected: number;
  trials: number;
}

const initialNameRequests: NameRequest[] = [
  { id: "NC-01", requestedBy: "D. Chen · Site Coordinator", current: "Apollo Hosp.", requested: "Apollo Hospital", type: "Site", usersAffected: 23, trials: 8 },
  { id: "NC-02", requestedBy: "P. Nair · CRO Manager", current: "Global CRO", requested: "Global CRO Partners", type: "CRO", usersAffected: 128, trials: 28 },
];

export function OrganizationManagementScreen({ onBack }: OrganizationManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<typeof organizations[0] | null>(null);

  // Merge confirmation dialog
  const [mergeOrg, setMergeOrg] = useState<typeof organizations[0] | null>(null);
  const [mergeJustification, setMergeJustification] = useState("");

  // Name correction requests
  const [nameRequests, setNameRequests] = useState<NameRequest[]>(initialNameRequests);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const openMerge = (org: typeof organizations[0]) => {
    setMergeOrg(org);
    setMergeJustification("");
  };
  const confirmMerge = () => {
    if (!mergeOrg || !mergeJustification.trim()) return;
    toast.success(`${mergeOrg.name} merged into master record`);
    setMergeOrg(null);
    setSelectedOrg(null);
  };

  const approveName = (r: NameRequest) => {
    const finalName = editedNames[r.id] ?? r.requested;
    setNameRequests((prev) => prev.filter((x) => x.id !== r.id));
    toast.success(`Name correction applied: ${finalName}`);
  };
  const rejectName = (r: NameRequest) => {
    setNameRequests((prev) => prev.filter((x) => x.id !== r.id));
    toast.success(`Request from ${r.requestedBy} rejected`);
  };

  const tiles = [
    { label: "Total orgs", value: organizations.length },
    { label: "Sponsor", value: organizations.filter((o) => o.type === "Sponsor").length },
    { label: "CRO", value: organizations.filter((o) => o.type === "CRO").length },
    { label: "SMO", value: organizations.filter((o) => o.type === "SMO").length },
    { label: "Sites", value: organizations.filter((o) => o.type === "Site").length },
    { label: "Duplicates", value: 1 },
    { label: "Name reqs", value: nameRequests.length },
    { label: "Linked users", value: organizations.reduce((n, o) => n + o.users, 0) },
  ];

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sponsor":
        return "bg-violet/10 text-violet";
      case "CRO":
        return "bg-info/10 text-info";
      case "SMO":
        return "bg-accent/10 text-accent";
      case "Site":
        return "bg-success/15 text-success";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">Organization master list</h1>
          <p className="text-sm text-muted-foreground">Manage organizations, duplicates, and name correction requests.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.success("Add organization form")}>
          <Building2 className="h-4 w-4 mr-2" /> Add organization
        </Button>
      </div>

      {/* Summary tiles (ADM-03 Section 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="text-xl font-bold text-primary leading-none">{t.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1.5">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: search + org table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Search organizations by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] h-10 text-sm">
                <SelectValue placeholder="Entity type" />
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

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Organization</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Users</th>
                    <th className="px-4 py-3 font-medium">Trials</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-surface/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">{org.name}</div>
                            <Badge className={`text-[10px] mt-0.5 ${getTypeColor(org.type)}`}>{org.type}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[220px]">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" /> {org.address}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{org.users}</td>
                      <td className="px-4 py-3 text-muted-foreground">{org.trials}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${org.status === "Active" ? "border-green-500 text-success" : "border-red-500 text-destructive"}`}
                        >
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrg(org)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOrg(org)}>
                                <Eye className="h-4 w-4 mr-2" /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Editing ${org.name}`)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit info
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openMerge(org)}>
                                <Merge className="h-4 w-4 mr-2" /> Merge duplicate
                              </DropdownMenuItem>
                              {org.status === "Active" ? (
                                <DropdownMenuItem className="text-destructive" onClick={() => toast.success(`${org.name} suspended`)}>
                                  <Ban className="h-4 w-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-success" onClick={() => toast.success(`${org.name} activated`)}>
                                  <Building2 className="h-4 w-4 mr-2" /> Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Name correction requests (ADM-03 Section 4) */}
        <div className="xl:col-span-1">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-primary mb-3">Name correction requests</h2>
              {nameRequests.length === 0 && (
                <p className="text-xs text-muted-foreground/70 py-6 text-center">No pending requests.</p>
              )}
              <div className="space-y-3">
                {nameRequests.map((r) => (
                  <div key={r.id} className="rounded-lg border border-warning/20 bg-warning/10/40 p-3">
                    <p className="text-[11px] text-muted-foreground">{r.requestedBy}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-destructive line-through">{r.current}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/70" />
                      <span className="text-success font-medium">{r.requested}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {r.type} · {r.usersAffected} users · {r.trials} trials affected
                    </p>
                    <Input
                      value={editedNames[r.id] ?? r.requested}
                      onChange={(e) => setEditedNames((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="h-8 mt-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button size="sm" className="h-8 text-xs bg-success hover:bg-green-700" onClick={() => approveName(r)}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs text-destructive border-destructive/20" onClick={() => rejectName(r)}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Merge confirmation dialog (ADM-03) */}
      {mergeOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-semibold text-foreground">Confirm merge</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {mergeOrg.users} users and {mergeOrg.trials} trials will be re-linked to the master record.
              {" "}{mergeOrg.name} will be archived. This action is irreversible.
            </p>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Admin justification (required, logged)</p>
              <Textarea value={mergeJustification} onChange={(e) => setMergeJustification(e.target.value)} className="min-h-[60px]" />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setMergeOrg(null)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" disabled={!mergeJustification.trim()} onClick={confirmMerge}>
                Confirm merge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Detail Sheet */}
      <Sheet open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Organization Details</SheetTitle>
          </SheetHeader>
          {selectedOrg && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedOrg.name}</h2>
                  <Badge className={`mt-1 ${getTypeColor(selectedOrg.type)}`}>
                    {selectedOrg.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-info/5 rounded-lg text-center">
                  <Users className="h-5 w-5 text-info mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.users}</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg text-center">
                  <FileText className="h-5 w-5 text-accent mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.trials}</div>
                  <div className="text-xs text-muted-foreground">Trials</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm">{selectedOrg.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm">{selectedOrg.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedOrg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                  <Globe className="h-5 w-5 text-muted-foreground/70" />
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <p className="text-sm">{selectedOrg.website}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.success(`Editing ${selectedOrg.name}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Info
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMerge(selectedOrg)}
                >
                  <Merge className="h-4 w-4 mr-2" />
                  Merge Duplicate
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
