import Fastify from "fastify";
import registerGenerateRoute from "./routes/generate.js";
import registerStreamRoute from "./routes/stream.js";
import registerModelsRoute from "./routes/models.js";
import registerAdminRoutes from "./routes/admin.js";
import registerHomeRoute from "./routes/home.js";
import registerHealthRoute from "./routes/health.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const app = Fastify({ logger: true });

await app.register(swagger, {
    openapi: {
        info: {
            title: "AI Proxy API",
            description: "API documentation for text generation and streaming endpoints. Pass an optional model id from GET /models.",
            version: "1.0.0"
        },
        servers: [
            { url: process.env.BASE_URL ?? "http://localhost:3000" }
        ],
        tags: [
            { name: "root", description: "Root and health endpoints" },
            { name: "text", description: "Text generation endpoints" },
            { name: "stream", description: "Streaming endpoints" },
            { name: "models", description: "Models available for generation" }
        ]
    }
});

await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    }
});

app.register(registerModelsRoute);
app.register(registerGenerateRoute);
app.register(registerStreamRoute);
app.register(registerAdminRoutes);
app.register(registerHomeRoute);
app.register(registerHealthRoute);

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
    console.log("Server running at", address);
});