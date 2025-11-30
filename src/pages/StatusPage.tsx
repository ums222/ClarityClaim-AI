import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Activity,
  Server,
  Database,
  Globe,
  Zap,
  RefreshCw
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: string;
  responseTime: string;
  icon: React.ElementType;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  createdAt: string;
  updatedAt: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

const services: ServiceStatus[] = [
  {
    name: "Web Application",
    status: "operational",
    uptime: "99.99%",
    responseTime: "45ms",
    icon: Globe
  },
  {
    name: "API Services",
    status: "operational",
    uptime: "99.99%",
    responseTime: "120ms",
    icon: Zap
  },
  {
    name: "AI Engine",
    status: "operational",
    uptime: "99.95%",
    responseTime: "890ms",
    icon: Activity
  },
  {
    name: "Database Cluster",
    status: "operational",
    uptime: "99.99%",
    responseTime: "12ms",
    icon: Database
  },
  {
    name: "Background Jobs",
    status: "operational",
    uptime: "99.97%",
    responseTime: "N/A",
    icon: Server
  }
];

const recentIncidents: Incident[] = [
  {
    id: "inc-001",
    title: "Elevated API Response Times",
    status: "resolved",
    severity: "minor",
    createdAt: "Nov 15, 2025 09:30 PST",
    updatedAt: "Nov 15, 2025 10:45 PST",
    updates: [
      {
        time: "10:45 PST",
        message: "Issue has been resolved. API response times have returned to normal levels.",
        status: "resolved"
      },
      {
        time: "10:15 PST",
        message: "We've identified the cause as increased traffic and have scaled up our infrastructure.",
        status: "identified"
      },
      {
        time: "09:30 PST",
        message: "We're investigating reports of slower than normal API response times.",
        status: "investigating"
      }
    ]
  }
];

const uptimeHistory = [
  { date: "Nov 29", uptime: 100 },
  { date: "Nov 28", uptime: 100 },
  { date: "Nov 27", uptime: 100 },
  { date: "Nov 26", uptime: 100 },
  { date: "Nov 25", uptime: 100 },
  { date: "Nov 24", uptime: 100 },
  { date: "Nov 23", uptime: 100 },
  { date: "Nov 22", uptime: 99.9 },
  { date: "Nov 21", uptime: 100 },
  { date: "Nov 20", uptime: 100 },
  { date: "Nov 19", uptime: 100 },
  { date: "Nov 18", uptime: 100 },
  { date: "Nov 17", uptime: 100 },
  { date: "Nov 16", uptime: 100 },
  { date: "Nov 15", uptime: 99.5 },
];

const StatusPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const allOperational = services.every(s => s.status === "operational");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return isDark ? "text-green-400" : "text-green-600";
      case "degraded":
        return isDark ? "text-yellow-400" : "text-yellow-600";
      case "outage":
        return isDark ? "text-red-400" : "text-red-600";
      case "maintenance":
        return isDark ? "text-blue-400" : "text-blue-600";
      default:
        return isDark ? "text-slate-400" : "text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5" />;
      case "outage":
        return <XCircle className="h-5 w-5" />;
      case "maintenance":
        return <Clock className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "operational":
        return isDark ? "bg-green-500/10" : "bg-green-50";
      case "degraded":
        return isDark ? "bg-yellow-500/10" : "bg-yellow-50";
      case "outage":
        return isDark ? "bg-red-500/10" : "bg-red-50";
      case "maintenance":
        return isDark ? "bg-blue-500/10" : "bg-blue-50";
      default:
        return isDark ? "bg-slate-800" : "bg-slate-100";
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              System Status
            </h1>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleRefresh}
                className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </button>
            </div>
          </div>

          {/* Overall Status Banner */}
          <div className={`rounded-2xl border p-6 mb-8 ${
            allOperational
              ? isDark ? "border-green-500/30 bg-green-500/5" : "border-green-200 bg-green-50"
              : isDark ? "border-yellow-500/30 bg-yellow-500/5" : "border-yellow-200 bg-yellow-50"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${allOperational ? (isDark ? "bg-green-500/20" : "bg-green-100") : (isDark ? "bg-yellow-500/20" : "bg-yellow-100")}`}>
                {allOperational ? (
                  <CheckCircle2 className={`h-8 w-8 ${isDark ? "text-green-400" : "text-green-600"}`} />
                ) : (
                  <AlertTriangle className={`h-8 w-8 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
                )}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
                </h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {allOperational 
                    ? "All ClarityClaim AI services are running smoothly." 
                    : "We're aware of the issue and working on a fix."}
                </p>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} mb-8`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Services
              </h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {services.map((service) => (
                <div key={service.name} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <service.icon className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                        {service.name}
                      </p>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        {service.uptime} uptime • {service.responseTime} response
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBg(service.status)} ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    <span className="text-sm font-medium capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime History */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} mb-8`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                15-Day Uptime History
              </h3>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                99.97% average uptime
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-end gap-1 h-16">
                {uptimeHistory.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-all ${
                        day.uptime === 100 
                          ? isDark ? "bg-green-500" : "bg-green-500"
                          : day.uptime >= 99
                          ? isDark ? "bg-yellow-500" : "bg-yellow-500"
                          : isDark ? "bg-red-500" : "bg-red-500"
                      }`}
                      style={{ height: `${Math.max((day.uptime - 99) * 100, 10)}%` }}
                      title={`${day.date}: ${day.uptime}%`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>15 days ago</span>
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Today</span>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Recent Incidents
              </h3>
            </div>
            <div className="p-4">
              {recentIncidents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                    No recent incidents
                  </p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    All systems have been running smoothly
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                              {incident.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              incident.status === "resolved"
                                ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                                : isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {incident.status}
                            </span>
                          </div>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {incident.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className={`pl-4 border-l-2 ${isDark ? "border-slate-700" : "border-slate-200"} space-y-3`}>
                        {incident.updates.map((update, i) => (
                          <div key={i}>
                            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              {update.time} - <span className="capitalize">{update.status}</span>
                            </p>
                            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {update.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subscribe */}
          <div className={`mt-8 text-center ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <p className="text-sm">
              Subscribe to status updates:{" "}
              <a href="mailto:status@clarityclaim.ai" className={`font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                status@clarityclaim.ai
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StatusPage;
