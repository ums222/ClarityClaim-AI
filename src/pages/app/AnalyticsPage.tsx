import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const metrics = [
  {
    name: "Claims Processed",
    value: "45,231",
    change: "+12.5%",
    trend: "up",
    period: "vs last month",
  },
  {
    name: "Total Denials",
    value: "3,721",
    change: "-8.3%",
    trend: "down",
    period: "vs last month",
  },
  {
    name: "Appeals Submitted",
    value: "892",
    change: "+23.1%",
    trend: "up",
    period: "vs last month",
  },
  {
    name: "Revenue Recovered",
    value: "$4.2M",
    change: "+18.7%",
    trend: "up",
    period: "vs last month",
  },
];

const denialReasons = [
  { reason: "Medical Necessity", count: 1245, percentage: 33 },
  { reason: "Prior Authorization", count: 892, percentage: 24 },
  { reason: "Coding Errors", count: 743, percentage: 20 },
  { reason: "Timely Filing", count: 521, percentage: 14 },
  { reason: "Other", count: 320, percentage: 9 },
];

const monthlyTrends = [
  { month: "Jul", claims: 38000, denials: 4200, appeals: 720 },
  { month: "Aug", claims: 41000, denials: 4100, appeals: 780 },
  { month: "Sep", claims: 39500, denials: 3800, appeals: 810 },
  { month: "Oct", claims: 43000, denials: 3600, appeals: 850 },
  { month: "Nov", claims: 45231, denials: 3721, appeals: 892 },
];

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
            Analytics
          </h1>
          <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Track your claims performance and denial patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                  {metric.name}
                </p>
                <span className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  metric.trend === "up" ? "text-emerald-500" : "text-red-500"
                )}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </span>
              </div>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                {metric.value}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                {metric.period}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trends chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-500" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simple bar chart representation */}
              <div className="space-y-4">
                {monthlyTrends.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                        {data.month}
                      </span>
                      <span className={isDark ? "text-neutral-500" : "text-neutral-500"}>
                        {data.claims.toLocaleString()} claims
                      </span>
                    </div>
                    <div className="flex gap-1 h-6">
                      <div
                        className="bg-teal-500 rounded-l"
                        style={{ width: `${(data.claims / 50000) * 100}%` }}
                      />
                      <div
                        className="bg-red-500"
                        style={{ width: `${(data.denials / 50000) * 100}%` }}
                      />
                      <div
                        className="bg-blue-500 rounded-r"
                        style={{ width: `${(data.appeals / 50000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-teal-500" />
                    <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>Claims</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>Denials</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>Appeals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Denial reasons */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-teal-500" />
                Denial Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {denialReasons.map((item, idx) => (
                  <div key={item.reason}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                        {item.reason}
                      </span>
                      <span className={isDark ? "text-neutral-500" : "text-neutral-500"}>
                        {item.count}
                      </span>
                    </div>
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden",
                      isDark ? "bg-neutral-800" : "bg-neutral-200"
                    )}>
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          idx === 0 ? "bg-teal-500" :
                          idx === 1 ? "bg-blue-500" :
                          idx === 2 ? "bg-amber-500" :
                          idx === 3 ? "bg-purple-500" : "bg-neutral-500"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Highest Denial Payer",
                value: "Anthem Blue Cross",
                detail: "24% of all denials",
              },
              {
                title: "Most Improved Category",
                value: "Prior Authorization",
                detail: "32% reduction in denials",
              },
              {
                title: "Best Appeal Performance",
                value: "Medical Necessity",
                detail: "91% win rate",
              },
            ].map((insight) => (
              <div
                key={insight.title}
                className={cn(
                  "p-4 rounded-lg",
                  isDark ? "bg-neutral-800/50" : "bg-neutral-50"
                )}
              >
                <p className={cn("text-xs mb-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  {insight.title}
                </p>
                <p className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {insight.value}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-400" : "text-neutral-600")}>
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
