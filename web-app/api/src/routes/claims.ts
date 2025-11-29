import { FastifyInstance } from "fastify";

export const registerClaimRoutes = (app: FastifyInstance) => {
  app.get(
    "/claims",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const tenantId = req.user.tenantId;
      const claims = await app.prisma.claim.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return claims;
    }
  );

  app.get(
    "/claims/:id",
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { id } = req.params as { id: string };
      const tenantId = req.user.tenantId;
      const claim = await app.prisma.claim.findFirst({
        where: { id, tenantId },
        include: { appeals: true, equitySignals: true },
      });
      if (!claim) return reply.code(404).send({ message: "Not found" });
      return claim;
    }
  );
};
