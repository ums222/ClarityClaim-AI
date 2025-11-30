import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Brain,
  User,
  Shield,
  Eye,
  Edit,
  Trash2,
  LogIn,
  ChevronDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock audit log data
const auditLogs = [
  {
    id: '1',
    eventType: 'AI_DENIAL_RISK',
    category: 'ai',
    user: 'System',
    organization: 'Aegis Health System',
    resourceType: 'claim',
    resourceId: 'CLM-AEG-2024-000145',
    description: 'AI denial risk prediction generated for claim',
    severity: 'info',
    metadata: { model_version: 'v1.3', risk_score: 0.78 },
    timestamp: '2024-11-30T14:32:15Z',
    phiAccessed: true,
  },
  {
    id: '2',
    eventType: 'AI_APPEAL_GENERATED',
    category: 'ai',
    user: 'Jordan Williams',
    organization: 'Aegis Health System',
    resourceType: 'appeal',
    resourceId: 'APL-AEG-2024-000089',
    description: 'AI-generated appeal letter created',
    severity: 'info',
    metadata: { model_version: 'v1.3', confidence: 0.92 },
    timestamp: '2024-11-30T14:28:00Z',
    phiAccessed: true,
  },
  {
    id: '3',
    eventType: 'CLAIM_VIEWED',
    category: 'phi_access',
    user: 'Anthony Patel',
    organization: 'Aegis Health System',
    resourceType: 'claim',
    resourceId: 'CLM-AEG-2024-000143',
    description: 'User viewed claim with PHI',
    severity: 'info',
    metadata: { fields_accessed: ['patient_name', 'patient_dob', 'diagnosis'] },
    timestamp: '2024-11-30T14:15:30Z',
    phiAccessed: true,
  },
  {
    id: '4',
    eventType: 'USER_LOGIN',
    category: 'auth',
    user: 'Elena Moore',
    organization: 'Aegis Health System',
    resourceType: 'session',
    resourceId: null,
    description: 'User logged in successfully',
    severity: 'info',
    metadata: { ip_address: '192.168.1.100', device: 'Chrome/Windows' },
    timestamp: '2024-11-30T13:45:00Z',
    phiAccessed: false,
  },
  {
    id: '5',
    eventType: 'EQUITY_ANALYSIS_RUN',
    category: 'ai',
    user: 'System',
    organization: 'Unity Community Care Network',
    resourceType: 'report',
    resourceId: 'EQ-UNITY-2024-015',
    description: 'Equity disparity analysis completed',
    severity: 'warning',
    metadata: { dimensions_analyzed: ['zip_code', 'income_bracket'], disparities_found: 3 },
    timestamp: '2024-11-30T13:30:00Z',
    phiAccessed: false,
  },
  {
    id: '6',
    eventType: 'APPEAL_SUBMITTED',
    category: 'workflow',
    user: 'Marcus Johnson',
    organization: 'Unity Community Care Network',
    resourceType: 'appeal',
    resourceId: 'APL-UNITY-2024-000056',
    description: 'Appeal submitted to payer',
    severity: 'info',
    metadata: { payer: 'Medicaid', amount: 285 },
    timestamp: '2024-11-30T12:00:00Z',
    phiAccessed: true,
  },
  {
    id: '7',
    eventType: 'FAILED_LOGIN_ATTEMPT',
    category: 'auth',
    user: 'unknown',
    organization: 'Unknown',
    resourceType: 'session',
    resourceId: null,
    description: 'Failed login attempt detected',
    severity: 'warning',
    metadata: { email_attempted: 'admin@test.com', ip_address: '45.33.32.156' },
    timestamp: '2024-11-30T11:45:00Z',
    phiAccessed: false,
  },
  {
    id: '8',
    eventType: 'ROLE_CHANGED',
    category: 'admin',
    user: 'Priya Iyer',
    organization: 'Sunrise Pediatrics Group',
    resourceType: 'user',
    resourceId: 'david.martinez@sunrisepeds.org',
    description: 'User role changed from user to billing_specialist',
    severity: 'info',
    metadata: { old_role: 'user', new_role: 'billing_specialist' },
    timestamp: '2024-11-30T10:30:00Z',
    phiAccessed: false,
  },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'ai', label: 'AI Actions' },
  { value: 'phi_access', label: 'PHI Access' },
  { value: 'auth', label: 'Authentication' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'admin', label: 'Admin' },
];

const AdminAuditLogPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEventIcon = (eventType: string) => {
    if (eventType.startsWith('AI_')) return <Brain className="h-4 w-4" />;
    if (eventType.includes('LOGIN') || eventType.includes('AUTH')) return <LogIn className="h-4 w-4" />;
    if (eventType.includes('VIEW')) return <Eye className="h-4 w-4" />;
    if (eventType.includes('EDIT') || eventType.includes('CHANGE')) return <Edit className="h-4 w-4" />;
    if (eventType.includes('DELETE')) return <Trash2 className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600';
      case 'phi_access':
        return isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'auth':
        return isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'workflow':
        return isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600';
      case 'admin':
        return isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600';
      default:
        return isDark ? 'bg-neutral-500/10 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-500")} />;
      case 'error':
        return <AlertTriangle className={cn("h-4 w-4", isDark ? "text-red-400" : "text-red-500")} />;
      default:
        return <CheckCircle2 className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              Audit Log
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              HIPAA-compliant audit trail of all platform activity
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
                <FileText className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {auditLogs.length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Events Today
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-teal-500/10" : "bg-teal-50"
              )}>
                <Brain className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {auditLogs.filter(l => l.category === 'ai').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  AI Actions
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
                <Shield className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {auditLogs.filter(l => l.phiAccessed).length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  PHI Access
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
                <AlertTriangle className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {auditLogs.filter(l => l.severity === 'warning').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Warnings
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              isDark ? "text-neutral-500" : "text-neutral-400"
            )} />
            <Input
              placeholder="Search events, users, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full sm:w-auto justify-between"
            >
              <Filter className="h-4 w-4 mr-2" />
              {categories.find(c => c.value === selectedCategory)?.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {showCategoryDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategoryDropdown(false)} />
                <div className={cn(
                  "absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 py-1",
                  isDark ? "bg-neutral-900 border border-neutral-800" : "bg-white border border-neutral-200"
                )}>
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setShowCategoryDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors",
                        selectedCategory === category.value
                          ? isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                          : isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "p-4 transition-colors",
                  isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    getCategoryColor(log.category)
                  )}>
                    {getEventIcon(log.eventType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {log.eventType.replace(/_/g, ' ')}
                          </span>
                          {log.phiAccessed && (
                            <span className={cn(
                              "px-1.5 py-0.5 text-xs font-medium rounded",
                              isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                            )}>
                              PHI
                            </span>
                          )}
                          {getSeverityIcon(log.severity)}
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {log.description}
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs flex-shrink-0",
                        isDark ? "text-neutral-500" : "text-neutral-500"
                      )}>
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className={cn(
                        "flex items-center gap-1",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        <Building2 className="h-3 w-3" />
                        {log.organization}
                      </div>
                      {log.resourceId && (
                        <span className={cn(
                          "font-mono",
                          isDark ? "text-neutral-500" : "text-neutral-400"
                        )}>
                          {log.resourceId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center">
              <FileText className={cn(
                "h-12 w-12 mx-auto mb-4",
                isDark ? "text-neutral-600" : "text-neutral-400"
              )} />
              <h3 className={cn(
                "font-semibold mb-1",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                No events found
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

export default AdminAuditLogPage;
