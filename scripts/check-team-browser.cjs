const {chromium}=require('playwright'),assert=require('node:assert/strict');
// Synthetic network service only. Database authorization is tested separately in PostgreSQL.
const wait=async(p,fn)=>{for(let n=0;n<200;n++){if(await p.evaluate(fn))return;await p.waitForTimeout(50);}throw Error('Sync condition did not complete.');};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const org='11111111-1111-4111-8111-111111111111',user='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 const cloud=new Map(),photos=new Map();let sequence=0,loseReply=false;
 const contexts=[];
 async function device(){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});contexts.push(context);const device={context,offline:false};
  await context.route('**/api/team-config',route=>device.offline?route.abort():route.fulfill({json:{configured:true,url:'https://loss-control-test.supabase.co',key:'sb_publishable_synthetic'}}));
  await context.route('https://loss-control-test.supabase.co/**',async route=>{
   if(device.offline)return route.abort();const req=route.request(),url=new URL(req.url()),body=req.method()==='POST'&&req.headers()['content-type']?.includes('json')?req.postDataJSON():{};
   if(url.pathname.includes('/auth/v1/token'))return route.fulfill({json:{access_token:'synthetic-test-token',refresh_token:'synthetic-refresh',expires_at:Date.now()/1000+3600,user:{id:user,email:'rep@example.test'}}});
   if(url.pathname.includes('/lc_memberships'))return route.fulfill({json:[{organization_id:org,role:'admin',lc_organizations:{name:'Synthetic R&R team'}}]});
   if(url.pathname.includes('/storage/v1/object/')){
    const id=url.pathname.split('/').pop();if(req.method()==='POST'){if(photos.has(id))return route.fulfill({status:400,json:{message:'Asset already exists',error:'Duplicate'}});photos.set(id,req.postDataBuffer());return route.fulfill({json:{Key:id}});}
    if(!photos.has(id))return route.fulfill({status:404,json:{message:'Missing'}});return route.fulfill({body:photos.get(id),contentType:'image/png'});
   }
   if(url.pathname.endsWith('/lc_pull'))return route.fulfill({json:[...cloud.values()].filter(r=>r.change_sequence>body.after_sequence).sort((a,b)=>a.change_sequence-b.change_sequence).slice(0,body.page_size)});
   if(url.pathname.endsWith('/lc_push')){
    const results=body.operations.map(op=>{const key=op.kind+':'+op.record_id,old=cloud.get(key),same=old&&old.deleted===op.deleted&&(op.deleted||JSON.stringify(old.payload)===JSON.stringify(op.payload));
     if((old?.revision||0)!==op.expected_revision&&!same)return{status:'conflict',record:old};
     const record=same?old:{organization_id:org,kind:op.kind,record_id:op.record_id,payload:op.payload,deleted:op.deleted,revision:(old?.revision||0)+1,change_sequence:++sequence,updated_by:user,updated_at:new Date().toISOString()};cloud.set(key,record);return{status:'accepted',record};});
    if(loseReply){loseReply=false;return route.abort();}return route.fulfill({json:results});
   }
   return route.fulfill({json:{}});
  });
  device.page=await context.newPage();device.errors=[];device.page.on('pageerror',e=>device.errors.push(e.message));await device.page.goto('http://127.0.0.1:8888/team.html');await wait(device.page,async()=>!!(await TeamSync.info()).configured);
  await device.page.evaluate(async org=>{await TeamSync.signIn('rep@example.test','synthetic-password');await TeamSync.enable(org);},org);
  await device.page.goto('http://127.0.0.1:8888/index.html#walk');await wait(device.page,async()=>{const i=await TeamSync.info();return i.configured&&i.user;});return device;
 }
 const until=async(fn,p)=>{for(let n=0;n<30;n++){if(fn())return;await p.waitForTimeout(100);}assert(fn(),'The queued change did not reach the team.');};
 const sync=async p=>{await p.evaluate(()=>TeamSync.run());await wait(p,async()=>!(await TeamSync.info()).running);};
 try{
  const a=await device(),p=a.page;await sync(p);
  const image=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=8;c.height=8;c.getContext('2d').fillRect(0,0,8,8);return c.toDataURL('image/png');});
  await p.evaluate(async image=>{await Clients.transaction(s=>{s.clients.push({id:'client',displayName:'Synthetic Test LLC',normalizedName:'synthetic test',aliases:[],type:'Client'});s.visits.push({id:'visit',clientId:'client',company:'Synthetic Test LLC',location:'North',date:'2026-11-01',consultant:'Test Rep',sector:'mfg',modules:['machine'],checklistSnapshot:[{id:'machine',name:'Original section wording',items:[{id:'check',q:'Original question',look:'Original hint',std:'1910.212',rec:'Fit the guard'}]}],findings:[{id:'finding',title:'Guard press',sev:'High',owner:'Lee',due:'2026-11-10',photos:[image]}],status:['Open'],ok:[],unchecked:[],prior:{cites:[],severe:[]}});return s;});},image);
  await sync(p);assert(cloud.has('visit:visit'));assert.equal(photos.size,1);assert(cloud.get('visit:visit').payload.findings[0].photos[0].startsWith('rr-photo:'));
  const b=await device();await sync(b.page);assert.equal(await b.page.evaluate(async()=>{const s=await Clients.transaction();return s.visits[0].findings[0].photos[0];}),image);
  a.offline=true;await a.context.setOffline(true);await p.evaluate(()=>Clients.transaction(s=>{s.clients.find(c=>c.id==='client').notes='Offline phone edit';return s;}));await sync(p);assert.equal(await p.evaluate(async()=>(await Clients.transaction()).clients[0].notes),'Offline phone edit');
  await b.page.evaluate(()=>Clients.transaction(s=>{s.clients.find(c=>c.id==='client').phone='555-0100';return s;}));await sync(b.page);assert.equal(cloud.get('client:client').payload.phone,'555-0100');
  a.offline=false;await a.context.setOffline(false);await sync(p);let info=await p.evaluate(()=>TeamSync.info());assert(info.meta.conflicts['client:client']);assert.equal(await p.evaluate(async()=>(await Clients.transaction()).clients[0].notes),'Offline phone edit');
  await p.evaluate(()=>TeamSync.resolve('client:client','phone'));await sync(p);await until(()=>cloud.get('client:client').payload.notes==='Offline phone edit',p);assert.equal(cloud.get('client:client').payload.notes,'Offline phone edit');await sync(b.page);assert.equal(await b.page.evaluate(async()=>(await Clients.transaction()).clients[0].notes),'Offline phone edit');
  loseReply=true;await p.evaluate(()=>Clients.transaction(s=>{s.clients[0].notes='Response lost after commit';return s;}));await sync(p);const revision=cloud.get('client:client').revision;await sync(p);assert.equal(cloud.get('client:client').revision,revision);assert.equal((await p.evaluate(()=>TeamSync.info())).meta.outbox.length,0);
  await p.goto('http://127.0.0.1:8888/index.html#walk');await p.waitForFunction(()=>document.querySelector('#walk-history [data-v]'));await p.locator('#walk-history [data-v]').click();await p.locator('#h-repeat').click();await p.waitForFunction(()=>document.querySelector('[data-id="check"]'));
  const draft=await p.evaluate(async()=>(await TeamSync.read()).walk);assert.equal(draft.followup[0].owner,'Lee');assert.equal(draft.followup[0].sourceFindingId,'finding');assert.equal(draft.checklistSnapshot[0].name,'Original section wording');assert.deepEqual(draft.answers,{});
  await p.locator('[data-mod="machine"]>summary').click();await p.locator('[data-s="find"]').click();await p.locator('[data-f="note"]').first().fill('A fresh repeat-visit observation');await p.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await p.waitForTimeout(500);await sync(p);
  await p.evaluate(()=>navigator.serviceWorker.ready);a.offline=true;await a.context.setOffline(true);await p.reload();await p.waitForFunction(()=>typeof TeamSync!=='undefined');assert.equal(await p.evaluate(async()=>(await TeamSync.read()).walk.answers.check.note),'A fresh repeat-visit observation');
  a.offline=false;await a.context.setOffline(false);await sync(p);
  await p.goto('http://127.0.0.1:8888/content-review.html');await wait(p,async()=>!!(await TeamSync.info()).user);await p.evaluate(async()=>{await TeamSync.publish([{id:'team-machines',name:'Shared machines',sectors:['mfg'],items:[{id:'team-guard',q:'Shared question',std:'1910.212',rec:'Fit the guard'}]}],'1');});await sync(p);
  await p.evaluate(async()=>{const doc=(await(await fetch('hazards.json')).json())[0];await ContentReview.record(doc,'hazard','Synthetic lead','approved');});await sync(p);await b.page.goto('http://127.0.0.1:8888/handouts.html');await wait(b.page,async()=>!!(await TeamSync.info()).user);await sync(b.page);
  const reviewed=await b.page.evaluate(async()=>{const doc=(await(await fetch('hazards.json')).json())[0];await TeamSync.change(s=>{s._teamMeta.role='rep';return s;});const approved=(await ContentReview.apply([doc],'hazard'))[0],catalog=structuredClone((await TeamSync.read())['team-catalog']);await TeamSync.change(s=>{s['team-catalog'].contentReviews[0].reviewer='Unpublished edit';return s;});const changed=(await ContentReview.apply([doc],'hazard'))[0];await TeamSync.change(s=>{s['team-catalog']=catalog;s._teamMeta.role='admin';return s;});return{approved:approved.reviewed,changed:changed.reviewed,reviewer:approved.reviewMetadata.authenticatedReviewer};});assert.deepEqual(reviewed,{approved:true,changed:false,reviewer:user});
  await p.goto('http://127.0.0.1:8888/index.html#walk');assert.equal(await p.evaluate(async()=>(await TeamSync.read()).walk.checklistSnapshot[0].name),'Original section wording');
  const backup=await p.evaluate(()=>FieldTools.makeBackup());assert(!backup.records._teamMeta);assert(!JSON.stringify(backup).includes('synthetic-test-token'));assert(!JSON.stringify(backup).includes('synthetic-refresh'));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);for(const d of contexts)assert.deepEqual(d===a.context?a.errors:d===b.context?b.errors:[],[]);
  console.log('PASS: two devices, private content-addressed photo transfer, offline edits, explicit conflict resolution, lost-response retry without duplicate revisions, repeat checklist/owners/before photos, offline reload with notes, shared section/review release, authenticated reviewer, rejection of unpublished rep approvals, credential-free backup and 390 px layout.');
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
