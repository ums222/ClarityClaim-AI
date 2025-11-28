import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

const DashboardPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-300 flex items-center justify-center",
          isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
        )}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-clarity-secondary border-t-transparent rounded-full mx-auto mb-4" />
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, they'll be redirected
  if (!user) {
    return null;
  }

  // Mock data for dashboard
  const stats = [
    { label: "Total Claims", value: "12,847", change: "+12%", icon: FileText, color: "text-blue-500" },
    { label: "Denial Rate", value: "8.2%", change: "-3.5%", icon: AlertTriangle, color: "text-amber-500" },
    { label: "Revenue Recovered", value: "$284K", change: "+18%", icon: DollarSign, color: "text-emerald-500" },
    { label: "Appeal Success", value: "87%", change: "+5%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const recentClaims = [
    { id: "CLM-001", patient: "John D.", amount: "$2,450", status: "approved", date: "Today" },
    { id: "CLM-002", patient: "Sarah M.", amount: "$1,200", status: "pending", date: "Today" },
    { id: "CLM-003", patient: "Michael R.", amount: "$3,800", status: "denied", date: "Yesterday" },
    { id: "CLM-004", patient: "Emily K.", amount: "$950", status: "approved", date: "Yesterday" },
    { id: "CLM-005", patient: "David L.", amount: "$5,200", status: "pending", date: "2 days ago" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-500/20 text-red-500"><XCircle className="h-3 w-3 mr-1" />Denied</Badge>;
      default:
        return <Badge className="bg-amber-500/20 text-amber-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24">
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                Welcome back, {profile?.full_name || user.email?.split("@")[0] || "User"}
              </h1>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                Here's what's happening with your claims today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className={cn(isDark ? "bg-slate-900/70" : "bg-white")}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={cn("h-5 w-5", stat.color)} />
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          stat.change.startsWith("+") 
                            ? "bg-emerald-500/20 text-emerald-500" 
                            : "bg-red-500/20 text-red-500"
                        )}>
                          {stat.change}
                        </span>
                      </div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {stat.value}
                      </div>
                      <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Claims */}
            <div className="lg:col-span-2">
              <Card className={cn(isDark ? "bg-slate-900/70" : "bg-white")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Claims</CardTitle>
                      <CardDescription>Your latest claim submissions</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          isDark ? "bg-slate-800/50" : "bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                              {claim.id}
                            </p>
                            <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>
                              {claim.patient}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {claim.amount}
                          </span>
                          {getStatusBadge(claim.status)}
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>
                            {claim.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className={cn(isDark ? "bg-slate-900/70" : "bg-white")}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Submit New Claim", icon: FileText },
                    { label: "View Denials", icon: AlertTriangle },
                    { label: "Generate Appeal", icon: TrendingUp },
                    { label: "View Reports", icon: BarChart3 },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.label}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className={cn("mt-6", isDark ? "bg-slate-900/70" : "bg-white")}>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-600")}>
                    Our support team is here to help you get the most out of ClarityClaim AI.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
