// Which sources are ready. The page shows this so you know when keys are plugged in.
import { json } from "../lib/shared.mjs";
import { stat } from "node:fs/promises";
import path from "node:path";

const has = async (f) => { try { return (await stat(path.resolve(f))).size > 10; } catch { return false; } };
export default async () => json({
  osha: !!process.env.DOL_API_KEY,
  msha: !!process.env.DOL_API_KEY,
  fmcsa: !!process.env.FMCSA_WEBKEY,
  ita: await has("data/ita.json"),
  sir: await has("data/sir.json"),
  bls: await has("data/bls-benchmarks.json"),
  echo: true,
  fedreg: true,
});
