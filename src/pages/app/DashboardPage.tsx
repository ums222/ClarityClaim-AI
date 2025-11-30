import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const stats = [
  {
    name: "Total Claims",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
  },
  {
    name: "Denial Rate",
    value: "8.2%",
    change: "-2.3%",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    name: "Revenue Recovered",
    value: "$2.34M",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Appeal Win Rate",
    value: "87%",
    change: "+4.5%",
    trend: "up",
    icon: CheckCircle2,
  },
];

const recentAppeals = [
  {
    id: "APL-2024-001",
    patient: "John Smith",
    amount: "$12,450",
    status: "approved",
    date: "2024-01-15",
  },
  {
    id: "APL-2024-002",
    patient: "Sarah Johnson",
    amount: "$8,320",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "APL-2024-003",
    patient: "Michael Brown",
    amount: "$5,680",
    status: "in_review",
    date: "2024-01-14",
  },
  {
    id: "APL-2024-004",
    patient: "Emily Davis",
    amount: "$3,200",
    status: "denied",
    date: "2024-01-13",
  },
  {
    id: "APL-2024-005",
    patient: "Robert Wilson",
    amount: "$15,800",
    status: "approved",
    date: "2024-01-12",
  },
];

const pendingActions = [
  { title: "Review 12 high-risk claims", priority: "high", action: "Review Now" },
  { title: "3 appeals awaiting submission", priority: "medium", action: "Submit" },
  { title: "Update payer credentials", priority: "low", action: "Update" },
];

const DashboardPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      in_review: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      denied: "bg-red-500/10 text-red-600 dark:text-red-400",
    };
    const labels = {
      approved: "Approved",
      pending: "Pending",
      in_review: "In Review",
      denied: "Denied",
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[status as keyof typeof styles])}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
            Dashboard
          </h1>
          <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Welcome back! Here's an overview of your claims performance.
          </p>
        </div>
        <Link to="/app/appeals/new">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Appeal
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isDark ? "bg-neutral-800" : "bg-neutral-100"
                )}>
                  <stat.icon className={cn("h-5 w-5", isDark ? "text-neutral-400" : "text-neutral-600")} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                )}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                  {stat.value}
                </p>
                <p className={cn("text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  {stat.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent appeals */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Appeals</CardTitle>
              <Link to="/app/appeals" className="text-sm text-teal-500 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAppeals.map((appeal) => (
                  <div
                    key={appeal.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDark ? "bg-neutral-800/50" : "bg-neutral-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                          {appeal.patient}
                        </p>
                        <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                          {appeal.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {appeal.amount}
                      </span>
                      {getStatusBadge(appeal.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-500" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingActions.map((action, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border",
                      isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-neutral-50 border-neutral-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Clock className={cn("h-4 w-4 mt-0.5", getPriorityColor(action.priority))} />
                        <p className={cn("text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                          {action.title}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 w-full justify-center">
                      {action.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                    Appeals Generated
                  </span>
                  <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    47
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                    Claims Processed
                  </span>
                  <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    1,284
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                    Avg Response Time
                  </span>
                  <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    2.3 days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
