import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Check,
  X,
  Loader2,
  FileText,
  Scale,
  AlertTriangle,
  Users,
  Calendar,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences as NotificationPrefsType,
} from '../../lib/settings';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, label, description, icon: Icon, disabled }: ToggleSwitchProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 p-3 rounded-lg transition-colors",
        disabled && "opacity-50",
        isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className={cn(
            "h-5 w-5 mt-0.5",
            isDark ? "text-neutral-500" : "text-neutral-400"
          )} />
        )}
        <div>
          <p className={cn(
            "text-sm font-medium",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            {label}
          </p>
          {description && (
            <p className={cn(
              "text-xs mt-0.5",
              isDark ? "text-neutral-500" : "text-neutral-500"
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          checked
            ? "bg-teal-500"
            : isDark ? "bg-neutral-700" : "bg-neutral-300",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

export function NotificationSettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [prefs, setPrefs] = useState<Partial<NotificationPrefsType>>({
    email_enabled: true,
    email_claim_status_change: true,
    email_appeal_status_change: true,
    email_appeal_deadline_reminder: true,
    email_denial_prediction_alert: true,
    email_team_activity: false,
    email_weekly_digest: true,
    email_monthly_report: true,
    inapp_enabled: true,
    inapp_claim_status_change: true,
    inapp_appeal_status_change: true,
    inapp_appeal_deadline_reminder: true,
    inapp_denial_prediction_alert: true,
    inapp_team_activity: true,
    push_enabled: false,
    push_urgent_only: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    digest_frequency: 'daily',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await getNotificationPreferences();
      if (data) {
        setPrefs(data);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      await updateNotificationPreferences(prefs);
      setMessage({ type: 'success', text: 'Notification preferences saved' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  const updatePref = (key: keyof NotificationPrefsType, value: any) => {
    setPrefs(p => ({ ...p, [key]: value }));
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

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <Mail className={cn(
                  "h-5 w-5",
                  isDark ? "text-teal-400" : "text-teal-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Email Notifications
                </h3>
                <p className={cn(
                  "text-sm mt-0.5",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Receive updates via email
                </p>
              </div>
            </div>
            <button
              onClick={() => updatePref('email_enabled', !prefs.email_enabled)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                prefs.email_enabled ? "bg-teal-500" : isDark ? "bg-neutral-700" : "bg-neutral-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                  prefs.email_enabled && "translate-x-5"
                )}
              />
            </button>
          </div>

          <div className="space-y-1">
            <ToggleSwitch
              checked={prefs.email_claim_status_change || false}
              onChange={(v) => updatePref('email_claim_status_change', v)}
              label="Claim Status Changes"
              description="When claims are approved, denied, or updated"
              icon={FileText}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_appeal_status_change || false}
              onChange={(v) => updatePref('email_appeal_status_change', v)}
              label="Appeal Status Changes"
              description="Updates on appeal progress and decisions"
              icon={Scale}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_appeal_deadline_reminder || false}
              onChange={(v) => updatePref('email_appeal_deadline_reminder', v)}
              label="Appeal Deadline Reminders"
              description="Alerts before appeal deadlines expire"
              icon={Clock}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_denial_prediction_alert || false}
              onChange={(v) => updatePref('email_denial_prediction_alert', v)}
              label="High-Risk Denial Alerts"
              description="When AI predicts high denial risk"
              icon={AlertTriangle}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_team_activity || false}
              onChange={(v) => updatePref('email_team_activity', v)}
              label="Team Activity"
              description="When team members join or update items"
              icon={Users}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_weekly_digest || false}
              onChange={(v) => updatePref('email_weekly_digest', v)}
              label="Weekly Digest"
              description="Summary of the week's activity"
              icon={Calendar}
              disabled={!prefs.email_enabled}
            />
            <ToggleSwitch
              checked={prefs.email_monthly_report || false}
              onChange={(v) => updatePref('email_monthly_report', v)}
              label="Monthly Report"
              description="Monthly analytics and insights"
              icon={Calendar}
              disabled={!prefs.email_enabled}
            />
          </div>
        </Card>
      </motion.div>

      {/* In-App Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <Bell className={cn(
                  "h-5 w-5",
                  isDark ? "text-teal-400" : "text-teal-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  In-App Notifications
                </h3>
                <p className={cn(
                  "text-sm mt-0.5",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Notifications within the application
                </p>
              </div>
            </div>
            <button
              onClick={() => updatePref('inapp_enabled', !prefs.inapp_enabled)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                prefs.inapp_enabled ? "bg-teal-500" : isDark ? "bg-neutral-700" : "bg-neutral-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                  prefs.inapp_enabled && "translate-x-5"
                )}
              />
            </button>
          </div>

          <div className="space-y-1">
            <ToggleSwitch
              checked={prefs.inapp_claim_status_change || false}
              onChange={(v) => updatePref('inapp_claim_status_change', v)}
              label="Claim Status Changes"
              icon={FileText}
              disabled={!prefs.inapp_enabled}
            />
            <ToggleSwitch
              checked={prefs.inapp_appeal_status_change || false}
              onChange={(v) => updatePref('inapp_appeal_status_change', v)}
              label="Appeal Status Changes"
              icon={Scale}
              disabled={!prefs.inapp_enabled}
            />
            <ToggleSwitch
              checked={prefs.inapp_appeal_deadline_reminder || false}
              onChange={(v) => updatePref('inapp_appeal_deadline_reminder', v)}
              label="Appeal Deadline Reminders"
              icon={Clock}
              disabled={!prefs.inapp_enabled}
            />
            <ToggleSwitch
              checked={prefs.inapp_denial_prediction_alert || false}
              onChange={(v) => updatePref('inapp_denial_prediction_alert', v)}
              label="High-Risk Denial Alerts"
              icon={AlertTriangle}
              disabled={!prefs.inapp_enabled}
            />
            <ToggleSwitch
              checked={prefs.inapp_team_activity || false}
              onChange={(v) => updatePref('inapp_team_activity', v)}
              label="Team Activity"
              icon={Users}
              disabled={!prefs.inapp_enabled}
            />
          </div>
        </Card>
      </motion.div>

      {/* Push Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <Smartphone className={cn(
                  "h-5 w-5",
                  isDark ? "text-teal-400" : "text-teal-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Push Notifications
                </h3>
                <p className={cn(
                  "text-sm mt-0.5",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Mobile push notifications (coming soon)
                </p>
              </div>
            </div>
            <button
              onClick={() => updatePref('push_enabled', !prefs.push_enabled)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                prefs.push_enabled ? "bg-teal-500" : isDark ? "bg-neutral-700" : "bg-neutral-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                  prefs.push_enabled && "translate-x-5"
                )}
              />
            </button>
          </div>

          <ToggleSwitch
            checked={prefs.push_urgent_only || false}
            onChange={(v) => updatePref('push_urgent_only', v)}
            label="Urgent Notifications Only"
            description="Only receive push notifications for urgent items"
            icon={AlertTriangle}
            disabled={!prefs.push_enabled}
          />
        </Card>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <Moon className={cn(
                  "h-5 w-5",
                  isDark ? "text-teal-400" : "text-teal-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Quiet Hours
                </h3>
                <p className={cn(
                  "text-sm mt-0.5",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Pause non-urgent notifications during specific hours
                </p>
              </div>
            </div>
            <button
              onClick={() => updatePref('quiet_hours_enabled', !prefs.quiet_hours_enabled)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                prefs.quiet_hours_enabled ? "bg-teal-500" : isDark ? "bg-neutral-700" : "bg-neutral-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                  prefs.quiet_hours_enabled && "translate-x-5"
                )}
              />
            </button>
          </div>

          {prefs.quiet_hours_enabled && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 block",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  Start Time
                </label>
                <Select
                  value={prefs.quiet_hours_start || '22:00'}
                  onChange={(e) => updatePref('quiet_hours_start', e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 block",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  End Time
                </label>
                <Select
                  value={prefs.quiet_hours_end || '08:00'}
                  onChange={(e) => updatePref('quiet_hours_end', e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </Select>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Digest Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-neutral-800" : "bg-neutral-100"
            )}>
              <Calendar className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Digest Frequency
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                How often to receive notification digests
              </p>
            </div>
          </div>

          <Select
            value={prefs.digest_frequency || 'daily'}
            onChange={(e) => updatePref('digest_frequency', e.target.value)}
          >
            <option value="realtime">Real-time (no digest)</option>
            <option value="hourly">Hourly digest</option>
            <option value="daily">Daily digest</option>
            <option value="weekly">Weekly digest</option>
          </Select>
        </Card>
      </motion.div>

      {/* Save Button */}
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

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Save Notification Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default NotificationSettings;
