import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Receipt,
  TrendingUp,
  Sparkles,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import AppLayout from '../../components/app/AppLayout';
import { Card } from '../../components/ui/card';
import {
  SubscriptionPlans,
  CurrentPlanUsage,
  PaymentMethods,
  InvoiceHistory,
} from '../../components/billing';

type TabType = 'overview' | 'plans' | 'payment' | 'invoices';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: TrendingUp,
    description: 'Current plan and usage',
  },
  {
    id: 'plans',
    label: 'Plans',
    icon: Sparkles,
    description: 'View subscription plans',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: CreditCard,
    description: 'Manage payment methods',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: Receipt,
    description: 'Billing history',
  },
];

export default function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Handle success/cancel from Stripe checkout
  useEffect(function handleStripeCallback() {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      setNotification({
        type: 'success',
        message: 'Your subscription has been updated successfully!',
      });
      setSearchParams({});
    } else if (canceled === 'true') {
      setNotification({
        type: 'error',
        message: 'Checkout was canceled. No changes were made.',
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CurrentPlanUsage onViewPlans={() => setActiveTab('plans')} />;
      case 'plans':
        return <SubscriptionPlans onUpgrade={() => setActiveTab('overview')} />;
      case 'payment':
        return <PaymentMethods />;
      case 'invoices':
        return <InvoiceHistory />;
      default:
        return <CurrentPlanUsage onViewPlans={() => setActiveTab('plans')} />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Billing & Subscription
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Manage your subscription, payment methods, and view invoices
          </p>
        </div>

        {/* Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
                notification.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <p
                  className={`text-sm font-medium ${
                    notification.type === 'success'
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`p-1 rounded-full hover:bg-white/50 ${
                  notification.type === 'success'
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div className="border-b border-neutral-200 dark:border-neutral-700">
              <nav className="flex gap-8" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
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
                          layoutId="activeTab"
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
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
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

        {/* Help Card */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Need help with billing?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Our team is available to answer any questions about your subscription
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:billing@clarityclaim.ai"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
              >
                Contact Billing Support
              </a>
              <a
                href="/help/billing"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                View FAQ →
              </a>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
