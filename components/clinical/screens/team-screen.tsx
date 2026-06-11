"use client"

import { useState } from "react"
import { ArrowLeft, Search, Users, Link, Mail, Check, ChevronRight, X, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamScreenProps {
  onBack: () => void
}

type TeamRole = "Sponsor" | "CRO" | "PI" | "Research Team" | "MTB Admin"

interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  organization: string
  status: "active" | "pending"
  joinedDate: string
  avatar: string
}

const roleColors: Record<TeamRole, string> = {
  "Sponsor": "bg-info/10 text-info",
  "CRO": "bg-violet/10 text-violet",
  "PI": "bg-accent/10 text-accent",
  "Research Team": "bg-success/15 text-success",
  "MTB Admin": "bg-destructive/10 text-destructive",
}

const initialMembers: TeamMember[] = [
  { id: "1", name: "Rajesh Kumar", email: "r.kumar@pharmaco.com", role: "Sponsor", organization: "PharmaCo Ltd", status: "active", joinedDate: "1 Jan 2025", avatar: "RK" },
  { id: "2", name: "Priya Shah", email: "p.shah@cro-global.com", role: "CRO", organization: "CRO Global", status: "active", joinedDate: "15 Jan 2025", avatar: "PS" },
  { id: "3", name: "Dr. Rajesh Sharma", email: "r.sharma@apollo.com", role: "PI", organization: "Apollo Mumbai", status: "active", joinedDate: "20 Jan 2025", avatar: "RS" },
  { id: "4", name: "Ms. Priya Desai", email: "p.desai@apollo.com", role: "Research Team", organization: "Apollo Mumbai", status: "active", joinedDate: "22 Jan 2025", avatar: "PD" },
  { id: "5", name: "Dr. Sunita Rao", email: "s.rao@maxhealthcare.com", role: "PI", organization: "Max Delhi", status: "active", joinedDate: "5 Feb 2025", avatar: "SR" },
  { id: "6", name: "Vikram Nair", email: "v.nair@pharmaco.com", role: "Sponsor", organization: "PharmaCo Ltd", status: "pending", joinedDate: "—", avatar: "VN" },
]

export function TeamScreen({ onBack }: TeamScreenProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | TeamRole>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showInviteLink, setShowInviteLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "PI" as TeamRole, org: "" })
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const inviteLink = "https://pvs.mtb.com/invite?token=MTB-TEAM-2025-XKZP"

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || m.role === roleFilter
    return matchSearch && matchRole
  })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return
    setMembers(prev => [...prev, {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      organization: newMember.org,
      status: "pending",
      joinedDate: "—",
      avatar: newMember.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    }])
    setNewMember({ name: "", email: "", role: "PI", org: "" })
    setShowAddForm(false)
  }

  const handleCopyLink = () => {
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleRemove = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    setSelectedMember(null)
  }

  // Member detail view
  if (selectedMember) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedMember(null)} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
          <span className="font-semibold flex-1">Team Member</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-primary">
              {selectedMember.avatar}
            </div>
            <h2 className="text-lg font-bold text-foreground">{selectedMember.name}</h2>
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", roleColors[selectedMember.role])}>{selectedMember.role}</span>
            <p className="text-sm text-muted-foreground">{selectedMember.organization}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            {[
              { label: "Email", val: selectedMember.email },
              { label: "Status", val: selectedMember.status === "active" ? "Active" : "Pending Invite" },
              { label: "Joined", val: selectedMember.joinedDate },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <p className="text-xs text-muted-foreground/70">{r.label}</p>
                <p className="text-sm font-medium text-foreground">{r.val}</p>
              </div>
            ))}
          </div>
          <button onClick={() => handleRemove(selectedMember.id)}
            className="w-full py-3 rounded-xl border border-destructive/20 text-destructive text-sm font-semibold">
            Remove from Team
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <span className="font-semibold flex-1">Team Management</span>
        <button onClick={() => setShowAddForm(true)} className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-semibold whitespace-nowrap">
          Add Member
        </button>
      </div>

      {/* Stats strip */}
      <div className="flex gap-3 px-4 py-3 bg-card border-b border-border">
        <div className="flex-1 text-center">
          <p className="text-xl font-bold text-primary-deep">{members.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Members</p>
        </div>
        <div className="w-px bg-muted" />
        <div className="flex-1 text-center">
          <p className="text-xl font-bold text-success">{members.filter(m => m.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </div>
        <div className="w-px bg-muted" />
        <div className="flex-1 text-center">
          <p className="text-xl font-bold text-warning">{members.filter(m => m.status === "pending").length}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Invite link banner */}
      <div className="mx-4 mt-3">
        <button onClick={() => setShowInviteLink(!showInviteLink)}
          className="w-full flex items-center gap-3 bg-info/5 border border-info/20 rounded-xl px-4 py-3">
          <Link className="w-4 h-4 text-info" />
          <span className="flex-1 text-sm font-medium text-info text-left">Share Invite Link</span>
          <ChevronRight className={cn("w-4 h-4 text-blue-400 transition-transform", showInviteLink && "rotate-90")} />
        </button>
        {showInviteLink && (
          <div className="bg-info/5 border border-info/20 border-t-0 rounded-b-xl px-4 pb-3">
            <div className="bg-card border border-info/20 rounded-lg p-3 flex items-center gap-2 mt-2">
              <p className="flex-1 text-xs text-muted-foreground truncate font-mono">{inviteLink}</p>
              <button onClick={handleCopyLink} className={cn("p-1.5 rounded-lg transition-colors", linkCopied ? "bg-success/15" : "bg-info/10")}>
                {linkCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-info" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-1.5">Link expires in 7 days. Anyone with this link can join as a standard user.</p>
          </div>
        )}
      </div>

      {/* Search + Filter */}
      <div className="px-4 pt-3 space-y-2">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground/70" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            className="flex-1 text-sm outline-none" />
          {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-muted-foreground/70" /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["all", "Sponsor", "CRO", "PI", "Research Team", "MTB Admin"] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", roleFilter === r ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border")}>
              {r === "all" ? `All (${members.length})` : r}
            </button>
          ))}
        </div>
      </div>

      {/* Member List */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-2">
        {filtered.map(m => (
          <button key={m.id} onClick={() => setSelectedMember(m)}
            className="w-full bg-card rounded-xl border border-border p-3.5 flex items-center gap-3 text-left shadow-xs">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                {m.avatar}
              </div>
              {m.status === "active" && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">{m.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", roleColors[m.role])}>{m.role}</span>
              {m.status === "pending" && <span className="text-[10px] text-warning font-medium">Pending</span>}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users className="w-12 h-12 text-slate-300" />
            <p className="text-muted-foreground font-medium">No members found</p>
          </div>
        )}
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-card rounded-t-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-foreground text-lg">Add Team Member</h3>
              <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5 text-muted-foreground/70" /></button>
            </div>
            {[
              { label: "Full Name *", field: "name" as const, type: "text", placeholder: "Enter name" },
              { label: "Email *", field: "email" as const, type: "email", placeholder: "Enter email" },
              { label: "Organization", field: "org" as const, type: "text", placeholder: "Enter organization" },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-sm font-medium text-foreground/80 mb-1">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={newMember[f.field]}
                  onChange={e => setNewMember(prev => ({ ...prev, [f.field]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Role *</label>
              <select value={newMember.role} onChange={e => setNewMember(prev => ({ ...prev, role: e.target.value as TeamRole }))}
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm bg-card appearance-none focus:border-primary">
                {(["Sponsor", "CRO", "PI", "Research Team", "MTB Admin"] as TeamRole[]).map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-foreground/80 text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleAddMember}
                className="flex-1 py-3 rounded-xl bg-primary-deep text-white text-sm font-semibold flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
