import { FastifyInstance } from "fastify";

export const registerAppealRoutes = (app: FastifyInstance) => {
  app.post(
    "/claims/:id/appeals",
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { id } = req.params as { id: string };
      const { draftText } = req.body as { draftText: string };
      const userId = req.user.sub;
      const tenantId = req.user.tenantId;

      const claim = await app.prisma.claim.findFirst({
        where: { id, tenantId },
      });
      if (!claim) return reply.code(404).send({ message: "Claim not found" });

      const appeal = await app.prisma.appeal.create({
        data: {
          claimId: id,
          draftText,
          createdById: userId,
        },
      });

      return appeal;
    }
  );
};
