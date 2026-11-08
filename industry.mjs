// Industry risk profile: what actually hurts people in a Wisconsin industry.
// /api/industry?list=1            -> manufacturing and construction industries with data
// /api/industry?naics=3323        -> profile for one industry
import { json, fail, loadData, benchFor, sectorOf, rate, hoursLookRight, eventBucket } from "../lib/shared.mjs";

const top = (rows, key, n = 6) => {
  const c = {};
  rows.forEach((r) => { const k = r[key]; if (k) c[k] = (c[k] || 0) + 1; });
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, count]) => ({ label, count }));
};
const BODY = [[/finger|thumb/i, "Fingers and thumbs"], [/hand|wrist/i, "Hands and wrists"], [/arm|elbow|shoulder/i, "Arms and shoulders"], [/leg|knee|ankle|foot|feet|toe/i, "Legs and feet"], [/head|face|eye|skull|brain/i, "Head and face"], [/back|spine|trunk|chest|rib|hip|pelvi/i, "Back and trunk"], [/multiple/i, "Multiple body parts"]];
const bodyBucket = (b) => { for (const [re, l] of BODY) if (re.test(b || "")) return l; return b ? "Other" : ""; };
const pct = (arr, p) => { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2); };

export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    const [ita, sir, bls] = await Promise.all([loadData("ita"), loadData("sir"), loadData("bls-benchmarks")]);
    if (q.get("list")) {
      const latest = ita.reduce((m, r) => (r.year > m ? r.year : m), "0");
      const c = {};
      for (const r of ita) {
        if (r.year !== latest || sectorOf(r.naics) === "other") continue;
        const k = r.naics.slice(0, 4);
        c[k] ||= { naics: k, sector: sectorOf(r.naics), filers: 0 };
        c[k].filers++;
      }
      const list = Object.values(c).filter((x) => x.filers >= 5).map((x) => ({
        ...x, label: (bls.rates[x.naics] || bls.wisconsin[x.naics] || {}).label || `NAICS ${x.naics}`,
      })).sort((a, b) => a.sector.localeCompare(b.sector) || b.filers - a.filers);
      return json({ year: latest, list });
    }

    const naics = (q.get("naics") || "").replace(/\D/g, "");
    if (naics.length < 2) return json({ error: "Pick an industry" }, 400);
    const latest = ita.reduce((m, r) => (r.year > m ? r.year : m), "0");
    const filers = ita.filter((r) => r.naics.startsWith(naics) && r.year === latest && r.hours >= 10000 && hoursLookRight(r));
    const trirs = filers.map((r) => rate(r).trir);
    const b = benchFor(bls, naics), us = benchFor(bls, naics, false);
    const cutoff = new Date(Date.now() - 5 * 365.25 * 864e5).toISOString().slice(0, 10);
    const sev = sir.filter((s) => s.naics.startsWith(naics) && s.date >= cutoff).map((s) => ({ ...s, bucket: eventBucket(s.event), part: bodyBucket(s.body) }));
    const byYear = {};
    sev.forEach((s) => { const y = s.date.slice(0, 4); byYear[y] = (byYear[y] || 0) + 1; });
    return json({
      naics, label: us.label, year: latest,
      bls: { wi: b.scope === "WI" ? b : null, us },
      filers: {
        count: filers.length, median: pct(trirs, 0.5), p75: pct(trirs, 0.75), p90: pct(trirs, 0.9),
        aboveBench: b.trc ? trirs.filter((t) => t > b.trc).length : null,
        zeroCases: filers.filter((r) => r.dafw + r.djtr + r.other === 0).length,
      },
      severe: {
        count: sev.length, amputations: sev.filter((s) => s.amputation).length,
        hospitalized: sev.filter((s) => s.hospitalized).length, eyeLoss: sev.filter((s) => s.eyeLoss).length,
        byYear, events: top(sev, "bucket", 8), sources: top(sev, "source"), body: top(sev, "part"),
        // Employer names left off on purpose: this view is about patterns, safe to show a client
        examples: sev.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map((s) => ({ date: s.date, narrative: s.narrative, amputation: s.amputation })),
      },
    });
  } catch (e) {
    return fail("industry", e);
  }
};
