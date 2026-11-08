// OSHA Injury Tracking Application (300A) data. No API exists, so this searches
// data/ita.json built by scripts/build-data.mjs from OSHA's bulk CSVs.
import { json, fail, nameMatch } from "../lib/shared.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

let cache;
export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    cache ||= JSON.parse(await readFile(path.resolve("data/ita.json"), "utf8"));
    const zip = q.get("zip") || "", st = (q.get("state") || "").toUpperCase();
    const rows = cache.filter((r) => (!st || r.state === st) && (!zip || r.zip === zip) && nameMatch(q.get("name"), r.name, r.company));
    return json({ rows: rows.slice(0, 100) });
  } catch (e) {
    return fail("ita", e.code === "ENOENT" ? "Injury data not loaded. Run scripts/build-data.mjs" : e);
  }
};
