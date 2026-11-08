// Turns OSHA bulk CSVs into small JSON files the site can search.
//
// 1. Download into data/raw/ (osha.gov blocks some scripts, a browser download always works):
//    300A summary CSVs from https://www.osha.gov/itadata  (any file name containing "300A")
//    Severe Injury Reports CSV from https://www.osha.gov/severe-injury-reports (file name containing "20")
// 2. node scripts/build-data.mjs WI
//    Add states only if your book needs them. Every state adds weight to the function bundle.
import { createReadStream } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";

const states = new Set((process.argv.slice(2).length ? process.argv.slice(2) : ["WI"]).map((s) => s.toUpperCase()));
const RAW = process.env.RAW_DIR || "data/raw";

// Streaming CSV parser: handles quoted commas and line breaks, never holds the whole file.
async function eachRow(file, fn) {
  let head = null, row = [], cell = "", q = false, prev = "";
  const emit = () => {
    row.push(cell); cell = "";
    if (!head) head = row.map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, "_"));
    else if (row.length > 1) fn(Object.fromEntries(head.map((h, i) => [h, row[i] ?? ""])));
    row = [];
  };
  for await (const chunk of createReadStream(file, { encoding: "utf8" })) {
    for (const c of chunk) {
      if (q) {
        if (c === '"') q = false; else cell += c;
      } else if (c === '"') { if (prev === '"') cell += '"'; q = true; }
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") emit();
      else if (c !== "\r") cell += c;
      prev = c;
    }
  }
  if (cell || row.length) emit();
}
const STATE_NAMES = { ALABAMA:"AL",ALASKA:"AK",ARIZONA:"AZ",ARKANSAS:"AR",CALIFORNIA:"CA",COLORADO:"CO",CONNECTICUT:"CT",DELAWARE:"DE","DISTRICT OF COLUMBIA":"DC",FLORIDA:"FL",GEORGIA:"GA",HAWAII:"HI",IDAHO:"ID",ILLINOIS:"IL",INDIANA:"IN",IOWA:"IA",KANSAS:"KS",KENTUCKY:"KY",LOUISIANA:"LA",MAINE:"ME",MARYLAND:"MD",MASSACHUSETTS:"MA",MICHIGAN:"MI",MINNESOTA:"MN",MISSISSIPPI:"MS",MISSOURI:"MO",MONTANA:"MT",NEBRASKA:"NE",NEVADA:"NV","NEW HAMPSHIRE":"NH","NEW JERSEY":"NJ","NEW MEXICO":"NM","NEW YORK":"NY","NORTH CAROLINA":"NC","NORTH DAKOTA":"ND",OHIO:"OH",OKLAHOMA:"OK",OREGON:"OR",PENNSYLVANIA:"PA","RHODE ISLAND":"RI","SOUTH CAROLINA":"SC","SOUTH DAKOTA":"SD",TENNESSEE:"TN",TEXAS:"TX",UTAH:"UT",VERMONT:"VT",VIRGINIA:"VA",WASHINGTON:"WA","WEST VIRGINIA":"WV",WISCONSIN:"WI",WYOMING:"WY" };
const st = (v) => { const u = String(v || "").trim().toUpperCase(); return STATE_NAMES[u] || u; };
const num = (v) => Number(String(v).replace(/[^0-9.-]/g, "")) || 0;
const t = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
// 11/30/2025 -> 2025-11-30
const iso = (v) => { const m = t(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m ? `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}` : t(v).slice(0, 10); };
const zip5 = (z) => String(z || "").trim().slice(0, 5);

const files = await readdir(RAW).catch(() => []);
const itaFiles = files.filter((f) => /300a/i.test(f) && f.endsWith(".csv"));
const sirFiles = files.filter((f) => /^[A-Za-z]+20\d\d.*\.csv$/.test(f) || /severe/i.test(f));

// 300A: one row per establishment per year, latest submission wins
const ita = new Map();
for (const f of itaFiles) {
  await eachRow(`${RAW}/${f}`, (r) => {
    const state = st(r.state);
    if (!states.has(state)) return;
    const key = `${r.establishment_id}|${r.year_filing_for}`;
    ita.set(key, {
      name: t(r.establishment_name), company: t(r.company_name), ein: String(r.ein || "").replace(/\D/g, "").length === 9 ? String(r.ein).replace(/\D/g, "") : "", street: t(r.street_address), city: t(r.city), state,
      zip: zip5(r.zip_code), naics: t(r.naics_code), industry: t(r.industry_description), year: t(r.year_filing_for),
      employees: num(r.annual_average_employees), hours: num(r.total_hours_worked), deaths: num(r.total_deaths),
      dafw: num(r.total_dafw_cases), djtr: num(r.total_djtr_cases), other: num(r.total_other_cases),
      dafwDays: num(r.total_dafw_days), djtrDays: num(r.total_djtr_days),
    });
  });
  console.log(`read ${f}`);
}
await writeFile("data/ita.json", JSON.stringify([...ita.values()]));
console.log(`ita.json: ${ita.size} establishment-years for ${[...states].join(", ")}`);

const sir = [];
for (const f of sirFiles) {
  await eachRow(`${RAW}/${f}`, (r) => {
    const state = st(r.state);
    if (!states.has(state)) return;
    sir.push({
      date: iso(r.eventdate), employer: t(r.employer), street: t(r.address1), city: t(r.city), state,
      zip: zip5(r.zip), naics: t(r.primary_naics), hospitalized: num(r.hospitalized), amputation: num(r.amputation),
      eyeLoss: num(r.loss_of_eye), inspection: t(r.inspection),
      nature: t(r.naturetitle), body: t(r.part_of_body_title), event: t(r.eventtitle), source: t(r.sourcetitle),
      narrative: t(r.final_narrative),
    });
  });
  console.log(`read ${f}`);
}
await writeFile("data/sir.json", JSON.stringify(sir));
console.log(`sir.json: ${sir.length} reports`);
