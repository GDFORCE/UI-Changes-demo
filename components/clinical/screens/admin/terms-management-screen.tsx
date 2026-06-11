"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

  // ADM-04-F1 Publish New Version form
  const [publishOpen, setPublishOpen] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [forceReacceptance, setForceReacceptance] = useState(true);

  const currentVersionNum = 3.0;
  const versionValid = parseFloat(newVersion.replace(/^v/i, "")) > currentVersionNum;
  const canPublish = versionValid && effectiveDate && changeSummary.trim().length > 0;

  const openPublish = () => {
    setNewVersion("");
    setEffectiveDate("");
    setChangeSummary("");
    setForceReacceptance(true);
    setPublishOpen(true);
  };
  const handlePublish = () => {
    if (!canPublish) {
      toast.error("Enter a higher version, effective date, and change summary");
      return;
    }
    toast.success(`T&C ${newVersion} published — users prompted on next login`);
    setPublishOpen(false);
  };

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
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">Terms &amp; Conditions management</h1>
          <p className="text-sm text-muted-foreground">Publish new versions, track acceptance, and manage version history.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={openPublish}>
          Publish new version
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border rounded-lg h-auto p-1">
          <TabsTrigger value="versions" className="text-sm">Versions</TabsTrigger>
          <TabsTrigger value="history" className="text-sm">Acceptance history</TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="space-y-5 mt-0">
          {/* Active Documents */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {termsVersions
              .filter((v) => v.status === "Active")
              .map((version) => (
                <Card key={version.id} className="border border-border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {version.type === "Terms of Service" ? (
                          <FileText className="h-5 w-5 text-info" />
                        ) : (
                          <Shield className="h-5 w-5 text-accent" />
                        )}
                        <div>
                          <h3 className="font-medium text-sm">{version.type}</h3>
                          <p className="text-xs text-muted-foreground">Version {version.version}</p>
                        </div>
                      </div>
                      <Badge className="bg-success/15 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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
          </div>

          {/* Previous Versions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Previous Versions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {termsVersions
              .filter((v) => v.status === "Inactive")
              .map((version) => (
                <Card key={version.id} className="border border-border shadow-sm bg-surface">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground/70" />
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">{version.type}</h3>
                          <p className="text-xs text-muted-foreground/70">Version {version.version}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground/70">
                      <span>Deactivated: {version.deactivatedAt}</span>
                      <span>{version.acceptedBy} accepted</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2 h-7 text-xs text-muted-foreground"
                      onClick={() => handleView(version)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-2 mt-0">
          <p className="text-xs text-muted-foreground mb-3">
            Users who accepted terms during login
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {acceptanceHistory.map((record, idx) => (
            <Card key={idx} className="border border-border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{record.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.type} v{record.version}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground/70">{record.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View/Edit Sheet */}
      <Sheet open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>
                {selectedVersion?.type} v{selectedVersion?.version}
              </span>
              {selectedVersion?.status === "Active" && (
                <Badge className="bg-success/15 text-success">Active</Badge>
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
                    <Button
                      className="flex-1 bg-primary"
                      onClick={() => {
                        setIsEditing(false);
                        toast.success("Changes saved");
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-surface p-4 rounded-lg">
                        {selectedVersion.content}
                      </pre>
                    </div>
                  </div>
                  {selectedVersion.status === "Active" && (
                    <Button
                      className="w-full mt-4 bg-primary"
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

      {/* Publish New Version form (ADM-04-F1) */}
      <Sheet open={publishOpen} onOpenChange={setPublishOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Publish new T&amp;C version</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">New version number (higher than v3.0)</p>
              <Input value={newVersion} onChange={(e) => setNewVersion(e.target.value)} placeholder="v3.1" />
              {newVersion && !versionValid && (
                <p className="text-[10px] text-destructive mt-1">Must be higher than the current v3.0.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Effective date</p>
              <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Change summary (shown to users on accept)</p>
              <Textarea value={changeSummary} onChange={(e) => setChangeSummary(e.target.value)} className="min-h-[70px]" />
            </div>
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
              Upload T&amp;C document (PDF / DOCX) — optional
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={forceReacceptance} onCheckedChange={(v) => setForceReacceptance(!!v)} />
              Force re-acceptance on next login
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button variant="outline" className="h-9 text-xs" onClick={() => toast.info("Preview shown to users")}>
                <Eye className="h-3 w-3 mr-1" /> Preview
              </Button>
              <Button variant="outline" className="h-9 text-xs" onClick={() => setPublishOpen(false)}>
                Cancel
              </Button>
              <Button className="h-9 text-xs bg-primary" disabled={!canPublish} onClick={handlePublish}>
                Publish
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
