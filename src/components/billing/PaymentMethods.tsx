import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Star,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  createPortalSession,
  PaymentMethod,
} from '../../lib/billing';
import { useAuth } from '../../contexts/AuthContext';

export function PaymentMethods() {
  const { profile } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canManage = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      console.error('Error loading payment methods:', err);
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }

  async function handleSetDefault(id: string) {
    setActionLoading(id);
    try {
      await setDefaultPaymentMethod(id);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error setting default:', err);
      setError('Failed to set default payment method');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this payment method?')) return;

    setActionLoading(id);
    try {
      await deletePaymentMethod(id);
      await loadPaymentMethods();
    } catch (err: any) {
      console.error('Error deleting payment method:', err);
      setError(err.response?.data?.error || 'Failed to delete payment method');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAddPaymentMethod() {
    try {
      const { url } = await createPortalSession(window.location.href);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Error opening billing portal:', err);
      setError('Failed to open billing portal');
    }
  }

  const getCardBrandLogo = (brand?: string) => {
    const brandLower = brand?.toLowerCase();
    switch (brandLower) {
      case 'visa':
        return (
          <svg className="w-10 h-6" viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="4" fill="#1A1F71" />
            <path d="M17.5 16.5l1.5-9h2.4l-1.5 9H17.5zm9.8-8.8c-.5-.2-1.2-.4-2.1-.4-2.4 0-4 1.2-4 2.9 0 1.3 1.2 2 2 2.4.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 2c.5.2 1.5.4 2.5.4 2.5 0 4.2-1.2 4.2-3 0-1-.6-1.8-2-2.4-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.3-.8.7 0 1.3.1 1.7.3l.2.1.3-1.8h.2zm4.7-.2h-1.8c-.6 0-1 .2-1.2.7l-3.5 8.3h2.5l.5-1.3h3l.3 1.3h2.2l-2-9zm-2.7 5.8l.9-2.5c0 0 .2-.5.3-.8l.2.7.5 2.5h-1.9v.1zM15.4 7.7l-2.3 6.1-.2-1.2-.8-4.2c-.1-.6-.6-.7-1.1-.7H7.5l-.1.3c.9.2 1.7.5 2.4.9.4.2.6.5.7.9l1.9 7.3h2.5l3.8-9.4h-2.3z" fill="white" />
          </svg>
        );
      case 'mastercard':
        return (
          <svg className="w-10 h-6" viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="4" fill="#252525" />
            <circle cx="15" cy="12" r="7" fill="#EB001B" />
            <circle cx="25" cy="12" r="7" fill="#F79E1B" />
            <path d="M20 6.5c1.8 1.3 3 3.3 3 5.5s-1.2 4.2-3 5.5c-1.8-1.3-3-3.3-3-5.5s1.2-4.2 3-5.5z" fill="#FF5F00" />
          </svg>
        );
      case 'amex':
      case 'american_express':
        return (
          <svg className="w-10 h-6" viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="4" fill="#006FCF" />
            <path d="M6.5 12h3l.8-2h1.2l.8 2h6v-1.5l.5 1.5h3l.5-1.5v1.5h12v-4h-4v-.5l-.3-.5h-4.2l-.3.5v.5H16.5v-1h-2l-.7 1.5-.7-1.5h-7v1h-.6l-.7-1.5-.7 1.5H6.5v4zm7-3h-1.5l-1 2.5-1-2.5H8.5v3h1v-2.5l1 2.5h.5l1-2.5v2.5h1v-3zm9.5 0v3h3v-.5h-2v-.75h2v-.5h-2v-.75h2v-.5h-3zm-4.5 0l-1.5 3h1l.25-.5h1.5l.25.5h1l-1.5-3h-1zm.5.75l.5 1h-1l.5-1zm8 2.75v-.5h2v-.5h-2v-.75h2v-.5h-3v3h3v-.5h-2v-.25z" fill="white" />
          </svg>
        );
      default:
        return <CreditCard className="w-10 h-6 text-neutral-400" />;
    }
  };

  if (!canManage) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-5 h-5" />
          <p>Only organization owners and admins can manage payment methods.</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Payment Methods
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your payment methods for billing
          </p>
        </div>
        <Button onClick={handleAddPaymentMethod}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card className="p-8 text-center">
          <CreditCard className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
          <h4 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            No payment methods
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Add a payment method to upgrade your plan or enable auto-renewal
          </p>
          <Button onClick={handleAddPaymentMethod}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((pm, index) => (
            <motion.div
              key={pm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 ${
                  pm.is_default
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Card Brand Logo */}
                    <div className="flex-shrink-0">
                      {getCardBrandLogo(pm.card_brand)}
                    </div>

                    {/* Card Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {pm.card_brand ? pm.card_brand.charAt(0).toUpperCase() + pm.card_brand.slice(1) : 'Card'} •••• {pm.card_last4}
                        </p>
                        {pm.is_default && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            <Star className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Expires {pm.card_exp_month?.toString().padStart(2, '0')}/{pm.card_exp_year}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!pm.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(pm.id)}
                        disabled={actionLoading === pm.id}
                      >
                        {actionLoading === pm.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Set Default
                          </>
                        )}
                      </Button>
                    )}
                    {!pm.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(pm.id)}
                        disabled={actionLoading === pm.id}
                      >
                        {actionLoading === pm.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <Card className="p-4 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Secure payment processing
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Your payment information is encrypted and securely processed by Stripe.
              We never store your full card details on our servers.
            </p>
            <a
              href="https://stripe.com/docs/security"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 mt-2"
            >
              Learn about Stripe security
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentMethods;
