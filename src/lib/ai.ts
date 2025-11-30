/**
 * AI Service - Frontend API client for AI features
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

// Types
export interface RiskFactor {
  category: string;
  factor: string;
  impact: 'low' | 'medium' | 'high';
  weight: number;
  recommendation: string;
  description?: string;
}

export interface Recommendation {
  type: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface DenialPrediction {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  recommendations: Recommendation[];
  aiInsights?: {
    additionalFactors?: RiskFactor[];
    adjustedScore?: number;
    insights?: string;
    specificRecommendations?: string[];
  };
  analyzedAt: string;
}

export interface AppealLetter {
  letter: string;
  generatedAt: string;
  type: 'ai-generated' | 'template';
  model?: string;
}

export interface PatternData {
  type: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  data: Record<string, unknown>;
}

export interface ClaimStats {
  total: number;
  byStatus: Record<string, number>;
  byPayer: Record<string, { count: number; denied: number; total_billed: number }>;
  byDenialCategory: Record<string, number>;
  avgBilledAmount: number;
  avgRiskScore: number;
  totalBilled: number;
  totalPaid: number;
  denialRate: number;
}

export interface PatternAnalysis {
  patterns: PatternData[];
  stats: ClaimStats;
  analyzedAt: string;
  claimsAnalyzed: number;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

export interface AIStatus {
  enabled: boolean;
  capabilities: {
    denialPrediction: boolean;
    appealGeneration: boolean;
    patternAnalysis: boolean;
    riskScoring: boolean;
  };
  model: string;
  features: {
    realTimeAnalysis: boolean;
    bulkProcessing: boolean;
    customRecommendations: boolean;
  };
}

// AI Service
export const aiService = {
  /**
   * Get AI service status
   */
  async getStatus(): Promise<AIStatus> {
    const response = await fetch(`${API_BASE}/api/ai/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch AI status');
    }
    return response.json();
  },

  /**
   * Predict denial risk for a claim
   */
  async predictDenialRisk(claimId: string): Promise<{
    success: boolean;
    claimId: string;
    prediction: DenialPrediction;
    aiEnabled: boolean;
  }> {
    const response = await fetch(`${API_BASE}/api/claims/${claimId}/predict-denial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to predict denial risk');
    }
    
    return response.json();
  },

  /**
   * Generate appeal letter for a claim
   */
  async generateAppeal(
    claimId: string,
    options?: {
      denial_reason?: string;
      denial_code?: string;
      additional_context?: string;
    }
  ): Promise<{
    success: boolean;
    claimId: string;
    appeal: AppealLetter;
    aiEnabled: boolean;
  }> {
    const response = await fetch(`${API_BASE}/api/claims/${claimId}/generate-appeal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {}),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate appeal');
    }
    
    return response.json();
  },

  /**
   * Get pattern analysis for claims
   */
  async analyzePatterns(days = 90): Promise<PatternAnalysis & { success: boolean }> {
    const response = await fetch(`${API_BASE}/api/analytics/patterns?days=${days}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze patterns');
    }
    
    return response.json();
  },

  /**
   * Get risk factor definitions
   */
  async getRiskFactors(): Promise<{
    success: boolean;
    riskFactors: Array<RiskFactor & { id: string }>;
    count: number;
  }> {
    const response = await fetch(`${API_BASE}/api/analytics/risk-factors`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch risk factors');
    }
    
    return response.json();
  },

  /**
   * Bulk predict denial risk for multiple claims
   */
  async bulkPredict(claimIds: string[]): Promise<{
    success: boolean;
    processed: number;
    results: Array<{
      claimId: string;
      claimNumber: string;
      prediction: DenialPrediction;
    }>;
  }> {
    const response = await fetch(`${API_BASE}/api/claims/bulk-predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimIds }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process bulk prediction');
    }
    
    return response.json();
  },
};

// Helper functions
export function getRiskLevelColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low':
      return 'emerald';
    case 'medium':
      return 'amber';
    case 'high':
      return 'red';
    default:
      return 'gray';
  }
}

export function getImpactIcon(impact: 'low' | 'medium' | 'high'): string {
  switch (impact) {
    case 'low':
      return 'ℹ️';
    case 'medium':
      return '⚠️';
    case 'high':
      return '🚨';
    default:
      return '•';
  }
}

export function formatRiskScore(score: number): string {
  if (score >= 60) return 'High Risk';
  if (score >= 30) return 'Medium Risk';
  return 'Low Risk';
}

export default aiService;
