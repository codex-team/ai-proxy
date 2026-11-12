/*
 * Curated text models from https://ai-gateway.vercel.sh/v1/models.
 * A request without `model` keeps using MODEL from the environment.
 *
 * shortcut: pricing is the 2026-11-12 standard gateway rate in USD per 1M tokens, refresh from that catalog when rates change. Region, priority, flex, and long-context tiers are omitted.
 */
export const MODELS = [
    {
        id: "openai/gpt-5-mini",
        name: "GPT-5 mini",
        pricing: { input: 0.25, output: 2, cacheRead: 0.025 }
    },
    {
        id: "openai/gpt-5.4",
        name: "GPT 5.4",
        pricing: { input: 2.5, output: 15, cacheRead: 0.25 }
    },
    {
        id: "openai/gpt-6.1-terra",
        name: "GPT-6.1 Terra",
        pricing: { input: 1, output: 5, cacheRead: 0.05, cacheWrite: 1.25 }
    },
    {
        id: "anthropic/claude-haiku-5.5",
        name: "Claude Haiku 5.5",
        pricing: { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 }
    },
    {
        id: "anthropic/claude-sonnet-5.5",
        name: "Claude Sonnet 5.5",
        pricing: { input: 2, output: 10, cacheRead: 0.1, cacheWrite: 2.5 }
    },
    {
        id: "anthropic/claude-opus-5.5",
        name: "Claude Opus 5.5",
        pricing: { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 }
    },
    {
        id: "google/gemini-4-argon",
        name: "Gemini 4 Argon",
        pricing: { input: 2, output: 10, cacheRead: 0.1 }
    },
    {
        id: "deepseek/deepseek-v4-flash",
        name: "DeepSeek V4 Flash",
        pricing: { input: 0.13, output: 0.26, cacheRead: 0.028 }
    },
    {
        id: "moonshotai/kimi-k3",
        name: "Kimi K3",
        pricing: { input: 3, output: 15, cacheRead: 0.3 }
    },
    {
        id: "spacexai/grok-4.7",
        name: "Grok 4.7",
        pricing: { input: 2, output: 6, cacheRead: 0.5 }
    }
];

export const MODEL_IDS = MODELS.map((item) => {
    return item.id;
});

const ALLOWED = new Set(MODEL_IDS);

export function modelFieldSchema() {
    return {
        type: "string",
        description: "Optional model id. If omitted, the server MODEL is used. Allowed: " + MODEL_IDS.join(", ")
    };
}

/**
 * @param {string | undefined} requested
 * @returns {{ model: string | undefined } | { error: string, models: string[] }}
 */
export function resolveModel(requested) {
    const model = typeof requested === "string" ? requested.trim() : "";

    if (model.length === 0) {
        return { model: process.env.MODEL };
    }

    if (ALLOWED.has(model) || model === process.env.MODEL) {
        return { model };
    }

    return {
        error: "unknown model",
        models: MODEL_IDS
    };
}
