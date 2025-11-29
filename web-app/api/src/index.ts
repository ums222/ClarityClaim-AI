import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { registerClaimRoutes } from "./routes/claims";
import { registerAppealRoutes } from "./routes/appeals";
import { registerHealthRoutes } from "./routes/health";

const prisma = new PrismaClient();

const buildServer = () => {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: process.env.WEB_ORIGIN ?? true,
    credentials: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  app.decorate(
    "authenticate",
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );

  app.decorate("prisma", prisma);

  registerHealthRoutes(app);
  registerClaimRoutes(app);
  registerAppealRoutes(app);

  return app;
};

const start = async () => {
  const app = buildServer();
  const port = Number(process.env.PORT ?? 4000);
  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`API listening on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: any;
  }

  interface FastifyRequest {
    user: { sub: string; tenantId: string; role: string };
  }
}
