import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  Shield,
  AlertTriangle,
  Loader2,
  LogOut,
  Check,
  RefreshCw,
  History,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  getLoginHistory,
  UserSession,
  LoginHistoryEntry,
  formatDate,
  formatRelativeTime,
} from '../../lib/security';

export function SessionManagement() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [sessionsData, historyData] = await Promise.all([
        getSessions(),
        getLoginHistory(10),
      ]);
      setSessions(sessionsData);
      setLoginHistory(historyData);
    } catch (error) {
      console.error('Error loading session data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevokeSession(sessionId: string) {
    setRevoking(sessionId);
    try {
      await revokeSession(sessionId);
      await loadData();
    } catch (error) {
      console.error('Error revoking session:', error);
    } finally {
      setRevoking(null);
    }
  }

  async function handleRevokeAllSessions() {
    if (!confirm('Are you sure you want to log out of all other sessions?')) {
      return;
    }

    setRevokingAll(true);
    try {
      await revokeAllOtherSessions();
      await loadData();
    } catch (error) {
      console.error('Error revoking all sessions:', error);
    } finally {
      setRevokingAll(false);
    }
  }

  function getDeviceIcon(deviceType?: string) {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  }

  function getStatusBadge(session: UserSession) {
    if (session.is_current) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <Check className="w-3 h-3" />
          Current Session
        </span>
      );
    }
    if (session.status === 'suspicious') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle className="w-3 h-3" />
          Suspicious
        </span>
      );
    }
    if (session.is_trusted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Shield className="w-3 h-3" />
          Trusted
        </span>
      );
    }
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const otherSessions = sessions.filter((s) => !s.is_current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Active Sessions
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your active sessions and login history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide' : 'Show'} Login History
          </Button>
          {otherSessions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllSessions}
              disabled={revokingAll}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {revokingAll ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              Log Out All Others
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 ${
                session.is_current
                  ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : session.status === 'suspicious'
                  ? 'ring-2 ring-red-500 bg-red-50/50 dark:bg-red-950/20'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Device Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      session.is_current
                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    {getDeviceIcon(session.device_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-neutral-900 dark:text-white">
                        {session.device_name || `${session.browser} on ${session.os}`}
                      </h4>
                      {getStatusBadge(session)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {session.ip_address || 'Unknown IP'}
                      </span>
                      {(session.location_city || session.location_country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {[session.location_city, session.location_country]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last active {formatRelativeTime(session.last_active_at)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Session started {formatDate(session.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {!session.is_current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revoking === session.id}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {revoking === session.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Revoke
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {sessions.length === 0 && (
          <Card className="p-8 text-center">
            <Monitor className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400">
              No active sessions found
            </p>
          </Card>
        )}
      </div>

      {/* Login History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Recent Login History
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">IP Address</th>
                      <th className="pb-3">2FA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {loginHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="py-3 text-sm text-neutral-900 dark:text-white">
                          {formatRelativeTime(entry.created_at)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              entry.status === 'success'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : entry.status === 'failed'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                          {entry.login_type}
                        </td>
                        <td className="py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {[entry.location_city, entry.location_country]
                            .filter(Boolean)
                            .join(', ') || '-'}
                        </td>
                        <td className="py-3">
                          <code className="text-xs text-neutral-500">
                            {entry.ip_address || '-'}
                          </code>
                        </td>
                        <td className="py-3">
                          {entry.used_2fa ? (
                            <span className="text-emerald-600">
                              <Check className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Timeout Settings Info */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Session Security Settings
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h5 className="font-medium text-neutral-900 dark:text-white">
                Idle Timeout
              </h5>
            </div>
            <p className="text-2xl font-bold text-indigo-600">30 min</p>
            <p className="text-xs text-neutral-500 mt-1">
              Sessions expire after 30 minutes of inactivity
            </p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <h5 className="font-medium text-neutral-900 dark:text-white">
                Max Duration
              </h5>
            </div>
            <p className="text-2xl font-bold text-purple-600">12 hours</p>
            <p className="text-xs text-neutral-500 mt-1">
              Sessions auto-expire after 12 hours maximum
            </p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-5 h-5 text-emerald-500" />
              <h5 className="font-medium text-neutral-900 dark:text-white">
                Concurrent Sessions
              </h5>
            </div>
            <p className="text-2xl font-bold text-emerald-600">3 max</p>
            <p className="text-xs text-neutral-500 mt-1">
              Maximum 3 active sessions per user
            </p>
          </div>
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Security Recommendation
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              If you see any suspicious sessions or logins from unfamiliar locations,
              immediately revoke them and change your password. Enable two-factor
              authentication for additional security.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SessionManagement;
