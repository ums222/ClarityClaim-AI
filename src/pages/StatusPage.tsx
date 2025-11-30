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
  Shield,
  Zap,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

interface Service {
  name: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  icon: React.ElementType;
}

interface Incident {
  id: number;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  startTime: string;
  updates: { time: string; message: string }[];
}

const StatusPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated service data
  const services: Service[] = [
    { name: "API Services", status: "operational", uptime: 99.99, responseTime: 45, icon: Zap },
    { name: "Web Application", status: "operational", uptime: 99.98, responseTime: 120, icon: Globe },
    { name: "Database", status: "operational", uptime: 99.99, responseTime: 12, icon: Database },
    { name: "Authentication", status: "operational", uptime: 100, responseTime: 89, icon: Shield },
    { name: "Claims Processing", status: "operational", uptime: 99.97, responseTime: 234, icon: Activity },
    { name: "Appeal Generation", status: "operational", uptime: 99.95, responseTime: 1250, icon: Server }
  ];

  const recentIncidents: Incident[] = [
    {
      id: 1,
      title: "Scheduled Maintenance - Database Upgrade",
      status: "resolved",
      severity: "minor",
      startTime: "November 25, 2025 02:00 AM ET",
      updates: [
        { time: "04:30 AM", message: "Maintenance completed successfully. All systems operational." },
        { time: "02:00 AM", message: "Beginning scheduled database upgrade. Expected duration: 2-3 hours." }
      ]
    },
    {
      id: 2,
      title: "Elevated API Response Times",
      status: "resolved",
      severity: "minor",
      startTime: "November 20, 2025 03:45 PM ET",
      updates: [
        { time: "04:30 PM", message: "Issue resolved. Response times back to normal." },
        { time: "04:15 PM", message: "Root cause identified. Implementing fix." },
        { time: "03:45 PM", message: "Investigating reports of slower API response times." }
      ]
    }
  ];

  const uptimeHistory = [
    { date: "Nov 28", uptime: 100 },
    { date: "Nov 27", uptime: 100 },
    { date: "Nov 26", uptime: 100 },
    { date: "Nov 25", uptime: 99.8 },
    { date: "Nov 24", uptime: 100 },
    { date: "Nov 23", uptime: 100 },
    { date: "Nov 22", uptime: 100 },
    { date: "Nov 21", uptime: 100 },
    { date: "Nov 20", uptime: 99.9 },
    { date: "Nov 19", uptime: 100 },
    { date: "Nov 18", uptime: 100 },
    { date: "Nov 17", uptime: 100 },
    { date: "Nov 16", uptime: 100 },
    { date: "Nov 15", uptime: 100 }
  ];

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational": return "text-green-500";
      case "degraded": return "text-amber-500";
      case "outage": return "text-red-500";
      case "maintenance": return "text-blue-500";
      default: return "text-slate-500";
    }
  };

  const getStatusBgColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational": return isDark ? "bg-green-500/20" : "bg-green-100";
      case "degraded": return isDark ? "bg-amber-500/20" : "bg-amber-100";
      case "outage": return isDark ? "bg-red-500/20" : "bg-red-100";
      case "maintenance": return isDark ? "bg-blue-500/20" : "bg-blue-100";
      default: return isDark ? "bg-slate-800" : "bg-slate-100";
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational": return CheckCircle2;
      case "degraded": return AlertTriangle;
      case "outage": return XCircle;
      case "maintenance": return Clock;
      default: return Activity;
    }
  };

  const getOverallStatus = (): { status: ServiceStatus; message: string } => {
    const hasOutage = services.some(s => s.status === "outage");
    const hasDegraded = services.some(s => s.status === "degraded");
    const hasMaintenance = services.some(s => s.status === "maintenance");
    
    if (hasOutage) return { status: "outage", message: "System Outage" };
    if (hasDegraded) return { status: "degraded", message: "Partial System Outage" };
    if (hasMaintenance) return { status: "maintenance", message: "Scheduled Maintenance" };
    return { status: "operational", message: "All Systems Operational" };
  };

  const overall = getOverallStatus();

  const refreshStatus = () => {
    setLastUpdated(new Date());
  };

  // Render status icon based on overall status
  const renderOverallIcon = () => {
    const iconClass = `h-16 w-16 mx-auto mb-4 ${getStatusColor(overall.status)}`;
    switch (overall.status) {
      case "operational": return <CheckCircle2 className={iconClass} />;
      case "degraded": return <AlertTriangle className={iconClass} />;
      case "outage": return <XCircle className={iconClass} />;
      case "maintenance": return <Clock className={iconClass} />;
      default: return <Activity className={iconClass} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          
          {/* Overall Status */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800" : "border-slate-200"} p-8 mb-8 text-center ${getStatusBgColor(overall.status)}`}>
            {renderOverallIcon()}
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              {overall.message}
            </h1>
            <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <button 
              onClick={refreshStatus}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-900 hover:bg-slate-50 shadow-sm"}`}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </button>
          </div>

          {/* 90-Day Uptime */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6 mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Uptime History (Last 14 Days)
              </h2>
              <span className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                99.98%
              </span>
            </div>
            <div className="flex gap-1">
              {uptimeHistory.map((day) => (
                <div 
                  key={day.date}
                  className="flex-1 group relative"
                  title={`${day.date}: ${day.uptime}%`}
                >
                  <div 
                    className={`h-8 rounded-sm ${day.uptime === 100 ? "bg-green-500" : day.uptime >= 99.5 ? "bg-amber-500" : "bg-red-500"}`}
                  />
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-slate-800 text-white" : "bg-slate-900 text-white"}`}>
                    {day.date}: {day.uptime}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>14 days ago</span>
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Today</span>
            </div>
          </div>

          {/* Service Status */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden mb-8`}>
            <div className={`px-6 py-4 ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <h2 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Service Status
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {services.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div 
                    key={service.name}
                    className={`px-6 py-4 flex items-center justify-between ${isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <service.icon className={`h-5 w-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                      <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Response</p>
                        <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {service.responseTime}ms
                        </p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Uptime</p>
                        <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {service.uptime}%
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBgColor(service.status)}`}>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(service.status)}`} />
                        <span className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden mb-8`}>
            <div className={`px-6 py-4 ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <h2 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Recent Incidents
              </h2>
            </div>
            {recentIncidents.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>No incidents reported</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>All systems have been running smoothly</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="px-6 py-4">
                    <button 
                      onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          incident.status === "resolved" 
                            ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                            : isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                        }`}>
                          {incident.status}
                        </span>
                        <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                          {incident.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {incident.startTime}
                        </span>
                        {expandedIncident === incident.id ? (
                          <ChevronUp className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                        ) : (
                          <ChevronDown className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                        )}
                      </div>
                    </button>
                    {expandedIncident === incident.id && (
                      <div className={`mt-4 pl-4 border-l-2 ${isDark ? "border-slate-700" : "border-slate-300"}`}>
                        {incident.updates.map((update, idx) => (
                          <div key={idx} className="mb-3 last:mb-0">
                            <p className={`text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                              {update.time}
                            </p>
                            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {update.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscribe to Updates */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Subscribe to Status Updates
            </h2>
            <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Get notified about scheduled maintenance and service incidents via email.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"} border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              <button className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StatusPage;
