import axios from "axios";

const AI_APPEALS_URL = process.env.AI_APPEALS_URL;
const AI_DENIAL_RISK_URL = process.env.AI_DENIAL_RISK_URL;
const AI_API_KEY = process.env.AI_API_KEY;

export type DenialRiskRequest = {
  claimId: string;
  structuredFeatures: Record<string, unknown>;
};

export type DenialRiskResponse = {
  probability: number;
  topFactors: { label: string; weight: number }[];
  explanation: string;
};

export type GenerateAppealRequest = {
  claimId: string;
  denialReason: string;
  payerName: string;
  claimSummary: string;
  clinicalFacts: string;
};

export type GenerateAppealResponse = {
  draftText: string;
  modelVersion: string;
  citations: {
    sourceType: "payer_policy" | "cms" | "clinical_guideline" | "prior_appeal";
    reference: string;
    snippet: string;
  }[];
};

function assertConfigured(name: string, value: string | undefined): asserts value is string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export async function getDenialRisk(
  payload: DenialRiskRequest
): Promise<DenialRiskResponse> {
  assertConfigured("AI_DENIAL_RISK_URL", AI_DENIAL_RISK_URL);
  assertConfigured("AI_API_KEY", AI_API_KEY);

  const res = await axios.post(AI_DENIAL_RISK_URL, payload, {
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
    },
  });
  return res.data;
}

export async function generateAppealLetter(
  payload: GenerateAppealRequest
): Promise<GenerateAppealResponse> {
  assertConfigured("AI_APPEALS_URL", AI_APPEALS_URL);
  assertConfigured("AI_API_KEY", AI_API_KEY);

  const res = await axios.post(AI_APPEALS_URL, payload, {
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
    },
  });
  return res.data;
}
