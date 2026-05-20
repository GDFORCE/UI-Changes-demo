"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  FileText,
  Shield,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Save,
} from "lucide-react";

interface TermsManagementScreenProps {
  onBack?: () => void;
}

const termsVersions = [
  {
    id: "TOS-v3.0",
    type: "Terms of Service",
    version: "3.0",
    status: "Active",
    createdAt: "2024-03-01",
    activatedAt: "2024-03-05",
    acceptedBy: 2456,
    content: `Terms of Service for Patient Visit Schedule Application

1. ACCEPTANCE OF TERMS
By accessing and using the Patient Visit Schedule mobile application ("App"), you agree to be bound by these Terms of Service.

2. DESCRIPTION OF SERVICE
The App provides clinical trial visit scheduling, medication reminders, and communication features for patients, investigators, and sponsors participating in clinical trials.

3. USER RESPONSIBILITIES
- Maintain confidentiality of login credentials
- Provide accurate information
- Comply with trial protocols
- Report any adverse events promptly

4. PRIVACY AND DATA PROTECTION
Your data is protected in accordance with applicable regulations including ICH-GCP guidelines and NDCT Rules 2019.

5. LIMITATION OF LIABILITY
The App is provided "as is" without warranties of any kind.`,
  },
  {
    id: "TOS-v2.1",
    type: "Terms of Service",
    version: "2.1",
    status: "Inactive",
    createdAt: "2024-01-15",
    activatedAt: "2024-01-20",
    deactivatedAt: "2024-03-05",
    acceptedBy: 1823,
    content: "Previous version of Terms of Service...",
  },
  {
    id: "PP-v2.0",
    type: "Privacy Policy",
    version: "2.0",
    status: "Active",
    createdAt: "2024-03-01",
    activatedAt: "2024-03-05",
    acceptedBy: 2456,
    content: `Privacy Policy for Patient Visit Schedule Application

1. INFORMATION WE COLLECT
- Personal identification information
- Health-related data for trial participation
- Device and usage information

2. HOW WE USE YOUR INFORMATION
- To provide trial management services
- To send visit and medication reminders
- To facilitate communication with research teams

3. DATA SHARING
We do not sell your personal data. Data is shared only with authorized trial personnel.

4. DATA SECURITY
We implement industry-standard security measures to protect your data.

5. YOUR RIGHTS
You have the right to access, correct, or delete your personal data.`,
  },
];

const acceptanceHistory = [
  { user: "Dr. Sarah Johnson", type: "Terms of Service", version: "3.0", date: "2024-03-15 09:30 AM" },
  { user: "Michael Chen", type: "Terms of Service", version: "3.0", date: "2024-03-14 02:15 PM" },
  { user: "A*** K***", type: "Privacy Policy", version: "2.0", date: "2024-03-14 11:00 AM" },
  { user: "Emily Rodriguez", type: "Terms of Service", version: "3.0", date: "2024-03-13 04:45 PM" },
  { user: "D*** Y***", type: "Privacy Policy", version: "2.0", date: "2024-03-13 03:30 PM" },
];

export function TermsManagementScreen({ onBack }: TermsManagementScreenProps) {
  const [activeTab, setActiveTab] = useState("versions");
  const [selectedVersion, setSelectedVersion] = useState<typeof termsVersions[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const handleEdit = (version: typeof termsVersions[0]) => {
    setSelectedVersion(version);
    setEditContent(version.content);
    setIsEditing(true);
  };

  const handleView = (version: typeof termsVersions[0]) => {
    setSelectedVersion(version);
    setIsEditing(false);
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
              <h1 className="text-lg font-semibold">Terms & Policy</h1>
              <p className="text-xs text-blue-200">Manage legal documents</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
            <Plus className="h-4 w-4 mr-1" />
            New Version
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-3 pt-2 bg-white border-b rounded-none h-auto">
          <TabsTrigger value="versions" className="text-xs">
            Versions
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            Acceptance History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="flex-1 overflow-y-auto p-3 space-y-3 mt-0">
          {/* Active Documents */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Active Documents</h3>
            {termsVersions
              .filter((v) => v.status === "Active")
              .map((version) => (
                <Card key={version.id} className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {version.type === "Terms of Service" ? (
                          <FileText className="h-5 w-5 text-[#2563EB]" />
                        ) : (
                          <Shield className="h-5 w-5 text-[#0D9488]" />
                        )}
                        <div>
                          <h3 className="font-medium text-sm">{version.type}</h3>
                          <p className="text-xs text-gray-500">Version {version.version}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Activated: {version.activatedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {version.acceptedBy} accepted
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleView(version)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleEdit(version)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Previous Versions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Previous Versions</h3>
            {termsVersions
              .filter((v) => v.status === "Inactive")
              .map((version) => (
                <Card key={version.id} className="border-0 shadow-sm bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-sm text-gray-600">{version.type}</h3>
                          <p className="text-xs text-gray-400">Version {version.version}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Deactivated: {version.deactivatedAt}</span>
                      <span>{version.acceptedBy} accepted</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2 h-7 text-xs text-gray-500"
                      onClick={() => handleView(version)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <p className="text-xs text-gray-500 mb-3">
            Users who accepted terms during login
          </p>
          {acceptanceHistory.map((record, idx) => (
            <Card key={idx} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                      <Users className="h-4 w-4 text-[#1A3872]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{record.user}</p>
                      <p className="text-xs text-gray-500">
                        {record.type} v{record.version}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{record.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* View/Edit Sheet */}
      <Sheet open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>
                {selectedVersion?.type} v{selectedVersion?.version}
              </span>
              {selectedVersion?.status === "Active" && (
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          {selectedVersion && (
            <div className="mt-4 flex flex-col h-[calc(100%-60px)]">
              {isEditing ? (
                <>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 min-h-[300px] text-sm font-mono"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-[#1A3872]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                        {selectedVersion.content}
                      </pre>
                    </div>
                  </div>
                  {selectedVersion.status === "Active" && (
                    <Button
                      className="w-full mt-4 bg-[#1A3872]"
                      onClick={() => {
                        setEditContent(selectedVersion.content);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Document
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
