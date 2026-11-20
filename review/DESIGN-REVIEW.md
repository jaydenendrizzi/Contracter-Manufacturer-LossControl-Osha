# Shared R&R website design

November 19, 2026. Visual update to the Loss Control application.

## Design sources

- FleetReportCard at `1287beb85b641aa6de6ca6ab50e18a7cc8820abc`: `styles/tokens.css`, `styles/shell.css` and the report card styles.
- Farm Intelligence at `607c2fb2cdbd51d1755b8dbedc947e52d89fe613`: `src/tokens.css` and `src/styles.css`.
- Both reference token files are identical. This update uses their Overpass type, sidebar `#17393B`, primary `#1F4244`, tan `#B8A77F`, background `#F3F4F1`, white surfaces and border `#DDE1DC`.
- Only the existing `rr-logo.png` artwork is used. The main page's embedded version is byte-for-byte identical to that file and is retained for the visit PDF. The added 500/600 Overpass WOFF2 weights come from Fontsource's Overpass distribution; the existing font license is in `fonts/OFL.txt`.

## Changes

Shared sidebar and top bar across the main application, Handouts, Clients, Backup and content review. Workspace links appear first, research links below, and backup tools at the bottom. Lead review stays outside the normal rep navigation. Active links and breadcrumb titles follow the existing hash routes.

Screen-only styling aligns type sizes, spacing, card borders, forms, buttons and tables. The original report/PDF renderers, disclaimer text, hazard wording, data and storage schemas are unchanged. The main page now loads the already-bundled jsPDF file instead of the CDN copy. All five font weights and both shell assets are cached in the bumped service worker version. Library and hazard cache names are unchanged.

## Verification

- `node scripts/check-syntax.cjs`: all 36 scripts, including inline scripts, pass `node --check`; handout JSON parses.
- `node scripts/check-site-shell.cjs`: desktop and 390 px layouts; all six main views and four tool pages; active navigation; keyboard focus/trap; Escape and backdrop closing; skip link preserves the current view; original visit-PDF logo; shell hidden for print; cached fonts/shell and offline page loading. No page errors or horizontal overflow in checked layouts.
- `node scripts/check-field-workflow.cjs`: backup/restore with photos, conflicting edits, completion records, full open-items PDF, wording review and offline workflows pass.
- `node scripts/check-handouts.cjs`: 50 sheets, six forms, 50-page packet, categories, search, share handoff, prefills and offline PDF generation pass.
- `node scripts/check-clients-browser.cjs`: legacy visits, grouping, snapshots, rename/merge, import, follow-ups and offline behavior pass.
- `node scripts/check-backup.cjs` and `node scripts/check-clients.cjs`: data preservation and migration checks pass.
- `git diff --check`: passes.

Generated screenshots are local in `review/design/`. No client-named PDFs or screenshots are committed. These are headless Chromium checks, not physical iPhone or Android testing. Existing physical-phone checks in `PHONE-CHECKS.md` still apply.

FleetReportCard, Farm Intelligence and production deployment settings were not modified.

## Logo and citation follow-up

The user's silica PDF showed a duplicate citation pill at the bottom edge of the top banner. Removed that pill from all hazard sheets and packet pages. References now sit below the CTA with sources, caveats and the unchanged disclaimer. The footer is measured before rendering, and the CTA reserves enough room for wrapped general-industry/construction references and review metadata. Blank-form references and snapshot sources were already at the bottom and remain there.

The logo now occupies a full-width white masthead with a tan rule and a Loss Control label, rather than a small rounded image tile. The mobile top bar also displays the official logo. The original artwork and embedded visit-report image are preserved.

Validation: all 50 hazard sheets, six forms and the 50-page packet render successfully; the PDF-coordinate check finds 223 citation/source markers in the bottom area across the 56 sheets/forms and no text outside printable bounds. The shell checks verify the edge-to-edge masthead, transparent logo container and mobile branding in addition to their prior coverage. The field-workflow suite passes, including snapshot/full-list PDFs and template-review invalidation. All 37 scripts pass syntax checks. These changes bump the service worker to `rr-lc-2026-11-19-brand-footer-v2`.
