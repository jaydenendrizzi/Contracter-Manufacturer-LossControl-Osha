/* Run with the app served at 127.0.0.1:8888 and Playwright installed. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review/phase1');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8888/handouts.html');await page.waitForFunction(()=>document.querySelectorAll('#hazard-list .pick').length===50);
  await page.evaluate(()=>navigator.serviceWorker.ready);
  assert.equal(await page.locator('#category option').count(),8);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const data=await page.evaluate(async()=>({hazards:await (await fetch('hazards.json')).json(),forms:await(await fetch('handout-forms.json')).json()}));
  assert.equal(data.hazards.length,50);assert.equal(new Set(data.hazards.map(h=>h.id)).size,50);assert.equal(data.forms.length,6);assert(data.hazards.every(h=>h.reviewed===false&&h.checks.length===5));
  const packIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'index.html'),'utf8').match(/const INDUSTRY_PACKS = (\[.*?\]);/s)[1]).map(p=>p.id));
  for(const h of data.hazards)for(const id of h.related_walkthrough_section_ids)assert(packIds.has(id),id);
  for(const [kind,docs] of [['hazard',data.hazards],['form',data.forms]]){
   for(const item of docs){
    const result=await page.evaluate(async({kind,item})=>{try{const pdf=await Handouts[kind==='form'?'buildForm':'build'](item,{client:'Example Client LLC',date:'2026-11-18',rep:'Example Rep',phone:'555-0100'});return {pages:pdf.getNumberOfPages(),uri:pdf.output('datauristring')};}catch(e){return {error:e.message};}},{kind,item});
    assert(!result.error,kind+' '+item.id+': '+result.error);assert.equal(result.pages,1);
    fs.writeFileSync(path.join(out,`${kind}-${item.id}-DRAFT.pdf`),Buffer.from(result.uri.split(',')[1],'base64'));
   }
  }
  const packet=await page.evaluate(async()=>{const hazards=await(await fetch('hazards.json')).json();const pdf=await Handouts.buildPacket(hazards,{date:'2026-11-18'});return {pages:pdf.getNumberOfPages(),uri:pdf.output('datauristring')};});
  assert.equal(packet.pages,50);fs.writeFileSync(path.join(out,'all-hazards-DRAFT.pdf'),Buffer.from(packet.uri.split(',')[1],'base64'));
  await page.locator('#search').fill('ladder');assert.equal(await page.locator('#hazard-list .pick').count(),1);
  await page.locator('#hazard-list input').check();await page.waitForFunction(()=>!document.querySelector('#create').disabled);
  await page.locator('#search').fill('');await page.locator('#category').selectOption('Ergonomic and human factors');assert.equal(await page.locator('#hazard-list .pick').count(),7);
  await page.locator('#hazard-list input').first().check();await page.waitForFunction(()=>!document.querySelector('#create').disabled);assert.match(await page.locator('#selection').innerText(),/2 hazard/);
  await page.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async({files})=>{window.sharedPDF={name:files[0].name,type:files[0].type,size:files[0].size};}});});
  await page.locator('#create').click();assert.deepEqual(await page.evaluate(()=>({name:sharedPDF.name,type:sharedPDF.type})),{name:'RR-hazard-packet-DRAFT.pdf',type:'application/pdf'});
  await page.locator('#show-forms').click();await page.waitForFunction(()=>document.querySelectorAll('#form-list input').length===6);await page.locator('#form-list input').first().check();await page.waitForFunction(()=>!document.querySelector('#create').disabled);
  await page.screenshot({path:path.join(out,'handouts-390.png'),fullPage:true});
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>document.querySelectorAll('#hazard-list .pick').length===50);await page.locator('#show-forms').click();await page.waitForFunction(()=>document.querySelectorAll('#form-list input').length===6);await page.locator('#form-list input').nth(3).check();await page.waitForFunction(()=>!document.querySelector('#create').disabled);
  await page.locator('#show-hazards').click();await page.locator('#hazard-list input').first().check();await page.locator('#hazard-list input').nth(1).check();await page.waitForFunction(()=>!document.querySelector('#create').disabled);
  const cachesNow=await page.evaluate(()=>caches.keys());assert(cachesNow.includes('rr-hazards-v1'));assert(cachesNow.includes('rr-lib-v1'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await context.setOffline(false);
  await page.goto('http://127.0.0.1:8888/index.html#walk');await page.locator('#w-company').fill('Visit Test LLC');await page.locator('#w-date').fill('2026-11-17');await page.locator('#w-consultant').fill('Visit Rep');
  await page.locator('#walk-handouts').click();await page.waitForURL('**/handouts.html');assert.equal(await page.locator('#client').inputValue(),'Visit Test LLC');assert.equal(await page.locator('#date').inputValue(),'2026-11-17');assert.equal(await page.locator('#rep').inputValue(),'Visit Rep');
  assert.deepEqual(errors,[]);console.log('PASS: 50 hazard PDFs, six forms, 50-page packet, seven categories, title search, selection, file sharing handoff, offline forms/packet, visit prefills, 390 px layout; no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
