import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth header
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================
// Types
// ============================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number; // in cents
  price_yearly: number;
  stripe_product_id?: string;
  stripe_price_monthly_id?: string;
  stripe_price_yearly_id?: string;
  claims_per_month: number; // -1 = unlimited
  appeals_per_month: number;
  users_limit: number;
  integrations_limit: number;
  api_requests_per_day: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_payment_method_id?: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'paused';
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  cancellation_reason?: string;
  plan?: SubscriptionPlan;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  organization_id: string;
  stripe_payment_method_id: string;
  type: 'card' | 'us_bank_account';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  bank_name?: string;
  bank_last4?: string;
  is_default: boolean;
  status: 'active' | 'expired' | 'failed';
  billing_name?: string;
  billing_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id?: string;
  stripe_invoice_id?: string;
  invoice_number?: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  subtotal: number;
  tax: number;
  total: number;
  amount_due: number;
  amount_paid: number;
  currency: string;
  invoice_date: string;
  due_date?: string;
  paid_at?: string;
  period_start?: string;
  period_end?: string;
  line_items?: LineItem[];
  hosted_invoice_url?: string;
  invoice_pdf_url?: string;
  description?: string;
  created_at: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  amount: number;
  currency: string;
}

export interface UsageRecord {
  id: string;
  organization_id: string;
  period_start: string;
  period_end: string;
  claims_processed: number;
  claims_submitted: number;
  appeals_created: number;
  appeals_submitted: number;
  ai_predictions: number;
  ai_letters_generated: number;
  api_requests: number;
  storage_bytes: number;
  claims_limit?: number;
  appeals_limit?: number;
  api_limit?: number;
  is_current: boolean;
}

export interface BillingStatus {
  stripe_configured: boolean;
  webhook_configured: boolean;
}

// ============================================
// API Functions
// ============================================

// Get all subscription plans
export async function getPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await axios.get(`${API_URL}/billing/plans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    // Return default plans if API fails
    return [
      {
        id: 'free',
        name: 'Free',
        description: 'Get started with basic features',
        price_monthly: 0,
        price_yearly: 0,
        claims_per_month: 50,
        appeals_per_month: 10,
        users_limit: 1,
        integrations_limit: 0,
        api_requests_per_day: 100,
        features: ['50 claims per month', '10 appeals per month', 'Basic AI analysis', 'Email support'],
        is_active: true,
        is_popular: false,
        sort_order: 0,
      },
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small practices',
        price_monthly: 9900,
        price_yearly: 95000,
        claims_per_month: 500,
        appeals_per_month: 100,
        users_limit: 3,
        integrations_limit: 1,
        api_requests_per_day: 1000,
        features: ['500 claims per month', '100 appeals per month', 'AI denial prediction', '1 EHR integration', 'Priority email support'],
        is_active: true,
        is_popular: false,
        sort_order: 1,
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Best for growing organizations',
        price_monthly: 29900,
        price_yearly: 287000,
        claims_per_month: 2500,
        appeals_per_month: 500,
        users_limit: 10,
        integrations_limit: 5,
        api_requests_per_day: 10000,
        features: ['2,500 claims per month', '500 appeals per month', 'Advanced AI features', '5 integrations', 'Phone & email support', 'API access'],
        is_active: true,
        is_popular: true,
        sort_order: 2,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large healthcare systems',
        price_monthly: 0,
        price_yearly: 0,
        claims_per_month: -1,
        appeals_per_month: -1,
        users_limit: -1,
        integrations_limit: -1,
        api_requests_per_day: -1,
        features: ['Unlimited claims', 'Unlimited appeals', 'Dedicated AI models', 'Unlimited integrations', '24/7 dedicated support', 'Custom development'],
        is_active: true,
        is_popular: false,
        sort_order: 3,
      },
    ];
  }
}

// Get current subscription
export async function getSubscription(): Promise<Subscription | null> {
  try {
    const response = await axios.get(`${API_URL}/billing/subscription`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Get current usage
export async function getUsage(): Promise<UsageRecord | null> {
  try {
    const response = await axios.get(`${API_URL}/billing/usage`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching usage:', error);
    return null;
  }
}

// Create checkout session
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string): Promise<{ sessionId: string; url: string }> {
  const response = await axios.post(
    `${API_URL}/billing/checkout`,
    { priceId, successUrl, cancelUrl },
    { headers: getAuthHeader() }
  );
  return response.data;
}

// Create portal session
export async function createPortalSession(returnUrl: string): Promise<{ url: string }> {
  const response = await axios.post(
    `${API_URL}/billing/portal`,
    { returnUrl },
    { headers: getAuthHeader() }
  );
  return response.data;
}

// Get invoices
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const response = await axios.get(`${API_URL}/billing/invoices`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

// Get payment methods
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const response = await axios.get(`${API_URL}/billing/payment-methods`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Create setup intent
export async function createSetupIntent(): Promise<{ clientSecret: string }> {
  const response = await axios.post(
    `${API_URL}/billing/setup-intent`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
}

// Set default payment method
export async function setDefaultPaymentMethod(id: string): Promise<void> {
  await axios.post(
    `${API_URL}/billing/payment-methods/${id}/default`,
    {},
    { headers: getAuthHeader() }
  );
}

// Delete payment method
export async function deletePaymentMethod(id: string): Promise<void> {
  await axios.delete(`${API_URL}/billing/payment-methods/${id}`, {
    headers: getAuthHeader(),
  });
}

// Cancel subscription
export async function cancelSubscription(reason?: string, immediate?: boolean): Promise<void> {
  await axios.post(
    `${API_URL}/billing/cancel`,
    { reason, immediate },
    { headers: getAuthHeader() }
  );
}

// Resume subscription
export async function resumeSubscription(): Promise<void> {
  await axios.post(
    `${API_URL}/billing/resume`,
    {},
    { headers: getAuthHeader() }
  );
}

// Get billing status
export async function getBillingStatus(): Promise<BillingStatus> {
  try {
    const response = await axios.get(`${API_URL}/billing/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching billing status:', error);
    return { stripe_configured: false, webhook_configured: false };
  }
}

// ============================================
// Helper Functions
// ============================================

// Format price for display
export function formatPrice(cents: number, currency: string = 'usd'): string {
  if (cents === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Format price with decimals
export function formatPriceDetailed(cents: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

// Get status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'paid':
      return 'green';
    case 'trialing':
      return 'blue';
    case 'past_due':
    case 'open':
      return 'yellow';
    case 'canceled':
    case 'void':
    case 'uncollectible':
      return 'red';
    case 'paused':
    case 'draft':
      return 'gray';
    default:
      return 'gray';
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get card brand icon name
export function getCardBrandIcon(brand?: string): string {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'mastercard';
    case 'amex':
    case 'american_express':
      return 'amex';
    case 'discover':
      return 'discover';
    default:
      return 'card';
  }
}

// Calculate usage percentage
export function calculateUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  if (limit === 0) return 100; // At limit
  return Math.min(100, Math.round((used / limit) * 100));
}

// Get usage status
export function getUsageStatus(used: number, limit: number): 'ok' | 'warning' | 'critical' {
  const percentage = calculateUsagePercentage(used, limit);
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'warning';
  return 'ok';
}

// Days remaining in period
export function getDaysRemaining(periodEnd?: string): number {
  if (!periodEnd) return 0;
  const end = new Date(periodEnd);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Calculate savings percentage
export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  if (monthlyPrice === 0) return 0;
  const yearlyTotal = monthlyPrice * 12;
  return Math.round(((yearlyTotal - yearlyPrice) / yearlyTotal) * 100);
}

export default {
  getPlans,
  getSubscription,
  getUsage,
  createCheckoutSession,
  createPortalSession,
  getInvoices,
  getPaymentMethods,
  createSetupIntent,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  cancelSubscription,
  resumeSubscription,
  getBillingStatus,
  formatPrice,
  formatPriceDetailed,
  getStatusColor,
  formatDate,
  getCardBrandIcon,
  calculateUsagePercentage,
  getUsageStatus,
  getDaysRemaining,
  calculateYearlySavings,
};
