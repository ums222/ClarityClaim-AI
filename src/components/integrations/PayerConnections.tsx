import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
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
  Send,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getPayerConnections,
  createPayerConnection,
  updatePayerConnection,
  deletePayerConnection,
  testPayerConnection,
  PAYER_CLEARINGHOUSES,
  type PayerConnection,
} from '../../lib/integrations';

export function PayerConnections() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  
  const [connections, setConnections] = useState<PayerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    payer_name: '',
    payer_id: '',
    trading_partner_id: '',
    connection_type: 'clearinghouse' as PayerConnection['connection_type'],
    clearinghouse: 'availity',
    api_url: '',
    api_key: '',
    api_secret: '',
    username: '',
    password: '',
    submission_format: 'X12_837P',
    supports_real_time: false,
    supports_batch: true,
  });

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await getPayerConnections();
      setConnections(data);
    } catch (error) {
      console.error('Failed to load payer connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      payer_name: '',
      payer_id: '',
      trading_partner_id: '',
      connection_type: 'clearinghouse',
      clearinghouse: 'availity',
      api_url: '',
      api_key: '',
      api_secret: '',
      username: '',
      password: '',
      submission_format: 'X12_837P',
      supports_real_time: false,
      supports_batch: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (editingId) {
        await updatePayerConnection(editingId, formData);
        setMessage({ type: 'success', text: 'Connection updated successfully' });
      } else {
        await createPayerConnection(formData);
        setMessage({ type: 'success', text: 'Connection created successfully' });
      }
      setModalOpen(false);
      resetForm();
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save connection' });
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const result = await testPayerConnection(id);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this connection?')) return;
    
    try {
      await deletePayerConnection(id);
      setMessage({ type: 'success', text: 'Connection deleted' });
      loadConnections();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete' });
    }
    setMenuOpen(null);
  };

  const handleEdit = (connection: PayerConnection) => {
    setFormData({
      name: connection.name,
      payer_name: connection.payer_name,
      payer_id: connection.payer_id || '',
      trading_partner_id: connection.trading_partner_id || '',
      connection_type: connection.connection_type,
      clearinghouse: connection.clearinghouse || 'availity',
      api_url: connection.api_url || '',
      api_key: '',
      api_secret: '',
      username: '',
      password: '',
      submission_format: connection.submission_format,
      supports_real_time: connection.supports_real_time,
      supports_batch: connection.supports_batch,
    });
    setEditingId(connection.id);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'error':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'suspended':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const getClearinghouseInfo = (value: string) => {
    return PAYER_CLEARINGHOUSES.find(c => c.value === value) || { label: value, description: '' };
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
          <p className="text-sm font-medium">You need admin permissions to manage payer connections.</p>
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
            Payer API Connections
          </h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Connect to clearinghouses and payer portals for direct claim submission
          </p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Payer
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

      {/* Connections */}
      {connections.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {connections.map((connection, index) => {
            const chInfo = getClearinghouseInfo(connection.clearinghouse || '');
            const acceptanceRate = connection.claims_submitted > 0
              ? Math.round((connection.claims_accepted / connection.claims_submitted) * 100)
              : 0;
            
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
                              onClick={() => { handleTest(connection.id); setMenuOpen(null); }}
                              disabled={testingId === connection.id}
                              className={cn("flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors", isDark ? "hover:bg-neutral-700 text-neutral-300" : "hover:bg-neutral-100 text-neutral-700")}
                            >
                              {testingId === connection.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                              Test Connection
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
                      <Building2 className={cn("h-6 w-6", isDark ? "text-teal-400" : "text-teal-600")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-semibold truncate", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.name}
                      </h4>
                      <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                        {connection.payer_name}
                        {connection.clearinghouse && ` via ${chInfo.label}`}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(connection.status))}>
                      {connection.status}
                    </span>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600")}>
                      {connection.submission_format}
                    </span>
                    {connection.supports_real_time && (
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600")}>
                        Real-time
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className={cn("p-3 rounded-lg grid grid-cols-3 gap-3", isDark ? "bg-neutral-800/50" : "bg-neutral-50")}>
                    <div className="text-center">
                      <p className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.claims_submitted.toLocaleString()}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Submitted</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-lg font-semibold text-green-500")}>
                        {connection.claims_accepted.toLocaleString()}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Accepted</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-lg font-semibold", acceptanceRate >= 90 ? "text-green-500" : acceptanceRate >= 70 ? "text-yellow-500" : "text-red-500")}>
                        {acceptanceRate}%
                      </p>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Rate</p>
                    </div>
                  </div>

                  {/* Last Activity */}
                  {connection.last_submission_at && (
                    <p className={cn("text-xs mt-3 flex items-center gap-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                      <Send className="h-3 w-3" />
                      Last submission: {new Date(connection.last_submission_at).toLocaleString()}
                    </p>
                  )}

                  {/* Error */}
                  {connection.status === 'error' && connection.last_error && (
                    <div className={cn("mt-3 p-2 rounded-lg text-xs", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
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
          <Building2 className={cn("h-12 w-12 mx-auto mb-4", isDark ? "text-neutral-600" : "text-neutral-400")} />
          <h4 className={cn("font-medium mb-2", isDark ? "text-white" : "text-neutral-900")}>
            No payer connections
          </h4>
          <p className={cn("text-sm mb-4", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Connect to clearinghouses and payers for direct claim submission
          </p>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Payer
          </Button>
        </Card>
      )}

      {/* Clearinghouses */}
      <div>
        <h4 className={cn("text-sm font-medium mb-3", isDark ? "text-neutral-300" : "text-neutral-700")}>
          Supported Clearinghouses
        </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PAYER_CLEARINGHOUSES.map((ch) => (
            <Card
              key={ch.value}
              className={cn("p-4 cursor-pointer transition-all", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50")}
              onClick={() => { resetForm(); setFormData(f => ({ ...f, clearinghouse: ch.value, connection_type: ch.value === 'direct' ? 'api' : 'clearinghouse' })); setModalOpen(true); }}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                  <Building2 className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
                </div>
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>{ch.label}</p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>{ch.description}</p>
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
                  {editingId ? 'Edit Payer Connection' : 'Add Payer Connection'}
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
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Blue Cross Blue Shield" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Payer Name
                    </label>
                    <Input value={formData.payer_name} onChange={(e) => setFormData({ ...formData, payer_name: e.target.value })} placeholder="BCBS of Texas" required />
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Payer ID
                    </label>
                    <Input value={formData.payer_id} onChange={(e) => setFormData({ ...formData, payer_id: e.target.value })} placeholder="84980" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Connection Type
                    </label>
                    <Select value={formData.connection_type} onChange={(e) => setFormData({ ...formData, connection_type: e.target.value as any })}>
                      <option value="clearinghouse">Clearinghouse</option>
                      <option value="api">Direct API</option>
                      <option value="sftp">SFTP</option>
                      <option value="portal">Portal</option>
                    </Select>
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Clearinghouse
                    </label>
                    <Select value={formData.clearinghouse} onChange={(e) => setFormData({ ...formData, clearinghouse: e.target.value })} disabled={formData.connection_type !== 'clearinghouse'}>
                      {PAYER_CLEARINGHOUSES.filter(c => c.value !== 'direct').map((ch) => (
                        <option key={ch.value} value={ch.value}>{ch.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Submission Format
                  </label>
                  <Select value={formData.submission_format} onChange={(e) => setFormData({ ...formData, submission_format: e.target.value })}>
                    <option value="X12_837P">X12 837P (Professional)</option>
                    <option value="X12_837I">X12 837I (Institutional)</option>
                    <option value="API_JSON">API JSON</option>
                    <option value="FHIR">FHIR</option>
                  </Select>
                </div>

                <div className={cn("p-4 rounded-lg space-y-3", isDark ? "bg-neutral-800" : "bg-neutral-50")}>
                  <p className={cn("text-sm font-medium", isDark ? "text-neutral-300" : "text-neutral-700")}>Credentials</p>
                  
                  {formData.connection_type === 'api' && (
                    <>
                      <div>
                        <label className={cn("text-xs mb-1 block", isDark ? "text-neutral-400" : "text-neutral-600")}>API URL</label>
                        <Input value={formData.api_url} onChange={(e) => setFormData({ ...formData, api_url: e.target.value })} placeholder="https://api.payer.com/claims" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={cn("text-xs mb-1 block", isDark ? "text-neutral-400" : "text-neutral-600")}>API Key</label>
                          <Input value={formData.api_key} onChange={(e) => setFormData({ ...formData, api_key: e.target.value })} placeholder="API Key" />
                        </div>
                        <div>
                          <label className={cn("text-xs mb-1 block", isDark ? "text-neutral-400" : "text-neutral-600")}>API Secret</label>
                          <Input type="password" value={formData.api_secret} onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })} placeholder="••••••••" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={cn("text-xs mb-1 block", isDark ? "text-neutral-400" : "text-neutral-600")}>Username</label>
                      <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
                    </div>
                    <div>
                      <label className={cn("text-xs mb-1 block", isDark ? "text-neutral-400" : "text-neutral-600")}>Password</label>
                      <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.supports_real_time} onChange={(e) => setFormData({ ...formData, supports_real_time: e.target.checked })} />
                    <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Real-time submission</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.supports_batch} onChange={(e) => setFormData({ ...formData, supports_batch: e.target.checked })} />
                    <span className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>Batch submission</span>
                  </label>
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

export default PayerConnections;
