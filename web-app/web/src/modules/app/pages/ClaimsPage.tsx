import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../lib/apiClient";
import { Link } from "react-router-dom";

type Claim = {
  id: string;
  claimNumber: string;
  status: string;
  amount: string;
  payerId: string | null;
  facilityId: string | null;
  denialReason: string | null;
  createdAt: string;
};

const ClaimsPage = () => {
  const api = useApiClient();

  const { data, isLoading } = useQuery<Claim[]>({
    queryKey: ["claims"],
    queryFn: async () => {
      const res = await api.get("/claims");
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Claims Worklist</h2>
          <p className="text-sm text-slate-400">
            Ranked claims for proactive denial prevention and appeal generation.
          </p>
        </div>
      </div>

      {isLoading && <div className="text-sm text-slate-400">Loading claims...</div>}

      {!isLoading && data && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Claim #</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-left">Denial Reason</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((claim) => (
                <tr
                  key={claim.id}
                  className="border-t border-slate-800 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-2">
                    <span className="font-mono text-slate-100">
                      {claim.claimNumber}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className="inline-flex rounded-full border border-slate-700 px-2 py-0.5 text-[11px]">
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${Number(claim.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-300">
                    {claim.denialReason ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-400">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      to={`/app/claims/${claim.id}`}
                      className="text-clarity-accent text-xs hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimsPage;
