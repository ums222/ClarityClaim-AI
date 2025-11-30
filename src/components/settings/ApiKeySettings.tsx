import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Check,
  X,
  Loader2,
  Trash2,
  AlertCircle,
  Clock,
  Activity,
  Shield,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKey,
} from '../../lib/settings';

const PERMISSION_OPTIONS = [
  { value: 'read', label: 'Read', description: 'View claims and appeals' },
  { value: 'write', label: 'Write', description: 'Create and update data' },
  { value: 'delete', label: 'Delete', description: 'Remove data' },
  { value: 'admin', label: 'Admin', description: 'Full access' },
];

export function ApiKeySettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: ApiKey; fullKey: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: ['read'] as string[],
    expiresInDays: '',
  });

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: ['read'],
      expiresInDays: '',
    });
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      const expiresInDays = formData.expiresInDays ? parseInt(formData.expiresInDays) : undefined;
      const result = await createApiKey(
        formData.name,
        formData.description || undefined,
        formData.permissions,
        expiresInDays
      );
      setNewKeyData(result);
      resetForm();
      loadApiKeys();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to create API key' });
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;
    
    try {
      await revokeApiKey(id);
      setMessage({ type: 'success', text: 'API key revoked successfully' });
      loadApiKeys();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to revoke API key' });
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePermission = (permission: string) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'revoked':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
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
            You need admin permissions to manage API keys.
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
            API Keys
          </h3>
          <p className={cn(
            "text-sm mt-0.5",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Manage API keys for programmatic access to ClarityClaim
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Generate API Key
        </Button>
      </div>

      {/* Security Notice */}
      <Card className={cn(
        "p-4 border-l-4",
        isDark ? "border-l-yellow-500 bg-yellow-500/10" : "border-l-yellow-500 bg-yellow-50"
      )}>
        <div className="flex gap-3">
          <Shield className={cn(
            "h-5 w-5 flex-shrink-0",
            isDark ? "text-yellow-400" : "text-yellow-600"
          )} />
          <div>
            <p className={cn(
              "text-sm font-medium",
              isDark ? "text-yellow-400" : "text-yellow-700"
            )}>
              Keep your API keys secure
            </p>
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-yellow-400/80" : "text-yellow-700/80"
            )}>
              API keys provide full access to your account. Never share them publicly or commit them to version control.
            </p>
          </div>
        </div>
      </Card>

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

      {/* API Keys List */}
      {apiKeys.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={cn(
                    "p-4 transition-colors",
                    key.status === 'revoked' && 'opacity-60',
                    isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={cn(
                        "p-2 rounded-lg mt-0.5",
                        isDark ? "bg-neutral-800" : "bg-neutral-100"
                      )}>
                        <Key className={cn(
                          "h-5 w-5",
                          key.status === 'revoked'
                            ? isDark ? "text-neutral-600" : "text-neutral-400"
                            : isDark ? "text-teal-400" : "text-teal-600"
                        )} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn(
                            "font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {key.name}
                          </p>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            getStatusColor(key.status)
                          )}>
                            {key.status}
                          </span>
                        </div>
                        
                        <div className={cn(
                          "mt-1 flex items-center gap-2 text-sm font-mono",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          <span>{key.key_prefix}••••••••••••</span>
                          <button
                            onClick={() => copyToClipboard(key.key_prefix)}
                            className={cn(
                              "p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700",
                              isDark ? "text-neutral-500" : "text-neutral-400"
                            )}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        
                        {key.description && (
                          <p className={cn(
                            "text-xs mt-1",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            {key.description}
                          </p>
                        )}

                        <div className={cn(
                          "flex flex-wrap items-center gap-3 mt-2 text-xs",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {key.permissions.join(', ')}
                          </span>
                          
                          {key.last_used_at && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Last used: {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          
                          {key.expires_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {new Date(key.expires_at).toLocaleDateString()}
                            </span>
                          )}
                          
                          <span>
                            {key.usage_count.toLocaleString()} requests
                          </span>
                        </div>
                      </div>
                    </div>

                    {key.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-500 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Key className={cn(
            "h-12 w-12 mx-auto mb-4",
            isDark ? "text-neutral-600" : "text-neutral-400"
          )} />
          <h4 className={cn(
            "font-medium mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            No API keys created
          </h4>
          <p className={cn(
            "text-sm mb-4",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Generate an API key to access ClarityClaim programmatically
          </p>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Generate API Key
          </Button>
        </Card>
      )}

      {/* Create Key Modal */}
      <AnimatePresence>
        {modalOpen && !newKeyData && (
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
                "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl shadow-xl p-6",
                isDark ? "bg-neutral-900" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Generate API Key
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

              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Key Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Production API Key"
                    required
                  />
                </div>

                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Description (optional)
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Used for integrating with our internal system"
                  />
                </div>

                <div>
                  <label className={cn(
                    "text-sm font-medium mb-2 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {PERMISSION_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          formData.permissions.includes(option.value)
                            ? isDark ? "bg-teal-500/10 ring-1 ring-teal-500/30" : "bg-teal-50 ring-1 ring-teal-500/30"
                            : isDark ? "bg-neutral-800 hover:bg-neutral-750" : "bg-neutral-50 hover:bg-neutral-100"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(option.value)}
                          onChange={() => togglePermission(option.value)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {option.label}
                          </p>
                          <p className={cn(
                            "text-xs",
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          )}>
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={cn(
                    "text-sm font-medium mb-1.5 block",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}>
                    Expiration (optional)
                  </label>
                  <Select
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                  >
                    <option value="">Never expires</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setModalOpen(false); resetForm(); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formData.permissions.length === 0}>
                    <Key className="h-4 w-4" />
                    Generate Key
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Key Display Modal */}
      <AnimatePresence>
        {newKeyData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl shadow-xl p-6",
                isDark ? "bg-neutral-900" : "bg-white"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-green-500/20" : "bg-green-50"
                )}>
                  <Check className={cn(
                    "h-5 w-5",
                    isDark ? "text-green-400" : "text-green-600"
                  )} />
                </div>
                <div>
                  <h3 className={cn(
                    "text-lg font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    API Key Created
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  )}>
                    {newKeyData.key.name}
                  </p>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-lg mb-4",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <p className={cn(
                  "text-xs mb-2 font-medium",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Your API key (copy it now - it won't be shown again):
                </p>
                <div className="flex items-center gap-2">
                  <code className={cn(
                    "flex-1 text-sm font-mono break-all",
                    isDark ? "text-teal-400" : "text-teal-600"
                  )}>
                    {newKeyData.fullKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKeyData.fullKey)}
                    className={cn(
                      "p-2 rounded-lg transition-colors flex-shrink-0",
                      copied
                        ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
                        : isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-neutral-200 text-neutral-600"
                    )}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className={cn(
                "p-3 rounded-lg mb-4 flex items-start gap-2",
                isDark ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-50 text-yellow-700"
              )}>
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">
                  Make sure to copy your API key now. For security reasons, you won't be able to see it again.
                </p>
              </div>

              <Button
                onClick={() => { setNewKeyData(null); setModalOpen(false); }}
                className="w-full"
              >
                Done
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ApiKeySettings;
