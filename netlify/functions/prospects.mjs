// Prospect finder: Wisconsin manufacturers and contractors whose 300A injury rates run
// above their industry. Built from the bundled 300A, severe injury and BLS files.
// /api/prospects?sector=mfg&zips=530,531,532&minEmp=20&naics=332&sort=ratio
import { json, fail, loadData, benchFor, sectorOf, rate, nameMatch, hoursLookRight } from "../lib/shared.mjs";

const letters = (x) => String(x || "").toLowerCase().replace(/[^a-z]/g, "");
const junk = (name, city) =>
  letters(name).replace(letters(city), "").length < 3 ||            // "Waukesha", "Pleasant Prairie 2"
  /^\d+\s+(n|s|e|w)?\s*\w+\s+(st|street|rd|road|ave|avenue|dr|drive|blvd|ln|ct|way|hwy)\b/i.test(name) || // an address
  /^[\d_\-\s]+$/.test(name);                                         // an internal code

export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    const [ita, sir, bls] = await Promise.all([loadData("ita"), loadData("sir"), loadData("bls-benchmarks")]);
    const sector = q.get("sector") || "mfg";
    const naics = (q.get("naics") || "").replace(/\D/g, "");
    const zips = (q.get("zips") || "").split(",").map((z) => z.trim()).filter(Boolean);
    const minEmp = Number(q.get("minEmp") || 20), maxEmp = Number(q.get("maxEmp") || 1e9);
    const city = (q.get("city") || "").trim().toLowerCase();

    // Latest filing per establishment, plus the one before it for the trend
    const byEst = new Map();
    for (const r of ita) {
      if (!r.hours || r.hours < 10000) continue;
      if (naics ? !r.naics.startsWith(naics) : (sector !== "all" && sectorOf(r.naics) !== sector)) continue;
      const key = `${r.name.toLowerCase()}|${r.zip}`;
      (byEst.get(key) || byEst.set(key, []).get(key)).push(r);
    }
    const sirByZip = new Map();
    const cutoff = new Date(Date.now() - 5 * 365.25 * 864e5).toISOString().slice(0, 10);
    for (const s of sir) if (s.date >= cutoff) (sirByZip.get(s.zip) || sirByZip.set(s.zip, []).get(s.zip)).push(s);

    const out = [];
    let setAside = 0;
    for (const rows of byEst.values()) {
      rows.sort((a, b) => b.year.localeCompare(a.year));
      const r = rows[0];
      if (r.employees < minEmp || r.employees > maxEmp) continue;
      if (zips.length && !zips.some((z) => r.zip.startsWith(z))) continue;
      if (city && !r.city.toLowerCase().includes(city)) continue;
      if (!hoursLookRight(r)) { setAside++; continue; }
      // Multi-site companies often name each plant by its city or street. Fall back to the parent company.
      const display = junk(r.name, r.city) ? (r.company && !junk(r.company, r.city) ? `${r.company} (${r.city} site)` : null) : r.name;
      if (!display) { setAside++; continue; }
      const { trir, dart } = rate(r);
      const prev = rows[1] && hoursLookRight(rows[1]) ? rate(rows[1]).trir : null;
      const b = benchFor(bls, r.naics);
      // Both directions must match, so a generic name like "De Pere" doesn't grab every De Pere employer
      const severe = (sirByZip.get(r.zip) || []).filter((s) => nameMatch(r.name, s.employer) && nameMatch(s.employer, r.name));
      out.push({
        name: display, filedAs: r.name, company: r.company !== r.name ? r.company : "", street: r.street, city: r.city, zip: r.zip,
        naics: r.naics, industry: r.industry, year: r.year, employees: r.employees,
        cases: r.dafw + r.djtr + r.other, lostDays: r.dafwDays + r.djtrDays, deaths: r.deaths,
        trir: +trir.toFixed(2), dart: +dart.toFixed(2), prevTrir: prev == null ? null : +prev.toFixed(2),
        bench: b.trc, benchDart: b.dart, benchLabel: b.label, benchScope: b.scope,
        ratio: b.trc ? +(trir / b.trc).toFixed(2) : null,
        // Injuries beyond what an average shop their size would have. Weights by size, so a
        // 300-person plant running hot outranks a 22-person shop with one bad year.
        excess: b.trc ? +((r.dafw + r.djtr + r.other) - b.trc * r.hours / 200000).toFixed(1) : null,
        severe: severe.length, amputations: severe.filter((s) => s.amputation).length,
      });
    }
    const sort = q.get("sort") || "excess";
    const keyFn = { excess: (x) => x.excess ?? -1e9, ratio: (x) => x.ratio ?? 0, trir: (x) => x.trir, lostDays: (x) => x.lostDays, severe: (x) => x.severe * 1000 + (x.ratio ?? 0), employees: (x) => x.employees }[sort] || ((x) => x.ratio);
    out.sort((a, b) => keyFn(b) - keyFn(a));
    return json({ total: out.length, setAside, rows: out.slice(0, Number(q.get("limit") || 150)) });
  } catch (e) {
    return fail("prospects", e.code === "ENOENT" ? "Injury data not loaded. Run scripts/build-data.mjs" : e);
  }
};
