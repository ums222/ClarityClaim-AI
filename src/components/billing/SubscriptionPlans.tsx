import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  Rocket,
  Crown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  getPlans,
  getSubscription,
  createCheckoutSession,
  formatPrice,
  calculateYearlySavings,
  SubscriptionPlan,
  Subscription,
} from '../../lib/billing';

interface SubscriptionPlansProps {
  onUpgrade?: () => void;
}

export function SubscriptionPlans({ onUpgrade }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [plansData, subscriptionData] = await Promise.all([
        getPlans(),
        getSubscription(),
      ]);
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(plan: SubscriptionPlan) {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@clarityclaim.ai?subject=Enterprise%20Inquiry';
      return;
    }

    setUpgrading(plan.id);
    try {
      const priceId = billingCycle === 'yearly' 
        ? plan.stripe_price_yearly_id 
        : plan.stripe_price_monthly_id;

      if (!priceId) {
        // Fallback for demo: show alert
        alert(`Upgrade to ${plan.name} would redirect to Stripe checkout with price ID. Configure Stripe price IDs to enable.`);
        return;
      }

      const { url } = await createCheckoutSession(
        priceId,
        `${window.location.origin}/app/billing?success=true`,
        `${window.location.origin}/app/billing?canceled=true`
      );
      
      if (url) {
        window.location.href = url;
      }
      onUpgrade?.();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setUpgrading(null);
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Sparkles className="w-6 h-6" />;
      case 'starter':
        return <Zap className="w-6 h-6" />;
      case 'professional':
        return <Rocket className="w-6 h-6" />;
      case 'enterprise':
        return <Crown className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (planId: string, isPopular: boolean) => {
    if (isPopular) {
      return 'from-indigo-500 via-purple-500 to-pink-500';
    }
    switch (planId) {
      case 'free':
        return 'from-gray-400 to-gray-500';
      case 'starter':
        return 'from-emerald-400 to-teal-500';
      case 'professional':
        return 'from-indigo-500 to-purple-500';
      case 'enterprise':
        return 'from-amber-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const currentPlanId = currentSubscription?.plan_id || 'free';

  return (
    <div className="space-y-8">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="relative bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {billingCycle === 'monthly' && (
              <motion.div
                layoutId="billingToggle"
                className="absolute inset-0 bg-indigo-600 rounded-full"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">Monthly</span>
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'yearly'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {billingCycle === 'yearly' && (
              <motion.div
                layoutId="billingToggle"
                className="absolute inset-0 bg-indigo-600 rounded-full"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">Yearly</span>
            <span className="ml-2 text-xs text-emerald-400">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {plans.map((plan, index) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const price = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
          const savings = calculateYearlySavings(plan.price_monthly, plan.price_yearly);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.is_popular
                  ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/20'
                  : 'ring-1 ring-slate-200 dark:ring-slate-700'
              } bg-white dark:bg-slate-800 overflow-hidden`}
            >
              {/* Popular Badge */}
              {plan.is_popular && (
                <div className="absolute top-0 right-0 -translate-y-0 translate-x-0">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 bg-gradient-to-br ${getPlanGradient(plan.id, plan.is_popular)} text-white`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {getPlanIcon(plan.id)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm opacity-90">{plan.description}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  {plan.id === 'enterprise' ? (
                    <span className="text-3xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">{formatPrice(price)}</span>
                      <span className="text-sm opacity-80">/month</span>
                    </>
                  )}
                </div>
                {billingCycle === 'yearly' && savings > 0 && plan.id !== 'enterprise' && (
                  <p className="mt-2 text-sm">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full">
                      Save {savings}% annually
                    </span>
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Limits Summary */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Claims/month</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {plan.claims_per_month === -1 ? 'Unlimited' : plan.claims_per_month.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Team members</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {plan.users_limit === -1 ? 'Unlimited' : plan.users_limit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Integrations</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {plan.integrations_limit === -1 ? 'Unlimited' : plan.integrations_limit}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : plan.id === 'enterprise' ? (
                    <Button
                      variant="outline"
                      className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={() => handleUpgrade(plan)}
                    >
                      Contact Sales
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : plan.sort_order > plans.findIndex(p => p.id === currentPlanId) ? (
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      onClick={() => handleUpgrade(plan)}
                      disabled={upgrading === plan.id}
                    >
                      {upgrading === plan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Upgrade to {plan.name}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleUpgrade(plan)}
                      disabled={upgrading === plan.id}
                    >
                      {upgrading === plan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Downgrade
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Link */}
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Need help choosing?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Compare all features
          </a>{' '}
          or{' '}
          <a href="mailto:support@clarityclaim.ai" className="text-indigo-600 hover:text-indigo-500 font-medium">
            contact our team
          </a>
        </p>
      </div>
    </div>
  );
}

export default SubscriptionPlans;
