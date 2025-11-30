import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Users,
  Plug,
  Key,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import AppLayout from '../../components/app/AppLayout';
import {
  ProfileSettings,
  OrganizationSettings,
  TeamSettings,
  IntegrationSettings,
  ApiKeySettings,
  NotificationSettings,
} from '../../components/settings';

type TabId = 'profile' | 'organization' | 'team' | 'integrations' | 'api-keys' | 'notifications';

interface Tab {
  id: TabId;
  name: string;
  icon: React.ElementType;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'profile',
    name: 'Profile',
    icon: User,
    description: 'Your personal information and preferences',
  },
  {
    id: 'organization',
    name: 'Organization',
    icon: Building2,
    description: 'Organization settings and configuration',
  },
  {
    id: 'team',
    name: 'Team',
    icon: Users,
    description: 'Manage team members and invitations',
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Plug,
    description: 'Connect EHR, payer, and other systems',
  },
  {
    id: 'api-keys',
    name: 'API Keys',
    icon: Key,
    description: 'Manage API access keys',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Email and in-app notification preferences',
  },
];

const SettingsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'organization':
        return <OrganizationSettings />;
      case 'team':
        return <TeamSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'api-keys':
        return <ApiKeySettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn(
            "text-2xl font-semibold tracking-tight",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Settings
          </h1>
          <p className={cn(
            "text-sm mt-1",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all",
                    activeTab === tab.id
                      ? isDark
                        ? "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20"
                        : "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20"
                      : isDark
                        ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-opacity",
                    activeTab === tab.id ? "opacity-100" : "opacity-0"
                  )} />
                </button>
              ))}
            </nav>

            {/* Mobile Tab Pills */}
            <div className="lg:hidden mt-4 -mx-1 overflow-x-auto pb-2">
              <div className="flex gap-2 px-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? isDark
                          ? "bg-teal-500/10 text-teal-400"
                          : "bg-teal-50 text-teal-600"
                        : isDark
                          ? "text-neutral-400 bg-neutral-800"
                          : "text-neutral-600 bg-neutral-100"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
