const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close(error => (error ? reject(error) : resolve(port)));
    });
    server.on('error', reject);
  });
}

async function waitForHealth(baseUrl, child, getLogs, timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(`API server exited early. Logs:\n${getLogs()}`);
    }
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the server is ready.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for API health check. Logs:\n${getLogs()}`);
}

function removeDatabaseFiles(databasePath) {
  for (const suffix of ['', '-shm', '-wal']) {
    fs.rmSync(`${databasePath}${suffix}`, { force: true });
  }
}

async function startApiServer() {
  const port = await getFreePort();
  const dbName = `stay-safe-test-${Date.now()}-${Math.random().toString(16).slice(2)}.db`;
  const databasePath = path.join(os.tmpdir(), dbName);
  const cwd = path.resolve(__dirname, '../..');
  const env = {
    ...process.env,
    PORT: String(port),
    NODE_ENV: 'production',
    DATABASE_PATH: databasePath,
    JWT_SECRET: 'test-secret',
    ARTICLE_SYNC_ENABLED: 'false',
    CORS_ORIGIN: 'http://127.0.0.1:59999',
  };

  const child = spawn(process.execPath, ['dist/server.js'], {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let logs = '';
  child.stdout.on('data', chunk => {
    logs += chunk.toString();
  });
  child.stderr.on('data', chunk => {
    logs += chunk.toString();
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHealth(baseUrl, child, () => logs);

  return {
    baseUrl,
    async request(pathname, options = {}) {
      const response = await fetch(`${baseUrl}${pathname}`, options);
      const text = await response.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }
      return { response, text, json };
    },
    async stop() {
      if (child.exitCode === null) {
        child.kill('SIGTERM');
        await once(child, 'exit');
      }
      removeDatabaseFiles(databasePath);
    },
  };
}

module.exports = {
  startApiServer,
};