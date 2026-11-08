// OSHA inspections, violations and accident investigations (DOL API v4).
// /api/osha?mode=search&name=Acme&state=WI&zip=53188
// /api/osha?mode=detail&ids=1701234,1654321
import { json, fail, dol, and } from "../lib/shared.mjs";

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

    const name = (q.get("name") || "").trim();
    if (name.length < 3) return json({ error: "Enter at least 3 characters" }, 400);
    const filter = and(
      { field: "estab_name", operator: "like", value: `%${name.toUpperCase()}%` },
      q.get("state") && { field: "site_state", operator: "eq", value: q.get("state").toUpperCase() },
      q.get("zip") && { field: "site_zip", operator: "eq", value: q.get("zip") },
    );
    const inspections = await dol("OSHA", "inspection", filter,
      { limit: 300, sort_by: "open_date", fields: INSP_FIELDS });
    return json({ inspections });
  } catch (e) {
    return fail("osha", e);
  }
};
