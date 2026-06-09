"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Pencil, PauseCircle, Ban, Users } from "lucide-react";

interface DelegationScreenProps {
  onBack?: () => void;
}

const TASK_CATEGORIES = [
  "User Management",
  "Organization Management",
  "Others Specify Approvals",
  "Notification Monitoring",
  "Issue Management",
  "T&C Reminders",
  "Trial Overview (read-only)",
];

type Status = "Active" | "Pending acceptance" | "Suspended";

interface Staff {
  id: string;
  name: string;
  email: string;
  tasks: string[];
  status: Status;
  delegatedDate: string;
  lastActive: string;
}

const initialStaff: Staff[] = [
  {
    id: "STF-01",
    name: "Ravi Menon",
    email: "ravi.menon@trialsync.com",
    tasks: ["User Management", "Issue Management"],
    status: "Active",
    delegatedDate: "12-May-2026",
    lastActive: "05-Jun-2026",
  },
  {
    id: "STF-02",
    name: "Sneha Patel",
    email: "sneha.patel@trialsync.com",
    tasks: ["Others Specify Approvals", "Notification Monitoring"],
    status: "Pending acceptance",
    delegatedDate: "02-Jun-2026",
    lastActive: "—",
  },
];

const statusColor: Record<Status, string> = {
  Active: "bg-green-100 text-green-700",
  "Pending acceptance": "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};

export function DelegationScreen({ onBack }: DelegationScreenProps) {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formTasks, setFormTasks] = useState<string[]>([]);
  const [formReason, setFormReason] = useState("");

  const activeStaff = staff.filter((s) => s.status === "Active").length;
  const tasksDelegated = staff.reduce((n, s) => n + s.tasks.length, 0);
  const pending = staff.filter((s) => s.status === "Pending acceptance").length;

  const openAdd = () => {
    setEditingId(null);
    setFormName("");
    setFormTasks([]);
    setFormReason("");
    setOverlayOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditingId(s.id);
    setFormName(s.name);
    setFormTasks(s.tasks);
    setFormReason("");
    setOverlayOpen(true);
  };

  const toggleTask = (t: string) =>
    setFormTasks((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const canSave = formName.trim() && formTasks.length > 0 && formReason.trim().length >= 20;

  const handleSave = () => {
    if (!canSave) {
      toast.error("Name, at least 1 task, and a 20+ char reason are required");
      return;
    }
    if (editingId) {
      setStaff((prev) => prev.map((s) => (s.id === editingId ? { ...s, name: formName, tasks: formTasks } : s)));
      toast.success(`Delegation updated for ${formName}`);
    } else {
      setStaff((prev) => [
        ...prev,
        {
          id: `STF-${String(prev.length + 1).padStart(2, "0")}`,
          name: formName,
          email: `${formName.toLowerCase().replace(/\s+/g, ".")}@trialsync.com`,
          tasks: formTasks,
          status: "Pending acceptance",
          delegatedDate: "05-Jun-2026",
          lastActive: "—",
        },
      ]);
      toast.success(`${formName} added as Admin Staff`);
    }
    setOverlayOpen(false);
  };

  const handleSuspend = (s: Staff) => {
    setStaff((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: "Suspended" } : x)));
    toast.success(`${s.name} suspended`);
  };

  const handleRevoke = (s: Staff) => {
    setStaff((prev) => prev.filter((x) => x.id !== s.id));
    toast.success(`All delegation revoked for ${s.name}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1A3872]">Scoped admin tasks for staff</h1>
          <p className="text-sm text-gray-500">Assign specific tasks to registered users designated as Admin Staff.</p>
        </div>
        <Button className="bg-[#1A3872] hover:bg-[#15305f]" onClick={openAdd}>
          Add admin staff
        </Button>
      </div>

      <div className="space-y-6">
        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <Tile value={activeStaff} label="Active staff" color="text-green-600" />
          <Tile value={tasksDelegated} label="Tasks delegated" color="text-blue-600" />
          <Tile value={pending} label="Pending acceptance" color="text-amber-600" />
        </div>

        {/* Staff list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {staff.map((s) => (
          <Card key={s.id} className="border border-gray-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-[#1A3872]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{s.email}</p>
                  </div>
                </div>
                <Badge className={`${statusColor[s.status]} text-[10px] shrink-0`}>{s.status}</Badge>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {s.tasks.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[9px]">
                    {t}
                  </Badge>
                ))}
              </div>

              <p className="text-[10px] text-gray-400 mt-2">
                Delegated {s.delegatedDate} · last active {s.lastActive}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => openEdit(s)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs text-amber-700 border-amber-200"
                  onClick={() => handleSuspend(s)}
                >
                  <PauseCircle className="h-3 w-3 mr-1" /> Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs text-red-700 border-red-200"
                  onClick={() => handleRevoke(s)}
                >
                  <Ban className="h-3 w-3 mr-1" /> Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Add / Edit overlay */}
      <Sheet open={overlayOpen} onOpenChange={setOverlayOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit delegation" : "Add admin staff"}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Staff name or email</p>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Search registered users…" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Delegated tasks</p>
              <div className="space-y-2">
                {TASK_CATEGORIES.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={formTasks.includes(t)} onCheckedChange={() => toggleTask(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Reason for delegation (min 20 chars, logged)</p>
              <Textarea value={formReason} onChange={(e) => setFormReason(e.target.value)} className="min-h-[70px]" />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOverlayOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-[#1A3872]" disabled={!canSave} onClick={handleSave}>
                Save delegation
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Tile({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl p-3 border border-gray-200 bg-white text-center">
      <div className={`text-2xl font-bold ${color} leading-none`}>{value}</div>
      <div className="text-[10px] text-gray-600 mt-1">{label}</div>
    </div>
  );
}
