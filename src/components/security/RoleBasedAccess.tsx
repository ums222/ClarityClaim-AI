import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Eye,
  Edit,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  getRoles,
  updateRole,
  RolePermission,
  PermissionsMap,
} from '../../lib/security';
import { useAuth } from '../../contexts/AuthContext';

export function RoleBasedAccess() {
  const { profile } = useAuth();
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<PermissionsMap | null>(null);
  const [saving, setSaving] = useState(false);

  const canManage = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditRole(role: RolePermission) {
    setEditingRole(role.id);
    setEditedPermissions(role.permissions);
    setExpandedRole(role.id);
  }

  async function handleSaveRole(roleId: string) {
    if (!editedPermissions) return;

    setSaving(true);
    try {
      await updateRole(roleId, { permissions: editedPermissions });
      await loadRoles();
      setEditingRole(null);
      setEditedPermissions(null);
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setSaving(false);
    }
  }

  function togglePermission(category: string, permission: string) {
    if (!editedPermissions) return;

    setEditedPermissions({
      ...editedPermissions,
      [category]: {
        ...(editedPermissions as any)[category],
        [permission]: !(editedPermissions as any)[category][permission],
      },
    });
  }

  function getPhiAccessBadge(level: string) {
    switch (level) {
      case 'full':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <Eye className="w-3 h-3" />
            Full PHI Access
          </span>
        );
      case 'limited':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Eye className="w-3 h-3" />
            Limited PHI
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Lock className="w-3 h-3" />
            No PHI Access
          </span>
        );
    }
  }

  const permissionCategories = [
    { key: 'claims', label: 'Claims', permissions: ['view', 'create', 'edit', 'delete', 'export'] },
    { key: 'appeals', label: 'Appeals', permissions: ['view', 'create', 'edit', 'delete', 'submit'] },
    { key: 'patients', label: 'Patients', permissions: ['view', 'create', 'edit', 'delete', 'view_phi'] },
    { key: 'analytics', label: 'Analytics', permissions: ['view', 'export'] },
    { key: 'integrations', label: 'Integrations', permissions: ['view', 'manage'] },
    { key: 'team', label: 'Team', permissions: ['view', 'invite', 'manage_roles', 'remove'] },
    { key: 'billing', label: 'Billing', permissions: ['view', 'manage'] },
    { key: 'settings', label: 'Settings', permissions: ['view', 'manage'] },
    { key: 'security', label: 'Security', permissions: ['view_logs', 'manage_2fa', 'manage_sessions'] },
    { key: 'api', label: 'API', permissions: ['view_keys', 'create_keys', 'revoke_keys'] },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Role-Based Access Control
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Define granular permissions for each role
          </p>
        </div>
        {canManage && (
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Role
          </Button>
        )}
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id} className="overflow-hidden">
            {/* Role Header */}
            <div
              className={`p-4 flex items-center justify-between cursor-pointer ${
                expandedRole === role.id ? 'bg-slate-50 dark:bg-slate-800/50' : ''
              }`}
              onClick={() =>
                setExpandedRole(expandedRole === role.id ? null : role.id)
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    role.role === 'owner'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : role.role === 'admin'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <Users
                    className={`w-5 h-5 ${
                      role.role === 'owner'
                        ? 'text-amber-600 dark:text-amber-400'
                        : role.role === 'admin'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {role.role_name}
                    </h4>
                    {role.is_system && (
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {role.role_description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getPhiAccessBadge(role.phi_access_level)}
                {expandedRole === role.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {/* Expanded Permissions */}
            <AnimatePresence>
              {expandedRole === role.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    {/* Actions */}
                    {canManage && !role.is_system && (
                      <div className="mb-4 flex items-center gap-2">
                        {editingRole === role.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSaveRole(role.id)}
                              disabled={saving}
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Check className="w-4 h-4 mr-2" />
                              )}
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingRole(null);
                                setEditedPermissions(null);
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Permissions
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Permissions Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {permissionCategories.map((category) => {
                        const permissions =
                          editingRole === role.id && editedPermissions
                            ? (editedPermissions as any)[category.key]
                            : (role.permissions as any)[category.key];

                        return (
                          <div
                            key={category.key}
                            className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                          >
                            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              {category.label}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {category.permissions.map((perm) => {
                                const hasPermission = permissions?.[perm] ?? false;
                                const isEditing = editingRole === role.id;

                                return (
                                  <button
                                    key={perm}
                                    onClick={() =>
                                      isEditing &&
                                      togglePermission(category.key, perm)
                                    }
                                    disabled={!isEditing}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                      hasPermission
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-500'
                                    } ${
                                      isEditing
                                        ? 'cursor-pointer hover:opacity-80'
                                        : 'cursor-default'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {hasPermission ? (
                                        <Unlock className="w-3 h-3" />
                                      ) : (
                                        <Lock className="w-3 h-3" />
                                      )}
                                      {perm.replace(/_/g, ' ')}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* PHI Access Warning */}
      <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              PHI Access Control
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Protected Health Information (PHI) access is strictly controlled based on role
              assignments. Users with "No PHI Access" cannot view patient identifiable information.
              All PHI access is logged for HIPAA compliance.
            </p>
          </div>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Access Control Best Practices
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Principle of Least Privilege',
              description:
                'Grant users only the minimum permissions needed to perform their job functions.',
            },
            {
              title: 'Regular Access Reviews',
              description:
                'Review user access permissions quarterly to ensure they are still appropriate.',
            },
            {
              title: 'Separation of Duties',
              description:
                'Divide sensitive operations among multiple roles to prevent fraud.',
            },
            {
              title: 'Audit Trail',
              description:
                'All permission changes are logged and can be reviewed in the audit log.',
            },
          ].map((practice, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
            >
              <Shield className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-slate-900 dark:text-white">
                  {practice.title}
                </h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {practice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default RoleBasedAccess;
