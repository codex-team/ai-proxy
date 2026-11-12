import { MODELS } from "../models.js";
import { verifyApiKey } from "../users.js";

export default async function registerModelsRoute(fastify) {
    fastify.get("/models", {
        schema: {
            tags: ["models"],
            summary: "List models available for text generation",
            headers: {
                type: "object",
                properties: {
                    "x-api-key": { type: "string" }
                },
                required: ["x-api-key"]
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        default: { type: "string" },
                        models: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    pricing: {
                                        type: "object",
                                        description: "Standard USD price per 1 million tokens. Omits region, priority, flex, and long-context tiers.",
                                        properties: {
                                            input: { type: "number" },
                                            output: { type: "number" },
                                            cacheRead: { type: "number" },
                                            cacheWrite: { type: "number" }
                                        },
                                        required: ["input", "output"]
                                    }
                                },
                                required: ["id", "name", "pricing"]
                            }
                        }
                    },
                    required: ["models"]
                },
                401: { type: "object", properties: { error: { type: "string" } }, required: ["error"] },
                403: { type: "object", properties: { error: { type: "string" } }, required: ["error"] }
            }
        }
    }, async (req, reply) => {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return reply.status(401).send({ error: "API key required" });
        }

        const user = await verifyApiKey(apiKey);
        if (!user) {
            return reply.status(403).send({ error: "Invalid API key" });
        }

        const payload = { models: MODELS };
        if (typeof process.env.MODEL === "string" && process.env.MODEL.length > 0) {
            payload.default = process.env.MODEL;
        }

        return reply.send(payload);
    });
}
