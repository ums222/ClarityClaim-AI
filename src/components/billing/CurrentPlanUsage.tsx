import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Loader2,
  FileText,
  Scale,
  Brain,
  Cpu,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  getSubscription,
  getUsage,
  createPortalSession,
  formatPrice,
  formatDate,
  calculateUsagePercentage,
  getUsageStatus,
  getDaysRemaining,
  Subscription,
  UsageRecord,
} from '../../lib/billing';

interface CurrentPlanUsageProps {
  onViewPlans?: () => void;
}

export function CurrentPlanUsage({ onViewPlans }: CurrentPlanUsageProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [managingBilling, setManagingBilling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [subscriptionData, usageData] = await Promise.all([
        getSubscription(),
        getUsage(),
      ]);
      setSubscription(subscriptionData);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleManageBilling() {
    setManagingBilling(true);
    try {
      const { url } = await createPortalSession(window.location.href);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Failed to open billing portal. You may not have an active subscription yet.');
    } finally {
      setManagingBilling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const plan = subscription?.plan;
  const daysRemaining = getDaysRemaining(subscription?.current_period_end);
  const isCanceling = subscription?.cancel_at_period_end;

  const usageMetrics = [
    {
      label: 'Claims Processed',
      value: usage?.claims_processed || 0,
      limit: plan?.claims_per_month || 50,
      icon: FileText,
      color: 'indigo',
    },
    {
      label: 'Appeals Created',
      value: usage?.appeals_created || 0,
      limit: plan?.appeals_per_month || 10,
      icon: Scale,
      color: 'purple',
    },
    {
      label: 'AI Predictions',
      value: usage?.ai_predictions || 0,
      limit: plan?.claims_per_month || 50,
      icon: Brain,
      color: 'pink',
    },
    {
      label: 'API Requests',
      value: usage?.api_requests || 0,
      limit: plan?.api_requests_per_day ? plan.api_requests_per_day * 30 : 3000,
      icon: Cpu,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Plan Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {plan?.name || 'Free'} Plan
                </h3>
                {subscription?.status === 'active' && !isCanceling && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
                {subscription?.status === 'trialing' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Clock className="w-3 h-3" />
                    Trial
                  </span>
                )}
                {isCanceling && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    Canceling
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {plan?.description || 'Basic features for getting started'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatPrice(plan?.price_monthly || 0)}
              </p>
              <p className="text-sm text-slate-500">per month</p>
            </div>
          </div>

          {/* Billing Period */}
          {subscription?.current_period_end && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {isCanceling ? 'Access until' : 'Next billing date'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {daysRemaining} days remaining
                  </p>
                  <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${
                        daysRemaining < 7 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, (daysRemaining / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={onViewPlans}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {plan?.id === 'free' ? 'Upgrade Plan' : 'Change Plan'}
            </Button>
            {subscription?.stripe_customer_id && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={managingBilling}
              >
                {managingBilling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                )}
                Manage Billing
              </Button>
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
            This Billing Period
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Period</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {usage?.period_start ? formatDate(usage.period_start) : 'N/A'} -{' '}
                  {usage?.period_end ? formatDate(usage.period_end) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Claims</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(usage?.claims_processed || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Appeals</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(usage?.appeals_created || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">AI Predictions</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(usage?.ai_predictions || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Storage Used</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {((usage?.storage_bytes || 0) / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Usage This Period
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {usageMetrics.map((metric, index) => {
            const percentage = calculateUsagePercentage(metric.value, metric.limit);
            const status = getUsageStatus(metric.value, metric.limit);
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                    </div>
                    {status === 'critical' && (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        Limit
                      </span>
                    )}
                    {status === 'warning' && (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <AlertTriangle className="w-3 h-3" />
                        75%+
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400">
                      / {metric.limit === -1 ? '∞' : metric.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        status === 'critical'
                          ? 'bg-red-500'
                          : status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 text-right">
                    {metric.limit === -1 ? 'Unlimited' : `${percentage}% used`}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Usage Tips */}
      {plan?.id === 'free' && (
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Need more capacity?
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Upgrade to Starter for 10x more claims, advanced AI features, and priority support.
              </p>
              <Button
                size="sm"
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={onViewPlans}
              >
                View Plans
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default CurrentPlanUsage;
