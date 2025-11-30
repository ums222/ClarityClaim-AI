import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Globe,
  Calendar,
  Shield,
  Camera,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import {
  updateUserProfile,
  updatePassword,
  TIMEZONES,
  DATE_FORMATS,
  type UserProfile,
} from '../../lib/settings';

export function ProfileSettings() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, refreshProfile } = useAuth();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    full_name: '',
    email: '',
    phone: '',
    job_title: '',
    department: '',
    timezone: 'America/New_York',
    date_format: 'MM/DD/YYYY',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: (profile as any).phone || '',
        job_title: (profile as any).job_title || '',
        department: (profile as any).department || '',
        timezone: (profile as any).timezone || 'America/New_York',
        date_format: (profile as any).date_format || 'MM/DD/YYYY',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      await updateUserProfile(formData);
      refreshProfile?.();
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    
    setSavingPassword(true);
    setPasswordMessage(null);
    
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update password' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold",
                isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"
              )}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  formData.full_name?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />
                )}
              </div>
              <button
                className={cn(
                  "absolute -bottom-1 -right-1 p-1.5 rounded-full",
                  isDark 
                    ? "bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700"
                    : "bg-white text-neutral-500 hover:text-neutral-900 border border-neutral-200 shadow-sm"
                )}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Profile Information
              </h3>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Update your personal information and preferences
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className={cn(
                  "text-xs mt-1",
                  isDark ? "text-neutral-500" : "text-neutral-500"
                )}>
                  Contact support to change your email
                </p>
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </label>
                <Input
                  value={formData.job_title || ''}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder="Revenue Cycle Manager"
                />
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Building2 className="h-4 w-4" />
                  Department
                </label>
                <Input
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Revenue Cycle"
                />
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Globe className="h-4 w-4" />
                  Timezone
                </label>
                <Select
                  value={formData.timezone || 'America/New_York'}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 flex items-center gap-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  <Calendar className="h-4 w-4" />
                  Date Format
                </label>
                <Select
                  value={formData.date_format || 'MM/DD/YYYY'}
                  onChange={(e) => setFormData({ ...formData, date_format: e.target.value })}
                >
                  {DATE_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </Select>
              </div>
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

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Password & Security */}
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
                Password & Security
              </h3>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-neutral-400" : "text-neutral-600"
              )}>
                Keep your account secure with a strong password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className={cn(
                "text-sm font-medium mb-1.5 block",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}>
                Current Password
              </label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 block",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className={cn(
                  "text-sm font-medium mb-1.5 block",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}>
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {passwordMessage && (
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-lg text-sm",
                passwordMessage.type === 'success'
                  ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-600"
                  : isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
              )}>
                {passwordMessage.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {passwordMessage.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProfileSettings;
