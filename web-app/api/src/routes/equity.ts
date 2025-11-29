import { FastifyInstance } from "fastify";

export const registerEquityRoutes = (app: FastifyInstance) => {
  app.get(
    "/equity/summary",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const tenantId = req.user.tenantId;

      // Get claim IDs for this tenant first (tenant isolation)
      const tenantClaims = await app.prisma.claim.findMany({
        where: { tenantId },
        select: { id: true },
      });
      const claimIds = tenantClaims.map((c) => c.id);

      if (claimIds.length === 0) {
        return { tenantId, rows: [] };
      }

      // Aggregate equity signals only for this tenant's claims
      const rows = await app.prisma.equitySignal.groupBy({
        by: ["dimension", "value"],
        where: {
          claimId: { in: claimIds },
        },
        _avg: { riskScore: true },
        _count: { id: true },
      });

      return { tenantId, rows };
    }
  );
};
