# Phases 2 and 3 review

Both phases are implemented under the user's instruction to finish them together. The existing visit PDF renderer is unchanged. Snapshot wording stays DRAFT unless snapshotReviewed is explicitly true in the client data. Renames, merges, new visits and finding edits invalidate review. No UI bypass was added.

## Client records

Clients come from saved and active visits. Records hold displayName, normalizedName, aliases, primaryContactName, email, phone, type, notes, an empty unused externalId, and the snapshot review flag. No externalId UI, AMS connection, CSV import or external directory was built.

Exact normalized names/aliases attach visits automatically. Normalization ignores case, punctuation, the article and common company suffixes, including L.L.C. Similar names get a hint. Existing client records never auto-merge. Rename preserves the old name. Within a client, choose another client and tap Merge selected client. All visits and the active draft move to the survivor; old names become aliases. Conflicting contact information is kept in notes.

The visit setup lets the rep choose Client or Prospect, default Prospect. Known names prefill their type; an explicit rep choice wins over an asynchronous lookup. Optional contacts and notes are edited in Clients.

The migration is idempotent and writes clients and visit links atomically in the existing rr-loss-control IndexedDB kv store. client-migration-backup-v1 retains the original visits and draft. Existing finding objects, photos, statuses and notes are preserved. The 25-visit archive cap is removed. Data removed by earlier versions cannot be recovered from the phone.

Client JSON export/import uses rr-loss-control-clients/1. Import validates and merges names/aliases, fills missing contact fields and preserves notes. Ambiguous matches stop the transaction for manual correction. Import never replaces saved visits. This client-list file is separate from visit/photo backups.

## Snapshot

History is grouped by client, overdue groups first, with counts and snapshot links. The two-page PDF uses all saved client visits and locations, the approved font/colors, summary metrics, section bars, top three High items, stats, open/closed tables, coming-due items, CTA and the unchanged disclaimer.

Done is closed; Client declined remains unresolved. Overdue means due before the as-of date. Close rate is Done findings / all findings. Closed since last visit uses known dates from the latest visit date through the as-of date, inclusive. Median days to close excludes unknown or invalid dates. A uniquely matched Fixed follow-up closes its source item but records a confirmation date rather than inventing an actual close date. Ambiguous legacy follow-ups do not silently close another finding. Carried-forward recommendations are not counted as new findings.

To remain two readable letter pages, the PDF shows up to eight section tiles, nine open rows, nine closed rows and three coming-due examples, with explicit showing-counts. Totals include every record. Download snapshot data provides all items and sections. The footnote says this is a starting point for the client's own program and a saved-record snapshot rather than a new site visit.

## Validation and review files

check-clients.cjs passes normalization, old-record migration, idempotency, photo/status/note preservation, aliases, merge, import, metrics, follow-up confirmation and 40 retained visits.

check-clients-browser.cjs passes at 390 px in headless Chromium. It seeds real IndexedDB with 30 old-format visits and photos, migrates, groups, renders the two-page snapshot, renames, merges, imports without replacing visits, creates a snapshot offline, matches a new visit through an old alias, preserves the rep's Client choice and saves the 32nd visit without dropping older visits. No overflow or page errors. The Phase 1 handout regression suite also passes. All scripts pass node --check.

Review the `phase2-3/client-status-DRAFT.pdf` (snapshot PDF, generated locally), `phase2-3/client-status-1.png` (page 1, generated locally), `phase2-3/client-status-2.png` (page 2, generated locally), and `phase2-3/clients-390.png` (390 px Clients screen, generated locally). These contain fixture data.

Native iOS/Android sharing still needs a physical phone check. Everything remains local and offline-capable. No server, new dependency, external messaging or deployment was added. sw.js VERSION is bumped; hazard and library caches remain preserved.
