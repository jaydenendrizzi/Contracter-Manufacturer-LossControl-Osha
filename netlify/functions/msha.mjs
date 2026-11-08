// MSHA mines and violations (DOL API v4). Field names verified against the DOL catalog.
import { json, fail, dol, and, likeAny, nameMatch } from "../lib/shared.mjs";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const name = (q.get("name") || "").trim();
  try {
    // Fetch on the most distinctive word, then keep mines whose operator or mine name
    // matches every word, however it's spelled
    const found = await dol("MSHA", "mines", and(
      likeAny(["oper_nm", "curr_mine_nm"], name),
      q.get("state") && { field: "state_abbr", operator: "eq", value: q.get("state").toUpperCase() },
    ), { limit: 300, fields: ["mine_id","curr_mine_nm","oper_nm","state_abbr","fips_cnty_nm","mine_type_cd","curr_stat_cd","employee_cnt","primary_canvass_desc"] });
    const mines = found.filter((m) => nameMatch(name, m.oper_nm, m.curr_mine_nm)).slice(0, 25);
    const ids = mines.map((m) => m.mine_id).filter(Boolean).slice(0, 20);
    const violations = ids.length
      ? await dol("MSHA", "violation", { field: "mine_id", operator: "in", value: ids },
          { limit: 500, sort_by: "iss_dt", fields: ["mine_id","viol_no","iss_dt","part_section","sig_sub","cit_ord_safe","negligence","likelihood"] }).catch(() => [])
      : [];
    return json({ mines, violations });
  } catch (e) {
    return fail("msha", e);
  }
};
