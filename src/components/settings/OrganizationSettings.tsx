import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Palette,
  Scale,
  FileText,
  Shield,
  DollarSign,
  Check,
  X,
  Loader2,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  getOrganizationSettings,
  updateOrganizationSettings,
  updateOrganization,
  type OrganizationSettings as OrgSettingsType,
} from '../../lib/settings';

export function OrganizationSettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { organization, profile } = useAuth();
  
  const [orgName, setOrgName] = useState('');
  const [settings, setSettings] = useState<Partial<OrgSettingsType>>({
    primary_color: '#3B82F6',
    secondary_color: '#6366F1',
    default_appeal_deadline_days: 60,
    auto_assign_appeals: false,
    require_approval_for_submission: true,
    default_claim_priority: 'normal',
    auto_run_denial_prediction: true,
    risk_threshold_high: 60,
    risk_threshold_medium: 30,
    fiscal_year_start: 1,
    currency: 'USD',
    hipaa_audit_logging: true,
    data_retention_days: 2555,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAdmin = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || '');
    }
  }, [organization]);

  const loadSettings = async () => {
    try {
      const data = await getOrganizationSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load organization settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      // Update organization name
      if (orgName !== organization?.name) {
        await updateOrganization({ name: orgName });
      }
      
      // Update organization settings
      await updateOrganizationSettings(settings);
      setMessage({ type: 'success', text: 'Organization settings updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update settings' });
    } finally {
      setSaving(false);
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
            You need admin or owner permissions to view organization settings.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-neutral-800" : "bg-neutral-100"
            )}>
              <Building2 className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                General Settings
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Basic organization information and branding
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={cn(
                "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                <Building2 className="h-4 w-4" />
                Organization Name
              </label>
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Healthcare"
              />
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                <Palette className="h-4 w-4" />
                Primary Color
              </label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.primary_color || '#3B82F6'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-14 p-1 h-10"
                />
                <Input
                  value={settings.primary_color || '#3B82F6'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                <Palette className="h-4 w-4" />
                Secondary Color
              </label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.secondary_color || '#6366F1'}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="w-14 p-1 h-10"
                />
                <Input
                  value={settings.secondary_color || '#6366F1'}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appeal Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-neutral-800" : "bg-neutral-100"
            )}>
              <Scale className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Appeal Settings
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Configure appeal workflow and deadlines
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Default Appeal Deadline (days)
              </label>
              <Input
                type="number"
                value={settings.default_appeal_deadline_days || 60}
                onChange={(e) => setSettings({ ...settings, default_appeal_deadline_days: parseInt(e.target.value) || 60 })}
                min={1}
                max={365}
              />
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Auto-Assign Appeals
              </label>
              <Select
                value={settings.auto_assign_appeals ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, auto_assign_appeals: e.target.value === 'true' })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Require Approval Before Submission
              </label>
              <Select
                value={settings.require_approval_for_submission ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, require_approval_for_submission: e.target.value === 'true' })}
              >
                <option value="true">Required</option>
                <option value="false">Not Required</option>
              </Select>
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-neutral-500" : "text-neutral-500"
              )}>
                When enabled, appeals must be approved by a manager before submission
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Claim Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-neutral-800" : "bg-neutral-100"
            )}>
              <FileText className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Claim Settings
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Configure claim processing and risk scoring
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Default Claim Priority
              </label>
              <Select
                value={settings.default_claim_priority || 'normal'}
                onChange={(e) => setSettings({ ...settings, default_claim_priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Auto-Run Denial Prediction
              </label>
              <Select
                value={settings.auto_run_denial_prediction ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, auto_run_denial_prediction: e.target.value === 'true' })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </Select>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                High Risk Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.risk_threshold_high || 60}
                onChange={(e) => setSettings({ ...settings, risk_threshold_high: parseInt(e.target.value) || 60 })}
                min={1}
                max={100}
              />
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Medium Risk Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.risk_threshold_medium || 30}
                onChange={(e) => setSettings({ ...settings, risk_threshold_medium: parseInt(e.target.value) || 30 })}
                min={1}
                max={100}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Financial & Compliance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-neutral-800" : "bg-neutral-100"
            )}>
              <Shield className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Financial & Compliance
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Configure financial settings and compliance options
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                <DollarSign className="h-4 w-4" />
                Currency
              </label>
              <Select
                value={settings.currency || 'USD'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </Select>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Fiscal Year Start Month
              </label>
              <Select
                value={String(settings.fiscal_year_start || 1)}
                onChange={(e) => setSettings({ ...settings, fiscal_year_start: parseInt(e.target.value) })}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                HIPAA Audit Logging
              </label>
              <Select
                value={settings.hipaa_audit_logging ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, hipaa_audit_logging: e.target.value === 'true' })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </Select>
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-neutral-500" : "text-neutral-500"
              )}>
                Required for HIPAA compliance
              </p>
            </div>

            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Data Retention (days)
              </label>
              <Input
                type="number"
                value={settings.data_retention_days || 2555}
                onChange={(e) => setSettings({ ...settings, data_retention_days: parseInt(e.target.value) || 2555 })}
                min={365}
                max={3650}
              />
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-neutral-500" : "text-neutral-500"
              )}>
                Healthcare records typically require 7 years (2555 days) retention
              </p>
            </div>
          </div>
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
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="h-4 w-4" />
              Save Organization Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default OrganizationSettings;
