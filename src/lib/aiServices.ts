import { supabase } from "./supabase";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

// ==================== TYPES ====================
export interface DenialRiskAnalysis {
  success: boolean;
  analysis: {
    denialProbability: number;
    riskScore: number;
    riskLevel: "Low" | "Medium" | "High" | "Critical";
    riskFactors: string[];
    recommendations: string[];
    confidence: number;
  };
}

export interface ChatSessionResponse {
  success: boolean;
  session?: any;
  message?: any;
  messages?: any[];
}

export interface PatternAnalysisResponse {
  success: boolean;
  analysis: {
    total: number;
    byStatus: Record<string, number>;
    byPayer: Record<string, number>;
    totalAmount: number;
    deniedClaims: number;
  };
  insights: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    metrics: Record<string, any>;
  };
  cached: boolean;
}

// ==================== API SERVICES ====================
export const aiServices = {
  // Analyze Denial Risk for a specific claim
  analyzeDenialRisk: async (
    claimId: string,
    organizationId: string
  ): Promise<DenialRiskAnalysis> => {
    const { data: { session } } = await supabase!.auth.getSession();
    
    const response = await fetch(`${FUNCTIONS_URL}/analyze-denial-risk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ claimId, organizationId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Create AI Chat Session
  createChatSession: async (
    organizationId: string,
    userId: string,
    claimId?: string,
    title?: string
  ): Promise<ChatSessionResponse> => {
    const { data: { session } } = await supabase!.auth.getSession();
    
    const response = await fetch(`${FUNCTIONS_URL}/ai-chat-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: "create",
        organizationId,
        userId,
        claimId,
        title: title || "New Chat Session",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Send Chat Message
  sendChatMessage: async (
    sessionId: string,
    message: string
  ): Promise<ChatSessionResponse> => {
    const { data: { session } } = await supabase!.auth.getSession();
    
    const response = await fetch(`${FUNCTIONS_URL}/ai-chat-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: "send_message",
        sessionId,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get Chat History
  getChatHistory: async (sessionId: string): Promise<ChatSessionResponse> => {
    const { data: { session } } = await supabase!.auth.getSession();
    
    const response = await fetch(`${FUNCTIONS_URL}/ai-chat-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: "get_history",
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Analyze Patterns
  analyzePatterns: async (
    organizationId: string,
    analysisType: "denial_trends" | "common_issues" | "payer_patterns" | "time_analysis",
    dateRange?: { startDate: string; endDate: string },
    filters?: Record<string, any>,
    useCache: boolean = true
  ): Promise<PatternAnalysisResponse> => {
    const { data: { session } } = await supabase!.auth.getSession();
    
    const response = await fetch(`${FUNCTIONS_URL}/analyze-patterns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        organizationId,
        analysisType,
        dateRange,
        filters,
        useCache,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get Existing Analysis for a Claim
  getClaimAnalysis: async (claimId: string) => {
    const { data, error } = await supabase!
      .from("claim_ai_analysis")
      .select("*")
      .eq("claim_id", claimId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  },
};
