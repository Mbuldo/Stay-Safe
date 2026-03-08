const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { startApiServer } = require('./helpers/server');

let api;

before(async () => {
  api = await startApiServer();
});

after(async () => {
  await api?.stop();
});

test('GET /docs returns Swagger UI HTML with compatible CSP', async () => {
  const { response, text } = await api.request('/docs');
  const csp = response.headers.get('content-security-policy') || '';

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /text\/html/);
  assert.match(csp, /script-src[^;]*https:\/\/cdn\.jsdelivr\.net/);
  assert.match(csp, /script-src[^;]*'unsafe-inline'/);
  assert.match(csp, /style-src[^;]*https:\/\/cdn\.jsdelivr\.net/);
  assert.match(text, /Stay-Safe API Docs/);
  assert.match(text, /Loading interactive docs/i);
  assert.match(text, /SwaggerUIBundle/);
  assert.match(text, /openapi\.json/);
});

test('GET /openapi.json exposes the main documented routes', async () => {
  const { response, json } = await api.request('/openapi.json');

  assert.equal(response.status, 200);
  assert.equal(json.openapi, '3.0.3');
  assert.equal(json.info.title, 'Stay-Safe API');
  assert.ok(json.paths['/health']);
  assert.ok(json.paths['/api/users/register']);
  assert.ok(json.paths['/api/articles']);
  assert.ok(json.paths['/api/resources']);
});