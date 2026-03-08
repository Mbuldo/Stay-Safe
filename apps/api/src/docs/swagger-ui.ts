export const swaggerUiContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https: data:",
  "img-src 'self' data: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "connect-src 'self'",
  "frame-ancestors 'self'",
].join('; ');

export function getSwaggerUiHtml(specUrl: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stay-Safe API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f8fafc; color: #0f172a; font-family: Inter, system-ui, sans-serif; }
      .docs-shell { padding: 24px; }
      .docs-header { margin: 0 auto 16px; max-width: 1100px; }
      .docs-header h1 { margin: 0 0 8px; font-size: 1.875rem; }
      .docs-header p { margin: 0; color: #475569; }
      .docs-header a { color: #2563eb; }
      .loading { max-width: 1100px; margin: 0 auto 16px; color: #334155; }
      .topbar { display: none; }
    </style>
  </head>
  <body>
    <div class="docs-shell">
      <div class="docs-header">
        <h1>Stay-Safe API Docs</h1>
        <p>
          Interactive API reference for the deployed backend. If the UI does not load,
          open the raw <a href="${specUrl}">OpenAPI JSON</a>.
        </p>
      </div>
      <div id="swagger-ui">
        <div class="loading">Loading interactive docs…</div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '${specUrl}',
          dom_id: '#swagger-ui',
          deepLinking: true,
          displayRequestDuration: true,
          presets: [SwaggerUIBundle.presets.apis],
        });
      };
    </script>
  </body>
</html>`;
}