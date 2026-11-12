const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CodeX AI Proxy</title>
<style>
  :root {
    color-scheme: dark;
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --border: oklch(1 0 0 / 10%);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --radius: 0.625rem;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: var(--background);
    color: var(--foreground);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    letter-spacing: -0.011em;
  }

  main {
    width: min(28rem, calc(100% - 2rem));
    padding: 1.5rem;
    background: #000;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) + 4px);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.45);
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  p {
    margin: 0.75rem 0 0;
    color: var(--muted-foreground);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  a {
    display: inline-flex;
    align-items: center;
    height: 2.25rem;
    margin-top: 1.25rem;
    padding: 0 1rem;
    border-radius: calc(var(--radius) - 2px);
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
  }

  a:hover {
    background: oklch(0.85 0 0);
  }

  a:focus-visible {
    outline: 2px solid var(--foreground);
    outline-offset: 2px;
  }

  .note {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>
  <main>
    <h1>CodeX AI Proxy</h1>
    <p>A proxy service for text generation and streaming.</p>
    <a href="https://github.com/codex-team/ai-proxy">Repository</a>
    <p class="note">Get the API key in the chat.</p>
  </main>
</body>
</html>
`;

export default async function registerHomeRoute(fastify) {
    fastify.get("/", {
        schema: {
            tags: ["root"],
            summary: "Home page"
        }
    }, (req, reply) => {
        reply.type("text/html; charset=utf-8");
        return reply.send(PAGE);
    });
}
