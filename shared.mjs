// Shared helpers for every data function.
export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
  });

export const fail = (source, err) =>
  json({ source, error: String(err?.message || err) }, 502);

// DOL Open Data API v4. Key goes in the query string (the header is rejected on /v4/get).
// Field names: confirm with https://apiprod.dol.gov/v4/get/<agency>/<endpoint>/json/metadata?X-API-KEY=...
export async function dol(agency, endpoint, filter, opts = {}) {
  const key = process.env.DOL_API_KEY;
  if (!key) throw new Error("DOL_API_KEY is not set in Netlify environment variables");
  const p = new URLSearchParams({ limit: String(opts.limit || 200), "X-API-KEY": key });
  if (filter) p.set("filter_object", JSON.stringify(filter));
  if (opts.sort_by) { p.set("sort_by", opts.sort_by); p.set("sort", opts.sort || "desc"); }
  if (opts.fields) p.set("fields", opts.fields.join(","));
  const url = `https://apiprod.dol.gov/v4/get/${agency}/${endpoint}/json?${p}`;
  const r = await fetch(url);
  if (r.status === 404 || r.status === 204) return [];
  if (!r.ok) throw new Error(`DOL ${agency}/${endpoint} returned ${r.status}`);
  const body = await r.json();
  return Array.isArray(body) ? body : body.data || [];
}

export const and = (...conds) => {
  const c = conds.filter(Boolean);
  return c.length === 1 ? c[0] : { and: c };
};

// Name matching shared by the bulk-file searches: every meaningful word in the
// query must appear in the record's name. "Lakeshore Metal" matches "LAKESHORE METAL FAB LLC".
const STOP = new Set(["llc", "inc", "co", "corp", "corporation", "company", "ltd", "lp", "the", "and", "of"]);
export const tokens = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
export const nameMatch = (query, ...names) => {
  const q = tokens(query);
  if (!q.length) return false;
  const hay = new Set(names.flatMap(tokens));
  return q.every((w) => hay.has(w) || [...hay].some((h) => h.startsWith(w) && w.length >= 4));
};

// Cached loaders for the bundled data files
import { readFile as _rf } from "node:fs/promises";
import _path from "node:path";
const _cache = {};
export const loadData = async (name) => (_cache[name] ||= JSON.parse(await _rf(_path.resolve(`data/${name}.json`), "utf8")));

// Benchmark for a NAICS code: longest matching prefix, Wisconsin first when asked
export const benchFor = (bls, naics, preferWI = true) => {
  const look = (rates) => { if (!rates) return null; for (let l = naics.length; l >= 2; l--) { const h = rates[naics.slice(0, l)]; if (h) return { naics: naics.slice(0, l), ...h }; } return null; };
  const wi = preferWI ? look(bls.wisconsin) : null;
  return wi ? { ...wi, scope: "WI" } : (look(bls.rates) ? { ...look(bls.rates), scope: "US" } : { ...bls.rates.all, naics: "all", scope: "US" });
};
export const sectorOf = (naics) => (String(naics).startsWith("23") ? "con" : /^3[123]/.test(String(naics)) ? "mfg" : "other");
export const rate = (r) => ({ trir: r.hours ? (r.dafw + r.djtr + r.other) * 200000 / r.hours : 0, dart: r.hours ? (r.dafw + r.djtr) * 200000 / r.hours : 0 });

// 300A filings with impossible hours (typos are common) make rates meaningless.
// Full-time is about 2,000 hours a year; anything outside 800 to 3,500 per employee gets set aside.
export const hoursLookRight = (r) => r.employees > 0 && r.hours / r.employees >= 800 && r.hours / r.employees <= 3500;

// Severe injury event codes are very granular. Roll them up so patterns show.
const EVENT_BUCKETS = [
  [/fall.*lower level|fall from|jump to lower/i, "Fall to a lower level"],
  [/fall.*same level|slip|trip/i, "Slip, trip or fall on same level"],
  [/caught in|compressed|pinched|crushed/i, "Caught in or crushed by equipment"],
  [/struck by|struck against|rubbed|abraded/i, "Struck by object or equipment"],
  [/powered equipment|running.*equipment|machine/i, "Contact with running machinery"],
  [/fire|explosion|ignition/i, "Fire or explosion"],
  [/electric/i, "Electrical"],
  [/exposure|inhal|ingest|contact with.*(temperature|hot|cold|chemical)|heat|burn/i, "Exposure (heat, chemical, burns)"],
  [/overexertion|lifting|bodily reaction|repetitive/i, "Overexertion or bodily reaction"],
  [/vehicle|transportation|roadway|pedestrian|forklift/i, "Vehicle or transportation"],
  [/violence|assault/i, "Violence"],
];
export const eventBucket = (e) => { for (const [re, label] of EVENT_BUCKETS) if (re.test(e || "")) return label; return e ? "Other" : ""; };
