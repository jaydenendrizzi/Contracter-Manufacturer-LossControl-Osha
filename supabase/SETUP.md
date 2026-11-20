# Connect the internal R&R team

The application and migration are ready to configure. A Supabase project has not been created or connected during development. Until configured, the application continues to save locally and says that team storage is unavailable.

## Create the dedicated project

1. Create a new Supabase project for Loss Control in R&R's account. Choose the region and plan R&R wants. Keep it separate from FleetReportCard and Farm Intelligence.
2. In the project's SQL editor, run `migrations/202611200001_internal_team.sql` once. It creates organization/member tables, versioned records, history, sync functions and the private `lc-photos` bucket. The migration is transactional; a failure rolls it back.
3. In Authentication, disable public sign-ups. Set the Site URL to the Loss Control site's URL. Add the exact production URL and any intentional review URL ending in `/team.html` to allowed redirect URLs. Do not allow arbitrary Netlify domains.
4. Create/invite the R&R staff accounts in Authentication. The app accepts invited account links and supports setting/changing a password. Choose the project's password policy and MFA/account requirements before inviting the team. Configure the Auth email sender for real staff delivery; development email limits are not a rollout plan.
5. Create the R&R organization and memberships using the SQL below, replacing the email addresses with the invited staff emails. Only a trusted database administrator creates or changes membership. Staff cannot join a team from the browser.

```sql
insert into public.lc_organizations(name) values ('R&R Loss Control') returning id;

-- Replace ORGANIZATION_UUID and the invited account email before running.
insert into public.lc_memberships(organization_id,user_id,role)
select 'ORGANIZATION_UUID'::uuid,id,'admin'
from auth.users where email='lead@example.com';

insert into public.lc_memberships(organization_id,user_id,role)
select 'ORGANIZATION_UUID'::uuid,id,'rep'
from auth.users where email='rep@example.com';

-- Confirm each intended account has a membership. An unmatched email inserts zero rows.
select m.organization_id,u.email,m.role
from public.lc_memberships m join auth.users u on u.id=m.user_id;
```

## Connect Netlify

Set these environment variables on the Loss Control site and redeploy:

| Variable | Value |
|---|---|
| `LC_SUPABASE_URL` | The dedicated project's HTTPS URL, such as `https://PROJECT.supabase.co` |
| `LC_SUPABASE_PUBLISHABLE_KEY` | Its publishable key, or legacy public `anon` key |

No service-role key is needed. Do not put a secret/service-role key in these values. The configuration function rejects secret keys. The browser uses the signed-in user's access token; database and photo policies enforce access. Tokens are kept in session storage and excluded from complete backups.

## Start sharing

Open **Team workspace**, sign in, choose the R&R workspace and tap **Start sharing this phone**. That explicit action includes the clients, saved visits, unfinished visits and photos already on the phone. Existing visits keep their IDs and formats. A second device signs in with its own staff account to receive shared clients/visits, or the same account to also receive that rep's unfinished visits.

The browser saves locally before uploading. Completed visits/photos are shared with organization members. Unfinished visits and their uploaded photos are scoped to their rep. If the browser terminates the session, cached work remains available offline; staff sign in again to resume network sync. Cached work is readable on the device, so use the device screen lock. Sign-out does not erase unsynced work or encrypt the local database.

Conflicting edits are kept for review. **Use phone version** queues that version against the latest server revision. **Use team version** adopts the team copy. Both versions are retained locally in resolution history and in backups. Server revision history retains accepted changes and deletion markers. Private photo objects are immutable; unused uploads are retained until an administrator applies an agreed retention process.

## Consistent records

Lead accounts publish reviewed, versioned checklist sections from an R&R template export or the local template builder. A changed question/recommendation needs a new section version. New visits freeze the actual checklist wording in their saved record; repeat visits reuse that snapshot and begin with fresh answers. Owners, due dates, finding IDs and before photos carry forward without guessing a completion date.

When a phone is linked, shared handout wording approvals come from the lead-controlled catalog. Lead review records carry the authenticated reviewer ID. Changed document/template fingerprints return approvals to DRAFT. Publishing a team catalog does not change existing visit wording or the visit PDF renderer.

## Rollout and recovery

Before using real records, verify two actual staff accounts plus a nonmember in the hosted project. Confirm member reads, denied cross-team access, private drafts/photos, rejected direct record writes and rejected rep catalog publishing. Test with synthetic records first.

Run a real iPhone Safari/Home Screen and Android Chrome test: capture a photo, turn on airplane mode, edit and close/reopen the app, restore signal, confirm team sync on another device, make simultaneous edits and resolve them, then verify the actual phone share sheet. Headless mobile tests cannot certify the camera, OS termination behavior or share sheet on a physical device.

Keep complete per-device backups during rollout. They contain photos and edits but omit authentication and sync baselines. Restore never reconnects another phone's session. For team disaster recovery, arrange database backups **and** private object-file backups in R&R's account, then test restoration into a separate project. Database backups alone do not include photo bytes. Choose the provider backup/PITR plan and retention R&R needs; no hosted backup policy has been provisioned here.

## Verification commands

With the local server running on port 8888:

```sh
node scripts/check-syntax.cjs
node scripts/check-team-records.cjs
node scripts/check-team-browser.cjs
node scripts/check-phone-reliability.cjs
node scripts/check-field-workflow.cjs
node scripts/check-clients-browser.cjs
node scripts/check-site-shell.cjs
```

The database suite runs the actual migration in PostgreSQL via PGlite, using stub Auth/Storage platform tables and synthetic identities. Install PGlite in a test-only directory, then set its module path:

```sh
npm install --prefix /tmp/rr-team-tests @electric-sql/pglite@0.3.15 --no-audit --no-fund
PGLITE_PATH=/tmp/rr-team-tests/node_modules/@electric-sql/pglite node scripts/check-team-database.cjs
```

No runtime dependency is added to the application. The browser integration suite uses a synthetic network service; it does not claim a configured hosted Supabase project.
