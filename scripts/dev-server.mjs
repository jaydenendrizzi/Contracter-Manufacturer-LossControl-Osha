// Run the whole site locally without the Netlify CLI:  node scripts/dev-server.mjs
// Then open http://localhost:8888. Put keys in your shell first if you have them:
//   DOL_API_KEY=xxx FMCSA_WEBKEY=yyy node scripts/dev-server.mjs
import http from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const PORT = process.env.PORT || 8888;
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    const m = url.pathname.match(/^\/(?:api|\.netlify\/functions)\/([a-z]+)$/);
    if (m) {
      const mod = await import(pathToFileURL(path.resolve(`netlify/functions/${m[1]}.mjs`)).href);
      const out = await mod.default(new Request(url.href));
      res.writeHead(out.status, Object.fromEntries(out.headers));
      return res.end(Buffer.from(await out.arrayBuffer()));
    }
    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (file.includes("..")) throw Object.assign(new Error("bad path"), { code: "ENOENT" });
    const body = await readFile(path.resolve(file));
    const TYPES = { html: "text/html", js: "text/javascript", png: "image/png", json: "application/json", webmanifest: "application/manifest+json", css: "text/css" };
    res.writeHead(200, { "content-type": TYPES[file.split(".").pop()] || "application/octet-stream" });
    res.end(body);
  } catch (e) {
    res.writeHead(e.code === "ENOENT" || e.code === "ERR_MODULE_NOT_FOUND" ? 404 : 500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: String(e.message || e) }));
  }
}).listen(PORT, () => console.log(`Loss control lookup on http://localhost:${PORT}`));
