# Field workflow implementation and audit

Date: November 18, 2026. All examples and screenshots use synthetic fixture data. This work is for R&R Loss Control reps. No submissions, carrier packages, placement workflow, new server or application dependency was added.

## Delivered

1. Four next actions appear above the research views: Start visit, Resume visit, Create handout, and Follow up on overdue items. A complete-backup button is available there too. Starting another visit keeps the current draft until the existing replacement confirmation. Resume uses the saved draft.
2. A single complete JSON backup contains all IndexedDB work, clients, visits, findings, original and completion photos, the active draft, imported visit data, review history, migration backups and R&R checklist/settings preferences. A SHA-256 integrity check runs before restore. The restore screen previews counts and requires the explicit Restore button. Existing records stay; conflicting records are copied and their client/follow-up links remapped. Repeated restore does not create duplicate copies. A backup can also recover the old copy after a later edit. Conflicting unfinished visits have a Resume restored visit button. Existing local settings win; imported conflicting settings are retained in the restored data. Downloadable Library packs are not user work and are saved separately.
3. Saved findings have one completion form for date, short client update and an optional photo. These commit together. Dates outside the visit-through-today interval are rejected. Completion history is preserved. Snapshot data and closed rows include the update and photo indication. The original visit report PDF renderer is unchanged; the existing numbers-only team export continues to strip both original and completion photos.
4. Save status is shown only after a successful database write. Storage failure says the work is only in memory, and the top backup action can include the in-memory draft or current visit edits. Offline status checks actual cached app files, PDF tools/fonts, handout/form data and Library pack counts. Backup tools can save the handouts/forms explicitly for offline use.
5. Clients offers the original two-page summary or a full open-items PDF. The full list paginates all items and details rather than truncating them. A generation counter prevents an older PDF build from becoming shareable after the format or client changes.
6. Content review is a separate lead-tools page, outside the ordinary rep flow. Reviewers can prepare the actual DRAFT PDF, inspect source wording, record their name and approval/draft decision, and export the audit log. Each record includes UTC time, wording version, data hash and PDF-template hash. Changed document wording or rendering-template wording invalidates the approval. Newer revocations win over older approvals during restore. The default content remains DRAFT. This is an offline local review record, not authenticated identity or tamper-proof authorization.

## Audit fixes

- Restores validate the format and integrity before opening a write transaction; quota/transaction failure leaves existing records intact.
- Client, visit and follow-up IDs are remapped together when conflicting copies are retained.
- Old approvals cannot override newer revocations merely by appearing later in an imported backup.
- All authoring and rendered-template text participates in approval validity. Merely changing a reviewed checkbox does not supply a reviewer/version record in the normal handout UI.
- Pending status/owner edits and completion saves use serialized writes to avoid whole-visit stale overwrites.
- An export can recover in-memory edits after an unsuccessful save. The UI does not report a failed save as saved.
- Legacy checklist settings missing a sectors array receive a safe default rather than crashing Walkthrough.
- An explicit global hidden rule prevents layout CSS from displaying the visit setup form behind a saved visit.
- New HTML does not place client text into executable markup. No email or external message was sent.

## Verification

Run with a loopback server on port 8888, Playwright and Chromium available:

```
node scripts/check-syntax.cjs
node scripts/check-backup.cjs
node scripts/check-clients.cjs
node scripts/check-field-workflow.cjs
node scripts/check-clients-browser.cjs
node scripts/check-handouts.cjs
node scripts/check-handout-samples.cjs
```

The workflow browser suite uses touch-enabled Chromium at 390 px and a separate empty browser context for the phone-swap scenario. It verifies photos, drafts, settings, repeated restore, conflicting copies, changed-file rejection, transaction rollback after simulated full storage, completion date/update/photo, in-memory recovery export after a failed write, a 60-item full PDF including its final item, review identity/date/version, data/template invalidation, review-aware PDF filenames, format-change races, actual offline cache readiness and offline reload. It asserts no page errors or horizontal overflow.

The prior suites verify all 50 one-page hazard PDFs, six forms, a 50-page packet, client migration from 30 old-format visits with photos, merges, aliases, imports, visit retention and offline operation. Every script, including extracted inline scripts, is checked with node --check. GitHub CI runs the dependency-free syntax and client/backup data checks.

Review artifacts: `workflow/next-actions-390.png` (next actions and saved completion, generated locally), `workflow/full-open-items-DRAFT.pdf` (full open-items PDF, generated locally), and the earlier `phase2-3/client-status-DRAFT.pdf` (snapshot example, generated locally). Browser tests regenerate these from fixtures. Recovery JSON generated by tests is ignored by git.

## Remaining physical-device review

No physical iPhone or Android is available in this environment. Mobile Chromium emulation does not verify Safari, a real camera, native share sheets, OS file handling or realistic phone storage pressure. Follow [PHONE-CHECKS.md](PHONE-CHECKS.md) before production release. No physical-device test is claimed as passed.

The checksum detects accidental changes; it is not encryption or proof of source. Keep backup files in a location appropriate for client records and photos. Approval controls remain local and separate from rep controls; R&R still needs to review actual wording, citations and the inherited disclaimer. Nothing has been merged or deployed automatically.

## Publication scope

Automatic approval review rejected publishing a client-named sample snapshot as potentially sensitive data, despite its fixture origin. Generated PDFs, screenshots and recovery JSON are therefore excluded from the PR. They remain available in the local workspace and are regenerated by the browser test scripts. No rejected sample payload is referenced by the published Git tree. Source code, data templates, tests and audit notes are included.
