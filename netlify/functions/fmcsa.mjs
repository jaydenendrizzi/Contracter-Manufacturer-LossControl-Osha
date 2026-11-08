// FMCSA QCMobile carrier lookup. Same webKey as the trucking tool.
// /api/fmcsa?name=...&state=WI   name search
// /api/fmcsa?dot=1234567         one carrier by USDOT number (used to pin down the exact business)
import { json, fail, nameMatch, keyWord } from "../lib/shared.mjs";

const shape = (c) => ({
  dot: c.dotNumber, name: c.legalName, dba: c.dbaName, street: c.phyStreet, city: c.phyCity, state: c.phyState,
  zip: String(c.phyZipcode || "").slice(0, 5), powerUnits: c.totalPowerUnits, drivers: c.totalDrivers,
  rating: c.safetyRating, allowed: c.allowedToOperate, status: c.statusCode,
});

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const key = process.env.FMCSA_WEBKEY;
  try {
    if (!key) throw new Error("FMCSA_WEBKEY is not set");
    const dot = (q.get("dot") || "").replace(/\D/g, "");
    if (dot) {
      const r = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${dot}?webKey=${key}`);
      if (r.status === 404) return json({ carrier: null, error: `No carrier found for USDOT ${dot}` });
      if (!r.ok) throw new Error(`FMCSA returned ${r.status}`);
      const body = await r.json();
      const c = body.content && (body.content.carrier || body.content);
      if (!c || !c.legalName) return json({ carrier: null, error: `No carrier found for USDOT ${dot}` });
      return json({ carrier: shape(c), carriers: [shape(c)] });
    }
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
      .slice(0, 10).map(shape);
    return json({ carriers });
  } catch (e) {
    return fail("fmcsa", e);
  }
};
