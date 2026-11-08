// Federal Register: newest OSHA rules and proposed rules matching a keyword. No key.
import { json, fail } from "../lib/shared.mjs";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    const p = new URLSearchParams({ per_page: "6", order: "newest" });
    p.append("conditions[agencies][]", "occupational-safety-and-health-administration");
    p.append("conditions[type][]", "RULE");
    p.append("conditions[type][]", "PRORULE");
    if (q.get("term")) p.set("conditions[term]", q.get("term"));
    const since = new Date(Date.now() - 5 * 365.25 * 864e5).toISOString().slice(0, 10);
    p.set("conditions[publication_date][gte]", since);
    const r = await fetch(`https://www.federalregister.gov/api/v1/documents.json?${p}`);
    if (!r.ok) throw new Error(`Federal Register returned ${r.status}`);
    const body = await r.json();
    const rules = (body.results || []).map((d) => ({
      title: d.title, type: d.type, date: d.publication_date, url: d.html_url,
    }));
    return json({ rules });
  } catch (e) {
    return fail("fedreg", e);
  }
};
