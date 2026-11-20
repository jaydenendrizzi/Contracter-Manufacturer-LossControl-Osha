/* Complete local backups, integrity checks and offline readiness. Credentials stay out of backups. */
'use strict';
const FieldTools=(()=>{
 const open=()=>new Promise((resolve,reject)=>{const q=indexedDB.open('rr-loss-control',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});
 const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 const hash=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(v))))).map(x=>x.toString(16).padStart(2,'0')).join('');
 async function readAll(){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv'),s=tx.objectStore('kv'),k=s.getAllKeys(),v=s.getAll();tx.oncomplete=()=>{db.close();resolve(Object.fromEntries(k.result.map((key,i)=>[key,v.result[i]])));};tx.onerror=()=>{db.close();reject(tx.error);};});}
 async function makeBackup(){const records=await readAll(),preferences={};for(const k of Object.keys(records))if(k.startsWith('_team'))delete records[k];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('rr-'))preferences[k]=localStorage.getItem(k);}const payload={format:'rr-loss-control-backup/1',exportedAt:new Date().toISOString(),records,preferences};return {...payload,checksum:await hash(payload)};}
 async function validateBackup(data){
  if(!data||data.format!=='rr-loss-control-backup/1'||!data.records||Array.isArray(data.records)||typeof data.records!=='object'||!data.preferences||typeof data.preferences!=='object')throw Error('Choose a complete R&R backup file.');
  if(Object.keys(data.records).some(k=>['__proto__','constructor','prototype'].includes(k)))throw Error('Invalid backup record key.');
  if(data.records.walk!==undefined&&data.records.walk!==null&&(typeof data.records.walk!=='object'||typeof data.records.walk.company!=='string'))throw Error('Invalid unfinished visit in backup.');
  if(data.records.contentReviews!==undefined&&!Array.isArray(data.records.contentReviews))throw Error('Invalid content review log.');
  const {checksum,...payload}=data;if(typeof checksum!=='string'||checksum!==await hash(payload))throw Error('The backup is incomplete or changed. Nothing was restored.');
  for(const k of ['visits','clients','visits_imported'])if(data.records[k]!==undefined&&!Array.isArray(data.records[k]))throw Error('Invalid '+k+' in backup.');
  for(const v of [...(data.records.visits||[]),...(data.records.visits_imported||[])])if(!v||typeof v.id!=='string'||!Array.isArray(v.findings)||typeof v.company!=='string')throw Error('A visit in this backup is invalid.');
  for(const c of data.records.clients||[])if(!c||typeof c.id!=='string'||typeof c.displayName!=='string')throw Error('A client in this backup is invalid.');
  for(const [k,v]of Object.entries(data.preferences))if(!k.startsWith('rr-')||typeof v!=='string')throw Error('Invalid settings in backup.');
  return {visits:(data.records.visits||[]).length,clients:(data.records.clients||[]).length,draft:!!data.records.walk,exportedAt:data.exportedAt};
 }
 function mergeRecords(current,incoming,checksum){
  const result=structuredClone(current),tag=checksum.slice(0,16),clientMap={},visitMap={},same=(a,b)=>canonical(a)===canonical(b);
  const sameRow=(a,b)=>same({...a,id:''},{...b,id:''});
  const putRow=(rows,source)=>{const base=source.id+'-restored-'+tag;let id=source.id,n=0;while(true){const existing=rows.find(x=>x.id===id);if(!existing){rows.push({...source,id});return id;}if(sameRow(existing,source))return id;id=base+(n?'-'+n:'');n++;}};
  const clients=result.clients||=[];for(const source of incoming.clients||[])clientMap[source.id]=putRow(clients,structuredClone(source));
  const visits=result.visits||=[],sources=new Map((incoming.visits||[]).map(v=>[v.id,v])),active=new Set();
  const visit=id=>{if(visitMap[id])return visitMap[id];if(active.has(id))throw Error('The backup has a circular follow-up link. Nothing was restored.');active.add(id);const row=structuredClone(sources.get(id));if(clientMap[row.clientId])row.clientId=clientMap[row.clientId];if(sources.has(row.followupVisitId))row.followupVisitId=visit(row.followupVisitId);visitMap[id]=putRow(visits,row);active.delete(id);return visitMap[id];};
  for(const id of sources.keys())visit(id);
  const imported=result.visits_imported||=[];for(const source of incoming.visits_imported||[])putRow(imported,structuredClone(source));
  if(incoming.contentReviews){const all=[...(current.contentReviews||[]),...incoming.contentReviews],unique=new Map(all.map(entry=>[canonical(entry),entry]));result.contentReviews=[...unique.values()].sort((a,b)=>String(a.reviewedAt||'').localeCompare(String(b.reviewedAt||''))||(a.decision==='draft'?1:-1));}
  for(const [key,value]of Object.entries(incoming)){
    if(key.startsWith('_team'))continue;
    if(['visits','clients','visits_imported','contentReviews'].includes(key))continue;
    let row=structuredClone(value);if(key==='walk'&&row){if(clientMap[row.clientId])row.clientId=clientMap[row.clientId];if(visitMap[row.followupVisitId])row.followupVisitId=visitMap[row.followupVisitId];}
    if(!(key in result)||result[key]===null)result[key]=row;
    else if(!same(result[key],row)){let restoredKey='restored-'+tag+'-'+key,n=1;while(restoredKey in result&&!same(result[restoredKey],row))restoredKey='restored-'+tag+'-'+n+++'-'+key;result[restoredKey]=row;}
  }
  return result;
 }
 async function restore(data){await validateBackup(data);const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite'),s=tx.objectStore('kv'),keys=s.getAllKeys(),values=s.getAll();let ready=0;
  const apply=()=>{if(++ready!==2)return;try{const current=Object.fromEntries(keys.result.map((k,i)=>[k,values.result[i]])),merged=mergeRecords(current,data.records,data.checksum);for(const [k,v]of Object.entries(merged))s.put(v,k);s.put({preferences:data.preferences,restoredAt:new Date().toISOString()},'restore-settings-'+data.checksum.slice(0,16));}catch(e){reject(e);tx.abort();}};
  keys.onsuccess=apply;values.onsuccess=apply;tx.oncomplete=()=>{db.close();let settingsSaved=true;for(const [k,v]of Object.entries(data.preferences))try{if(localStorage.getItem(k)===null)localStorage.setItem(k,v);}catch{settingsSaved=false;}document.dispatchEvent(new Event('rr-local-change'));resolve({settingsSaved});};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||Error('Restore did not finish. Existing data was kept.'));};});}
 async function readiness(){const keys='caches'in window?await caches.keys():[],cache=keys.filter(k=>k.startsWith('rr-lc-')).at(-1);const shell=cache?await caches.open(cache):null,has=async p=>!!(shell&&await shell.match(p));const hc=keys.includes('rr-hazards-v1')?await caches.open('rr-hazards-v1'):null;const library=keys.includes('rr-lib-v1')?await caches.open('rr-lib-v1'):null;const packs=library?(await library.keys()).filter(r=>/\/lib-p-/.test(new URL(r.url).pathname)).length:0;return {shell:(await Promise.all(['/index.html','/clients.js','/field-tools.js'].map(has))).every(Boolean),pdf:(await Promise.all(['/rr-logo.png','/content-review.js','/field-tools.js','/handouts-ui.js'].map(has))).every(Boolean)&&await has('/vendor/jspdf.umd.min.js')&&await has('/handouts.js')&&(await Promise.all([400,700,800].map(w=>has('/fonts/overpass-'+w+'.ttf')))).every(Boolean),hazards:!!(hc&&await hc.match('/hazards.json')),forms:!!(hc&&await hc.match('/handout-forms.json')),packs};}
 async function storageHealth(){
  const db=await open(),key='_phone-check-'+crypto.randomUUID(),value='x'.repeat(32768);
  try{await new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite'),s=tx.objectStore('kv');s.put(value,key);const q=s.get(key);q.onsuccess=()=>{if(q.result!==value){tx.abort();return;}s.delete(key);};tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(tx.error||Error('Phone storage test failed.'));});}finally{db.close();}
  const estimate=await navigator.storage?.estimate?.(),persistent=await navigator.storage?.persist?.();
  return {write:true,available:estimate?.quota?Math.max(0,estimate.quota-(estimate.usage||0)):null,persistent:!!persistent};
 }
 const download=(value,name)=>{const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);};
 return {open,canonical,hash,readAll,makeBackup,validateBackup,mergeRecords,restore,readiness,storageHealth,download};
})();
if(typeof module!=='undefined')module.exports=FieldTools;
