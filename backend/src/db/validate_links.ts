/**
 * Validates all deal URLs and updates link_status in the deals table.
 * Statuses:
 *   'verified'  — HTTP 200–399, or 403/429 (blocked by site, but exists)
 *   'broken'    — HTTP 404 / 410
 *   'unchecked' — network error, timeout, or other server error
 *
 * Run: ./node_modules/.bin/ts-node src/db/validate_links.ts
 */
import dotenv from "dotenv";
dotenv.config();
import https from "https";
import http from "http";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const TIMEOUT_MS  = 8000;
const CONCURRENCY = 10; // parallel requests at a time

// ── Add column if it doesn't exist ──────────────────────────────────────────
async function ensureColumn() {
  await client.query(`
    ALTER TABLE deals ADD COLUMN IF NOT EXISTS link_status VARCHAR(20) DEFAULT 'unchecked';
  `);
}

// ── HTTP head-check with redirect following ──────────────────────────────────
function checkUrl(rawUrl: string): Promise<"verified" | "broken" | "unchecked"> {
  return new Promise((resolve) => {
    // skip placeholder / empty urls
    if (!rawUrl || rawUrl === "https://" || rawUrl.length < 10) {
      return resolve("unchecked");
    }

    let url: URL;
    try { url = new URL(rawUrl); }
    catch { return resolve("unchecked"); }

    const lib = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "HEAD",
      timeout: TIMEOUT_MS,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TritonSpend-LinkChecker/1.0)",
        "Accept": "text/html,application/xhtml+xml,*/*",
      },
      rejectUnauthorized: false,
    };

    const req = lib.request(options, (res) => {
      const code = res.statusCode ?? 0;
      res.resume(); // drain

      // follow one redirect manually
      if ((code === 301 || code === 302 || code === 307 || code === 308) && res.headers.location) {
        return checkUrl(res.headers.location).then(resolve);
      }

      if (code === 404 || code === 410) return resolve("broken");
      if (code === 400) return resolve("broken");
      // 403/429 means site exists but blocks bots → verified
      if (code >= 200 && code < 500) return resolve("verified");
      resolve("unchecked");
    });

    req.on("error", () => resolve("unchecked"));
    req.on("timeout", () => { req.destroy(); resolve("unchecked"); });
    req.end();
  });
}

// ── Run in batches of CONCURRENCY ────────────────────────────────────────────
async function runInBatches<T>(
  items: T[],
  fn: (item: T, i: number) => Promise<void>
) {
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    await Promise.all(items.slice(i, i + CONCURRENCY).map((item, j) => fn(item, i + j)));
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await client.connect();
  console.log("Connected to Supabase.");

  await ensureColumn();
  console.log("Column link_status ensured.\n");

  const { rows } = await client.query<{ id: number; name: string; url: string }>(
    "SELECT id, name, url FROM deals ORDER BY id;"
  );

  console.log(`Checking ${rows.length} URLs  (${CONCURRENCY} at a time)...\n`);

  let verified = 0, broken = 0, unchecked = 0;

  await runInBatches(rows, async (deal, idx) => {
    const status = await checkUrl(deal.url);
    await client.query("UPDATE deals SET link_status = $1 WHERE id = $2;", [status, deal.id]);

    const icon = status === "verified" ? "✅" : status === "broken" ? "❌" : "❓";
    const pad  = String(idx + 1).padStart(3, " ");
    console.log(`${pad}. ${icon} [${status.padEnd(9)}] ${deal.name.substring(0, 50)}`);

    if (status === "verified")  verified++;
    else if (status === "broken") broken++;
    else unchecked++;
  });

  console.log(`\n── Summary ──────────────────────────────`);
  console.log(`✅ Verified : ${verified}`);
  console.log(`❌ Broken   : ${broken}`);
  console.log(`❓ Unchecked: ${unchecked}`);
  console.log(`Total       : ${rows.length}`);

  await client.end();
}

main().catch(err => { console.error(err); process.exit(1); });
