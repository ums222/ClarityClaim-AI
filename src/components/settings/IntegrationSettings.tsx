import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plug,
  Plus,
  MoreVertical,
  Check,
  X,
  Loader2,
  Trash2,
  Settings,
  RefreshCw,
  AlertCircle,
  Activity,
  Building,
  Hospital,
  Workflow,
  BarChart3,
  Webhook,
  Zap,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegration,
  INTEGRATION_TYPES,
  INTEGRATION_PROVIDERS,
  type Integration,
} from '../../lib/settings';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'ehr':
      return Hospital;
    case 'payer':
      return Building;
    case 'clearinghouse':
      return Workflow;
    case 'analytics':
      return BarChart3;
    case 'webhook':
      return Webhook;
    default:
      return Plug;
  }
};

export function IntegrationSettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'ehr' as Integration['type'],
    provider: 'epic',
    description: '',
    sync_frequency: 'daily',
    sync_enabled: true,
    config: {
      api_key: '',
      api_url: '',
      client_id: '',
      client_secret: '',
    },
  });

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'ehr',
      provider: 'epic',
      description: '',
      sync_frequency: 'daily',
      sync_enabled: true,
      config: {
        api_key: '',
        api_url: '',
        client_id: '',
        client_secret: '',
      },
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (editingId) {
        await updateIntegration(editingId, {
          name: formData.name,
          description: formData.description,
          sync_frequency: formData.sync_frequency,
          sync_enabled: formData.sync_enabled,
          config: formData.config,
        });
        setMessage({ type: 'success', text: 'Integration updated successfully' });
      } else {
        await createIntegration({
          name: formData.name,
          type: formData.type,
          provider: formData.provider,
          description: formData.description,
          sync_frequency: formData.sync_frequency,
          sync_enabled: formData.sync_enabled,
          config: formData.config,
        });
        setMessage({ type: 'success', text: 'Integration created successfully' });
      }
      setModalOpen(false);
      resetForm();
      loadIntegrations();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save integration' });
    }
  };

  const handleEdit = (integration: Integration) => {
    const config = integration.config || {};
    setFormData({
      name: integration.name,
      type: integration.type,
      provider: integration.provider,
      description: integration.description || '',
      sync_frequency: integration.sync_frequency,
      sync_enabled: integration.sync_enabled,
      config: {
        api_key: (config as any).api_key || '',
        api_url: (config as any).api_url || '',
        client_id: (config as any).client_id || '',
        client_secret: (config as any).client_secret || '',
      },
    });
    setEditingId(integration.id);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this integration?')) return;
    
    try {
      await deleteIntegration(id);
      setMessage({ type: 'success', text: 'Integration deleted' });
      loadIntegrations();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete integration' });
    }
    setMenuOpen(null);
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const result = await testIntegration(id);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setTestingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'inactive':
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
      case 'error':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      default:
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDark ? "text-teal-400" : "text-teal-600"
        )} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            You need admin permissions to manage integrations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Integrations
          </h3>
          <p className={cn(
            "text-sm mt-0.5",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Connect your EHR systems, payer portals, and other healthcare platforms
          </p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Integration
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

      {/* Integrations Grid */}
      {integrations.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration, index) => {
            const TypeIcon = getTypeIcon(integration.type);
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 relative">
                  {/* Menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setMenuOpen(menuOpen === integration.id ? null : integration.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isDark 
                          ? "hover:bg-neutral-700 text-neutral-400"
                          : "hover:bg-neutral-200 text-neutral-600"
                      )}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {menuOpen === integration.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                              "absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-50 py-1 ring-1",
                              isDark ? "bg-neutral-800 ring-neutral-700" : "bg-white ring-neutral-200"
                            )}
                          >
                            <button
                              onClick={() => handleEdit(integration)}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                                isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700"
                              )}
                            >
                              <Settings className="h-4 w-4" />
                              Configure
                            </button>
                            <button
                              onClick={() => {
                                handleTest(integration.id);
                                setMenuOpen(null);
                              }}
                              disabled={testingId === integration.id}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                                isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700"
                              )}
                            >
                              {testingId === integration.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              Test Connection
                            </button>
                            <button
                              onClick={() => handleDelete(integration.id)}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors",
                                isDark ? "hover:bg-neutral-700 text-red-400" : "hover:bg-neutral-100 text-red-600"
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Icon & Status */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={cn(
                      "p-2.5 rounded-lg",
                      isDark ? "bg-neutral-800" : "bg-neutral-100"
                    )}>
                      <TypeIcon className={cn(
                        "h-6 w-6",
                        isDark ? "text-teal-400" : "text-teal-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-medium truncate",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {integration.name}
                      </h4>
                      <p className={cn(
                        "text-xs capitalize",
                        isDark ? "text-neutral-500" : "text-neutral-500"
                      )}>
                        {integration.type} • {integration.provider}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                      getStatusColor(integration.status)
                    )}>
                      {integration.status}
                    </span>
                    {integration.sync_enabled && (
                      <span className={cn(
                        "text-xs flex items-center gap-1",
                        isDark ? "text-neutral-500" : "text-neutral-500"
                      )}>
                        <Activity className="h-3 w-3" />
                        {integration.sync_frequency}
                      </span>
                    )}
                  </div>

                  {/* Last Sync */}
                  {integration.last_sync_at && (
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}>
                      Last synced: {new Date(integration.last_sync_at).toLocaleString()}
                    </p>
                  )}

                  {/* Error */}
                  {integration.status === 'error' && integration.last_error && (
                    <div className={cn(
                      "mt-3 p-2 rounded-lg text-xs",
                      isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                    )}>
                      {integration.last_error}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Plug className={cn(
            "h-12 w-12 mx-auto mb-4",
            isDark ? "text-neutral-600" : "text-neutral-400"
          )} />
          <h4 className={cn(
            "font-medium mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            No integrations configured
          </h4>
          <p className={cn(
            "text-sm mb-4",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Connect your first integration to streamline your workflow
          </p>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Integration
          </Button>
        </Card>
      )}

      {/* Available Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className={cn(
          "text-sm font-medium mb-3",
          isDark ? "text-neutral-300" : "text-neutral-700"
        )}>
          Available Integrations
        </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INTEGRATION_TYPES.map((type) => {
            const TypeIcon = getTypeIcon(type.value);
            return (
              <Card
                key={type.value}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50"
                )}
                onClick={() => {
                  resetForm();
                  setFormData(f => ({ ...f, type: type.value as Integration['type'] }));
                  setModalOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-neutral-800" : "bg-neutral-100"
                  )}>
                    <TypeIcon className={cn(
                      "h-5 w-5",
                      isDark ? "text-teal-400" : "text-teal-600"
                    )} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isDark ? "text-white" : "text-neutral-900"
                    )}>
                      {type.label}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}>
                      Click to add
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => { setModalOpen(false); resetForm(); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6",
                isDark ? "bg-neutral-900" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  {editingId ? 'Edit Integration' : 'Add Integration'}
                </h3>
                <button
                  onClick={() => { setModalOpen(false); resetForm(); }}
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Integration Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Epic Integration"
                    required
                  />
                </div>

                {!editingId && (
                  <>
                    <div>
                      <label className={cn(
                        "text-sm font-medium mb-1.5 block",
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      )}>
                        Integration Type
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) => {
                          const newType = e.target.value as Integration['type'];
                          const providers = INTEGRATION_PROVIDERS[newType];
                          setFormData({ 
                            ...formData, 
                            type: newType,
                            provider: providers?.[0]?.value || 'custom'
                          });
                        }}
                      >
                        {INTEGRATION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className={cn(
                        "text-sm font-medium mb-1.5 block",
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      )}>
                        Provider
                      </label>
                      <Select
                        value={formData.provider}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      >
                        {INTEGRATION_PROVIDERS[formData.type]?.map((provider) => (
                          <option key={provider.value} value={provider.value}>
                            {provider.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn(
                      "text-sm font-medium mb-1.5 block",
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    )}>
                      Sync Frequency
                    </label>
                    <Select
                      value={formData.sync_frequency}
                      onChange={(e) => setFormData({ ...formData, sync_frequency: e.target.value })}
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="manual">Manual</option>
                    </Select>
                  </div>

                  <div>
                    <label className={cn(
                      "text-sm font-medium mb-1.5 block",
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    )}>
                      Auto Sync
                    </label>
                    <Select
                      value={formData.sync_enabled ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, sync_enabled: e.target.value === 'true' })}
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </Select>
                  </div>
                </div>

                {/* API Configuration */}
                <div className={cn(
                  "p-4 rounded-lg space-y-4",
                  isDark ? "bg-neutral-800" : "bg-neutral-50"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    API Configuration
                  </p>
                  
                  <div>
                    <label className={cn(
                      "text-xs mb-1 block",
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    )}>
                      API URL
                    </label>
                    <Input
                      value={formData.config.api_url}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        config: { ...formData.config, api_url: e.target.value }
                      })}
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className={cn(
                      "text-xs mb-1 block",
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    )}>
                      API Key
                    </label>
                    <Input
                      type="password"
                      value={formData.config.api_key}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        config: { ...formData.config, api_key: e.target.value }
                      })}
                      placeholder="Your API key"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={cn(
                        "text-xs mb-1 block",
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      )}>
                        Client ID
                      </label>
                      <Input
                        value={formData.config.client_id}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          config: { ...formData.config, client_id: e.target.value }
                        })}
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "text-xs mb-1 block",
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      )}>
                        Client Secret
                      </label>
                      <Input
                        type="password"
                        value={formData.config.client_secret}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          config: { ...formData.config, client_secret: e.target.value }
                        })}
                        placeholder="Client Secret"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setModalOpen(false); resetForm(); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Zap className="h-4 w-4" />
                    {editingId ? 'Update Integration' : 'Create Integration'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IntegrationSettings;
