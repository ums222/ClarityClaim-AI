import { FastifyInstance } from "fastify";

export const registerMetricsRoutes = (app: FastifyInstance) => {
  app.get(
    "/metrics/executive",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const tenantId = req.user.tenantId;

      // Get all claims for this tenant
      const totalClaims = await app.prisma.claim.count({
        where: { tenantId },
      });

      const deniedClaims = await app.prisma.claim.count({
        where: { tenantId, status: "DENIED" },
      });

      const paidClaims = await app.prisma.claim.count({
        where: { tenantId, status: "PAID" },
      });

      // Get appeals with outcomes
      const tenantClaims = await app.prisma.claim.findMany({
        where: { tenantId },
        select: { id: true },
      });
      const claimIds = tenantClaims.map((c) => c.id);

      const totalAppeals = await app.prisma.appeal.count({
        where: { claimId: { in: claimIds } },
      });

      const successfulAppeals = await app.prisma.appeal.count({
        where: {
          claimId: { in: claimIds },
          outcome: { in: ["APPROVED_FULL", "APPROVED_PARTIAL"] },
        },
      });

      // Calculate revenue from paid claims
      const paidClaimsData = await app.prisma.claim.aggregate({
        where: { tenantId, status: "PAID" },
        _sum: { amount: true },
      });

      // Calculate metrics
      const currentDenialRate = totalClaims > 0
        ? (deniedClaims / totalClaims) * 100
        : 0;

      const firstPassRate = totalClaims > 0
        ? (paidClaims / totalClaims) * 100
        : 0;

      const appealSuccessRate = totalAppeals > 0
        ? (successfulAppeals / totalAppeals) * 100
        : 0;

      const revenueRecovered = Number(paidClaimsData._sum.amount ?? 0);

      // Baseline metrics (simulated for demo - in production, track historical data)
      const baselineDenialRate = 11.0; // Industry average ~11%
      const baselineFirstPassRate = 85.0;
      const baselineAppealSuccessRate = 45.0;

      return {
        currentDenialRate: Number(currentDenialRate.toFixed(1)),
        baselineDenialRate,
        denialRateImprovement: Number(
          (((baselineDenialRate - currentDenialRate) / baselineDenialRate) * 100).toFixed(1)
        ),
        firstPassRate: Number(firstPassRate.toFixed(1)),
        baselineFirstPassRate,
        firstPassImprovement: Number(
          (((firstPassRate - baselineFirstPassRate) / baselineFirstPassRate) * 100).toFixed(1)
        ),
        appealSuccessRate: Number(appealSuccessRate.toFixed(1)),
        baselineAppealSuccessRate,
        appealSuccessImprovement: Number(
          (((appealSuccessRate - baselineAppealSuccessRate) / baselineAppealSuccessRate) * 100).toFixed(1)
        ),
        revenueRecovered,
        totalClaims,
        totalAppeals,
        avgAppealTurnaroundDays: 3.2, // Mock for now - calculate from actual timestamps later
      };
    }
  );
};
