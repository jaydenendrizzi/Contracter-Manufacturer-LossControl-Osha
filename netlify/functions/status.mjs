// Which sources are ready. Doesn't just check that a key is set: makes one tiny real call
// with each key, so a typo or an inactive key shows up as a red chip with the reason.
import { json } from "../lib/shared.mjs";
import { stat } from "node:fs/promises";
import path from "node:path";

const has = async (f) => { try { return (await stat(path.resolve(f))).size > 10; } catch { return false; } };
const timed = (p, ms = 8000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timed out")), ms))]);

async function checkDol() {
  const key = process.env.DOL_API_KEY;
  if (!key) return { ok: false, why: "DOL_API_KEY is not set in Netlify" };
  try {
    const p = new URLSearchParams({ limit: "1", "X-API-KEY": key, filter_object: JSON.stringify({ field: "site_state", operator: "eq", value: "WI" }) });
    const r = await timed(fetch(`https://apiprod.dol.gov/v4/get/OSHA/inspection/json?${p}`));
    if (r.status === 401 || r.status === 403) return { ok: false, why: "DOL rejected the key. Check for a typo or that it's active." };
    if (!r.ok) return { ok: false, why: `DOL answered ${r.status}` };
    return { ok: true };
  } catch (e) { return { ok: false, why: `Couldn't reach DOL: ${e.message}` }; }
}
async function checkFmcsa() {
  const key = process.env.FMCSA_WEBKEY;
  if (!key) return { ok: false, why: "FMCSA_WEBKEY is not set in Netlify" };
  try {
    const r = await timed(fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/name/schneider?webKey=${key}`));
    if (!r.ok) return { ok: false, why: `FMCSA answered ${r.status}. Check the key.` };
    const body = await r.json();
    return (body.content || []).length ? { ok: true } : { ok: false, why: "FMCSA key accepted but returned nothing. Check the key." };
  } catch (e) { return { ok: false, why: `Couldn't reach FMCSA: ${e.message}` }; }
}

export default async () => {
  const [dol, fm] = await Promise.all([checkDol(), checkFmcsa()]);
  return json({
    osha: dol.ok, msha: dol.ok, fmcsa: fm.ok,
    ita: await has("data/ita.json"), sir: await has("data/sir.json"), bls: await has("data/bls-benchmarks.json"),
    echo: true, fedreg: true,
    why: { osha: dol.why, msha: dol.why, fmcsa: fm.why },
  });
};
