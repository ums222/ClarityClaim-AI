import Stripe from 'stripe';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe = null;

export function isStripeConfigured() {
  return !!stripeSecretKey && stripeSecretKey !== 'sk_test_your-stripe-secret-key';
}

export function getStripeClient() {
  if (!stripe && isStripeConfigured()) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }
  return stripe;
}

// Subscription Plans Mapping
export const PLANS = {
  free: {
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    claims: 50,
    appeals: 10,
  },
  starter: {
    name: 'Starter',
    priceMonthly: 9900, // $99.00
    priceYearly: 95000, // $950.00
    claims: 500,
    appeals: 100,
  },
  professional: {
    name: 'Professional',
    priceMonthly: 29900, // $299.00
    priceYearly: 287000, // $2,870.00
    claims: 2500,
    appeals: 500,
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: 0, // Custom pricing
    priceYearly: 0,
    claims: -1, // Unlimited
    appeals: -1,
  },
};

// Create or retrieve Stripe customer
export async function getOrCreateCustomer(organizationId, organization, email) {
  const client = getStripeClient();
  if (!client) return null;

  // Search for existing customer
  const existingCustomers = await client.customers.search({
    query: `metadata['organization_id']:'${organizationId}'`,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  const customer = await client.customers.create({
    email,
    name: organization.name,
    metadata: {
      organization_id: organizationId,
    },
  });

  return customer;
}

// Create checkout session for subscription
export async function createCheckoutSession(customerId, priceId, organizationId, successUrl, cancelUrl) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  const session = await client.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organization_id: organizationId,
    },
    subscription_data: {
      metadata: {
        organization_id: organizationId,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

// Create customer portal session
export async function createPortalSession(customerId, returnUrl) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  const session = await client.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Create setup intent for adding payment method
export async function createSetupIntent(customerId) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  const setupIntent = await client.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });

  return setupIntent;
}

// Get subscription details
export async function getSubscription(subscriptionId) {
  const client = getStripeClient();
  if (!client) return null;

  try {
    const subscription = await client.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'latest_invoice'],
    });
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Update subscription plan
export async function updateSubscription(subscriptionId, newPriceId) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  const subscription = await client.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await client.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });

  return updatedSubscription;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  if (cancelAtPeriodEnd) {
    return await client.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await client.subscriptions.cancel(subscriptionId);
  }
}

// Resume subscription
export async function resumeSubscription(subscriptionId) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  return await client.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Get customer invoices
export async function getCustomerInvoices(customerId, limit = 10) {
  const client = getStripeClient();
  if (!client) return [];

  const invoices = await client.invoices.list({
    customer: customerId,
    limit,
    expand: ['data.subscription'],
  });

  return invoices.data;
}

// Get payment methods
export async function getPaymentMethods(customerId) {
  const client = getStripeClient();
  if (!client) return [];

  const paymentMethods = await client.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

// Set default payment method
export async function setDefaultPaymentMethod(customerId, paymentMethodId) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  await client.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return true;
}

// Delete payment method
export async function deletePaymentMethod(paymentMethodId) {
  const client = getStripeClient();
  if (!client) throw new Error('Stripe is not configured');

  await client.paymentMethods.detach(paymentMethodId);
  return true;
}

// Verify webhook signature
export function verifyWebhookSignature(payload, signature) {
  const client = getStripeClient();
  if (!client) return null;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return null;

  try {
    return client.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

// Get upcoming invoice (preview)
export async function getUpcomingInvoice(customerId, subscriptionId) {
  const client = getStripeClient();
  if (!client) return null;

  try {
    const invoice = await client.invoices.retrieveUpcoming({
      customer: customerId,
      subscription: subscriptionId,
    });
    return invoice;
  } catch (error) {
    console.error('Error fetching upcoming invoice:', error);
    return null;
  }
}

export default {
  isStripeConfigured,
  getStripeClient,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  createSetupIntent,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
  getCustomerInvoices,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  verifyWebhookSignature,
  getUpcomingInvoice,
  PLANS,
};
