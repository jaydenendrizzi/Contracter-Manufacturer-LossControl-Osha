# Physical phone checks still required

No physical iOS or Android device is available in this workspace. Chromium with touch enabled at 390 px was tested. That does not verify the native share sheet, real camera, Safari, OS downloads, installation or storage pressure on a phone.

Run these checks on a test phone with synthetic client data before production release. Record device, OS, browser version, tester, date and result here. Test both Safari on iPhone and Chrome on Android if the team uses both.

- [ ] Install or open the app, then start a visit. Check Start, Resume, Handouts and Overdue actions.
- [ ] Take a real photo, add a finding and wait for the saved confirmation. Close and reopen the app, then resume it.
- [ ] Export a complete backup, find the downloaded JSON in Files/Downloads, and copy it to the other test phone.
- [ ] Restore the backup on the other phone. Check contacts, notes, findings, original photos, completion photos, dates and unfinished visit.
- [ ] Restore on a phone with existing data. Check both conflicting copies and the restored-draft Resume button. Existing work must remain.
- [ ] Record a completion date, client update and camera photo. Reopen the visit and check all three together.
- [ ] Save handouts/forms and a Library pack, enable airplane mode, relaunch, create a PDF and inspect the readiness messages.
- [ ] Create a hazard packet, summary snapshot and full open-items list. Use the native share sheet; cancel once, then share or save again. Check that every page is present and legible.
- [ ] Open the lead review page, inspect a DRAFT PDF, record a test approval, then generate that exact handout. Check reviewer/date/version. Revoke the test approval afterward.
- [ ] Test a realistic backup with the number and size of photos a rep keeps. Confirm the phone can export, transfer and restore it without closing the browser.

Do not use the synthetic approval as a real R&R wording approval. Real document wording, the inherited disclaimer and citations still need R&R review.

## Internal team rollout

These physical-device checks remain unrun. Synthetic Chromium tests cover two-device sync, network interruption, storage failures and tab conflicts; they do not substitute for this list.

- [ ] Create/configure the dedicated project, invite two test staff accounts and verify a nonmember cannot read records or photos.
- [ ] On iPhone Safari and the Home Screen app, sign in, start sharing, take a photo, then enable airplane mode and edit a visit. Force-close and reopen before reconnecting. Confirm the saved notes/photo and sign-in/sync messages.
- [ ] On Android Chrome, receive that completed visit. Compare actual image detail and confirm the other rep's unfinished visit and private photos are unavailable.
- [ ] Edit one client on both devices while one is offline. Reconnect, inspect both conflict versions, choose one and confirm the selected version reaches both devices.
- [ ] Repeat a full visit. Check the old checklist wording, fresh answers, owners, due dates, before photos and newly captured comparison photos. Verify the original visit is unchanged.
- [ ] Run **Backup > Check phone storage**. Exercise a realistically large photo set, device storage pressure, backup download and restore on the other phone.
- [ ] Publish a reviewed section version as a lead. Receive it as a rep; verify that an existing visit keeps its previous wording and a new visit uses the shared version.
- [ ] Let a sign-in session expire while offline. Confirm local capture continues, then sign in to the same workspace and finish syncing. Try switching accounts with queued work and confirm the workspace guard.
- [ ] In a separate test project, restore both a database backup and the private photo objects. Confirm a fresh phone can receive complete visits and readable photos.
