/*
 * Curated text models from https://ai-gateway.vercel.sh/v1/models.
 * A request without `model` keeps using MODEL from the environment.
 */
export const MODELS = [
    { id: "openai/gpt-5-mini", name: "GPT-5 mini" },
    { id: "openai/gpt-5.4", name: "GPT 5.4" },
    { id: "openai/gpt-6.1-terra", name: "GPT-6.1 Terra" },
    { id: "anthropic/claude-haiku-5.5", name: "Claude Haiku 5.5" },
    { id: "anthropic/claude-sonnet-5.5", name: "Claude Sonnet 5.5" },
    { id: "anthropic/claude-opus-5.5", name: "Claude Opus 5.5" },
    { id: "google/gemini-4-argon", name: "Gemini 4 Argon" },
    { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash" },
    { id: "moonshotai/kimi-k3", name: "Kimi K3" },
    { id: "spacexai/grok-4.7", name: "Grok 4.7" }
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
