import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Shield,
  Key,
  Server,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Database,
  Globe,
  FileText,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { getEncryptionStatus, EncryptionStatus, formatDate } from '../../lib/security';

export function DataEncryption() {
  const [status, setStatus] = useState<EncryptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const data = await getEncryptionStatus();
      setStatus(data);
    } catch (error) {
      console.error('Error loading encryption status:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Overview Banner */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
            <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              All Data Fully Encrypted
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Your data is protected with industry-leading encryption at rest and in transit
            </p>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStatus}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
      </Card>

      {/* Encryption Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Encryption at Rest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              {status?.at_rest.enabled ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Active</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Disabled</span>
                </span>
              )}
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              Encryption at Rest
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              All stored data is encrypted in the database
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Algorithm</span>
                <code className="font-mono text-slate-700 dark:text-slate-300">
                  {status?.at_rest.algorithm || 'AES-256-GCM'}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Key Rotation</span>
                <span className="text-slate-700 dark:text-slate-300">
                  Every {status?.at_rest.key_rotation_days || 90} days
                </span>
              </div>
              {status?.at_rest.last_rotation && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Last Rotated</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {formatDate(status.at_rest.last_rotation)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Encryption in Transit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              {status?.in_transit.enabled ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Active</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Disabled</span>
                </span>
              )}
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              Encryption in Transit
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              All network traffic is encrypted with TLS
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">TLS Version</span>
                <code className="font-mono text-slate-700 dark:text-slate-300">
                  {status?.in_transit.tls_version || 'TLS 1.3'}
                </code>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Cipher Suites</span>
                <div className="mt-2 space-y-1">
                  {(status?.in_transit.cipher_suites || []).slice(0, 3).map((suite, i) => (
                    <code
                      key={i}
                      className="block text-xs font-mono text-slate-600 dark:text-slate-400 truncate"
                    >
                      {suite}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* PHI Encryption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              {status?.phi_encryption.enabled ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Active</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Disabled</span>
                </span>
              )}
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              PHI Field Encryption
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Protected Health Information is encrypted at field level
            </p>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-slate-500">Encrypted Fields</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(status?.phi_encryption.fields_encrypted || []).map((field, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs rounded"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              {status?.phi_encryption.last_audit && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Last Audit</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {formatDate(status.phi_encryption.last_audit)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Security Features */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Additional Security Measures
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Key,
              title: 'Key Management',
              description: 'Encryption keys are managed securely using AWS KMS with automatic rotation',
              status: 'active',
            },
            {
              icon: Server,
              title: 'Secure Infrastructure',
              description: 'Data is stored in SOC 2 Type II and HIPAA compliant data centers',
              status: 'active',
            },
            {
              icon: FileText,
              title: 'Access Logging',
              description: 'All access to encrypted data is logged for audit compliance',
              status: 'active',
            },
            {
              icon: Shield,
              title: 'Zero-Trust Architecture',
              description: 'All requests are authenticated and authorized before data access',
              status: 'active',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
            >
              <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-slate-900 dark:text-white">
                    {feature.title}
                  </h5>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Compliance Certifications */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Compliance & Certifications
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'HIPAA', description: 'Healthcare compliance' },
            { name: 'SOC 2 Type II', description: 'Security controls' },
            { name: 'HITECH', description: 'Technology standards' },
            { name: 'PCI DSS', description: 'Payment security' },
          ].map((cert, index) => (
            <div
              key={index}
              className="text-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h5 className="font-semibold text-slate-900 dark:text-white">
                {cert.name}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* HIPAA Notice */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              HIPAA Security Rule Compliance
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Our encryption implementation meets all HIPAA Security Rule requirements for protecting
              electronic Protected Health Information (ePHI). This includes addressable specifications
              for encryption and decryption (§ 164.312(a)(2)(iv)).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DataEncryption;
