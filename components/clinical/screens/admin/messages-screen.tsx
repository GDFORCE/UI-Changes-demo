"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Eye, Save, AlertTriangle } from "lucide-react";

interface MessagesScreenProps {
  onBack?: () => void;
}

const messageTypes = [
  { value: "general", label: "General announcement", badge: "bg-muted text-foreground/80" },
  { value: "compliance", label: "Compliance notice", badge: "bg-warning/15 text-warning" },
  { value: "system", label: "System alert", badge: "bg-destructive/10 text-destructive" },
  { value: "targeted", label: "Targeted message", badge: "bg-info/10 text-info" },
  { value: "urgent", label: "Urgent notice", badge: "bg-destructive/10 text-destructive" },
];

const sentMessages = [
  { id: "MSG-018", type: "compliance", subject: "Updated consent SOP — action required", recipients: "All Sponsors · 22 users", sentAt: "05-Jun 09:10", status: "Delivered", replies: 3, read: "18 / 22" },
  { id: "MSG-017", type: "system", subject: "Scheduled maintenance tonight 11 PM IST", recipients: "All users · 2,847", sentAt: "04-Jun 17:30", status: "Partial failure", replies: 0, read: "2103 / 2847" },
  { id: "MSG-016", type: "targeted", subject: "Enrollment milestone reached", recipients: "CTRI/2024/001 · 47 users", sentAt: "03-Jun 14:02", status: "Delivered", replies: 5, read: "47 / 47" },
];

const initialReplies = [
  { id: "RPL-1", from: "Dr. S. Johnson · PI · Apollo Hospital", original: "Updated consent SOP", message: "Can you confirm the deadline for re-consent?", at: "05-Jun 09:40", resolved: false },
  { id: "RPL-2", from: "PT-1042 · Patient", original: "Scheduled maintenance", message: "Will my reminders still work tonight?", at: "04-Jun 18:05", resolved: false },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-success/15 text-success",
  "Partial failure": "bg-warning/15 text-warning",
  Failed: "bg-destructive/10 text-destructive",
};

export function MessagesScreen({ onBack }: MessagesScreenProps) {
  const [msgType, setMsgType] = useState("general");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("all");
  const [allowReplies, setAllowReplies] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [replies, setReplies] = useState(initialReplies);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const canSend = subject.trim() && body.trim() && target;
  const recipientCount =
    target === "all" ? 2847 : target === "entity" ? 105 : target === "trial" ? 47 : target === "role" ? 156 : 1;

  const doSend = () => {
    setConfirmOpen(false);
    toast.success(`Message sent to ${recipientCount} users`);
    setSubject("");
    setBody("");
    setAllowReplies(false);
    setScheduled(false);
  };

  const sendReply = (id: string) => {
    toast.success("Reply sent to user");
    setReplyDrafts((p) => ({ ...p, [id]: "" }));
  };

  const resolveReply = (id: string) => {
    setReplies((prev) => prev.map((r) => (r.id === id ? { ...r, resolved: true } : r)));
    toast.success("Thread marked resolved");
  };

  const typeBadge = (t: string) => messageTypes.find((m) => m.value === t)?.badge ?? "bg-muted text-foreground/80";

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Announcements &amp; admin chat</h1>
        <p className="text-sm text-muted-foreground">Broadcast platform messages and respond to user replies.</p>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="replies">
            Replies
            {replies.some((r) => !r.resolved) && (
              <span className="ml-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center">
                {replies.filter((r) => !r.resolved).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Compose */}
        <TabsContent value="compose" className="max-w-2xl space-y-4 mt-0 bg-card border border-border rounded-xl p-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Message type</p>
            <Select value={msgType} onValueChange={setMsgType}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {messageTypes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Subject / title</p>
            <Input value={subject} onChange={(e) => setSubject(e.target.value.slice(0, 120))} placeholder="Short headline" />
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 text-right">{subject.length}/120</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Message body</p>
            <Textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 2000))} className="min-h-[120px]" placeholder="Full message content…" />
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 text-right">{body.length}/2000</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Recipients — target level</p>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="entity">By entity type</SelectItem>
                <SelectItem value="organization">By organization</SelectItem>
                <SelectItem value="trial">By trial</SelectItem>
                <SelectItem value="role">By role</SelectItem>
                <SelectItem value="site">By site</SelectItem>
                <SelectItem value="individual">Individual user</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-info mt-1">This message will be sent to {recipientCount} users.</p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={allowReplies} onCheckedChange={(v) => setAllowReplies(!!v)} />
            Allow replies
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={scheduled} onCheckedChange={(v) => setScheduled(!!v)} />
            Schedule for later
          </label>
          {scheduled && <Input type="datetime-local" className="h-9" />}

          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button variant="outline" className="h-9 text-xs" onClick={() => toast.info("Message preview")}>
              <Eye className="h-3 w-3 mr-1" /> Preview
            </Button>
            <Button variant="outline" className="h-9 text-xs" onClick={() => toast.success("Saved to drafts")}>
              <Save className="h-3 w-3 mr-1" /> Draft
            </Button>
            <Button className="h-9 text-xs bg-primary" disabled={!canSend} onClick={() => setConfirmOpen(true)}>
              <Send className="h-3 w-3 mr-1" /> Send
            </Button>
          </div>
        </TabsContent>

        {/* Sent */}
        <TabsContent value="sent" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-0">
          {sentMessages.map((m) => (
            <Card key={m.id} className="border border-border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge className={`${typeBadge(m.type)} text-[10px]`}>
                    {messageTypes.find((t) => t.value === m.type)?.label}
                  </Badge>
                  <Badge className={`${statusColor[m.status]} text-[10px]`}>{m.status}</Badge>
                </div>
                <p className="text-sm font-semibold text-foreground mt-1">{m.subject}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.recipients} · {m.sentAt}</p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>Read {m.read}</span>
                  {m.replies > 0 && <span className="text-info font-medium">{m.replies} replies</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Replies */}
        <TabsContent value="replies" className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-0">
          {replies.map((r) => (
            <Card key={r.id} className="border border-border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{r.from}</span>
                  {!r.resolved && <span className="h-2 w-2 rounded-full bg-info" />}
                </div>
                <p className="text-[10px] text-muted-foreground/70">re: {r.original} · {r.at}</p>
                <p className="text-xs text-foreground/80 mt-1.5 bg-surface rounded-lg p-2">{r.message}</p>
                {r.resolved ? (
                  <Badge className="bg-success/15 text-success text-[10px] mt-2">Resolved</Badge>
                ) : (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={replyDrafts[r.id] ?? ""}
                      onChange={(e) => setReplyDrafts((p) => ({ ...p, [r.id]: e.target.value }))}
                      placeholder="Reply to this user…"
                      className="min-h-[60px]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-primary"
                        disabled={!(replyDrafts[r.id] ?? "").trim()}
                        onClick={() => sendReply(r.id)}
                      >
                        <Send className="h-3 w-3 mr-1" /> Send reply
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => resolveReply(r.id)}>
                        Mark resolved
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Send confirmation dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-semibold text-foreground">Confirm send</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You are about to send a {messageTypes.find((m) => m.value === msgType)?.label} to {recipientCount} users.
              This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-primary" onClick={doSend}>
                Confirm send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
