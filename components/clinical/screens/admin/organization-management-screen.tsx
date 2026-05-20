"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ArrowLeft,
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

export function OrganizationManagementScreen({ onBack }: OrganizationManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<typeof organizations[0] | null>(null);

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
        return "bg-purple-100 text-purple-700";
      case "CRO":
        return "bg-blue-100 text-blue-700";
      case "SMO":
        return "bg-teal-100 text-teal-700";
      case "Site":
        return "bg-green-100 text-green-700";
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
            <h1 className="text-lg font-semibold">Organizations</h1>
            <p className="text-xs text-blue-200">{organizations.length} registered</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3 bg-white border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sponsor">Sponsor</SelectItem>
              <SelectItem value="CRO">CRO</SelectItem>
              <SelectItem value="SMO">SMO</SelectItem>
              <SelectItem value="Site">Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organization List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredOrgs.map((org) => (
          <Card key={org.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-[#1A3872]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm">{org.name}</h3>
                    <Badge className={`text-xs mt-1 ${getTypeColor(org.type)}`}>
                      {org.type}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedOrg(org)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Info
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Merge className="h-4 w-4 mr-2" />
                      Merge Duplicate
                    </DropdownMenuItem>
                    {org.status === "Active" ? (
                      <DropdownMenuItem className="text-red-600">
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{org.address}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    {org.users} users
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-gray-400" />
                    {org.trials} trials
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    org.status === "Active"
                      ? "border-green-500 text-green-700"
                      : "border-red-500 text-red-700"
                  }`}
                >
                  {org.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization Detail Sheet */}
      <Sheet open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Organization Details</SheetTitle>
          </SheetHeader>
          {selectedOrg && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-[#1A3872]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedOrg.name}</h2>
                  <Badge className={`mt-1 ${getTypeColor(selectedOrg.type)}`}>
                    {selectedOrg.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <Users className="h-5 w-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.users}</div>
                  <div className="text-xs text-gray-500">Users</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg text-center">
                  <FileText className="h-5 w-5 text-[#0D9488] mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.trials}</div>
                  <div className="text-xs text-gray-500">Trials</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{selectedOrg.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm">{selectedOrg.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedOrg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm">{selectedOrg.website}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Info
                </Button>
                <Button variant="outline" className="w-full">
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
