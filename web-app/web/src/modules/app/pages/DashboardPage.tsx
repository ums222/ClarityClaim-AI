import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../lib/apiClient";
import { useAuth } from "../../auth/AuthProvider";

type ExecutiveMetrics = {
  currentDenialRate: number;
  baselineDenialRate: number;
  denialRateImprovement: number;
  firstPassRate: number;
  baselineFirstPassRate: number;
  firstPassImprovement: number;
  appealSuccessRate: number;
  baselineAppealSuccessRate: number;
  appealSuccessImprovement: number;
  revenueRecovered: number;
  totalClaims: number;
  totalAppeals: number;
  avgAppealTurnaroundDays: number;
};

const KPICard = ({
  title,
  value,
  unit,
  improvement,
  improvementLabel,
  inverse = false,
}: {
  title: string;
  value: string | number;
  unit?: string;
  improvement?: number;
  improvementLabel?: string;
  inverse?: boolean;
}) => {
  const isPositive = inverse ? (improvement ?? 0) < 0 : (improvement ?? 0) > 0;
  const improvementColor = isPositive ? "text-green-400" : "text-red-400";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="text-xs text-slate-400 uppercase tracking-wide">{title}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-lg text-slate-400">{unit}</span>}
      </div>
      {improvement !== undefined && (
        <div className={`mt-2 text-sm ${improvementColor}`}>
          {arrow} {Math.abs(improvement).toFixed(1)}% {improvementLabel ?? "vs baseline"}
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const api = useApiClient();

  const { data, isLoading } = useQuery<ExecutiveMetrics>({
    queryKey: ["executive-metrics"],
    queryFn: async () => {
      const res = await api.get("/metrics/executive");
      return res.data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Executive Dashboard</h2>
        <p className="text-sm text-slate-400">
          Welcome back, {user?.name ?? "User"}. Here's your revenue cycle performance at a glance.
        </p>
      </div>

      {isLoading && (
        <div className="text-sm text-slate-400">Loading metrics...</div>
      )}

      {!isLoading && data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Denial Rate"
              value={data.currentDenialRate}
              unit="%"
              improvement={data.denialRateImprovement}
              inverse
            />
            <KPICard
              title="First-Pass Rate"
              value={data.firstPassRate}
              unit="%"
              improvement={data.firstPassImprovement}
            />
            <KPICard
              title="Appeal Success"
              value={data.appealSuccessRate}
              unit="%"
              improvement={data.appealSuccessImprovement}
            />
            <KPICard
              title="Revenue Recovered"
              value={`$${(data.revenueRecovered / 1000000).toFixed(2)}M`}
              improvementLabel="YTD"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Avg Appeal Turnaround
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-100">
                {data.avgAppealTurnaroundDays} days
              </div>
              <div className="mt-1 text-xs text-slate-500">
                AI-assisted drafting reduces manual effort by 70%
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Claims Processed
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-100">
                {data.totalClaims.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Total claims in system
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Appeals Generated
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-100">
                {data.totalAppeals.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                AI-assisted appeal letters
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-sm font-semibold mb-3">AI Impact Summary</h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Baseline denial rate</span>
                  <span className="text-slate-300">{data.baselineDenialRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current denial rate</span>
                  <span className="text-green-400 font-semibold">{data.currentDenialRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Industry avg appeal success</span>
                  <span className="text-slate-300">{data.baselineAppealSuccessRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Your appeal success</span>
                  <span className="text-green-400 font-semibold">{data.appealSuccessRate}%</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex items-center">
                <p>
                  ClarityClaim AI uses predictive analytics to identify at-risk claims before
                  submission and generates evidence-based appeal letters when denials occur.
                  All AI outputs are reviewed by human specialists before action.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
