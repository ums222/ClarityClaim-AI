import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Webhook,
  Plus,
  MoreVertical,
  Check,
  X,
  Loader2,
  Trash2,
  Settings,
  Play,
  Pause,
  AlertCircle,
  Activity,
  Zap,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  getWebhookDeliveries,
  WEBHOOK_EVENTS,
  type Webhook as WebhookType,
  type WebhookDelivery,
} from '../../lib/integrations';

export function WebhookManager() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveriesModalOpen, setDeliveriesModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookType | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    auth_type: 'none' as WebhookType['auth_type'],
    auth_token: '',
    auth_username: '',
    auth_password: '',
    events: [] as string[],
    active: true,
    retry_enabled: true,
    max_retries: 3,
    timeout_seconds: 30,
    custom_headers: {} as Record<string, string>,
  });

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const data = await getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async (webhookId: string) => {
    setLoadingDeliveries(true);
    try {
      const { deliveries } = await getWebhookDeliveries(webhookId);
      setDeliveries(deliveries);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      auth_type: 'none',
      auth_token: '',
      auth_username: '',
      auth_password: '',
      events: [],
      active: true,
      retry_enabled: true,
      max_retries: 3,
      timeout_seconds: 30,
      custom_headers: {},
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (formData.events.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one event' });
      return;
    }
    
    try {
      if (editingId) {
        await updateWebhook(editingId, formData);
        setMessage({ type: 'success', text: 'Webhook updated successfully' });
      } else {
        await createWebhook(formData);
        setMessage({ type: 'success', text: 'Webhook created successfully' });
      }
      setModalOpen(false);
      resetForm();
      loadWebhooks();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save webhook' });
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const result = await testWebhook(id);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      loadWebhooks();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setTestingId(null);
    }
  };

  const handleToggle = async (webhook: WebhookType) => {
    try {
      await updateWebhook(webhook.id, { active: !webhook.active });
      loadWebhooks();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to toggle webhook' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      await deleteWebhook(id);
      setMessage({ type: 'success', text: 'Webhook deleted' });
      loadWebhooks();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete' });
    }
    setMenuOpen(null);
  };

  const handleEdit = (webhook: WebhookType) => {
    setFormData({
      name: webhook.name,
      description: webhook.description || '',
      url: webhook.url,
      auth_type: webhook.auth_type,
      auth_token: '',
      auth_username: '',
      auth_password: '',
      events: webhook.events,
      active: webhook.active,
      retry_enabled: webhook.retry_enabled,
      max_retries: webhook.max_retries,
      timeout_seconds: webhook.timeout_seconds,
      custom_headers: webhook.custom_headers || {},
    });
    setEditingId(webhook.id);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleViewDeliveries = (webhook: WebhookType) => {
    setSelectedWebhook(webhook);
    loadDeliveries(webhook.id);
    setDeliveriesModalOpen(true);
    setMenuOpen(null);
  };

  const toggleEvent = (eventValue: string) => {
    if (formData.events.includes(eventValue)) {
      setFormData({ ...formData, events: formData.events.filter(e => e !== eventValue) });
    } else {
      setFormData({ ...formData, events: [...formData.events, eventValue] });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'failed':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      default:
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={cn("h-8 w-8 animate-spin", isDark ? "text-teal-400" : "text-teal-600")} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">You need admin permissions to manage webhooks.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
            Webhooks
          </h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Configure real-time event notifications to external systems
          </p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      {message && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-sm",
          message.type === 'success'
            ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-600"
            : isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
        )}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Webhooks */}
      {webhooks.length > 0 ? (
        <div className="space-y-4">
          {webhooks.map((webhook, index) => {
            const successRate = webhook.total_deliveries > 0
              ? Math.round((webhook.successful_deliveries / webhook.total_deliveries) * 100)
              : 100;
            
            return (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn("p-5", !webhook.active && "opacity-60")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={cn("p-3 rounded-xl", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                        <Webhook className={cn("h-6 w-6", isDark ? "text-teal-400" : "text-teal-600")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={cn("font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                            {webhook.name}
                          </h4>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(webhook.status))}>
                            {webhook.active ? webhook.status : 'paused'}
                          </span>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                            {webhook.auth_type === 'none' ? 'No auth' : webhook.auth_type}
                          </span>
                        </div>
                        <p className={cn("text-sm mt-1 font-mono truncate", isDark ? "text-neutral-400" : "text-neutral-600")}>
                          {webhook.url}
                        </p>
                        {webhook.description && (
                          <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                            {webhook.description}
                          </p>
                        )}
                        
                        {/* Events */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {webhook.events.map((event) => (
                            <span key={event} className={cn("px-2 py-0.5 rounded text-xs", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-lg text-center", isDark ? "bg-neutral-800/50" : "bg-neutral-50")}>
                        <p className={cn("text-lg font-semibold", successRate >= 90 ? "text-green-500" : successRate >= 70 ? "text-yellow-500" : "text-red-500")}>
                          {successRate}%
                        </p>
                        <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                          {webhook.total_deliveries} deliveries
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === webhook.id ? null : webhook.id)}
                          className={cn("p-1.5 rounded-lg transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-neutral-200 text-neutral-600")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        <AnimatePresence>
                          {menuOpen === webhook.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn("absolute right-0 mt-1 w-44 rounded-lg shadow-lg z-50 py-1 ring-1", isDark ? "bg-neutral-800 ring-neutral-700" : "bg-white ring-neutral-200")}
                              >
                                <button
                                  onClick={() => handleToggle(webhook)}
                                  className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                                >
                                  {webhook.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                  {webhook.active ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                  onClick={() => { handleTest(webhook.id); setMenuOpen(null); }}
                                  disabled={testingId === webhook.id}
                                  className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                                >
                                  {testingId === webhook.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                  Send Test
                                </button>
                                <button
                                  onClick={() => handleViewDeliveries(webhook)}
                                  className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Deliveries
                                </button>
                                <button
                                  onClick={() => handleEdit(webhook)}
                                  className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                                >
                                  <Settings className="h-4 w-4" />
                                  Configure
                                </button>
                                <button
                                  onClick={() => handleDelete(webhook.id)}
                                  className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-red-400" : "hover:bg-neutral-100 text-red-600")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {webhook.status === 'failed' && webhook.last_error && (
                    <div className={cn("mt-4 p-2 rounded-lg text-xs", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
                      {webhook.last_error}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Webhook className={cn("h-12 w-12 mx-auto mb-4", isDark ? "text-neutral-600" : "text-neutral-400")} />
          <h4 className={cn("font-medium mb-2", isDark ? "text-white" : "text-neutral-900")}>
            No webhooks configured
          </h4>
          <p className={cn("text-sm mb-4", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Set up webhooks to receive real-time event notifications
          </p>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Webhook
          </Button>
        </Card>
      )}

      {/* Available Events */}
      <div>
        <h4 className={cn("text-sm font-medium mb-3", isDark ? "text-neutral-300" : "text-neutral-700")}>
          Available Events
        </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {WEBHOOK_EVENTS.map((event) => (
            <div key={event.value} className={cn("p-3 rounded-lg", isDark ? "bg-neutral-800/50" : "bg-neutral-50")}>
              <code className={cn("text-xs font-mono", isDark ? "text-teal-400" : "text-teal-600")}>{event.value}</code>
              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => { setModalOpen(false); resetForm(); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6", isDark ? "bg-neutral-900" : "bg-white")}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {editingId ? 'Edit Webhook' : 'Create Webhook'}
                </h3>
                <button onClick={() => { setModalOpen(false); resetForm(); }} className={cn("p-1 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Name</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="My Webhook" required />
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Endpoint URL</label>
                  <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://api.yourapp.com/webhook" required />
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Description</label>
                  <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Optional description" />
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Authentication</label>
                  <Select value={formData.auth_type} onChange={(e) => setFormData({ ...formData, auth_type: e.target.value as any })}>
                    <option value="none">No Authentication</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="api_key">API Key Header</option>
                    <option value="hmac">HMAC Signature</option>
                  </Select>
                </div>

                {formData.auth_type === 'bearer' && (
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Bearer Token</label>
                    <Input type="password" value={formData.auth_token} onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })} placeholder="Your bearer token" />
                  </div>
                )}

                {formData.auth_type === 'basic' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Username</label>
                      <Input value={formData.auth_username} onChange={(e) => setFormData({ ...formData, auth_username: e.target.value })} placeholder="Username" />
                    </div>
                    <div>
                      <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>Password</label>
                      <Input type="password" value={formData.auth_password} onChange={(e) => setFormData({ ...formData, auth_password: e.target.value })} placeholder="Password" />
                    </div>
                  </div>
                )}

                {formData.auth_type === 'api_key' && (
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>API Key</label>
                    <Input type="password" value={formData.auth_token} onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })} placeholder="Your API key" />
                  </div>
                )}

                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Events <span className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>({formData.events.length} selected)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    {WEBHOOK_EVENTS.map((event) => (
                      <label
                        key={event.value}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded cursor-pointer text-sm transition-colors",
                          formData.events.includes(event.value)
                            ? isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600"
                            : isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.value)}
                          onChange={() => toggleEvent(event.value)}
                          className="rounded"
                        />
                        <span className="truncate">{event.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.retry_enabled} onChange={(e) => setFormData({ ...formData, retry_enabled: e.target.checked })} />
                    <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Enable retries</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
                    <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit">
                    <Zap className="h-4 w-4" />
                    {editingId ? 'Update Webhook' : 'Create Webhook'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deliveries Modal */}
      <AnimatePresence>
        {deliveriesModalOpen && selectedWebhook && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setDeliveriesModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl shadow-xl", isDark ? "bg-neutral-900" : "bg-white")}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  Recent Deliveries - {selectedWebhook.name}
                </h3>
                <button onClick={() => setDeliveriesModalOpen(false)} className={cn("p-1 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
                {loadingDeliveries ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className={cn("h-8 w-8 animate-spin", isDark ? "text-teal-400" : "text-teal-600")} />
                  </div>
                ) : deliveries.length > 0 ? (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {deliveries.map((delivery) => (
                      <div key={delivery.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {getDeliveryStatusIcon(delivery.status)}
                            <div>
                              <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                                {delivery.event_type}
                              </p>
                              <p className={cn("text-xs mt-0.5", isDark ? "text-neutral-500" : "text-neutral-500")}>
                                {new Date(delivery.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {delivery.response_status && (
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-mono",
                                delivery.response_status >= 200 && delivery.response_status < 300
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              )}>
                                {delivery.response_status}
                              </span>
                            )}
                            {delivery.response_time_ms && (
                              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                                {delivery.response_time_ms}ms
                              </p>
                            )}
                          </div>
                        </div>
                        {delivery.error_message && (
                          <p className={cn("text-xs mt-2 p-2 rounded", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
                            {delivery.error_message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Activity className={cn("h-8 w-8 mx-auto mb-2", isDark ? "text-neutral-600" : "text-neutral-400")} />
                    <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>No deliveries yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebhookManager;
