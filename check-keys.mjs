// Run this the day you get your keys, before deploying:
//   DOL_API_KEY=xxx FMCSA_WEBKEY=yyy node scripts/check-keys.mjs
// It makes one small call per source and confirms the fields the site reads are there.
const checks = [];
const ok = (name, msg) => checks.push(`PASS  ${name}: ${msg}`);
const bad = (name, msg) => checks.push(`FAIL  ${name}: ${msg}`);

async function dol(agency, endpoint, filter, expect) {
  const name = `DOL ${agency}/${endpoint}`;
  const key = process.env.DOL_API_KEY;
  if (!key) return bad(name, "DOL_API_KEY not set");
  const p = new URLSearchParams({ limit: "2", "X-API-KEY": key, filter_object: JSON.stringify(filter) });
  try {
    const r = await fetch(`https://apiprod.dol.gov/v4/get/${agency}/${endpoint}/json?${p}`);
    if (!r.ok) return bad(name, `HTTP ${r.status} ${(await r.text()).slice(0, 120)}`);
    const body = await r.json();
    const rows = Array.isArray(body) ? body : body.data || [];
    if (!rows.length) return bad(name, "key works but no rows came back for the test filter");
    const missing = expect.filter((f) => !(f in rows[0]));
    missing.length ? bad(name, `missing fields: ${missing.join(", ")}`) : ok(name, `${rows.length} rows, fields look right`);
  } catch (e) { bad(name, e.message); }
}

await dol("OSHA", "inspection", { field: "site_state", operator: "eq", value: "WI" },
  ["activity_nr", "estab_name", "site_address", "site_city", "site_zip", "naics_code", "insp_type", "open_date", "close_case_date"]);
await dol("OSHA", "violation", { field: "viol_type", operator: "eq", value: "R" },
  ["activity_nr", "standard", "viol_type", "initial_penalty", "current_penalty"]);
await dol("OSHA", "accident_injury", { field: "degree_of_inj", operator: "eq", value: 1 }, ["summary_nr", "rel_insp_nr"]);
await dol("MSHA", "mines", { field: "state_abbr", operator: "eq", value: "WI" }, ["mine_id", "curr_mine_nm", "oper_nm", "state_abbr"]);
// Name search uses "like". If this fails while the others pass, the wildcard format needs changing in osha.mjs.
await dol("OSHA", "inspection", { field: "estab_name", operator: "like", value: "%FOUNDRY%" }, ["estab_name"]);

const fk = process.env.FMCSA_WEBKEY;
if (!fk) bad("FMCSA", "FMCSA_WEBKEY not set");
else {
  try {
    const r = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/name/schneider?webKey=${fk}`);
    const body = await r.json();
    const c = (body.content || [])[0];
    c ? ok("FMCSA", `found ${(c.carrier || c).legalName}`) : bad("FMCSA", `HTTP ${r.status}, no carriers returned`);
  } catch (e) { bad("FMCSA", e.message); }
}
console.log(checks.join("\n"));
process.exitCode = checks.some((c) => c.startsWith("FAIL")) ? 1 : 0;
