import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Mail,
  MoreVertical,
  Shield,
  Clock,
  Check,
  X,
  Loader2,
  Trash2,
  UserCog,
  Send,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getTeamMembers,
  getTeamInvitations,
  createTeamInvitation,
  revokeTeamInvitation,
  updateTeamMemberRole,
  removeTeamMember,
  ROLES,
  type TeamMember,
  type TeamInvitation,
} from '../../lib/settings';

export function TeamSettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';
  const canManageTeam = profile?.role === 'owner' || profile?.role === 'admin' || profile?.role === 'manager';

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const [membersData, invitationsData] = await Promise.all([
        getTeamMembers(),
        getTeamInvitations(),
      ]);
      setMembers(membersData);
      setInvitations(invitationsData.filter(inv => inv.status === 'pending'));
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setInviting(true);
    setMessage(null);
    
    try {
      await createTeamInvitation(inviteEmail, inviteRole);
      setMessage({ type: 'success', text: 'Invitation sent successfully' });
      setInviteEmail('');
      setInviteRole('member');
      setInviteModalOpen(false);
      loadTeamData();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to send invitation' });
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await revokeTeamInvitation(invitationId);
      setMessage({ type: 'success', text: 'Invitation revoked' });
      loadTeamData();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to revoke invitation' });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateTeamMemberRole(memberId, newRole);
      setMessage({ type: 'success', text: 'Role updated successfully' });
      setEditingMember(null);
      loadTeamData();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update role' });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      await removeTeamMember(memberId);
      setMessage({ type: 'success', text: 'Team member removed' });
      loadTeamData();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to remove member' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'admin':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'manager':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'viewer':
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
      default:
        return isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDark ? "text-teal-400" : "text-teal-600"
        )} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Team Members
          </h3>
          <p className={cn(
            "text-sm mt-0.5",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            {members.length} member{members.length !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        {canManageTeam && (
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {message && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-sm",
          message.type === 'success'
            ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-600"
            : isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
        )}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Team Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {members.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "flex items-center justify-between p-4 transition-colors",
                  isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                    isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"
                  )}>
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      member.full_name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {member.full_name}
                        {member.id === profile?.id && (
                          <span className={cn(
                            "ml-2 text-xs",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            (you)
                          </span>
                        )}
                      </p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        getRoleBadgeColor(member.role)
                      )}>
                        {member.role}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}>
                      {member.email}
                      {member.job_title && ` • ${member.job_title}`}
                    </p>
                  </div>
                </div>

                {isAdmin && member.id !== profile?.id && member.role !== 'owner' && (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDark 
                          ? "hover:bg-neutral-700 text-neutral-400"
                          : "hover:bg-neutral-200 text-neutral-600"
                      )}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {menuOpen === member.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                              "absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-50 py-1 ring-1",
                              isDark ? "bg-neutral-800 ring-neutral-700" : "bg-white ring-neutral-200"
                            )}
                          >
                            <button
                              onClick={() => {
                                setEditingMember(member.id);
                                setEditingRole(member.role);
                                setMenuOpen(null);
                              }}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                                isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700"
                              )}
                            >
                              <UserCog className="h-4 w-4" />
                              Change Role
                            </button>
                            <button
                              onClick={() => {
                                handleRemoveMember(member.id);
                                setMenuOpen(null);
                              }}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                                isDark ? "hover:bg-neutral-700 text-red-400" : "hover:bg-neutral-100 text-red-600"
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Member
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <div className="p-8 text-center">
                <Users className={cn(
                  "h-12 w-12 mx-auto mb-3",
                  isDark ? "text-neutral-600" : "text-neutral-400"
                )} />
                <p className={cn(
                  "text-sm font-medium",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  No team members yet
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  isDark ? "text-neutral-500" : "text-neutral-500"
                )}>
                  Invite people to join your team
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className={cn(
            "text-sm font-medium mb-3",
            isDark ? "text-neutral-300" : "text-neutral-700"
          )}>
            Pending Invitations
          </h4>
          <Card className="overflow-hidden">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={cn(
                    "flex items-center justify-between p-4",
                    isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-50 text-yellow-600"
                    )}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {invitation.email}
                        </p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          getRoleBadgeColor(invitation.role)
                        )}>
                          {invitation.role}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs mt-0.5 flex items-center gap-1",
                        isDark ? "text-neutral-500" : "text-neutral-500"
                      )}>
                        <Clock className="h-3 w-3" />
                        Expires {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {canManageTeam && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeInvitation(invitation.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Role Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4">
          <h4 className={cn(
            "text-sm font-medium mb-3 flex items-center gap-2",
            isDark ? "text-neutral-300" : "text-neutral-700"
          )}>
            <Shield className="h-4 w-4" />
            Role Permissions
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.filter(r => r.value !== 'owner').map((role) => (
              <div
                key={role.value}
                className={cn(
                  "p-3 rounded-lg",
                  isDark ? "bg-neutral-800" : "bg-neutral-50"
                )}
              >
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  getRoleBadgeColor(role.value)
                )}>
                  {role.label}
                </span>
                <p className={cn(
                  "text-xs mt-2",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setInviteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl shadow-xl p-6",
                isDark ? "bg-neutral-900" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    required
                  />
                </div>

                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Role
                  </label>
                  <Select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    {ROLES.filter(r => r.value !== 'owner').map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviting}>
                    {inviting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setEditingMember(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl shadow-xl p-6",
                isDark ? "bg-neutral-900" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Change Member Role
                </h3>
                <button
                  onClick={() => setEditingMember(null)}
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    New Role
                  </label>
                  <Select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                  >
                    {ROLES.filter(r => r.value !== 'owner').map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateRole(editingMember, editingRole)}
                  >
                    Update Role
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeamSettings;
