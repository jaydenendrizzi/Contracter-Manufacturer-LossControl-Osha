# Phase 1 handoff for R&R review

The approved card design now covers all 50 hazards and six blank forms. The Handouts area is linked from Walkthrough and from saved visits. It supports seven categories, title search, an optional client name, client/date/rep prefills, and multi-hazard PDF packets. Phase 2 and Phase 3 are not started.

All 50 hazards and all six forms have reviewed:false. Approving the sample design did not approve the wording. There is no app button to bypass wording review. A record's reviewed flag controls its DRAFT label, and a packet filename stays DRAFT if any selected sheet is unreviewed. R&R should review the data, references and inherited disclaimer before changing those flags.

## Documents to review

Open the local generated PDF review index for every individual PDF. `phase1/all-hazards-DRAFT.pdf` (All 50 hazard sheets, generated locally) also form one 50-page packet, demonstrating one sheet per hazard. `phase1/blank-forms-preview.png` (The six-form preview, generated locally) shows each blank form's layout. The form PDFs are linked individually in the review index.

Use [the 50-row citation CSV](hazard-citation-review.csv) to review hazard, citation, status, verification notes, official source URLs and review state in one sitting. [The form source notes](form-template-review.md) identify each Library template and explain which reference applies. Generic forms have a place for the task-specific reference; no generic form mandate is invented.

## Source checking

Direct official eCFR HTML was fetched and read for the sections referenced by the new records, including the relevant paragraphs, scopes and exclusions. The versioner full-XML endpoints were unavailable, and individual section requests hit rate limits, so full official part/subpart HTML was used where available. A compact [source manifest](citation-source-manifest.json) records the sections, URLs, check date and hashes of the downloaded evidence. This is a text and applicability check, not a statement that a client's conditions satisfy a rule.

The construction carbon monoxide reference uses Table 1 of 1926.55 as shown by the current official text, rather than an outdated Appendix A label. Construction lighting references 1926.56. General industry lighting is not assigned a made-up numeric limit. Laser and ionizing radiation references are separated by scope. Broad material handling rules are not presented as automated-vehicle-specific rules. No single dust rule is claimed for all combustible dust. Guidance and general advice sheets say when no specific standard is cited. No unverified General Duty Clause citation is printed.

Wisconsin numbers remain limited to the approved heat mapping: two explicit environmental heat event categories in data/sir.json, January 2015 through November 2025. The sheet prints 39 reports and 39 hospitalized workers, with the limits of those counts. No employer names, cost estimates, premium claims or experience-mod claims are added. The other sheets carry no Wisconsin metrics.

## App behavior and verification

The same static browser architecture is retained. Hazard and form JSON load on demand into rr-hazards-v1, separately from the versioned app shell and rr-lib-v1. Open Handouts and Blank forms with signal once to save their content. Fonts and the existing jsPDF version are bundled locally. The original visit PDF renderer and its existing CDN reference are unchanged. VERSION in sw.js is bumped.

PDF files are prepared after a selection or client-field change. Create PDF then shares the ready file directly from the tap, preserving native user activation. Save PDF is the fallback. Client prefills use a URL fragment and are removed from the address on arrival. Opening handouts from a live visit flushes its pending draft save first; existing saved visit data is not migrated or modified.

Validation completed at 390 px in headless Chromium: all 50 hazard PDFs, all six form PDFs, a 50-page packet, title search, category counts, selection retained across filters, file-sharing handoff, offline forms and packet creation, visit setup prefills, no horizontal overflow and no page errors. Every application script, including inline scripts, passes node --check. PDF text is selectable and includes DRAFT, the starting-point statement and the unchanged DISCLAIMER wording. All hazard tile captions fit the printed layout. Form and hazard previews were inspected, including grayscale output.

The native iOS/Android share sheet still needs a physical phone check. The automated check verifies the File object handed to navigator.share, not the operating system's interface.

The disclaimer was preserved word for word as instructed. Its wording describes observed visit conditions even on generic handouts and blank forms. R&R should decide whether that inherited wording fits before release. It was not silently rewritten.

Stop at Phase 1, step G. Wait for the user's review before starting client status snapshots.
