import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../lib/apiClient";

type EquityRow = {
  dimension: string;
  value: string;
  _avg: { riskScore: number | null };
  _count: { id: number };
};

type EquitySummary = {
  tenantId: string;
  rows: EquityRow[];
};

const EquityPage = () => {
  const api = useApiClient();

  const { data, isLoading } = useQuery<EquitySummary>({
    queryKey: ["equity-summary"],
    queryFn: async () => {
      const res = await api.get("/equity/summary");
      return res.data;
    },
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Health Equity Analytics</h2>
        <p className="text-sm text-slate-400">
          Monitor denial patterns across demographics to detect disparities and support
          equitable reimbursement.
        </p>
      </div>

      {isLoading && (
        <div className="text-sm text-slate-400">Loading equity metrics...</div>
      )}

      {!isLoading && data && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <table className="min-w-full text-xs">
            <thead className="text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Dimension</th>
                <th className="px-3 py-2 text-left">Value</th>
                <th className="px-3 py-2 text-right">Avg Risk</th>
                <th className="px-3 py-2 text-right">Claims</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => {
                const avg = (row._avg.riskScore ?? 0) * 100;
                const riskClass =
                  avg > 60
                    ? "text-red-400"
                    : avg > 30
                    ? "text-yellow-400"
                    : "text-green-400";
                return (
                  <tr
                    key={idx}
                    className="border-t border-slate-800 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2">{row.dimension}</td>
                    <td className="px-3 py-2">{row.value}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${riskClass}`}>
                      {avg.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row._count.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-[10px] text-slate-500">
            Metrics are refreshed continuously as claims and appeals are processed. Use these
            signals alongside clinical and operational reviews to investigate and address
            potential disparities.
          </p>
        </div>
      )}
    </div>
  );
};

export default EquityPage;
