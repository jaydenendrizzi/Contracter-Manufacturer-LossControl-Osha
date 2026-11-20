# Internal team storage and repeat visits

## What is implemented

- Dedicated-project Supabase migration: organizations, staff memberships, record revisions, deletion markers, immutable change history and a private photo bucket. Server-side membership and owner policies protect team data and unfinished visits. Only leads publish shared sections/reviews. Ordinary browser writes to record tables are denied; sync uses revision-checked RPCs.
- Staff sign-in, invitation/reset handling, public configuration endpoint and a Team workspace screen. No service-role key or application runtime dependency is introduced. Authentication is excluded from complete backups.
- Local-first synchronization of clients, completed visits, findings/photos and private unfinished visits. Local records plus persisted baselines form the durable queue. Photos are hashed, uploaded separately and verified before use. Metadata cannot reference an object that has not uploaded. Shared and private draft-photo paths have separate read scopes.
- Reconnection/focus/visible-page polling and explicit Sync now. Partial requests leave local records intact. Lost responses can retry identical records without duplicate revisions. A conflicting edit or deletion keeps both versions for an explicit phone/team choice, with retained resolution copies. Open editors are protected from remote replacement.
- Repeat full checklist retains client/location, original checklist snapshot, source finding IDs, owners, due dates and before photos. Answers start fresh. Follow-up-only visits omit the full checklist. New comparison photos stay with the follow-up record. New visits freeze the section wording and its digest/version. Stable finding IDs disambiguate repeated titles. Unresolved recommendations continue through successive follow-ups, and a full repeat finds the original full checklist when the last visit was follow-up-only.
- Lead-controlled section versions and shared wording-review records. Personal sections remain available. A linked rep cannot publish a catalog or shared approval. Existing handout fingerprints still return changed content to DRAFT.
- Draft revision checks across tabs, recovery copies when starting another unfinished visit, page-hide save attempts, quota-failure reporting, in-memory backup rescue and a phone-storage probe. Existing client migration and complete backup behavior are retained. The visit PDF renderer is unchanged.

## Verification actually run

- Syntax checker: all 46 scripts pass, including extracted inline scripts.
- Pure record tests: concurrent edits/deletes, explicit resolutions, retained copies, edits during upload, open-editor protection and repeat metadata.
- Actual migration in isolated PostgreSQL/PGlite: organization isolation, private draft and photo access, lead-only writes, direct-write denial, immutable objects, idempotent retries, stale revisions, transaction rollback, history and deletion markers. Auth/Storage platform tables are stubbed; this is not a hosted Supabase certification.
- Two-device Chromium integration with a synthetic network service: photo upload/download, offline edits, conflict choice, lost response, duplicate-object response, repeated checklist, old owners/photos, offline reload, shared section/review release, authenticated reviewer ID, rejection of unpublished rep approvals and credential-free backup.
- Storage-failure Chromium test: injected quota failure, unchanged durable record, honest unsaved status, backup of in-memory changes, retry after storage recovery, simultaneous-tab protection, preserved alternate draft and storage probe.
- Existing field-workflow, client browser and shared-shell suites: photos/backups, restore conflicts, client grouping/merges, snapshots/full-item PDF, review invalidation, cached files and 390 px layouts pass. Existing client/backup data tests also pass, including matching a follow-up by finding ID when titles repeat.
- `git diff --check` passes. CI includes the new core/configuration/database/browser checks.

## What remains outside this workspace

The user confirmed there is no Supabase project yet. No cloud project, staff account, membership, production environment variable, cloud backup policy or hosted database migration has been provisioned. Follow `supabase/SETUP.md` in a new dedicated Loss Control project. Until then, the preview correctly offers local use and reports team storage as unconfigured.

No physical iPhone/Android device was available. The phone tests are synthetic Chromium tests with a 390 px touch viewport. Actual camera, OS termination/eviction, Safari/Home Screen behavior, realistic photo-volume limits and native sharing require the acceptance checks in `PHONE-CHECKS.md` before staff rollout.

Cached local work remains on a signed-out phone; device screen-lock protection is required. This release does not add offline encryption, MFA/SSO UI, client access, billing, client notifications or a manager dashboard. A browser session may need staff sign-in again after termination before queued work can reach the team. Database and private object-file recovery must be tested in the hosted account; database backups alone do not contain photo bytes.

FleetReportCard and Farm Intelligence were not modified. The feature branch builds on the separate visual-design PR.
