"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Users, Plus, Trash2, UserPlus, ChevronDown, ChevronRight,
  Mail, ToggleLeft, ToggleRight, AlertTriangle, Zap, Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { RecipientGroupVM } from "@/lib/strapi/global/email-config/recipient-group/recipient-group-view-models"
import {
  createRecipientGroup,
  toggleRecipientGroup,
  deleteRecipientGroup,
  addGroupMember,
  removeGroupMember,
  resolveRecipientsAction,
  type CreateRecipientGroupInput,
  type EmailStaffInput,
} from "@/lib/strapi/global/email-config/recipient-group/recipient-group-actions"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TYPE_COLORS: Record<string, string> = {
  service: "bg-blue-500/20 text-blue-400",
  contact: "bg-green-500/20 text-green-400",
  quotation: "bg-purple-500/20 text-purple-400",
}

const URGENCY_LABELS: Record<string, string> = {
  all: "All Urgency Levels",
  "emergency-only": "Emergency Only",
  "urgent-and-emergency": "Urgent & Emergency",
  "routine-only": "Routine Only",
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  initialGroups: RecipientGroupVM[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function RecipientGroupsClient({ initialGroups }: Props) {
  const router = useRouter()
  const [groupList, setGroupList] = useState(initialGroups)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [testType, setTestType] = useState<"service" | "contact" | "quotation">("service")
  const [testUrgency, setTestUrgency] = useState<"routine" | "urgent" | "emergency">("routine")
  const [testResult, setTestResult] = useState<string[] | null>(null)

  // Create form
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newTypes, setNewTypes] = useState<("service" | "contact" | "quotation")[]>([])
  const [newUrgency, setNewUrgency] = useState<CreateRecipientGroupInput["urgencyFilter"]>("all")

  // Add member form
  const [memberName, setMemberName] = useState("")
  const [memberEmail, setMemberEmail] = useState("")
  const [memberRole, setMemberRole] = useState("")

  // Sync when RSC delivers fresh props after router.refresh()
  useEffect(() => { setGroupList(initialGroups) }, [initialGroups])

  const stats = useMemo(() => {
    const uniqueEmails = new Set(groupList.flatMap(g => g.members.map(m => m.email)))
    const coverageByType: Record<string, number> = { service: 0, contact: 0, quotation: 0 }
    for (const g of groupList) {
      for (const t of g.templateTypes) coverageByType[t] = (coverageByType[t] ?? 0) + 1
    }
    return {
      totalGroups: groupList.length,
      activeGroups: groupList.filter(g => g.isActive).length,
      uniqueMembers: uniqueEmails.size,
      totalMembers: groupList.reduce((sum, g) => sum + g.members.length, 0),
      coverageByType,
    }
  }, [groupList])

  const refresh = useCallback(async () => { router.refresh() }, [router])

  async function handleCreate() {
    if (!newName.trim() || newTypes.length === 0) return
    setSaving(true)
    await createRecipientGroup({ name: newName, description: newDesc || null, templateTypes: newTypes, urgencyFilter: newUrgency })
    setNewName(""); setNewDesc(""); setNewTypes([]); setNewUrgency("all"); setShowCreate(false)
    await refresh()
    setSaving(false)
  }

  async function handleAddMember(group: RecipientGroupVM) {
    if (!memberEmail.trim()) return
    setSaving(true)
    const currentMembersInput: EmailStaffInput[] = group.members.map(
      ({ name, email, role, isActive }) => ({ name, email, role, isActive }),
    )
    const newMember: EmailStaffInput = {
      name: memberName,
      email: memberEmail,
      role: memberRole,
      isActive: true,
    }
    await addGroupMember(group.documentId, currentMembersInput, newMember)
    setMemberName(""); setMemberEmail(""); setMemberRole("")
    await refresh()
    setSaving(false)
  }

  async function handleRemoveMember(group: RecipientGroupVM, memberEmailToRemove: string) {
    setSaving(true)
    const currentMembersInput: EmailStaffInput[] = group.members.map(
      ({ name, email, role, isActive }) => ({ name, email, role, isActive }),
    )
    await removeGroupMember(group.documentId, currentMembersInput, memberEmailToRemove)
    await refresh()
    setSaving(false)
  }

  async function handleToggle(group: RecipientGroupVM) {
    setSaving(true)
    await toggleRecipientGroup(group.documentId, !group.isActive)
    await refresh()
    setSaving(false)
  }

  async function handleDelete(group: RecipientGroupVM) {
    setSaving(true)
    await deleteRecipientGroup(group.documentId)
    setExpandedId(null)
    await refresh()
    setSaving(false)
  }

  async function handleTestResolve() {
    const result = await resolveRecipientsAction(testType, testUrgency)
    setTestResult(result.emails)
  }

  function toggleType(type: "service" | "contact" | "quotation") {
    setNewTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/admin/email"><ArrowLeft className="mr-2 h-4 w-4" /> Email Configuration</Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-accent" />
              Recipient Groups
            </h1>
            <p className="text-muted-foreground mt-1">
              Define which staff members receive business notifications per template type and urgency level.
            </p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-2 h-4 w-4" /> New Group
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="responsive-grid-icon-2-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Groups</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalGroups}</p>
            <p className="text-xs text-muted-foreground">{stats.activeGroups} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Unique Members</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.uniqueMembers}</p>
            <p className="text-xs text-muted-foreground">{stats.totalMembers} total assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Type Coverage</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(stats.coverageByType).map(([type, count]) => (
                <Badge key={type} className={`${TYPE_COLORS[type]} border-0 text-[10px]`}>
                  {type}: {count} group{count !== 1 ? "s" : ""}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/30">
          <CardContent className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground">Test Resolution</p>
            <div className="flex gap-2">
              <Select value={testType} onValueChange={(v) => setTestType(v as typeof testType)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="quotation">Quotation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={testUrgency} onValueChange={(v) => setTestUrgency(v as typeof testUrgency)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="w-full" onClick={handleTestResolve}>
              <Zap className="mr-2 h-3 w-3" /> Resolve
            </Button>
            {testResult && (
              <div className="text-xs space-y-1 bg-muted/50 p-2 rounded">
                {testResult.length === 0 ? (
                  <p className="text-muted-foreground italic">No recipients matched.</p>
                ) : (
                  testResult.map((e) => (
                    <div key={e} className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-accent" />
                      <span className="font-mono text-foreground">{e}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Group Form */}
      {showCreate && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Create New Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="responsive-grid-2">
              <div className="space-y-2">
                <Label className="text-sm">Group Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Emergency Response Team" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Urgency Filter</Label>
                <Select value={newUrgency} onValueChange={(v) => setNewUrgency(v as CreateRecipientGroupInput["urgencyFilter"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency Levels</SelectItem>
                    <SelectItem value="emergency-only">Emergency Only</SelectItem>
                    <SelectItem value="urgent-and-emergency">Urgent &amp; Emergency</SelectItem>
                    <SelectItem value="routine-only">Routine Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Description</Label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What this group is responsible for" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Template Types</Label>
              <div className="flex gap-4">
                {(["service", "contact", "quotation"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={newTypes.includes(type)} onCheckedChange={() => toggleType(type)} />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!newName.trim() || newTypes.length === 0 || saving}>
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group List */}
      {groupList.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No groups found.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {groupList.map((group) => {
            const isExpanded = expandedId === group.documentId
            return (
              <Card key={group.documentId} className={group.isActive ? "border-accent/20" : "opacity-70"}>
                <button
                  type="button"
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : group.documentId)}
                >
                  <div className="shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="shrink-0">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{group.name}</p>
                      {group.templateTypes.map((t) => (
                        <Badge key={t} className={`${TYPE_COLORS[t]} border-0 text-[10px]`}>{t}</Badge>
                      ))}
                      {group.urgencyFilter !== "all" && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">
                          <Shield className="h-2.5 w-2.5 mr-1" />
                          {URGENCY_LABELS[group.urgencyFilter]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</span>
                    {group.isActive ? (
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">Active</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">Inactive</Badge>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-6 px-6 space-y-5 border-t border-border">
                    {/* Controls */}
                    <div className="flex items-center gap-2 pt-4">
                      <Button variant="outline" size="sm" disabled={saving} onClick={() => handleToggle(group)}>
                        {group.isActive ? (
                          <><ToggleRight className="mr-2 h-4 w-4 text-green-400" /> Deactivate</>
                        ) : (
                          <><ToggleLeft className="mr-2 h-4 w-4" /> Activate</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-400 bg-transparent"
                        disabled={saving}
                        onClick={() => handleDelete(group)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Group
                      </Button>
                    </div>

                    {/* Members */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Members</p>
                      {group.members.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No members yet. Add someone below.</p>
                      ) : (
                        <div className="rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Name</th>
                                <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Email</th>
                                <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Role</th>
                                <th className="w-10" />
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {group.members.map((m) => (
                                <tr key={m.email}>
                                  <td className="px-4 py-2.5 text-foreground">{m.name}</td>
                                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{m.email}</td>
                                  <td className="px-4 py-2.5 text-muted-foreground">{m.role}</td>
                                  <td className="px-2 py-2.5">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-muted-foreground hover:text-red-400 h-7 w-7 p-0"
                                      disabled={saving}
                                      onClick={() => handleRemoveMember(group, m.email)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Add member form */}
                    <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Add Member
                      </p>
                      <div className="responsive-grid-3">
                        <Input placeholder="Name" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="text-sm" />
                        <Input placeholder="Email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="text-sm font-mono" />
                        <Input placeholder="Role" value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className="text-sm" />
                      </div>
                      <Button size="sm" disabled={!memberEmail.trim() || saving} onClick={() => handleAddMember(group)}>
                        Add Member
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Architecture note */}
      <Card className="border-dashed border-amber-500/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">How Recipient Resolution Works</p>
              <p className="text-xs text-muted-foreground mt-1">
                At send-time, <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">resolveRecipients(type, urgency)</code> filters
                active groups by template type and urgency filter, then collects unique email addresses from all matching groups.
                This replaces the single BUSINESS_EMAIL env var with granular, per-template routing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
