import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Key,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  QrCode,
  RefreshCw,
  Trash2,
  Monitor,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  get2FASettings,
  setup2FA,
  verify2FA,
  disable2FA,
  regenerateBackupCodes,
  TwoFactorSettings,
  formatDate,
} from '../../lib/security';

export function TwoFactorAuth() {
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [disableMode, setDisableMode] = useState(false);
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const data = await get2FASettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading 2FA settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup() {
    setActionLoading(true);
    setError(null);
    try {
      const data = await setup2FA();
      setSetupData(data);
      setSetupMode(true);
    } catch (err) {
      console.error('Error setting up 2FA:', err);
      setError('Failed to start 2FA setup');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleVerify() {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await verify2FA(verificationCode);
      await loadSettings();
      setSetupMode(false);
      setSetupData(null);
      setVerificationCode('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDisable() {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await disable2FA(verificationCode);
      await loadSettings();
      setDisableMode(false);
      setVerificationCode('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRegenerateBackupCodes() {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code to regenerate backup codes');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const { backupCodes } = await regenerateBackupCodes(verificationCode);
      setNewBackupCodes(backupCodes);
      setVerificationCode('');
      await loadSettings();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to regenerate backup codes');
    } finally {
      setActionLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
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
            <AlertTriangle className="w-5 h-5 text-red-500" />
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

      {/* 2FA Status Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              settings?.totp_enabled
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              <Shield className={`w-6 h-6 ${
                settings?.totp_enabled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Add an extra layer of security to your account using a time-based one-time password (TOTP).
              </p>
              {settings?.totp_enabled && settings.totp_verified_at && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  Enabled on {formatDate(settings.totp_verified_at)}
                </p>
              )}
            </div>
          </div>
          <div>
            {settings?.totp_enabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                Enabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Not Enabled
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          {!settings?.totp_enabled && !setupMode && (
            <Button
              onClick={handleSetup}
              disabled={actionLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Enable 2FA
            </Button>
          )}

          {settings?.totp_enabled && !disableMode && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                <Key className="w-4 h-4 mr-2" />
                {showBackupCodes ? 'Hide' : 'View'} Backup Codes
              </Button>
              <Button
                variant="outline"
                onClick={() => setDisableMode(true)}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Disable 2FA
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Setup Mode */}
      <AnimatePresence>
        {setupMode && setupData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Set Up Two-Factor Authentication
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded">
                      <QrCode className="w-24 h-24 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Or enter this code manually:
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded font-mono">
                      {setupData.secret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(setupData.secret)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      {copiedCode === setupData.secret ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    2. Enter the 6-digit code from your authenticator app to verify
                  </p>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                  />
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={handleVerify}
                      disabled={actionLoading || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Verify & Enable
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupMode(false);
                        setSetupData(null);
                        setVerificationCode('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Backup Codes */}
                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      3. Save these backup codes in a safe place
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        {setupData.backupCodes.map((code, i) => (
                          <code
                            key={i}
                            className="text-sm font-mono text-slate-600 dark:text-slate-400"
                          >
                            {code}
                          </code>
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        Copy all codes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable Mode */}
      <AnimatePresence>
        {disableMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 border-red-200 dark:border-red-800">
              <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Disable Two-Factor Authentication
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Enter your current 2FA code to disable two-factor authentication. This will make your account less secure.
              </p>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="max-w-xs"
                maxLength={6}
              />
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleDisable}
                  disabled={actionLoading || verificationCode.length !== 6}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Disable 2FA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDisableMode(false);
                    setVerificationCode('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup Codes Section */}
      <AnimatePresence>
        {showBackupCodes && settings?.totp_enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Backup Codes
                </h4>
                <span className="text-sm text-slate-500">
                  {settings.backup_codes_used || 0} of 10 used
                </span>
              </div>

              {newBackupCodes ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-3">
                    New backup codes generated. Save these securely!
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {newBackupCodes.map((code, i) => (
                      <code
                        key={i}
                        className="text-sm font-mono text-emerald-600 dark:text-emerald-400"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(newBackupCodes.join('\n'))}
                    className="mt-3 text-sm text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy all codes
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Backup codes can be used to access your account if you lose your authenticator device.
                  Each code can only be used once.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 2FA code to regenerate"
                  className="max-w-xs"
                  maxLength={6}
                />
                <Button
                  variant="outline"
                  onClick={handleRegenerateBackupCodes}
                  disabled={actionLoading || verificationCode.length !== 6}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Regenerate Codes
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trusted Devices */}
      {settings?.trusted_devices && settings.trusted_devices.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Trusted Devices
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            These devices don't require 2FA verification for 30 days.
          </p>
          <div className="space-y-3">
            {settings.trusted_devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {device.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {device.browser} on {device.os} • Last used {formatDate(device.last_used)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* HIPAA Notice */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              HIPAA Compliance
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Two-factor authentication is recommended by HIPAA for accessing Protected Health Information (PHI).
              Enabling 2FA helps protect patient data and ensures compliance with healthcare regulations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TwoFactorAuth;
