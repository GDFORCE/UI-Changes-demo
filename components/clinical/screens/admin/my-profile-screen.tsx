"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Camera,
  Pencil,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  Monitor,
  KeyRound,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";

interface MyProfileScreenProps {
  onBack?: () => void;
}

export function MyProfileScreen({ onBack }: MyProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("Anil Kumar");
  const [designation, setDesignation] = useState("Platform Administrator");
  const [email] = useState("admin@trialsync.com");
  const [phone] = useState("+91-9876543210");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const strongEnough =
    next.length >= 8 && /[A-Z]/.test(next) && /[a-z]/.test(next) && /[0-9]/.test(next) && /[^A-Za-z0-9]/.test(next);
  const canUpdate = current && strongEnough && next === confirm;

  const handleUpdatePassword = () => {
    if (!canUpdate) {
      toast.error("Check password rules and confirmation");
      return;
    }
    toast.success("Password updated — please re-login");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const handleSaveProfile = () => {
    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Account, password &amp; security</h1>
        <p className="text-sm text-muted-foreground">Manage your administrator profile and session settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile details */}
        <Card className="border border-border shadow-sm lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-secondary text-primary text-lg font-semibold">
                    AK
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center"
                  onClick={() => toast.info("Choose a profile photo")}
                  aria-label="Upload photo"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-8 text-sm" />
                    <Input value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-8 text-sm" />
                  </div>
                ) : (
                  <>
                    <h2 className="font-semibold text-primary">{fullName}</h2>
                    <p className="text-xs text-muted-foreground">{designation}</p>
                    <Badge className="bg-info/10 text-info text-[10px] mt-1">Platform Admin</Badge>
                  </>
                )}
              </div>
              {editing ? (
                <Button size="sm" className="h-8 bg-primary" onClick={handleSaveProfile}>
                  Save
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="h-8" onClick={() => setEditing(true)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 p-2 bg-surface rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground/70" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">Email (edit via OTP)</p>
                  <p className="text-sm">{email}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info("OTP sent to email")}>
                  Change
                </Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-surface rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground/70" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">Phone (edit via OTP)</p>
                  <p className="text-sm">{phone}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info("OTP sent to phone")}>
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password management */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-info" /> Change password
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <PasswordField label="Current password" value={current} onChange={setCurrent} show={showCurrent} toggle={() => setShowCurrent((v) => !v)} />
            <PasswordField label="New password" value={next} onChange={setNext} show={showNew} toggle={() => setShowNew((v) => !v)} />
            {next.length > 0 && !strongEnough && (
              <p className="text-[10px] text-warning">
                Min 8 chars with uppercase, lowercase, number, and special character.
              </p>
            )}
            <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
            {confirm.length > 0 && next !== confirm && (
              <p className="text-[10px] text-destructive">Passwords do not match.</p>
            )}
            <Button className="w-full bg-primary mt-1" disabled={!canUpdate} onClick={handleUpdatePassword}>
              Update password
            </Button>
          </CardContent>
        </Card>

        {/* Security & session */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-info" /> Security &amp; session
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2 text-xs">
            <Row icon={ShieldCheck} label="MFA status" value="Enabled — TOTP" badge="Required" />
            <Row icon={Clock} label="Session timeout" value="30 minutes inactivity" />
            <Row icon={Monitor} label="Last successful login" value="05-Jun-2026 09:12 · Chrome · Windows" />
            <Row icon={Clock} label="Last failed login" value="03-Jun-2026 22:40 · 1 attempt" />
            <Row icon={Monitor} label="Active sessions" value="1 session — this device" />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success("MFA device reset — re-enroll required")}>
                Reset MFA device
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success("Other sessions terminated")}>
                End other sessions
              </Button>
            </div>
            <Button variant="destructive" className="w-full mt-1" onClick={() => toast.info("Logging out…")}>
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 pr-9"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/70"
          aria-label="Toggle visibility"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 bg-surface rounded-lg">
      <Icon className="h-4 w-4 text-muted-foreground/70 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs text-foreground">{value}</p>
      </div>
      {badge && <Badge className="bg-success/15 text-success text-[10px] shrink-0">{badge}</Badge>}
    </div>
  );
}
