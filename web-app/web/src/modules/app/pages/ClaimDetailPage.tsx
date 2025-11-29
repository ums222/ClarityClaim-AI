import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../lib/apiClient";

type ClaimDetail = {
  id: string;
  claimNumber: string;
  status: string;
  amount: string;
  denialReason: string | null;
  createdAt: string;
  appeals: {
    id: string;
    status: string;
    createdAt: string;
  }[];
  equitySignals: {
    id: string;
    dimension: string;
    value: string;
    riskScore: number;
  }[];
};

const ClaimDetailPage = () => {
  const { id } = useParams();
  const api = useApiClient();

  const { data, isLoading } = useQuery<ClaimDetail>({
    queryKey: ["claim", id],
    queryFn: async () => {
      const res = await api.get(`/claims/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading || !data) {
    return <div className="p-6 text-sm text-slate-400">Loading claim...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Claim {data.claimNumber}
          </h2>
          <p className="text-sm text-slate-400">
            Status: {data.status} • Created{" "}
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Claim Amount</div>
          <div className="text-lg font-semibold text-clarity-accent">
            ${Number(data.amount).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold mb-2">
            AI Insights & Recommended Next Actions
          </h3>
          <p className="text-xs text-slate-400">
            This panel will display denial risk scores, likely overturn probability,
            and recommended next steps based on our AI models. Human reviewers will
            always retain final decision authority.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold mb-2">
            Equity Signals
          </h3>
          {data.equitySignals.length === 0 && (
            <p className="text-xs text-slate-400">
              No specific equity signals recorded for this claim.
            </p>
          )}
          {data.equitySignals.map((s) => (
            <div key={s.id} className="mb-2 text-xs">
              <div className="font-medium text-slate-100">
                {s.dimension}: {s.value}
              </div>
              <div className="text-slate-400">
                Risk score: {(s.riskScore * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
