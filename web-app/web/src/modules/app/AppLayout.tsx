import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  BarChart2,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { cn } from "../../lib/utils";

const navItems = [
  {
    label: "Dashboard",
    path: "/app",
    icon: LayoutDashboard,
  },
  {
    label: "Claims Worklist",
    path: "/app/claims",
    icon: FileSearch,
  },
  {
    label: "Appeals Studio",
    path: "/app/appeals",
    icon: FileText,
  },
  {
    label: "Equity Analytics",
    path: "/app/equity",
    icon: BarChart2,
  },
];

const AppLayout = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="px-5 py-4 border-b border-slate-800">
          <div className="text-lg font-bold tracking-tight text-slate-50">
            ClarityClaim AI
          </div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Intelligence Console
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-xs">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-medium text-slate-200">{user.name}</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                Role: {user.role}
              </div>
            </>
          ) : (
            <span className="text-slate-500">Loading user...</span>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 z-50 bg-slate-950 border-r border-slate-800 transform transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <div className="text-lg font-bold text-slate-50">ClarityClaim AI</div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Intelligence Console
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-medium text-slate-200">{user.name}</span>
              </div>
              <div className="mt-1 text-[10px]">Role: {user.role}</div>
            </>
          ) : (
            <span className="text-slate-500">Loading user...</span>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur-sm">
          <button
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          <h1 className="text-sm font-semibold tracking-wide uppercase text-slate-400 ml-2 md:ml-0">
            ClarityClaim AI Console
          </h1>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
