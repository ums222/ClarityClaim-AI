import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Key,
  FileText,
  Lock,
  Users,
  Monitor,
  CheckCircle,
} from 'lucide-react';
import AppLayout from '../../components/app/AppLayout';
import { Card } from '../../components/ui/card';
import {
  TwoFactorAuth,
  AuditLogs,
  DataEncryption,
  RoleBasedAccess,
  SessionManagement,
} from '../../components/security';
import { useAuth } from '../../contexts/AuthContext';

type TabType = '2fa' | 'sessions' | 'audit' | 'encryption' | 'roles';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
  description: string;
  adminOnly?: boolean;
}

const tabs: Tab[] = [
  {
    id: '2fa',
    label: 'Two-Factor Auth',
    icon: Key,
    description: 'TOTP and backup codes',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    icon: Monitor,
    description: 'Active sessions',
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: FileText,
    description: 'Activity tracking',
    adminOnly: true,
  },
  {
    id: 'encryption',
    label: 'Encryption',
    icon: Lock,
    description: 'Data protection',
  },
  {
    id: 'roles',
    label: 'Access Control',
    icon: Users,
    description: 'Role permissions',
    adminOnly: true,
  },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('2fa');
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  const visibleTabs = tabs.filter((tab) => !tab.adminOnly || isAdmin);

  const renderTabContent = () => {
    switch (activeTab) {
      case '2fa':
        return <TwoFactorAuth />;
      case 'sessions':
        return <SessionManagement />;
      case 'audit':
        return isAdmin ? <AuditLogs /> : null;
      case 'encryption':
        return <DataEncryption />;
      case 'roles':
        return isAdmin ? <RoleBasedAccess /> : null;
      default:
        return <TwoFactorAuth />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Security & Compliance
            </h1>
          </div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Manage security settings, access controls, and HIPAA compliance features
          </p>
        </div>

        {/* Security Overview Banner */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">HIPAA Compliant Security</h2>
                <p className="text-white/80 text-sm">
                  Your organization's security features meet healthcare industry standards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">AES-256</span>
                </div>
                <p className="text-xs text-white/80">Encryption</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">TLS 1.3</span>
                </div>
                <p className="text-xs text-white/80">In Transit</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">7 Years</span>
                </div>
                <p className="text-xs text-white/80">Audit Retention</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">2FA Status</p>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Recommended
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Active Sessions</p>
                <p className="font-semibold text-neutral-900 dark:text-white">1</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Data Encrypted</p>
                <p className="font-semibold text-emerald-600">100%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Audit Logging</p>
                <p className="font-semibold text-emerald-600">Active</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div className="border-b border-neutral-200 dark:border-neutral-700">
              <nav className="flex gap-8" aria-label="Tabs">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative py-4 px-1 transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="securityActiveTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* HIPAA Compliance Notice */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                HIPAA Security Rule Compliance
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                ClarityClaim AI implements technical safeguards required by the HIPAA Security Rule
                (45 CFR § 164.312), including access controls, audit controls, integrity controls,
                and transmission security to protect electronic Protected Health Information (ePHI).
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/security"
                  className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Security Documentation →
                </a>
                <a
                  href="mailto:security@clarityclaim.ai"
                  className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Contact Security Team →
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
