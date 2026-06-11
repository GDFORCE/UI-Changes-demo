"use client"

import { useState, useRef, useEffect } from "react"
import { Activity, Building2, ChevronLeft, Send, Mic, Paperclip, Image, FileText, MoreVertical, Check, CheckCheck, Play, Pause, X, Search, Camera, ShieldCheck, Stethoscope, UsersRound, SquarePen } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────

type ChannelType = "sponsor-pi" | "sponsor-rt" | "pi-patient" | "rt-patient" | "admin-user"
type UserRole = "sponsor" | "cro" | "pi" | "research-team" | "patient" | "admin"

interface ChatChannel {
  id: string
  name: string
  role: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  channelType: ChannelType
}

interface Message {
  id: string
  sender: string
  isSelf: boolean
  content: string
  type: "text" | "voice" | "document" | "image"
  timestamp: string
  status: "sent" | "delivered" | "read"
  attachmentName?: string
  attachmentSize?: string
  duration?: number
}

interface ChatScreenProps {
  onBack?: () => void
  userRole?: UserRole
  /** Reports whether a conversation is open, so the app can hide the bottom nav in that view. */
  onConversationOpenChange?: (open: boolean) => void
}

// ── Data ─────────────────────────────────────────────────

const allChannels: ChatChannel[] = [
  // Sponsor ↔ Sites
  { id: "sp-pi-1", name: "Dr. Rajesh Sharma",  role: "PI — Apollo Mumbai",          avatar: "RS", lastMessage: "Site visit confirmed for next Monday",       time: "10:30 AM",  unread: 2, online: true,  channelType: "sponsor-pi" },
  { id: "sp-pi-2", name: "Dr. Sunita Rao",     role: "PI — Max Delhi",              avatar: "SR", lastMessage: "Patient SUBJ-003 needs attention",           time: "Yesterday", unread: 1, online: false, channelType: "sponsor-pi" },
  { id: "sp-pi-3", name: "Dr. Anand Krishnan", role: "PI — Fortis Bangalore",       avatar: "AK", lastMessage: "Enrollment on track for this quarter",       time: "2d ago",    unread: 0, online: true,  channelType: "sponsor-pi" },
  { id: "sp-rt-1", name: "Ms. Priya Desai",    role: "Research Team — Apollo",      avatar: "PD", lastMessage: "Visit 7 completion form submitted",          time: "9:15 AM",   unread: 0, online: true,  channelType: "sponsor-rt" },
  { id: "sp-rt-2", name: "Mr. Amit Singh",     role: "Research Team — Max Delhi",   avatar: "AS", lastMessage: "Screen failure report attached",             time: "Yesterday", unread: 0, online: false, channelType: "sponsor-rt" },
  // PI/RT ↔ Patients
  { id: "pi-pt-1", name: "SUBJ-001 (Priya K.)", role: "Patient — Protocol-001",     avatar: "PK", lastMessage: "I feel a bit dizzy after the last dose",     time: "11:00 AM",  unread: 3, online: true,  channelType: "pi-patient" },
  { id: "pi-pt-2", name: "SUBJ-002 (Arjun M.)", role: "Patient — Protocol-001",     avatar: "AM", lastMessage: "Is it okay to skip the morning dose?",       time: "Yesterday", unread: 1, online: false, channelType: "pi-patient" },
  { id: "pi-pt-3", name: "SUBJ-004 (Meena R.)", role: "Patient — Protocol-002",     avatar: "MR", lastMessage: "Reminder: Visit 5 is tomorrow at 10 AM",     time: "2d ago",    unread: 0, online: false, channelType: "pi-patient" },
  { id: "rt-pt-1", name: "SUBJ-001 (Priya K.)", role: "Patient — Protocol-001",     avatar: "PK", lastMessage: "I took the medication this morning",          time: "8:45 AM",   unread: 2, online: true,  channelType: "rt-patient" },
  { id: "rt-pt-2", name: "SUBJ-003 (Kavitha S.)", role: "Patient — Protocol-001",   avatar: "KS", lastMessage: "Visit rescheduled to Friday",                time: "Yesterday", unread: 0, online: false, channelType: "rt-patient" },
  // Admin ↔ Users
  { id: "adm-1",  name: "MTB Admin",           role: "Platform Administrator",      avatar: "MA", lastMessage: "Your support ticket #1042 is resolved",      time: "2d ago",    unread: 0, online: true,  channelType: "admin-user" },
]

// What channels each role can see
const roleChannelTypes: Record<UserRole, ChannelType[]> = {
  "sponsor":       ["sponsor-pi", "sponsor-rt", "admin-user"],
  "cro":           ["sponsor-pi", "sponsor-rt", "admin-user"],
  "pi":            ["sponsor-pi", "pi-patient", "admin-user"],
  "research-team": ["sponsor-rt", "rt-patient", "admin-user"],
  "patient":       ["pi-patient", "rt-patient"],
  "admin":         ["sponsor-pi", "sponsor-rt", "pi-patient", "rt-patient", "admin-user"],
}

const channelTypeLabel: Record<ChannelType, string> = {
  "sponsor-pi": "Sponsor ↔ PI",
  "sponsor-rt": "Sponsor ↔ Research Team",
  "pi-patient": "PI ↔ Patients",
  "rt-patient": "Research Team ↔ Patients",
  "admin-user": "MTB Admin",
}

const channelTypeColor: Record<ChannelType, string> = {
  "sponsor-pi": "bg-info/10 text-info",
  "sponsor-rt": "bg-accent/10 text-accent",
  "pi-patient": "bg-violet/10 text-violet",
  "rt-patient": "bg-success/15 text-success",
  "admin-user": "bg-destructive/10 text-destructive",
}

const channelTypeMeta = {
  "sponsor-pi": {
    icon: Stethoscope,
    accent: "bg-info",
    soft: "bg-info/5 text-info border-info/20",
    avatar: "bg-info/5 text-info ring-info/15",
  },
  "sponsor-rt": {
    icon: Building2,
    accent: "bg-accent",
    soft: "bg-accent/5 text-accent border-accent/20",
    avatar: "bg-accent/5 text-accent ring-teal-100",
  },
  "pi-patient": {
    icon: Activity,
    accent: "bg-violet",
    soft: "bg-violet/5 text-violet border-violet-100",
    avatar: "bg-violet/5 text-violet ring-violet-100",
  },
  "rt-patient": {
    icon: UsersRound,
    accent: "bg-success",
    soft: "bg-success/10 text-success border-success/20",
    avatar: "bg-success/10 text-success ring-emerald-100",
  },
  "admin-user": {
    icon: ShieldCheck,
    accent: "bg-rose-500",
    soft: "bg-rose-50 text-rose-700 border-rose-100",
    avatar: "bg-rose-50 text-rose-700 ring-rose-100",
  },
} satisfies Record<ChannelType, {
  icon: typeof Stethoscope
  accent: string
  soft: string
  avatar: string
}>

// Sample conversation messages per channel
const channelMessages: Record<string, Message[]> = {
  "sp-pi-1": [
    { id: "1", sender: "Dr. Rajesh Sharma", isSelf: false, content: "Good morning! We have completed enrollment for Protocol-001 at Apollo.", type: "text", timestamp: "9:00 AM", status: "read" },
    { id: "2", sender: "You", isSelf: true, content: "Excellent news! What's the current screen failure rate?", type: "text", timestamp: "9:10 AM", status: "read" },
    { id: "3", sender: "Dr. Rajesh Sharma", isSelf: false, content: "", type: "document", timestamp: "9:15 AM", status: "read", attachmentName: "Enrollment_Report_May2025.pdf", attachmentSize: "1.2 MB" },
    { id: "4", sender: "You", isSelf: true, content: "Thank you. Site visit confirmed for next Monday at 10 AM.", type: "text", timestamp: "10:28 AM", status: "read" },
    { id: "5", sender: "Dr. Rajesh Sharma", isSelf: false, content: "Site visit confirmed for next Monday", type: "text", timestamp: "10:30 AM", status: "read" },
  ],
  "pi-pt-1": [
    { id: "1", sender: "You", isSelf: true, content: "Good morning Priya! How are you feeling after Visit 6?", type: "text", timestamp: "8:30 AM", status: "read" },
    { id: "2", sender: "SUBJ-001", isSelf: false, content: "Good morning Doctor. I feel a bit dizzy after the last dose.", type: "text", timestamp: "11:00 AM", status: "read" },
    { id: "3", sender: "You", isSelf: true, content: "Thank you for letting us know. Please rest and stay hydrated. I'll review your medication.", type: "text", timestamp: "11:05 AM", status: "delivered" },
  ],
  "rt-pt-1": [
    { id: "1", sender: "You", isSelf: true, content: "Hi Priya, reminder to take your morning medication by 9 AM!", type: "text", timestamp: "8:00 AM", status: "read" },
    { id: "2", sender: "SUBJ-001", isSelf: false, content: "I took the medication this morning", type: "text", timestamp: "8:45 AM", status: "read" },
    { id: "3", sender: "SUBJ-001", isSelf: false, content: "", type: "document", timestamp: "8:46 AM", status: "read", attachmentName: "Medication_Log_Today.jpg", attachmentSize: "320 KB" },
    { id: "4", sender: "You", isSelf: true, content: "Great, thank you! Log confirmed.", type: "text", timestamp: "8:50 AM", status: "sent" },
  ],
  "adm-1": [
    { id: "1", sender: "MTB Admin", isSelf: false, content: "Your support ticket #1042 regarding the protocol upload error has been resolved.", type: "text", timestamp: "2d ago", status: "read" },
    { id: "2", sender: "You", isSelf: true, content: "Thank you! The upload is working now.", type: "text", timestamp: "2d ago", status: "read" },
  ],
}

const defaultMessages: Message[] = [
  { id: "1", sender: "Them", isSelf: false, content: "Hello! How can I help you today?", type: "text", timestamp: "Just now", status: "read" },
]

// ── Helpers ──────────────────────────────────────────────

function getStatusIcon(status: string, isSelf: boolean) {
  if (!isSelf) return null
  if (status === "sent")      return <Check className="h-3 w-3 text-muted-foreground/70" />
  if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground/70" />
  if (status === "read")      return <CheckCheck className="h-3 w-3 text-info" />
  return null
}

// ── Main Component ───────────────────────────────────────

export function ChatScreen({ onBack, userRole = "sponsor", onConversationOpenChange }: ChatScreenProps) {
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null)

  // Tell the parent when a conversation is open so it can hide the bottom nav.
  useEffect(() => {
    onConversationOpenChange?.(activeChannel !== null)
  }, [activeChannel, onConversationOpenChange])
  const [channelFilter, setChannelFilter] = useState<ChannelType>(roleChannelTypes[userRole][0])
  const [search, setSearch]               = useState("")
  const [messages, setMessages]           = useState<Message[]>(defaultMessages)
  const [inputText, setInputText]         = useState("")
  const [isRecording, setIsRecording]     = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVoice, setPlayingVoice]   = useState<string | null>(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const messagesEndRef   = useRef<HTMLDivElement>(null)
  const recordingTimer   = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Channels this role can see
  const allowedTypes  = roleChannelTypes[userRole]
  const visibleChannels = allChannels.filter(ch => allowedTypes.includes(ch.channelType))

  useEffect(() => {
    if (!allowedTypes.includes(channelFilter)) setChannelFilter(allowedTypes[0])
  }, [allowedTypes, channelFilter])

  const filteredChannels = visibleChannels.filter(ch => {
    const matchFilter = ch.channelType === channelFilter
    const matchSearch = search === "" || ch.name.toLowerCase().includes(search.toLowerCase()) || ch.role.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Group channels by type for display
  const groupedChannels = allowedTypes.reduce<Record<string, ChatChannel[]>>((acc, type) => {
    const items = filteredChannels.filter(ch => ch.channelType === type)
    if (items.length > 0) acc[type] = items
    return acc
  }, {})

  const totalUnread = visibleChannels.reduce((sum, ch) => sum + ch.unread, 0)

  const openChannel = (ch: ChatChannel) => {
    setActiveChannel(ch)
    setMessages(channelMessages[ch.id] ?? defaultMessages)
    setShowAttachMenu(false)
    setShowCompose(false)
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    const msg: Message = {
      id: Date.now().toString(),
      sender: "You",
      isSelf: true,
      content: inputText,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sent",
    }
    setMessages(prev => [...prev, msg])
    setInputText("")
  }

  const handleAttach = (type: "document" | "image") => {
    setShowAttachMenu(false)
    const msg: Message = {
      id: Date.now().toString(),
      sender: "You",
      isSelf: true,
      content: "",
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sent",
      attachmentName: type === "document" ? "Protocol_Document.pdf" : "Photo_20250526.jpg",
      attachmentSize: type === "document" ? "2.1 MB" : "480 KB",
    }
    setMessages(prev => [...prev, msg])
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingTimer.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingTimer.current) clearInterval(recordingTimer.current)
    if (recordingTime > 0) {
      const msg: Message = {
        id: Date.now().toString(),
        sender: "You",
        isSelf: true,
        content: "",
        type: "voice",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        status: "sent",
        duration: recordingTime,
      }
      setMessages(prev => [...prev, msg])
    }
    setRecordingTime(0)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  // ── Conversation View ─────────────────────────────────
  if (activeChannel) {
    return (
      <div className="flex flex-col h-full bg-surface">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveChannel(null)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {activeChannel.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">{activeChannel.name}</p>
            <p className="text-[11px] text-primary-foreground/75 truncate">{activeChannel.role}</p>
          </div>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0", channelTypeColor[activeChannel.channelType])}>
            {channelTypeLabel[activeChannel.channelType]}
          </span>
          <button className="p-1.5"><MoreVertical className="h-4 w-4" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex", msg.isSelf ? "justify-end" : "justify-start")}>
              {!msg.isSelf && (
                <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-muted-foreground mr-2 flex-shrink-0 self-end">
                  {activeChannel.avatar}
                </div>
              )}
              <div className="max-w-[78%]">
                {/* Text */}
                {msg.type === "text" && (
                  <div className={cn(
                    "rounded-2xl px-4 py-2.5",
                    msg.isSelf
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-card text-foreground rounded-bl-sm shadow-sm"
                  )}>
                    <p className="text-sm leading-snug">{msg.content}</p>
                  </div>
                )}

                {/* Document */}
                {msg.type === "document" && (
                  <div className={cn(
                    "rounded-2xl px-3 py-2.5 flex items-center gap-3",
                    msg.isSelf ? "bg-primary rounded-br-sm" : "bg-card shadow-sm rounded-bl-sm"
                  )}>
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", msg.isSelf ? "bg-white/20" : "bg-destructive/5")}>
                      <FileText className={cn("h-5 w-5", msg.isSelf ? "text-white" : "text-destructive")} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold truncate", msg.isSelf ? "text-white" : "text-foreground")}>{msg.attachmentName}</p>
                      <p className={cn("text-[10px]", msg.isSelf ? "text-white/60" : "text-muted-foreground/70")}>{msg.attachmentSize} · Tap to open</p>
                    </div>
                  </div>
                )}

                {/* Image */}
                {msg.type === "image" && (
                  <div className={cn(
                    "rounded-2xl overflow-hidden",
                    msg.isSelf ? "rounded-br-sm" : "rounded-bl-sm shadow-sm"
                  )}>
                    <div className={cn("w-48 h-36 flex flex-col items-center justify-center gap-2", msg.isSelf ? "bg-primary" : "bg-muted")}>
                      <Camera className={cn("h-8 w-8", msg.isSelf ? "text-white/60" : "text-muted-foreground/70")} />
                      <p className={cn("text-xs", msg.isSelf ? "text-white/70" : "text-muted-foreground")}>{msg.attachmentName}</p>
                      <p className={cn("text-[10px]", msg.isSelf ? "text-white/50" : "text-muted-foreground/70")}>{msg.attachmentSize}</p>
                    </div>
                  </div>
                )}

                {/* Voice */}
                {msg.type === "voice" && (
                  <div className={cn(
                    "rounded-2xl px-3 py-2.5 flex items-center gap-3",
                    msg.isSelf ? "bg-primary rounded-br-sm" : "bg-card shadow-sm rounded-bl-sm"
                  )}>
                    <button
                      onClick={() => setPlayingVoice(playingVoice === msg.id ? null : msg.id)}
                      className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.isSelf ? "bg-white/20" : "bg-info/10")}
                    >
                      {playingVoice === msg.id
                        ? <Pause className={cn("h-4 w-4", msg.isSelf ? "text-white" : "text-primary")} />
                        : <Play  className={cn("h-4 w-4", msg.isSelf ? "text-white" : "text-primary")} />
                      }
                    </button>
                    <div className={cn("flex-1 h-1 rounded-full", msg.isSelf ? "bg-white/30" : "bg-border")}>
                      <div className={cn("h-1 w-1/3 rounded-full", msg.isSelf ? "bg-card" : "bg-primary")} />
                    </div>
                    <span className={cn("text-xs flex-shrink-0", msg.isSelf ? "text-white/70" : "text-muted-foreground")}>{fmt(msg.duration ?? 0)}</span>
                  </div>
                )}

                {/* Timestamp + status */}
                <div className={cn("flex items-center gap-1 mt-1", msg.isSelf ? "justify-end" : "justify-start")}>
                  <span className="text-[10px] text-muted-foreground/70">{msg.timestamp}</span>
                  {getStatusIcon(msg.status, msg.isSelf)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Recording bar */}
        {isRecording && (
          <div className="bg-destructive/5 px-4 py-3 flex items-center justify-between border-t border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm text-destructive font-medium">Recording… {fmt(recordingTime)}</span>
            </div>
            <button onClick={stopRecording} className="text-sm text-destructive font-semibold">Stop</button>
          </div>
        )}

        {/* Attach menu */}
        {showAttachMenu && !isRecording && (
          <div className="bg-card border-t border-border px-4 py-3 flex gap-4">
            <button onClick={() => handleAttach("document")} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-destructive/5 flex items-center justify-center">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Document</span>
            </button>
            <button onClick={() => handleAttach("image")} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-violet/5 flex items-center justify-center">
                <Image className="h-6 w-6 text-purple-500" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Photo</span>
            </button>
            <button onClick={() => handleAttach("image")} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-info/5 flex items-center justify-center">
                <Camera className="h-6 w-6 text-info" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Camera</span>
            </button>
          </div>
        )}

        {/* Input */}
        <div className="bg-card border-t border-border px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={cn("p-2 rounded-full transition-colors", showAttachMenu ? "bg-info/10 text-primary" : "text-muted-foreground/70 hover:text-muted-foreground")}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a message…"
                className="w-full px-4 py-2 bg-muted rounded-full text-sm outline-none"
              />
            </div>
            {inputText.trim() ? (
              <button onClick={handleSend} className="p-2 bg-primary text-white rounded-full flex-shrink-0">
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={() => { if (isRecording) stopRecording() }}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={cn("p-2 rounded-full transition-colors flex-shrink-0", isRecording ? "bg-destructive text-white" : "bg-muted text-muted-foreground")}
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Channel List View ─────────────────────────────────
  return (
    <div className="relative flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-3 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-primary-foreground/75">Secure inbox</p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold leading-tight">Messages</h1>
              {totalUnread > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-info px-2 py-0.5 text-[11px] font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-card" />
                  {totalUnread} unread
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="h-10 px-4 rounded-full bg-card text-primary shadow-sm flex items-center justify-center gap-1.5 text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform"
            aria-label="Start new message"
          >
            <SquarePen className="h-4 w-4" />
            New
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-foreground placeholder-slate-400 text-sm outline-none"
          />
          {search && <button onClick={() => setSearch("")} className="rounded-full p-0.5 hover:bg-muted"><X className="h-4 w-4 text-muted-foreground/70" /></button>}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 bg-card px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
        {allowedTypes.map(type => {
          const meta = channelTypeMeta[type]
          const Icon = meta.icon
          const count = visibleChannels.filter(ch => ch.channelType === type).length

          return (
            <button
              key={type}
              onClick={() => setChannelFilter(type)}
              className={cn("flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap inline-flex items-center gap-1.5",
                channelFilter === type ? "bg-primary text-white border-primary" : meta.soft)}
            >
              <Icon className="h-3.5 w-3.5" />
              {channelTypeLabel[type]}
              <span className={cn("ml-0.5 rounded-full px-1.5 py-0.5 text-[10px]", channelFilter === type ? "bg-white/15 text-white" : "bg-white/70")}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Channel list grouped */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {Object.entries(groupedChannels).map(([type, channels]) => {
          const channelType = type as ChannelType
          const meta = channelTypeMeta[channelType]
          const Icon = meta.icon

          return (
          <div key={type} className="mb-4 last:mb-0">
            {/* Section header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("h-7 w-7 rounded-full flex items-center justify-center border", meta.soft)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {channelTypeLabel[channelType]}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground/70">{channels.length}</span>
            </div>

            <div className="space-y-2">
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => openChannel(ch)}
                  className={cn(
                    "relative w-full overflow-hidden rounded-lg border bg-card px-3 py-3 text-left shadow-sm transition-colors hover:bg-surface",
                    ch.unread > 0 ? "border-info/20 shadow-blue-950/5" : "border-border"
                  )}
                >
                  <span className={cn("absolute inset-y-0 left-0 w-1", ch.unread > 0 ? meta.accent : "bg-transparent")} />
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ring-1", meta.avatar)}>
                        {ch.avatar}
                      </div>
                      {ch.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className={cn("min-w-0 flex-1 truncate text-sm", ch.unread > 0 ? "font-bold text-slate-950" : "font-semibold text-foreground")}>
                          {ch.name}
                        </p>
                        <p className={cn("flex-shrink-0 text-[11px]", ch.unread > 0 ? "font-bold text-primary" : "font-medium text-muted-foreground/70")}>
                          {ch.time}
                        </p>
                      </div>

                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={cn("max-w-full truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold", meta.soft)}>
                          {ch.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className={cn("min-w-0 flex-1 truncate text-xs", ch.unread > 0 ? "font-semibold text-foreground/80" : "text-muted-foreground")}>
                          {ch.lastMessage}
                        </p>
                        {ch.unread > 0 && (
                          <span className="h-5 min-w-5 rounded-full bg-primary px-1.5 text-center text-[10px] font-bold leading-5 text-white">
                            {ch.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          )
        })}

        {filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-6">
            <Search className="w-10 h-10 text-slate-300" />
            <p className="text-muted-foreground font-medium text-sm">No conversations found</p>
          </div>
        )}
      </div>

      {showCompose && (
        <div className="absolute inset-0 z-20 flex flex-col bg-surface">
          <div className="bg-primary px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="rounded-full p-1 hover:bg-white/10"
                aria-label="Close new message"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-primary-foreground/75">Start chat</p>
                <h2 className="text-lg font-semibold leading-tight">New message</h2>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-4 py-3">
            {allowedTypes.map(type => {
              const contacts = visibleChannels.filter(ch => ch.channelType === type)
              if (contacts.length === 0) return null

              const meta = channelTypeMeta[type]
              const Icon = meta.icon

              return (
                <div key={type} className="mb-4 last:mb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={cn("h-7 w-7 rounded-full flex items-center justify-center border", meta.soft)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {channelTypeLabel[type]}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {contacts.map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => openChannel(ch)}
                        className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left shadow-sm hover:bg-surface"
                      >
                        <div className="relative flex-shrink-0">
                          <div className={cn("h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold ring-1", meta.avatar)}>
                            {ch.avatar}
                          </div>
                          {ch.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-success" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">{ch.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{ch.role}</p>
                        </div>
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                          Message
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
