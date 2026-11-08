// OSHA Injury Tracking Application (300A) data. No API exists, so this searches
// data/ita.json built by scripts/build-data.mjs from OSHA's bulk CSVs.
import { json, fail, nameMatch, sameSite } from "../lib/shared.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

let cache;
export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    cache ||= JSON.parse(await readFile(path.resolve("data/ita.json"), "utf8"));
    const zip = q.get("zip") || "", st = (q.get("state") || "").toUpperCase();
    const ein = (q.get("ein") || "").replace(/\D/g, "");
    const street = q.get("street") || "";
    // EIN finds every establishment the company files for. Street + ZIP finds the site under any name.
    const rows = cache.filter((r) => ein ? r.ein === ein
      : (!st || r.state === st) && ((street && zip && sameSite(street, zip, r.street, r.zip)) || ((!zip || r.zip === zip) && q.get("name") && nameMatch(q.get("name"), r.name, r.company))));
    return json({ rows: rows.slice(0, 100) });
  } catch (e) {
    return fail("ita", e.code === "ENOENT" ? "Injury data not loaded. Run scripts/build-data.mjs" : e);
  }
};
