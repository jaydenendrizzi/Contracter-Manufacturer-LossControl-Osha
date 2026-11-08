// FMCSA QCMobile carrier lookup. Same webKey as the trucking tool.
import { json, fail, nameMatch, keyWord } from "../lib/shared.mjs";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const key = process.env.FMCSA_WEBKEY;
  try {
    if (!key) throw new Error("FMCSA_WEBKEY is not set");
    const state = (q.get("state") || "").toUpperCase();
    // FMCSA searches nationwide and returns one page, so ask for a big page and search a
    // few spellings at once (as typed, hyphenated, and the most distinctive word)
    const name = (q.get("name") || "").trim();
    const terms = [...new Set([name, name.replace(/\s+/g, "-"), keyWord(name)])];
    const pages = await Promise.all(terms.map(async (term) => {
      const r = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/name/${encodeURIComponent(term)}?webKey=${key}&start=0&size=500`);
      if (!r.ok) throw new Error(`FMCSA returned ${r.status}`);
      return ((await r.json()).content || []).map((c) => c.carrier || c);
    }));
    const seen = new Set();
    const carriers = pages.flat()
      .filter((c) => !seen.has(c.dotNumber) && seen.add(c.dotNumber))
      .filter((c) => (!state || c.phyState === state) && nameMatch(name, c.legalName, c.dbaName))
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
