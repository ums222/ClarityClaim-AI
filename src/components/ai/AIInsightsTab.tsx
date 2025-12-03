import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2, TrendingUp, RefreshCw } from "lucide-react";
import { aiServices } from "@/lib/aiServices";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsTabProps {
  claimId: string;
  organizationId: string;
}

export const AIInsightsTab = ({ claimId, organizationId }: AIInsightsTabProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingAnalysis();
  }, [claimId]);

  const loadExistingAnalysis = async () => {
    try {
      const existingAnalysis = await aiServices.getClaimAnalysis(claimId);
      if (existingAnalysis) {
        setAnalysis(existingAnalysis);
      }
    } catch (err) {
      console.error("Error loading analysis:", err);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiServices.analyzeDenialRisk(claimId, organizationId);
      
      if (result.success) {
        toast({
          title: "Analysis Complete",
          description: "AI analysis has been generated successfully.",
        });
        await loadExistingAnalysis();
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze claim");
      toast({
        title: "Analysis Failed",
        description: err.message || "Failed to analyze claim",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <div className="rounded-full bg-primary/10 p-6">
          <TrendingUp className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">No AI Analysis Yet</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Get AI-powered insights about denial risk, recommendations, and key risk factors for this claim using advanced machine learning.
          </p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={loading}
          size="lg"
          className="mt-4"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-sm text-gray-500">
            Analysis generated on {new Date(analysis.created_at).toLocaleDateString()} at {new Date(analysis.created_at).toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Analysis
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Risk Score Overview */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Risk Assessment Overview
          </CardTitle>
          <CardDescription>
            AI-powered analysis of claim denial probability and risk factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 border-2 rounded-lg bg-red-50 border-red-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Denial Probability</p>
              <p className="text-4xl font-bold text-red-600">
                {analysis.denial_probability}%
              </p>
              <p className="text-xs text-gray-500 mt-2">Likelihood of denial</p>
            </div>
            <div className="text-center p-6 border-2 rounded-lg bg-orange-50 border-orange-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Risk Score</p>
              <p className="text-4xl font-bold text-orange-600">
                {analysis.risk_score}<span className="text-2xl text-gray-400">/100</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Overall risk rating</p>
            </div>
            <div className="text-center p-6 border-2 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Risk Level</p>
              <div className="flex justify-center mt-3">
                <Badge className={`text-lg px-4 py-2 ${getRiskLevelColor(analysis.risk_level)}`}>
                  {analysis.risk_level}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-3">Classification</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Identified Risk Factors
          </CardTitle>
          <CardDescription>
            Key factors contributing to the denial risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.risk_factors && analysis.risk_factors.length > 0 ? (
            <ul className="space-y-3">
              {analysis.risk_factors.map((factor: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific risk factors identified.</p>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Actionable Recommendations
          </CardTitle>
          <CardDescription>
            Steps to reduce denial risk and improve claim success rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recommendations available.</p>
          )}
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Analysis Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">AI Model</p>
              <p className="font-medium text-gray-900">{analysis.model_name || "Gemini Pro"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Confidence</p>
              <p className="font-medium text-gray-900">{analysis.confidence_score}%</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Analysis Date</p>
              <p className="font-medium text-gray-900">
                {new Date(analysis.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Version</p>
              <p className="font-medium text-gray-900">{analysis.model_version || "1.0"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
