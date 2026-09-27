/**
 * Temporary connection diagnostics (enable with DB_DIAGNOSTICS=true).
 * Probes DNS / TCP / TLS / raw pg against the DATABASE_URL host and its
 * internal/external sibling (with/without the "-a" suffix) and logs results.
 */
const net = require('net');
const tls = require('tls');
const dns = require('dns').promises;
const { Pool } = require('pg');

const tcpProbe = (host, port, ms = 6000) =>
  new Promise((resolve, reject) => {
    const s = net.connect({ host, port, timeout: ms });
    s.once('connect', () => { s.destroy(); resolve(); });
    s.once('timeout', () => { s.destroy(); reject(new Error('tcp timeout')); });
    s.once('error', reject);
  });

const tlsProbe = (host, port, ms = 6000) =>
  new Promise((resolve, reject) => {
    const s = tls.connect({ host, port, servername: host, rejectUnauthorized: false, timeout: ms });
    s.once('secureConnect', () => { s.destroy(); resolve(); });
    s.once('timeout', () => { s.destroy(); reject(new Error('tls timeout')); });
    s.once('error', reject);
  });

async function pgProbe(connectionString, sslCfg) {
  const pool = new Pool({ connectionString, ssl: sslCfg, max: 1, connectionTimeoutMillis: 8000 });
  try {
    const r = await pool.query('SELECT 1 AS ok');
    return `OK (SELECT 1 => ${JSON.stringify(r.rows[0])})`;
  } catch (e) {
    return `FAIL: ${e.message} | code=${e.code} errno=${e.errno} syscall=${e.syscall}`;
  } finally {
    await pool.end().catch(() => {});
  }
}

async function runDbDiagnostics() {
  const cs = process.env.DATABASE_URL || '';
  let u;
  try {
    u = new URL(cs);
  } catch (e) {
    console.error('[diag] DATABASE_URL is not a parseable URL:', cs.replace(/:[^:@/]*@/, ':***@'));
    return;
  }
  const baseHost = u.hostname;
  const altHost = baseHost.endsWith('-a') ? baseHost.slice(0, -2) : `${baseHost}-a`;
  const hosts = [...new Set([baseHost, altHost])];

  console.log(`[diag] user=${u.username} db=${u.pathname.replace('/', '')} passwordLength=${(u.password || '').length} port=${u.port || 5432}`);

  for (const host of hosts) {
    console.log(`[diag] ===== probing ${host} =====`);
    try {
      const rec = await dns.lookup(host);
      console.log(`[diag] dns: ${rec.address}`);
    } catch (e) {
      console.log(`[diag] dns FAILED: ${e.code} ${e.message}`);
      continue;
    }
    try {
      await tcpProbe(host, Number(u.port || 5432));
      console.log('[diag] tcp: connected');
    } catch (e) {
      console.log(`[diag] tcp FAILED: ${e.message} code=${e.code}`);
      continue;
    }
    try {
      await tlsProbe(host, Number(u.port || 5432));
      console.log('[diag] tls: handshake OK');
    } catch (e) {
      console.log(`[diag] tls FAILED: ${e.message} code=${e.code}`);
    }
    const u2 = new URL(cs);
    u2.hostname = host;
    const cs2 = u2.toString();
    console.log(`[diag] pg ssl=verify-off => ${await pgProbe(cs2, { rejectUnauthorized: false })}`);
    console.log(`[diag] pg ssl=off       => ${await pgProbe(cs2, false)}`);
  }
}

module.exports = { runDbDiagnostics };
