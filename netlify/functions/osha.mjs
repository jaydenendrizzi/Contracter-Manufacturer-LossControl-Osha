// OSHA inspections, violations and accident investigations (DOL API v4).
// /api/osha?mode=search&name=Acme&state=WI&zip=53188
// /api/osha?mode=detail&ids=1701234,1654321
import { json, fail, dol, and, likeAny, nameMatch, houseNo } from "../lib/shared.mjs";

const INSP_FIELDS = ["activity_nr","estab_name","site_address","site_city","site_state","site_zip",
  "naics_code","insp_type","insp_scope","open_date","close_case_date","nr_in_estab"];

export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    if (q.get("mode") === "detail") {
      const ids = (q.get("ids") || "").split(",").filter(Boolean).slice(0, 50).map(Number);
      if (!ids.length) return json({ violations: [], accidents: [] });
      const violations = await dol("OSHA", "violation",
        { field: "activity_nr", operator: "in", value: ids }, { limit: 1000 });
      // Accident investigations link to inspections through accident_injury.rel_insp_nr
      let accidents = [];
      const injuries = await dol("OSHA", "accident_injury",
        { field: "rel_insp_nr", operator: "in", value: ids }, { limit: 500 }).catch(() => []);
      const summaries = [...new Set(injuries.map((i) => i.summary_nr).filter(Boolean))];
      if (summaries.length) {
        const events = await dol("OSHA", "accident",
          { field: "summary_nr", operator: "in", value: summaries }, { limit: 200 }).catch(() => []);
        // Full narratives live in accident_abstract, split across numbered lines
        const lines = await dol("OSHA", "accident_abstract",
          { field: "summary_nr", operator: "in", value: summaries }, { limit: 2000 }).catch(() => []);
        accidents = events.map((e) => ({
          ...e,
          abstract_text: lines.filter((l) => l.summary_nr === e.summary_nr)
            .sort((a, b) => a.line_nr - b.line_nr).map((l) => l.abstract_text).join("") || e.abstract_text,
          injuries: injuries.filter((i) => i.summary_nr === e.summary_nr),
        }));
      }
      return json({ violations, accidents });
    }

    // One inspection by number: gives the exact employer name and site address to search from
    if (q.get("mode") === "insp") {
      const nr = Number((q.get("nr") || "").replace(/\D/g, ""));
      if (!nr) return json({ error: "Enter an inspection number" }, 400);
      const inspections = await dol("OSHA", "inspection", { field: "activity_nr", operator: "eq", value: nr }, { limit: 1, fields: INSP_FIELDS });
      return json({ inspections });
    }

    const name = (q.get("name") || "").trim();
    const zip = (q.get("zip") || "").trim();
    const num = houseNo(q.get("street"));
    const state = q.get("state") && { field: "site_state", operator: "eq", value: q.get("state").toUpperCase() };
    // Address search: house number plus ZIP finds the site no matter what name it was filed under
    if (num && zip) {
      const inspections = await dol("OSHA", "inspection",
        and({ field: "site_address", operator: "like", value: `${num} %` }, state, { field: "site_zip", operator: "eq", value: zip }),
        { limit: 300, sort_by: "open_date", fields: INSP_FIELDS });
      return json({ inspections });
    }
    if (name.length < 3) return json({ error: "Enter at least 3 characters" }, 400);
    // Fetch on the most distinctive word, then keep names that match every word,
    // however they're spelled ("Briggs & Stratton" = "BRIGGS AND STRATTON CORP")
    const filter = and(likeAny(["estab_name"], name), state, zip && { field: "site_zip", operator: "eq", value: zip });
    const found = await dol("OSHA", "inspection", filter,
      { limit: 2000, sort_by: "open_date", fields: INSP_FIELDS });
    const inspections = found.filter((i) => nameMatch(name, i.estab_name)).slice(0, 300);
    return json({ inspections });
  } catch (e) {
    return fail("osha", e);
  }
};
