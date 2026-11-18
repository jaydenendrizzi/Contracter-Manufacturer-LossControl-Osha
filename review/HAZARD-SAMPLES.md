# Phase 1, step C: archived sample-stage notes

This records the original three-sample review. After design approval, the rest of Phase 1 was built. See PHASE1-REVIEW.md for the current handoff.

These samples are for internal look and wording review. All three records have reviewed:false. The remaining 47 hazards, blank forms, packet builder, client snapshots and client grouping are not built.

Files: hazards.json, handouts.js, handouts.css, handouts-samples.html, handouts-samples.js, fonts/, vendor/jspdf.umd.min.js, and one link inside Walkthrough in index.html. sw.js has a new VERSION, a separate rr-hazards-v1 cache, and navigation caching by path so offline sample navigation does not replace the app's index.html. The existing visit PDF code and CDN script are unchanged. The samples use their own local copy of the same jsPDF 2.5.1 library already used by the app. No new application dependency.

Design source: supplied screenshots and the source repo's report-card.js at commit 61018fd16d238c43e2459e0ea5c971f224d964a2, especially rcCss(), rcPage(), and RPT_SCORE_CSS in index.html. The source renders HTML and calls window.print(). These samples instead use hand-drawn jsPDF for a selectable PDF file that can be shared offline. Overpass 400/700/800 is bundled for screen and PDF, with its OFL license. Source WOFF2 files: @fontsource/overpass 5.2.8, converted to TTF for jsPDF using fontTools during development. No font conversion is needed by the app.

The logo is rr-logo.png, unchanged. The top right uses the division label instead of the source's prohibited image. No invented percentages, status lights, thresholds, or padding metrics are used for unscored checks. A rep circles Check, Watch or Fix in each tile. Wisconsin metrics are omitted entirely where a clean mapping was not found.

Create PDF builds an embedded preview and download. Share PDF is a second tap, retaining a fresh user gesture for phone file sharing. Browsers without file sharing use the download. Native iOS/Android share sheets cannot be verified in headless Chromium; a physical phone check remains necessary. Full visit prefills and automatic sharing belong to step F after look approval.

## Wording review notes

The disclaimer is copied word for word from DISCLAIMER in index.html, with the client name substituted. It refers to observed visit conditions even though these are generic hazard sheets. R&R should review that fit before release; it was not silently rewritten. The footnote also says the sheet is a starting point for the client's own program. There is no interface to mark wording reviewed.

The heat source supports general prevention guidance and the General Duty Clause, but these samples do not print a General Duty Clause citation. They label the heat content guidance only. The federal OSHA standards page checked for the sample does not list a specific heat standard. Refresh that check before changing reviewed to true.

## Verification

Checked on 2026-11-18. eCFR titles.json reports Title 29 up to date through 2026-11-16. The versioner full-XML endpoints returned HTTP 406. Instead, fetched and read the official current eCFR section HTML directly, including the applicable paragraphs and exclusions. This is direct source verification, not reliance on the earlier citation review's verdicts.

| Hazard | Verified text | Official sections |
|---|---|---|
| Falls from roofs and unprotected edges | General industry unprotected edges at 4 ft; construction unprotected edges at 6 ft; roofing slope rules; fall system criteria and inspection/rescue provisions | [1910.28](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-D/section-1910.28), [1910.29](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/section-1910.29), [1926.501](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1926/section-1926.501), [1926.502](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1926/section-1926.502) |
| Lockout/tagout failures | 1910.147(c)(4) procedures; (c)(7) training; (d)(3)-(6) isolation, devices, stored energy and verification; (f)(4) shift changes; (a)(1)(ii)(A) excludes construction. Construction references cover circuits and concrete/masonry equipment separately. | [1910.147](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/section-1910.147), [1926.417](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1926/section-1926.417), [1926.702(j)(1)](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1926/section-1926.702) |
| Extreme heat and humidity | Official heat standards page describes the General Duty Clause, links Water. Rest. Shade., and NIOSH recommended guidance. No specific federal heat standard is listed there. | [OSHA Heat Exposure: Standards](https://www.osha.gov/heat-exposure/standards) |

Wisconsin mapping: data/sir.json rows where event equals exactly `Exposure to environmental heat` or `Exposure to environmental heat outdoor`. There are 39 reports and 39 hospitalized workers. These are reported events across all industries, not a humidity-specific or industry-specific rate. No employer names are copied to hazards.json. ITA data is industry-level and does not identify these hazards. Falls and lockout were left without metrics because broader event groups do not establish a roof/edge or isolation failure.

Related industry pack IDs were checked against INDUSTRY_PACKS: papermill, structure, highway; plastics, foodproc, printing, foundry; foundry, highway. Their saved IDs were not changed.

Checks: node --check on all 21 application scripts, including the extracted inline app script; 390 px headless Chromium sample creation; one letter page per PDF; selectable extracted PDF text; no page errors or horizontal overflow; service worker control; offline reload and PDF creation; separate hazard cache retained alongside the library cache. Images are rasterized from the generated PDFs, not screen mockups.
