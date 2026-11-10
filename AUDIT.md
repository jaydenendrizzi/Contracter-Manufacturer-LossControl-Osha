# Audit: Library tab and industry sections

Audited `main` at 38e6eb6 ("Add files via upload") on 2026-11-09. Everything below was run for real: data checks in Node, the page served with `python3 -m http.server` and driven in headless Chromium at 390 px wide. The `/api/*` calls 404 locally, so the site ran in demo mode as expected.

## Bottom line

The Library tab was broken in production. `index.html` asked for `/library/index.json` and `/library/p/*.json`, but the files were uploaded to the site root as `lib-index.json` and `lib-p-*.json`. The fixed page had been uploaded as `index[1].html` next to it instead of replacing it. Every rep who opened Library got "The library isn't reachable right now." That's fixed, along with five smaller bugs found while testing.

## Repo root

| Item | Status |
|---|---|
| `index[1].html` | Duplicate of `index.html` with the correct library paths. **Removed** (its fix is now in `index.html`). |
| `library-upload-1-of-4.zip` to `4-of-4.zip` | 8 MB of an older packing of the library (`library/p/*.json`, different split). Not used by the page, but Netlify publishes the repo root, so they were publicly downloadable. **Removed.** Still in git history. |
| `HTML files from export` | Not on `main`. It lives only on branch `jaydenendrizzi-patch-1` (see Housekeeping). |
| Stray folders | None. The `library` file created and deleted in 50aa7b0 / fa3353b left nothing behind. |

## Library data

- `lib-index.json` and all 28 `lib-p-*.json` parse as valid JSON.
- 5,351 index items, 0 duplicate ids. Every `p` value has a matching pack file, every index id is in its pack with the same title and kind, and no pack has records the index doesn't list.
- 5,240 templates and 111 courses across 11 industries. Professional services is 721 templates (not 828) and has no courses.

## Code checks

- The one inline `<script>` in `index.html` passes `node --check`, before and after every change.
- `sw.js` and every file in `netlify/functions` and `netlify/lib` pass `node --check`.
- No em dashes in `index.html` or in any library title.

## Browser tests (390 px, Chromium)

Results on the final branch. "Before" is `main` as uploaded.

| Test | Before | After |
|---|---|---|
| a. `#library` loads, "scaffold" finds results, industry filter works | **Fail** (library unreachable) | Pass: 23 results for scaffold, 21 in Construction |
| b. Open a template, Add to my walkthrough, section shows under Sections to walk | **Fail** (couldn't open one) | Pass |
| c. Plastics product manufacturing checks only "Industry: Plastics and rubber molding" | Pass | Pass |
| c. Utility system construction switches Type to Construction | Pass | Pass |
| d. Lakeshore Metal (WI) hand-off pre-checks only the NAICS industry section | Pass on a clean load, **fail** in two real flows (bugs 3 and 4 below) | Pass: only `ip-fabmetal` (NAICS 332322) |
| e. Open a template, go offline, reload, it still opens | **Fail** | Pass |
| e. Unopened template offline shows a friendly message | **Fail** | Pass: "That one isn't saved on this phone yet..." |
| Lookup, Prospects, Industry, Stats render and run | Pass | Pass |
| Walkthrough: start, check an item, add a finding | Pass | Pass |
| No horizontal scroll at 390 px | Pass | Pass |
| Page errors | `Cannot read properties of null (reading 'filter')` | None |

## Bugs fixed (one commit each)

1. **Library pointed at files that don't exist** (3d6aced). Fixed the two fetch paths and removed `index[1].html`.
2. **Typing in Library search before the index loaded crashed** (2d89a44). `renderLib` ran with no index and threw. Now it waits.
3. **Adding a library template wiped the next Lookup hand-off** (81e79f2). Adding a template set a flag that reloaded the whole page on the next visit to Walkthrough. If that visit was the Lookup "Start walkthrough" button, the reload threw away the company, NAICS and prior citations. Custom sections are now rebuilt in place, no reload.
4. **A stale industry pick beat the hand-off's NAICS** (cfca904). If an industry had been picked on the Walkthrough form earlier, a later Lookup hand-off still used it instead of the site's NAICS. A new hand-off now clears it once.
5. **Lookup hand-off buttons did nothing until every data call finished** (09eb1f3). "Start walkthrough" and "Copy and open Claude" appeared right away but had no handler until all the API calls returned, so early taps were lost. They now show dimmed until they work. Not caused by the new features, but it sits on the hand-off path you asked me to test.
6. **Every app update wiped offline library templates** (24a957d). The service worker's `activate` step deleted every cache except the current `VERSION`, and library packs were cached under `VERSION`. So each deploy (and each `VERSION` bump) silently threw away everything a rep had opened for offline use. Library files now live in their own cache, `rr-lib-v1`, which survives updates.

## Netlify

GitHub has no deploy status or check runs for 38e6eb6 (combined status is empty, no deployments recorded), so I can't see whether Netlify built it or what state it's in. Either the Netlify GitHub app isn't posting statuses or the site isn't linked for deploy previews. Check the Deploys page in Netlify. If production built from 38e6eb6, the Library tab is broken live right now until this PR merges.

## Not fixed, worth knowing

- **Repacking the library later.** Packs are served saved-copy-first. If a future rebuild moves templates between pack files, a phone with old packs can show "isn't saved on this phone" for a moved template until the background refresh lands. If you ever change the pack layout, change `LIB_CACHE` in both `sw.js` and `index.html` (now noted in the README).
- **jsPDF from cdnjs** couldn't load in this sandbox (network policy), so PDF export wasn't exercised here. Nothing in this PR touches it.
- **Library content** has company names and addresses inside some questions, and a lot of it appears to come from SafetyCulture's public library. See LIBRARY-REVIEW.md. Nothing changed there yet.

## Follow-up, 2026-11-10

Done at your direction after the first review:

- **Library cleaned.** 5,351 to 4,742 items. Removed 221 templates that named a company, address or contact, dropped 388 Professional services HR and admin forms (299 of your approved 319 remain; the other 20 also named a company), stripped SafetyCulture and iAuditor from 126 templates, and gave every item a clean id. Details in LIBRARY-REVIEW.md. The library cache is now `rr-lib-v2`, so phones drop packs saved under the old ids.
- **Glass section added.** "Industry: Glass and glass products", 10 items, cites checked against eCFR (see CITATIONS-REVIEW.md). Glass (NAICS 3272) now maps to it instead of the concrete section.
- Re-ran the full browser suite after both changes: all pass, no page errors.
