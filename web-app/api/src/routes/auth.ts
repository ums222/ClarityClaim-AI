import { FastifyInstance } from "fastify";

export const registerAuthRoutes = (app: FastifyInstance) => {
  // Dev-only endpoint to get a valid JWT for testing
  app.post("/auth/dev-token", async (req, reply) => {
    if (process.env.NODE_ENV === "production") {
      return reply.code(404).send({ message: "Not found" });
    }

    // Get the demo user from database
    const user = await app.prisma.user.findFirst({
      where: { email: "dev@clarityclaim.ai" },
    });

    if (!user) {
      return reply.code(404).send({ message: "Dev user not found. Run seed first." });
    }

    const token = app.jwt.sign({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    });

    return { token, user };
  });
};
