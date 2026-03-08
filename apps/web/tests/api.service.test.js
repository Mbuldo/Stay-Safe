import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { ApiService, resolveApiBaseUrl } from '../.test-dist/apps/web/src/services/api.js';

const originalFetch = globalThis.fetch;
const originalLocalStorage = globalThis.localStorage;

function createStorage(initialEntries = {}) {
  const store = new Map(Object.entries(initialEntries));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

afterEach(() => {
  if (originalFetch === undefined) {
    delete globalThis.fetch;
  } else {
    globalThis.fetch = originalFetch;
  }

  if (originalLocalStorage === undefined) {
    delete globalThis.localStorage;
  } else {
    globalThis.localStorage = originalLocalStorage;
  }
});

test('resolveApiBaseUrl trims whitespace, strips trailing slashes, and defaults to /api', () => {
  assert.equal(resolveApiBaseUrl(' https://stay-safe.onrender.com/api/// '), 'https://stay-safe.onrender.com/api');
  assert.equal(resolveApiBaseUrl(''), '/api');
  assert.equal(resolveApiBaseUrl(undefined), '/api');
});

test('request includes auth token and returns parsed JSON data', async () => {
  const api = new ApiService('https://example.com/api');
  globalThis.localStorage = createStorage({ token: 'test-token' });

  let receivedUrl = '';
  let receivedOptions;
  globalThis.fetch = async (url, options = {}) => {
    receivedUrl = String(url);
    receivedOptions = options;

    return new Response(JSON.stringify({ success: true, data: { id: 'user-1', username: 'micah' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const data = await api.request('/users/me', {}, true);

  assert.equal(receivedUrl, 'https://example.com/api/users/me');
  assert.equal(receivedOptions.headers.Authorization, 'Bearer test-token');
  assert.equal(receivedOptions.headers['Content-Type'], 'application/json');
  assert.deepEqual(data, { id: 'user-1', username: 'micah' });
});

test('request turns browser-style fetch failures into a helpful network error', async () => {
  const api = new ApiService('https://example.com/api');
  globalThis.fetch = async () => {
    throw new TypeError('Failed to fetch');
  };

  await assert.rejects(
    api.request('/users/register', { method: 'POST' }),
    /Network error while contacting API at https:\/\/example\.com\/api\/users\/register/
  );
});

test('request surfaces non-JSON error responses with a preview', async () => {
  const api = new ApiService('https://example.com/api');
  globalThis.fetch = async () =>
    new Response('<html><body>Server error</body></html>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    });

  await assert.rejects(
    api.request('/ai/status'),
    /API request failed \(502\) at https:\/\/example\.com\/api\/ai\/status\. Non-JSON response: <html><body>Server error<\/body><\/html>/
  );
});

test('frontend service methods build expected article and resource query strings', async () => {
  const api = new ApiService('https://example.com/api');
  const requestedUrls = [];

  globalThis.fetch = async url => {
    requestedUrls.push(String(url));
    return new Response(JSON.stringify({ success: true, data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  await api.getAllArticles({
    category: 'contraception',
    featured: true,
    search: 'campus support',
    limit: 3,
  });
  await api.getAllResources({
    city: 'Nairobi',
    studentFriendly: true,
    search: 'health center',
  });

  assert.equal(
    requestedUrls[0],
    'https://example.com/api/articles?category=contraception&featured=true&search=campus+support&limit=3'
  );
  assert.equal(
    requestedUrls[1],
    'https://example.com/api/resources?city=Nairobi&studentFriendly=true&search=health+center'
  );
});