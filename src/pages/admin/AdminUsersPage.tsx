import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock user data across all tenants
const allUsers = [
  {
    id: '1',
    name: 'ClarityClaim System Admin',
    email: 'admin@clarityclaim.ai',
    role: 'super_admin',
    organization: 'ClarityClaim Demo Org',
    organizationType: 'System',
    status: 'active',
    lastLogin: '2 minutes ago',
    isSystemAdmin: true,
    avatar: null,
  },
  {
    id: '2',
    name: 'Elena Moore',
    email: 'elena.moore@aegishealth.org',
    role: 'executive',
    organization: 'Aegis Health System',
    organizationType: 'Health System',
    status: 'active',
    lastLogin: '1 hour ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '3',
    name: 'Jordan Williams',
    email: 'jordan.williams@aegishealth.org',
    role: 'manager',
    organization: 'Aegis Health System',
    organizationType: 'Health System',
    status: 'active',
    lastLogin: '3 hours ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '4',
    name: 'Anthony Patel',
    email: 'anthony.patel@aegishealth.org',
    role: 'billing_specialist',
    organization: 'Aegis Health System',
    organizationType: 'Health System',
    status: 'active',
    lastLogin: '30 minutes ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '5',
    name: 'Lisa Chen',
    email: 'lisa.chen@aegishealth.org',
    role: 'billing_specialist',
    organization: 'Aegis Health System',
    organizationType: 'Health System',
    status: 'active',
    lastLogin: '2 hours ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '6',
    name: 'Dr. Maya Chen',
    email: 'maya.chen@unitycare.org',
    role: 'manager',
    organization: 'Unity Community Care Network',
    organizationType: 'FQHC',
    status: 'active',
    lastLogin: '4 hours ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '7',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@unitycare.org',
    role: 'billing_specialist',
    organization: 'Unity Community Care Network',
    organizationType: 'FQHC',
    status: 'active',
    lastLogin: '1 day ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '8',
    name: 'Priya Iyer',
    email: 'priya.iyer@sunrisepeds.org',
    role: 'admin',
    organization: 'Sunrise Pediatrics Group',
    organizationType: 'Specialty Practice',
    status: 'active',
    lastLogin: '5 hours ago',
    isSystemAdmin: false,
    avatar: null,
  },
  {
    id: '9',
    name: 'David Martinez',
    email: 'david.martinez@sunrisepeds.org',
    role: 'billing_specialist',
    organization: 'Sunrise Pediatrics Group',
    organizationType: 'Specialty Practice',
    status: 'active',
    lastLogin: '2 days ago',
    isSystemAdmin: false,
    avatar: null,
  },
];

const roleLabels: Record<string, string> = {
  super_admin: 'System Admin',
  admin: 'Admin',
  owner: 'Owner',
  executive: 'Executive',
  manager: 'Manager',
  billing_specialist: 'Billing Specialist',
  user: 'User',
  viewer: 'Viewer',
};

const organizations = [
  'All Organizations',
  'ClarityClaim Demo Org',
  'Aegis Health System',
  'Unity Community Care Network',
  'Sunrise Pediatrics Group',
];

const roles = [
  'All Roles',
  'super_admin',
  'admin',
  'executive',
  'manager',
  'billing_specialist',
  'user',
];

const AdminUsersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('All Organizations');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrg === 'All Organizations' || user.organization === selectedOrg;
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
    return matchesSearch && matchesOrg && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700';
      case 'admin':
      case 'owner':
        return isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
      case 'executive':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'manager':
        return isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'inactive':
        return isDark ? 'text-neutral-500' : 'text-neutral-400';
      case 'locked':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return isDark ? 'text-neutral-400' : 'text-neutral-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Users
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Manage users across all organizations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              isDark ? "text-neutral-500" : "text-neutral-400"
            )} />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Organization Filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="w-full sm:w-auto justify-between"
            >
              <Building2 className="h-4 w-4 mr-2" />
              {selectedOrg}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {showOrgDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowOrgDropdown(false)} />
                <div className={cn(
                  "absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 py-1",
                  isDark ? "bg-neutral-900 border border-neutral-800" : "bg-white border border-neutral-200"
                )}>
                  {organizations.map(org => (
                    <button
                      key={org}
                      onClick={() => {
                        setSelectedOrg(org);
                        setShowOrgDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors",
                        selectedOrg === org
                          ? isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                          : isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {org}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full sm:w-auto justify-between"
            >
              <Shield className="h-4 w-4 mr-2" />
              {selectedRole === 'All Roles' ? 'All Roles' : roleLabels[selectedRole]}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {showRoleDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
                <div className={cn(
                  "absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 py-1",
                  isDark ? "bg-neutral-900 border border-neutral-800" : "bg-white border border-neutral-200"
                )}>
                  {roles.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setShowRoleDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors",
                        selectedRole === role
                          ? isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                          : isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {role === 'All Roles' ? role : roleLabels[role]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-blue-500/10" : "bg-blue-50"
              )}>
                <Users className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {allUsers.length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Total Users
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {allUsers.filter(u => u.status === 'active').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Active
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-amber-500/10" : "bg-amber-50"
              )}>
                <ShieldCheck className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {allUsers.filter(u => u.isSystemAdmin).length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  System Admins
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-purple-500/10" : "bg-purple-50"
              )}>
                <Building2 className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {new Set(allUsers.map(u => u.organization)).size}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Organizations
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"
                )}>
                  <th className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    User
                  </th>
                  <th className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    Organization
                  </th>
                  <th className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    Role
                  </th>
                  <th className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    Status
                  </th>
                  <th className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    Last Active
                  </th>
                  <th className={cn(
                    "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y",
                isDark ? "divide-neutral-800" : "divide-neutral-200"
              )}>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "transition-colors",
                      isDark
                        ? "hover:bg-neutral-800/50"
                        : "hover:bg-neutral-50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          user.isSystemAdmin
                            ? isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                            : isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {user.isSystemAdmin ? (
                            <ShieldCheck className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {user.name}
                          </p>
                          <p className={cn(
                            "text-xs flex items-center gap-1",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className={cn(
                          "text-sm",
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        )}>
                          {user.organization}
                        </p>
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          {user.organizationType}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getRoleColor(user.role)
                      )}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        getStatusColor(user.status)
                      )}>
                        {user.status === 'active' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        <Clock className="h-4 w-4" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className={cn(
                "h-12 w-12 mx-auto mb-4",
                isDark ? "text-neutral-600" : "text-neutral-400"
              )} />
              <h3 className={cn(
                "font-semibold mb-1",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                No users found
              </h3>
              <p className={cn(
                "text-sm",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
