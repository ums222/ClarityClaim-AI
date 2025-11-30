import { useState } from "react";
import {
  User,
  Building2,
  Key,
  Bell,
  Shield,
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const SettingsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data
  const [profile, setProfile] = useState({
    firstName: "Demo",
    lastName: "User",
    email: "demo@clarityclaim.ai",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
  });

  const [organization, setOrganization] = useState({
    name: "Regional Medical Center",
    type: "Hospital",
    npi: "1234567890",
    taxId: "12-3456789",
    address: "123 Healthcare Ave, Medical City, MC 12345",
  });

  const apiKey = "cc_live_sk_123456789abcdef";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const regenerateApiKey = () => {
    toast.success("New API key generated", {
      description: "Your old key will stop working in 24 hours.",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      First Name
                    </label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Last Name
                    </label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Email
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Phone
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Role
                  </label>
                  <Input value={profile.role} disabled />
                  <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Contact your administrator to change your role
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "organization":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Manage your organization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Organization Name
                    </label>
                    <Input
                      value={organization.name}
                      onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Organization Type
                    </label>
                    <Input
                      value={organization.type}
                      onChange={(e) => setOrganization({ ...organization, type: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      NPI Number
                    </label>
                    <Input
                      value={organization.npi}
                      onChange={(e) => setOrganization({ ...organization, npi: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Tax ID
                    </label>
                    <Input
                      value={organization.taxId}
                      onChange={(e) => setOrganization({ ...organization, taxId: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Address
                  </label>
                  <Input
                    value={organization.address}
                    onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Live API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="pr-10 font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showApiKey ? (
                          <EyeOff className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                        ) : (
                          <Eye className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                        )}
                      </button>
                    </div>
                    <Button variant="outline" onClick={copyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Never share your API key. It provides full access to your account.
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button variant="outline" onClick={regenerateApiKey}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configure webhooks for real-time notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Webhook URL
                  </label>
                  <Input placeholder="https://your-server.com/webhook" />
                  <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    We'll send POST requests to this URL for appeal status updates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose which emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Appeal status updates", description: "Get notified when appeal status changes" },
                  { label: "Weekly summary", description: "Receive a weekly performance report" },
                  { label: "High-risk claim alerts", description: "Get alerted about claims with high denial risk" },
                  { label: "Product updates", description: "Learn about new features and improvements" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {item.label}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        {item.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={idx < 3}
                      className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Current Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Confirm New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button variant="outline">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Two-factor authentication is currently <span className="font-medium text-red-500">disabled</span>
                    </p>
                  </div>
                  <Button>Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "p-4 rounded-lg border-2 border-teal-500",
                  isDark ? "bg-teal-500/10" : "bg-teal-50"
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-neutral-900")}>
                        Professional Plan
                      </p>
                      <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                        $1,499/month • Up to 10,000 claims
                      </p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-14 items-center justify-center rounded-lg",
                    isDark ? "bg-neutral-800" : "bg-neutral-100"
                  )}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                      •••• •••• •••• 4242
                    </p>
                    <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                      Expires 12/25
                    </p>
                  </div>
                  <Button variant="ghost" className="ml-auto">Update</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
            Settings
          </h1>
          <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Manage your account and organization settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Settings layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar navigation */}
        <Card className="lg:w-64 shrink-0">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    activeTab === tab.id
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id && "text-teal-500")} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
