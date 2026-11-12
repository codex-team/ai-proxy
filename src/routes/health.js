export default async function registerHealthRoute(fastify) {
    fastify.get("/health", {
        schema: {
            tags: ["root"],
            summary: "Health check",
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string" }
                    },
                    required: ["status"]
                }
            }
        }
    }, (req, reply) => {
        return reply.send({ status: "ok" });
    });
}
