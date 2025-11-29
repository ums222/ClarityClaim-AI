import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [appealDraft, setAppealDraft] = useState<string>("");

  const { data, isLoading } = useQuery<ClaimDetail>({
    queryKey: ["claim", id],
    queryFn: async () => {
      const res = await api.get(`/claims/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const denialRiskMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/ai/claims/${id}/denial-risk`);
      return res.data as {
        probability: number;
        explanation: string;
        topFactors: { label: string; weight: number }[];
      };
    },
  });

  const generateAppealMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/ai/claims/${id}/generate-appeal`);
      return res.data as {
        appealId: string;
        draftText: string;
        modelVersion: string;
        citations: { sourceType: string; reference: string; snippet: string }[];
      };
    },
    onSuccess: (result) => {
      setAppealDraft(result.draftText);
      queryClient.invalidateQueries({ queryKey: ["claim", id] });
    },
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
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              AI Insights & Denial Risk
            </h3>
            <button
              className="text-xs text-clarity-accent hover:underline disabled:opacity-50"
              onClick={() => denialRiskMutation.mutate()}
              disabled={denialRiskMutation.isPending}
            >
              {denialRiskMutation.isPending ? "Analyzing..." : "Run Analysis"}
            </button>
          </div>

          {!denialRiskMutation.data && (
            <p className="text-xs text-slate-400">
              Run AI analysis to estimate denial risk and suggested actions. AI is used as
              decision support only; human reviewers remain responsible for final decisions.
            </p>
          )}

          {denialRiskMutation.data && (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Estimated denial probability: </span>
                <span className="font-semibold text-clarity-accent">
                  {(denialRiskMutation.data.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-slate-300">
                {denialRiskMutation.data.explanation}
              </div>
              <ul className="mt-1 text-slate-400 list-disc list-inside">
                {denialRiskMutation.data.topFactors.map((f) => (
                  <li key={f.label}>
                    {f.label} ({(f.weight * 100).toFixed(0)}% contribution)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <hr className="border-slate-800 my-3" />

          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Appeal Draft (AI-Assisted)
            </h4>
            <button
              className="text-xs text-clarity-accent hover:underline disabled:opacity-50"
              onClick={() => generateAppealMutation.mutate()}
              disabled={generateAppealMutation.isPending}
            >
              {generateAppealMutation.isPending ? "Generating..." : "Generate Draft"}
            </button>
          </div>

          <textarea
            className="mt-2 w-full h-40 rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-100"
            placeholder="AI-generated appeal draft will appear here for your review and editing."
            value={appealDraft}
            onChange={(e) => setAppealDraft(e.target.value)}
          />

          <p className="text-[10px] text-slate-500">
            AI-generated content is provided as decision support only. Please review for clinical
            accuracy, policy alignment, and compliance before submission.
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
