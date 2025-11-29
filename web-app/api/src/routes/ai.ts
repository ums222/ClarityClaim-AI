import { FastifyInstance } from "fastify";
import { getDenialRisk, generateAppealLetter } from "../services/aiClient";

export const registerAiRoutes = (app: FastifyInstance) => {
  app.post(
    "/ai/claims/:id/denial-risk",
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { id } = req.params as { id: string };
      const tenantId = req.user.tenantId;

      const claim = await app.prisma.claim.findFirst({
        where: { id, tenantId },
      });

      if (!claim) return reply.code(404).send({ message: "Claim not found" });

      const features = {
        amount: claim.amount,
        status: claim.status,
        denialReason: claim.denialReason,
      };

      const result = await getDenialRisk({
        claimId: id,
        structuredFeatures: features,
      });

      return result;
    }
  );

  app.post(
    "/ai/claims/:id/generate-appeal",
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { id } = req.params as { id: string };
      const tenantId = req.user.tenantId;

      const claim = await app.prisma.claim.findFirst({
        where: { id, tenantId },
      });
      if (!claim) return reply.code(404).send({ message: "Claim not found" });

      const payload = {
        claimId: id,
        denialReason: claim.denialReason ?? "",
        payerName: "Unknown Payer",
        claimSummary: `Claim ${claim.claimNumber} for amount ${claim.amount}`,
        clinicalFacts: "Clinical summary to be fetched from EHR integration.",
      };

      const result = await generateAppealLetter(payload);

      const appeal = await app.prisma.appeal.create({
        data: {
          claimId: id,
          draftText: result.draftText,
          aiModelVersion: result.modelVersion,
          createdById: req.user.sub,
        },
      });

      return {
        appealId: appeal.id,
        draftText: result.draftText,
        modelVersion: result.modelVersion,
        citations: result.citations,
      };
    }
  );
};
