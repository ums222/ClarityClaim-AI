import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hospital,
  Building2,
  Webhook,
  Upload,
  ChevronRight,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import AppLayout from '../../components/app/AppLayout';
import {
  EHRConnectors,
  PayerConnections,
  WebhookManager,
  BatchImporter,
} from '../../components/integrations';

type TabId = 'ehr' | 'payers' | 'webhooks' | 'import';

interface Tab {
  id: TabId;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const tabs: Tab[] = [
  {
    id: 'ehr',
    name: 'EHR/EMR',
    icon: Hospital,
    description: 'Connect Epic, Cerner, athenahealth',
    color: 'teal',
  },
  {
    id: 'payers',
    name: 'Payers',
    icon: Building2,
    description: 'Direct claim submission APIs',
    color: 'blue',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    icon: Webhook,
    description: 'Real-time event notifications',
    color: 'purple',
  },
  {
    id: 'import',
    name: 'Batch Import',
    icon: Upload,
    description: 'CSV, Excel, EDI 837 files',
    color: 'orange',
  },
];

const IntegrationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabId>('ehr');

  const renderContent = () => {
    switch (activeTab) {
      case 'ehr':
        return <EHRConnectors />;
      case 'payers':
        return <PayerConnections />;
      case 'webhooks':
        return <WebhookManager />;
      case 'import':
        return <BatchImporter />;
      default:
        return <EHRConnectors />;
    }
  };

  const getTabColorClasses = (tab: Tab, isActive: boolean) => {
    if (!isActive) {
      return isDark
        ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100';
    }
    
    switch (tab.color) {
      case 'teal':
        return isDark ? 'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20' : 'bg-teal-50 text-teal-600 ring-1 ring-teal-500/20';
      case 'blue':
        return isDark ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20';
      case 'purple':
        return isDark ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20' : 'bg-purple-50 text-purple-600 ring-1 ring-purple-500/20';
      case 'orange':
        return isDark ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/20';
      default:
        return isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600';
    }
  };

  const getIconColorClass = (tab: Tab) => {
    switch (tab.color) {
      case 'teal':
        return isDark ? 'text-teal-400' : 'text-teal-600';
      case 'blue':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'purple':
        return isDark ? 'text-purple-400' : 'text-purple-600';
      case 'orange':
        return isDark ? 'text-orange-400' : 'text-orange-600';
      default:
        return isDark ? 'text-teal-400' : 'text-teal-600';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-teal-500/10" : "bg-teal-50"
            )}>
              <Zap className={cn("h-6 w-6", isDark ? "text-teal-400" : "text-teal-600")} />
            </div>
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Integrations
            </h1>
          </div>
          <p className={cn(
            "text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Connect your EHR systems, payers, and external services to streamline your revenue cycle
          </p>
        </div>

        {/* Integration Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-5 cursor-pointer transition-all hover:shadow-lg",
                  activeTab === tab.id && (isDark ? "ring-1 ring-neutral-700" : "ring-1 ring-neutral-300")
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    isDark ? "bg-neutral-800" : "bg-neutral-100"
                  )}>
                    <tab.icon className={cn("h-5 w-5", getIconColorClass(tab))} />
                  </div>
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform",
                    activeTab === tab.id ? "translate-x-1" : "opacity-0",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )} />
                </div>
                <h3 className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  {tab.name}
                </h3>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  {tab.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                getTabColorClasses(tab, activeTab === tab.id)
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
              {activeTab === tab.id && (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default IntegrationsPage;
