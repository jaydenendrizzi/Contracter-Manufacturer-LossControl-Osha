// FMCSA QCMobile carrier lookup. Same webKey as the trucking tool.
import { json, fail, nameMatch } from "../lib/shared.mjs";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const key = process.env.FMCSA_WEBKEY;
  try {
    if (!key) throw new Error("FMCSA_WEBKEY is not set");
    const name = encodeURIComponent(q.get("name") || "");
    const r = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/name/${name}?webKey=${key}`);
    if (!r.ok) throw new Error(`FMCSA returned ${r.status}`);
    const body = await r.json();
    const state = (q.get("state") || "").toUpperCase();
    const carriers = (body.content || []).map((c) => c.carrier || c)
      .filter((c) => (!state || c.phyState === state) && nameMatch(q.get("name"), c.legalName, c.dbaName))
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
