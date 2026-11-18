const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const out=path.join(root,'review/samples');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8888/handouts-samples.html');await page.waitForFunction(()=>hazardSamples.length===3);await page.evaluate(()=>navigator.serviceWorker.ready);
 for(const id of ['9','2','32']){
  const result=await page.evaluate(async id=>{try{const d=await Handouts.build(hazardSamples.find(h=>h.id===id),{date:'2026-11-18'});return {data:d.output('datauristring'),pages:d.getNumberOfPages()};}catch(e){return {error:e.message,stack:e.stack};}},id);
  if(result.error)throw Error(JSON.stringify({id,...result}));
  fs.writeFileSync(path.join(out,`hazard-${id}-DRAFT.pdf`),Buffer.from(result.data.split(',')[1],'base64'));assert.equal(result.pages,1);console.log(id,result.pages,'page');
 }
 await page.locator('.sample button').first().click();await page.waitForFunction(()=>document.querySelector('#message').textContent.startsWith('DRAFT PDF ready'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);console.log('390 px overflow: none');await page.screenshot({path:path.join(out,'mobile-390.png'),fullPage:true});
 await page.reload();await page.waitForFunction(()=>hazardSamples.length===3);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>hazardSamples.length===3);await page.locator('.sample button').first().click();await page.waitForFunction(()=>document.querySelector('#message').textContent.startsWith('DRAFT PDF ready'));console.log('offline PDF PASS',await page.evaluate(()=>caches.keys()));assert.deepEqual(errors,[]);console.log('page errors',errors);await browser.close();
})();
