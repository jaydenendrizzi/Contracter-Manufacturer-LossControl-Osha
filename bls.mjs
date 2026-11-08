// BLS SOII industry benchmarks, national and Wisconsin. SOII publishes once a year
// (each November), so the rates live in data/bls-benchmarks.json instead of a live call.
import { json, fail } from "../lib/shared.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

let table;
const lookup = (rates, naics) => {
  if (!rates) return null;
  for (let len = naics.length; len >= 2; len--) {
    const hit = rates[naics.slice(0, len)];
    if (hit) return { naics: naics.slice(0, len), ...hit };
  }
  return rates.all ? { naics: "all", ...rates.all } : null;
};
export default async (req) => {
  const naics = (new URL(req.url).searchParams.get("naics") || "").replace(/\D/g, "");
  try {
    table ||= JSON.parse(await readFile(path.resolve("data/bls-benchmarks.json"), "utf8"));
    const us = lookup(table.rates, naics);
    return json({ ...us, year: us?.year || table.year, sample: table.sample, wisconsin: lookup(table.wisconsin, naics) });
  } catch (e) {
    return fail("bls", e);
  }
};
