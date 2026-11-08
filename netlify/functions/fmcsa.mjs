// FMCSA QCMobile carrier lookup. Same webKey as the trucking tool.
import { json, fail, nameMatch, keyWord } from "../lib/shared.mjs";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const key = process.env.FMCSA_WEBKEY;
  try {
    if (!key) throw new Error("FMCSA_WEBKEY is not set");
    const state = (q.get("state") || "").toUpperCase();
    const lookup = async (term) => {
      const r = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/name/${encodeURIComponent(term)}?webKey=${key}`);
      if (!r.ok) throw new Error(`FMCSA returned ${r.status}`);
      return ((await r.json()).content || []).map((c) => c.carrier || c)
        .filter((c) => (!state || c.phyState === state) && nameMatch(q.get("name"), c.legalName, c.dbaName));
    };
    // Try the name as typed; if FMCSA spells it differently, retry on the most distinctive word
    let found = await lookup(q.get("name") || "");
    if (!found.length) found = await lookup(keyWord(q.get("name")));
    const carriers = found
      .slice(0, 10)
      .map((c) => ({
        dot: c.dotNumber, name: c.legalName, dba: c.dbaName, city: c.phyCity, state: c.phyState,
        powerUnits: c.totalPowerUnits, drivers: c.totalDrivers, rating: c.safetyRating,
        allowed: c.allowedToOperate,
      }));
    return json({ carriers });
  } catch (e) {
    return fail("fmcsa", e);
  }
};
