# R&R Loss Control Site Lookup

Pre-visit lookup for loss control. Same setup as the trucking tool: static page on Netlify, serverless functions call the public sources so keys stay off the browser.

## Six tools in one site
- **Site lookup** (`#lookup`): everything public on one company before a visit. Search by company name, USDOT number, street address, EIN or OSHA inspection number. An ID pins down the exact business and address, then every source is searched by both name and address, and records at that address are marked "Same address" and listed first. Tick "Contractor or multi-site" for contractors, since OSHA inspects them at job sites, not their office.
- **Prospects** (`#prospects`): Wisconsin manufacturers and contractors ranked by injuries over what their industry would expect, from their own 300A filings. Tap a row to run the site lookup. Export to CSV.
- **Walkthrough** (`#walk`): **Snap a hazard** button always on screen: photo first, then pick a hazard type and the title, recommendation, reference and priority fill in. **Quick capture** skips the checklist entirely for photo-only visits. **Create PDF report** builds a real PDF on the phone (jsPDF) and opens the share sheet to text or email it.
  Full checklist mode: phone checklist for the visit. About 100 items across 20 manufacturing and construction sections, each tied to the standard and a default recommendation. Mark OK, Finding or N/A; findings get severity, dictated notes and photos. Saves on the phone (IndexedDB) so a dead signal or closed tab doesn't lose the visit. Ends with a printable PDF report or a hand-off to Claude (request text, photos and `visit.json`) via the phone's share sheet. Finished visits save to a visit history on the phone, where reps update each recommendation's client status (Open, Done, Client declined), reprint the PDF, draft a follow-up email, or start a follow-up visit that carries open items forward with Fixed / Partly fixed / Not fixed. Start it from a lookup and prior OSHA cites and severe injuries get flagged on the matching items.
- **Corrective actions** (in Walkthrough): every finding gets an owner at the client, their email and a due date (defaults: high 7 days, medium 30, low 60). "Email action plan" drafts one email to the owners grouped by person. "Due dates to my calendar" makes an .ics with an alert the day before and the morning it's due. Overdue items show in red in visit history and on the Walkthrough screen. Owner and due date print on the PDF and go to Claude in visit.json. Automatic emails to clients need a server, see below.
- **Photo markup** (in Walkthrough): tap any photo to circle it, draw an arrow or freehand in red or yellow. Saved at full resolution so it stays sharp in the PDF.
- **Template builder** (Walkthrough > Build or edit checklist sections): add your own sections and questions with a reference and default recommendation, no code. Saved on the phone; "Share with the team" exports a file others import.
- **Library** (`#library`): 4,742 items across 11 industries (4,631 inspection templates and 111 training outlines), searchable by title. Open one to read it, then "Add to my walkthrough" turns it into a custom checklist section (form fields like photo, date and signature are left out; only the checkable questions come over). Data lives at the site root: `lib-index.json` (titles, loaded first) and `lib-p-<industry>-<n>.json` (packs, loaded only when one is opened). `sw.js` keeps library files in their own cache (`rr-lib-v1`) that survives app updates, so anything a rep has opened, or saved with "Save for offline", works with no signal. To refresh the library, rebuild those files; if you change the pack layout, also change `LIB_CACHE` in both `sw.js` and `index.html` so phones drop the old packs.
- **Industry sections** (Walkthrough > Industry): 27 sections, 207 items, written for the industries on the Industry tab (plastics, food and dairy, meat, machine shops, fabrication and stamping, foundries, finishing, printing, paper, wood, concrete, HVAC and appliances, vehicles and boats, chemicals, medical and electronics, textiles, glass, and eight construction trades). Each item has a what-to-look-at hint, the OSHA reference and a default recommendation. Pick an industry on the setup form and the matching sections are checked; a lookup hand-off does it from the company's NAICS code. The content is in the `INDUSTRY_PACKS` list in `index.html` and `INDUSTRY_MAP` ties each industry label to its sections. References are a starting point for the consultant, not a compliance determination, so have a loss control lead review before relying on any of them with a client. Every CFR reference was checked against eCFR in November 2026; see CITATIONS-REVIEW.md.
- **Stats** (`#stats`): visits, findings per visit, close rate and median days to close, overdue items, where findings come from, repeat problems, visits by month, clients to chase. A manager sees the team by importing each consultant's "Export my visits" file (photos stripped).
- **Offline**: `sw.js` caches the app and `manifest.webmanifest` makes it installable (Share > Add to Home Screen on iPhone). Once a rep has opened the site with signal, the walkthrough, photos, PDFs and history all work with none. Lookups and prospects show the last data seen. Bump `VERSION` in sw.js on each deploy so phones pick up changes.
- **Industry risk** (`#industry`): what actually hurts people in a Wisconsin industry (severe injury patterns, equipment, body parts, how filers compare to BLS). No employer names, so it's safe to show a client.

## What works today, no keys
- Injury rates (OSHA 300A, Wisconsin, 2023 to 2025 filings): loaded in `data/ita.json`
- Severe injury reports (Wisconsin, Jan 2015 to Nov 2025): loaded in `data/sir.json`
- BLS 2024 industry benchmarks, national and Wisconsin, about 1,150 industries: `data/bls-benchmarks.json`
- EPA ECHO and Federal Register: live APIs, no key needed

## Turns on when you add keys
| Key | Get it | Turns on |
|---|---|---|
| `DOL_API_KEY` | dataportal.dol.gov, sign in with login.gov, then API Keys | OSHA inspections, citations, accidents, MSHA |
| `FMCSA_WEBKEY` | Same key the trucking tool uses | Trucks on the road |

The day you get them:
1. `DOL_API_KEY=xxx FMCSA_WEBKEY=yyy node scripts/check-keys.mjs` (every line should say PASS)
2. Netlify > Site settings > Environment variables, add both
3. Redeploy. The source chips at the top of the page go green.

## Deploy (no coding tools needed)
1. Upload everything inside this folder to the GitHub repo (GitHub > Add file > Upload files). `netlify.toml` must sit at the top level of the repo.
2. Netlify > Add new site > Import an existing project > GitHub > pick the repo > Deploy. Leave the build command empty.
3. Add the keys under Site configuration > Environment variables, then Deploys > Trigger deploy.
Don't use Netlify's drag-and-drop deploy: it skips the functions that call the APIs.

The status chips at the top of the site test each key with a real call. Green means it works; gray shows the reason.

## Run it locally
`node scripts/dev-server.mjs`, then open http://localhost:8888 (Node 18 or newer). Add keys in front of the command to test them.

## Refreshing data
| Data | When | How |
|---|---|---|
| 300A injury rates | OSHA adds filings through the year, big drop each spring | Download the 300A CSVs from osha.gov/itadata into `data/raw/`, run `node scripts/build-data.mjs WI` |
| Severe injury reports | A few times a year | Same, from osha.gov/severe-injury-reports |
| BLS benchmarks | Each November | Ask Claude to rebuild `bls-benchmarks.json` from download.bls.gov/pub/time.series/is/ |

Add more states to the build command only if your book needs them. Each state adds a few MB to the function bundle.

## Sources and field names
OSHA and MSHA field names were checked against the DOL catalog (apiprod.dol.gov/v4/datasets). ECHO, Federal Register, 300A and Severe Injury columns were checked against live data. The only untested pieces are the calls that need keys, which is what `check-keys.mjs` is for.

## Claude report skill
`claude-skill/rr-loss-control-report` (also packaged as `rr-loss-control-report.skill`). Install it in Claude (open the .skill file in Claude and click Save skill, or upload it under Settings > Capabilities > Skills). It reads the `visit.json` and photos the walkthrough shares, writes the letter using R&R's rules (no "violation," no "compliant," disclaimer word for word, priority order), and renders a branded PDF marked DRAFT until the consultant confirms it's reviewed. R&R logo is already in `assets/logo.png`.

## Before reps use the walkthrough report
- Have compliance or Mitch sign off on the disclaimer (`DISCLAIMER` in index.html) and the report format. It goes to clients and can end up in a lawsuit.
- Citations in the checklist are a starting point for the consultant, not a compliance determination. Spot-check the ones your team cites most.
- Photos stay on the phone until the rep shares them. Clearing a finished walkthrough deletes them.

## What still needs a server
Automatic reminder emails to client staff and a shared team view (instead of import/export) both need logins and a database, because they hold client findings. The data model is already in place: each finding stores owner, email, due date, status and closed date. Netlify Identity plus Netlify Blobs or Supabase would cover it.

## Data quality rules baked in
- 300A filings with impossible hours (under 800 or over 3,500 per employee) are set aside. They're typos and would wreck the rankings.
- Plants named by city or code ("Waukesha", "7682_18535") show under the parent company name.
- Severe injuries only attach to a prospect when the names match both ways, so a generic name doesn't grab someone else's injuries.
- Prospects rank by injuries over expected, not raw TRIR. Raw TRIR makes every 20-person shop with one bad year look like the top prospect.

## Don't remove
The "pick the right location" step. Public records file the same company under different names and addresses. That step is what keeps a rep from quoting another company's citations to a prospect.
