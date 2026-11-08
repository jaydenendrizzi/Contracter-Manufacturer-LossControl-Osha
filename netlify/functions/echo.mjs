// EPA ECHO facility compliance. No key needed.
import { json, fail, nameMatch, keyWord } from "../lib/shared.mjs";
const BASE = "https://echodata.epa.gov/echo/echo_rest_services";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    // Search ECHO on the most distinctive word so spelling differences don't hide a facility
    const p = new URLSearchParams({ output: "JSON", p_fn: keyWord(q.get("name")) });
    if (q.get("state")) p.set("p_st", q.get("state"));
    if (q.get("zip")) p.set("p_zip", q.get("zip"));
    const r = await (await fetch(`${BASE}.get_facilities?${p}`)).json();
    let facs = r?.Results?.Facilities;
    if (!facs && r?.Results?.QueryID) {
      const r2 = await (await fetch(`${BASE}.get_qid?output=JSON&qid=${r.Results.QueryID}&pageno=1`)).json();
      facs = r2?.Results?.Facilities;
    }
    // ECHO name search is loose, so keep only facilities whose name actually matches
    const facilities = (facs || []).filter((f) => nameMatch(q.get("name"), f.FacName)).slice(0, 25).map((f) => ({
      name: f.FacName, street: f.FacStreet, city: f.FacCity, state: f.FacState, zip: f.FacZip,
      registryId: f.RegistryID, inspections: f.FacInspectionCount, formalActions: f.FacFormalActionCount,
      penalties: f.FacTotalPenalties, lastInspection: f.FacDateLastInspection,
      qtrsNonCompliance: f.FacQtrsWithNC, significantViolator: f.FacSNCFlg,
      status: f.FacComplianceStatus, naics: f.FacNAICSCodes,
    }));
    return json({ facilities });
  } catch (e) {
    return fail("echo", e);
  }
};
