import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hospital,
  Plus,
  MoreVertical,
  Check,
  X,
  Loader2,
  Trash2,
  Settings,
  RefreshCw,
  AlertCircle,
  Zap,
  Clock,
  Link2,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getEHRConnections,
  createEHRConnection,
  updateEHRConnection,
  deleteEHRConnection,
  syncEHRConnection,
  EHR_PROVIDERS,
  type EHRConnection,
} from '../../lib/integrations';

export function EHRConnectors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [connections, setConnections] = useState<EHRConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    provider: 'epic' as EHRConnection['provider'],
    environment: 'sandbox' as EHRConnection['environment'],
    client_id: '',
    client_secret: '',
    base_url: '',
    fhir_version: 'R4',
    auto_sync_enabled: true,
    sync_frequency: 'daily',
    sync_claims: true,
    sync_patients: true,
    sync_coverage: true,
  });

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await getEHRConnections();
      setConnections(data);
    } catch (error) {
      console.error('Failed to load EHR connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: 'epic',
      environment: 'sandbox',
      client_id: '',
      client_secret: '',
      base_url: '',
      fhir_version: 'R4',
      auto_sync_enabled: true,
      sync_frequency: 'daily',
      sync_claims: true,
      sync_patients: true,
      sync_coverage: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (editingId) {
        await updateEHRConnection(editingId, formData);
        setMessage({ type: 'success', text: 'Connection updated successfully' });
      } else {
        await createEHRConnection(formData);
        setMessage({ type: 'success', text: 'Connection created successfully' });
      }
      setModalOpen(false);
      resetForm();
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save connection' });
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await syncEHRConnection(id);
      setMessage({ type: 'success', text: 'Sync completed successfully' });
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Sync failed' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this connection?')) return;
    
    try {
      await deleteEHRConnection(id);
      setMessage({ type: 'success', text: 'Connection deleted' });
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete' });
    }
    setMenuOpen(null);
  };

  const handleEdit = (connection: EHRConnection) => {
    setFormData({
      name: connection.name,
      provider: connection.provider,
      environment: connection.environment,
      client_id: connection.client_id || '',
      client_secret: '',
      base_url: connection.base_url || '',
      fhir_version: connection.fhir_version,
      auto_sync_enabled: connection.auto_sync_enabled,
      sync_frequency: connection.sync_frequency,
      sync_claims: connection.sync_claims,
      sync_patients: connection.sync_patients,
      sync_coverage: connection.sync_coverage,
    });
    setEditingId(connection.id);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'error':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'expired':
      case 'revoked':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const getProviderInfo = (provider: string) => {
    return EHR_PROVIDERS.find(p => p.value === provider) || { label: provider, description: '' };
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
          <p className="text-sm font-medium">You need admin permissions to manage EHR connections.</p>
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
            EHR/EMR Connections
          </h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Connect to Epic, Cerner, athenahealth, and other EHR systems via FHIR
          </p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Connection
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

      {/* Connections Grid */}
      {connections.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {connections.map((connection, index) => {
            const providerInfo = getProviderInfo(connection.provider);
            
            return (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 relative">
                  {/* Menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setMenuOpen(menuOpen === connection.id ? null : connection.id)}
                      className={cn("p-1.5 rounded-lg transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-neutral-200 text-neutral-600")}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {menuOpen === connection.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn("absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-50 py-1 ring-1", isDark ? "bg-neutral-800 ring-neutral-700" : "bg-white ring-neutral-200")}
                          >
                            <button
                              onClick={() => handleEdit(connection)}
                              className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                            >
                              <Settings className="h-4 w-4" />
                              Configure
                            </button>
                            <button
                              onClick={() => { handleSync(connection.id); setMenuOpen(null); }}
                              disabled={syncingId === connection.id}
                              className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                            >
                              {syncingId === connection.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                              Sync Now
                            </button>
                            <button
                              onClick={() => handleDelete(connection.id)}
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

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn("p-3 rounded-xl", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                      <Hospital className={cn("h-6 w-6", isDark ? "text-teal-400" : "text-teal-600")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-semibold truncate", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.name}
                      </h4>
                      <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                        {providerInfo.label} • FHIR {connection.fhir_version}
                      </p>
                    </div>
                  </div>

                  {/* Status & Environment */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(connection.status))}>
                      {connection.status === 'connected' ? (
                        <span className="flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          Connected
                        </span>
                      ) : connection.status}
                    </span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                      connection.environment === 'production'
                        ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-50 text-purple-600"
                        : isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
                    )}>
                      {connection.environment}
                    </span>
                  </div>

                  {/* Sync Info */}
                  <div className={cn("p-3 rounded-lg mb-4", isDark ? "bg-neutral-800/50" : "bg-neutral-50")}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>Auto Sync</span>
                      <span className={cn("font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.auto_sync_enabled ? connection.sync_frequency : 'Disabled'}
                      </span>
                    </div>
                    {connection.last_sync_at && (
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>Last Sync</span>
                        <span className={cn("font-medium flex items-center gap-1", isDark ? "text-white" : "text-neutral-900")}>
                          <Clock className="h-3 w-3" />
                          {new Date(connection.last_sync_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sync Resources */}
                  <div className="flex flex-wrap gap-2">
                    {connection.sync_claims && (
                      <span className={cn("px-2 py-0.5 rounded text-xs", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                        Claims
                      </span>
                    )}
                    {connection.sync_patients && (
                      <span className={cn("px-2 py-0.5 rounded text-xs", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                        Patients
                      </span>
                    )}
                    {connection.sync_coverage && (
                      <span className={cn("px-2 py-0.5 rounded text-xs", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                        Coverage
                      </span>
                    )}
                  </div>

                  {/* Error */}
                  {connection.status === 'error' && connection.last_error && (
                    <div className={cn("mt-4 p-2 rounded-lg text-xs", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
                      {connection.last_error}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Hospital className={cn("h-12 w-12 mx-auto mb-4", isDark ? "text-neutral-600" : "text-neutral-400")} />
          <h4 className={cn("font-medium mb-2", isDark ? "text-white" : "text-neutral-900")}>
            No EHR connections
          </h4>
          <p className={cn("text-sm mb-4", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Connect your EHR system to sync claims and patient data
          </p>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Connection
          </Button>
        </Card>
      )}

      {/* Available EHRs */}
      <div>
        <h4 className={cn("text-sm font-medium mb-3", isDark ? "text-neutral-300" : "text-neutral-700")}>
          Supported EHR Systems
        </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EHR_PROVIDERS.map((provider) => (
            <Card
              key={provider.value}
              className={cn("p-4 cursor-pointer transition-all", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50")}
              onClick={() => { resetForm(); setFormData(f => ({ ...f, provider: provider.value as any })); setModalOpen(true); }}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                  <Hospital className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
                </div>
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    {provider.label}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    {provider.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
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
                  {editingId ? 'Edit EHR Connection' : 'Add EHR Connection'}
                </h3>
                <button onClick={() => { setModalOpen(false); resetForm(); }} className={cn("p-1 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Connection Name
                  </label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Main Hospital EHR" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      EHR Provider
                    </label>
                    <Select value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}>
                      {EHR_PROVIDERS.map((provider) => (
                        <option key={provider.value} value={provider.value}>{provider.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Environment
                    </label>
                    <Select value={formData.environment} onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}>
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    FHIR Base URL
                  </label>
                  <Input value={formData.base_url} onChange={(e) => setFormData({ ...formData, base_url: e.target.value })} placeholder="https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Client ID
                    </label>
                    <Input value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} placeholder="Your Client ID" />
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Client Secret
                    </label>
                    <Input type="password" value={formData.client_secret} onChange={(e) => setFormData({ ...formData, client_secret: e.target.value })} placeholder="••••••••" />
                  </div>
                </div>

                <div className={cn("p-4 rounded-lg", isDark ? "bg-neutral-800" : "bg-neutral-50")}>
                  <p className={cn("text-sm font-medium mb-3", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Sync Settings
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>Auto Sync</span>
                      <Select value={formData.auto_sync_enabled ? formData.sync_frequency : 'disabled'} onChange={(e) => {
                        if (e.target.value === 'disabled') {
                          setFormData({ ...formData, auto_sync_enabled: false });
                        } else {
                          setFormData({ ...formData, auto_sync_enabled: true, sync_frequency: e.target.value });
                        }
                      }} className="w-32">
                        <option value="disabled">Disabled</option>
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </Select>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.sync_claims} onChange={(e) => setFormData({ ...formData, sync_claims: e.target.checked })} />
                        <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Claims</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.sync_patients} onChange={(e) => setFormData({ ...formData, sync_patients: e.target.checked })} />
                        <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Patients</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.sync_coverage} onChange={(e) => setFormData({ ...formData, sync_coverage: e.target.checked })} />
                        <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Coverage</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit">
                    <Zap className="h-4 w-4" />
                    {editingId ? 'Update Connection' : 'Create Connection'}
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

export default EHRConnectors;
