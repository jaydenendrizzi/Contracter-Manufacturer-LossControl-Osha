// OSHA Severe Injury Reports. Bulk CSV only, so this searches data/sir.json.
import { json, fail, nameMatch } from "../lib/shared.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

let cache;
export default async (req) => {
  const q = new URL(req.url).searchParams;
  try {
    cache ||= JSON.parse(await readFile(path.resolve("data/sir.json"), "utf8"));
    const zip = q.get("zip") || "", st = (q.get("state") || "").toUpperCase();
    const rows = cache.filter((r) => (!st || r.state === st) && (!zip || r.zip === zip) && nameMatch(q.get("name"), r.employer))
      .sort((a, b) => b.date.localeCompare(a.date));
    return json({ rows: rows.slice(0, 100) });
  } catch (e) {
    return fail("sir", e.code === "ENOENT" ? "Severe injury data not loaded. Run scripts/build-data.mjs" : e);
  }
};
