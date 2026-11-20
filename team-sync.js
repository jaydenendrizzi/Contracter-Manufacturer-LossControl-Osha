'use strict';
// Local records are the durable queue. Baselines and conflicts live in IndexedDB, not memory.
const TeamSync=(()=>{
 let config=null,session=null,running=false,job=null,timer,retryTimer,protectedKeys=[],editGeneration=0,status='Local work is saved on this phone. Team storage is not connected.';
 const emit=message=>{if(message)status=message;document.dispatchEvent(new CustomEvent('rr-team-status',{detail:{message:status,running}}));};
 const open=()=>new Promise((resolve,reject)=>{const q=indexedDB.open('rr-loss-control',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});
 async function read(){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv'),s=tx.objectStore('kv'),k=s.getAllKeys(),v=s.getAll();tx.oncomplete=()=>{db.close();resolve(Object.fromEntries(k.result.map((key,i)=>[key,v.result[i]])));};tx.onerror=()=>{db.close();reject(tx.error);};});}
 async function change(fn){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite'),s=tx.objectStore('kv'),keys=s.getAllKeys(),values=s.getAll();let ready=0,out;
  const apply=()=>{if(++ready!==2)return;try{const before=Object.fromEntries(keys.result.map((k,i)=>[k,values.result[i]]));out=fn(before);if(!out)throw Error('Local records changed. Sync will retry.');for(const k of keys.result)if(!(k in out))s.delete(k);for(const [k,v]of Object.entries(out))s.put(v,k);}catch(e){reject(e);tx.abort();}};
  keys.onsuccess=apply;values.onsuccess=apply;tx.oncomplete=()=>{db.close();resolve(out);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||Error('Local records changed. Sync will retry.'));};});}
 const canonical=TeamRecords.canonical;
 const digest=async value=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value))));
 const hex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
 async function hashes(state){return Object.fromEntries(await Promise.all(Object.entries(TeamRecords.rows(state)).map(async([k,v])=>[k,await digest(v.payload)])));}
 const metaFor=state=>state._teamMeta;
 function setSession(value){if(value&&!Number.isFinite(value.expires_at))value={...value,expires_at:Date.now()/1000+Number(value.expires_in||3600)};session=value;try{if(value)sessionStorage.setItem('lc-team-session',JSON.stringify({...value,project:config.url}));else sessionStorage.removeItem('lc-team-session');}catch{}emit();}
 async function request(path,options={},auth=true,retry=true){
  if(!config?.configured)throw Error('Team storage is not configured yet.');
  if(auth&&!session)throw Error('Sign in to send or receive team records. Your local work is kept.');
  if(auth&&session.expires_at<Date.now()/1000+60)await refresh();
  let r;try{r=await fetch(config.url+path,{...options,headers:{apikey:config.key,...(auth?{Authorization:'Bearer '+session.access_token}:{}),...options.headers},signal:AbortSignal.timeout(20000),cache:'no-store'});}catch{throw Error('Connection interrupted. Work stays queued on this phone.');}
  if(r.status===401&&auth&&retry){await refresh();return request(path,options,true,false);}
  if(!r.ok){const error=await r.json().catch(()=>({}));const e=Error(r.status===401?'Sign in again to sync. Local work is kept.':error.message||error.error_description||error.error||'Team request failed ('+r.status+').');e.status=r.status;e.code=error.code||error.error||error.statusCode;throw e;}
  return r;
 }
 async function refresh(){
  if(!session?.refresh_token)throw Error('Sign in again to sync.');
  try{const r=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})},false);setSession(await r.json());}catch(e){if(e.status===400||e.status===401)setSession(null);throw e;}
 }
 async function init(){
  try{config=await(await fetch('/api/team-config',{cache:'no-store',signal:AbortSignal.timeout(10000)})).json();if(config.configured)await change(s=>({...s,_teamConfig:config}));}
  catch{config=(await read())._teamConfig||{configured:false};}
  if(!config.configured){emit('Team storage is not configured yet. Visits still save on this phone.');return config;}
  try{const s=JSON.parse(sessionStorage.getItem('lc-team-session')||'null');if(s?.project===config.url)session=s;}catch{}
  const params=new URLSearchParams(location.hash.slice(1));
  if(location.pathname.endsWith('team.html')&&params.get('access_token')&&params.get('refresh_token')){
   session={access_token:params.get('access_token'),refresh_token:params.get('refresh_token'),expires_at:Date.now()/1000+Number(params.get('expires_in')||3600)};
   history.replaceState(null,'',location.pathname);try{session.user=await(await request('/auth/v1/user')).json();setSession(session);}catch{setSession(null);}
  }
  emit(session?'Signed in. Checking queued work...':'Sign in to sync team records. Local work stays available.');schedule();return config;
 }
 async function signIn(email,password){const r=await request('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})},false);setSession(await r.json());return memberships();}
 async function memberships(){if(!session)return[];return(await request('/rest/v1/lc_memberships?select=organization_id,role,lc_organizations(name)')).json();}
 async function enable(organization){
  const rows=await memberships(),member=rows.find(r=>r.organization_id===organization);if(!member)throw Error('This account is not on that team.');
  await change(s=>{const old=s._teamMeta;if(old&&(old.organization!==organization||old.user!==session.user.id))throw Error('This phone is linked to another workspace or account. Export its backup, then clear the local team copy before switching.');TeamRecords.prepare(s);s._teamMeta=old||{organization,user:session.user.id,role:member.role,bases:{},conflicts:{},cursor:0,outbox:[],failures:0};s._teamMeta.role=member.role;return s;});schedule(0);
 }
 async function signOut(){setSession(null);clearTimeout(retryTimer);emit('Signed out. Cached work remains on this phone; sign in with the same account to sync.');}
 async function changePassword(password){if(password.length<12)throw Error('Use at least 12 characters.');await request('/auth/v1/user',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});}
 async function resetPassword(email){await request('/auth/v1/recover',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,redirect_to:location.origin+'/team.html'})},false);}
 async function mapValues(value,fn,key=''){
  if(typeof value==='string')return fn(value,key);
  if(Array.isArray(value))return Promise.all(value.map(v=>mapValues(v,fn,key)));
  if(value&&typeof value==='object'){const out={};for(const [k,v]of Object.entries(value)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Invalid record property.');out[k]=await mapValues(v,fn,k);}return out;}return value;
 }
 const base64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);};
 async function externalize(payload,org,cache,scope='shared'){
  return mapValues(payload,async(value,key)=>{
   if(!value.startsWith('data:image/')){if(['photos','completionPhotos','photo'].includes(key)&&value&&!/^rr-photo:(shared|[a-f0-9-]{36})\/[a-f0-9]{64}\.(jpg|png|webp)$/.test(value))throw Error('A photo is not a supported saved image. Repair it before sharing this record.');return value;}
   const cacheKey=scope+':'+value;if(cache.has(cacheKey))return cache.get(cacheKey);
   const match=value.match(/^data:image\/(jpeg|png|webp);base64,([a-zA-Z0-9+/=]+)$/);if(!match)throw Error('A photo could not be read. Its local copy was kept.');
   const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));if(bytes.length>10*1024*1024)throw Error('A photo exceeds the 10 MB upload limit. Its local copy was kept.');
   const good=match[1]==='png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78:match[1]==='jpeg'?bytes[0]===255&&bytes[1]===216:bytes[0]===82&&bytes[8]===87;
   if(!good)throw Error('A photo has an invalid image signature. Its local copy was kept.');
   const id=hex(await crypto.subtle.digest('SHA-256',bytes))+'.'+(match[1]==='jpeg'?'jpg':match[1]);
   try{await request('/storage/v1/object/lc-photos/'+org+'/'+scope+'/'+id,{method:'POST',headers:{'Content-Type':'image/'+match[1],'x-upsert':'false'},body:bytes});}catch(e){if(e.status!==409&&!(e.status===400&&(/already exists/i.test(e.message)||['Duplicate','AssetAlreadyExists','KeyAlreadyExists','resource_already_exists'].includes(e.code))))throw e;const existing=await request('/storage/v1/object/authenticated/lc-photos/'+org+'/'+scope+'/'+id);if(hex(await crypto.subtle.digest('SHA-256',await existing.arrayBuffer()))!==id.split('.')[0])throw Error('The saved team photo failed its integrity check.');}
   const ref='rr-photo:'+scope+'/'+id;cache.set(cacheKey,ref);cache.set(ref,value);return ref;
  });
 }
 async function hydrate(payload,org,cache){return mapValues(payload,async value=>{
  if(!value.startsWith('rr-photo:'))return value;if(cache.has(value))return cache.get(value);
  const id=value.slice(9);if(!/^(shared|[a-f0-9-]{36})\/[a-f0-9]{64}\.(jpg|png|webp)$/.test(id))throw Error('Invalid team photo reference.');
  const r=await request('/storage/v1/object/authenticated/lc-photos/'+org+'/'+id),bytes=new Uint8Array(await r.arrayBuffer());
  if(hex(await crypto.subtle.digest('SHA-256',bytes))!==id.split('/').pop().split('.')[0])throw Error('A team photo failed its integrity check. Sync paused.');
  const mime=id.endsWith('.jpg')?'jpeg':id.split('.')[1],data='data:image/'+mime+';base64,'+base64(bytes);cache.set(value,data);return data;
 });}
 async function beforeSync(){const waits=[];protectedKeys=[];document.dispatchEvent(new CustomEvent('rr-before-sync',{detail:{wait:p=>waits.push(p),protect:id=>protectedKeys.push(id)}}));await Promise.all(waits);}
 const relevant=state=>canonical(TeamRecords.rows(state));
 async function mergeRemote(incoming,cursor,cache){
  await beforeSync();
  const state=await read(),meta=metaFor(state);if(!meta)throw Error('Link this phone to its team first.');const generation=editGeneration;
  const hydrated=[];for(const row of incoming){if(!['client','visit','draft','catalog'].includes(row.kind)||row.organization_id!==meta.organization)throw Error('Unexpected team record.');const payload=row.deleted?null:await hydrate(row.payload,meta.organization,cache);if(!row.deleted)TeamRecords.validate(row.kind,payload);hydrated.push({...row,payload});}
  const remoteHashes=Object.fromEntries(await Promise.all(hydrated.map(async r=>[TeamRecords.key(r.kind,r.record_id),r.deleted?null:await digest(r.payload)])));
  const result=TeamRecords.reconcile(state,meta,hydrated,await hashes(state),remoteHashes,protectedKeys),stamp=relevant(state);
  result.meta.cursor=cursor;
  await change(current=>{if(editGeneration!==generation||relevant(current)!==stamp||canonical(current._teamMeta)!==canonical(meta))return null;const next={...current,...result.state,_teamMeta:result.meta};for(const k of Object.keys(current))if(k.startsWith('team-draft:')&&!(k in result.state))delete next[k];return next;});
  const catalog=result.state['team-catalog'];if(catalog)try{localStorage.setItem('rr-team-sections',JSON.stringify(catalog));}catch{throw Error('Shared sections could not be saved on this phone.');}
  document.dispatchEvent(new CustomEvent('rr-team-applied'));
 }
 async function cycle(){
  if(running)return;running=true;emit('Checking team records...');const cache=new Map();
  try{
   if(!navigator.onLine){emit(config?.configured?'Offline. Work saves on this phone. Linked records sync after reconnection and sign-in.':'Offline. Work saves on this phone. Team storage is not configured yet.');return;}
   if(!config?.configured||!session){emit(!config?.configured?'Team storage is not configured yet.':'Sign in to sync. Local work stays queued.');return;}
   await beforeSync();let state=await read(),meta=metaFor(state);if(!meta){emit('Choose your team and start sharing this phone.');return;}
   if(meta.user!==session.user.id)throw Error('Sign in with this phone’s linked account.');
   // Pull first to identify concurrent edits before uploading local changes.
   for(let page=0;page<100;page++){
    const rows=await(await request('/rest/v1/rpc/lc_pull',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({org:meta.organization,after_sequence:meta.cursor,page_size:50})})).json();
    if(!Array.isArray(rows))throw Error('Unexpected sync response.');if(!rows.length)break;
    await mergeRemote(rows,Math.max(meta.cursor,...rows.map(r=>Number(r.change_sequence))),cache);meta=metaFor(await read());if(rows.length<50)break;
    if(page===99)throw Error('More team records remain. Sync again to continue.');
   }
   state=await read();meta=metaFor(state);const ops=TeamRecords.pending(state,meta,await hashes(state));
   await change(s=>{s._teamMeta.outbox=ops.map(o=>({kind:o.kind,id:o.record_id,hash:o.localHash,revision:o.expected_revision,deleted:o.deleted}));return s;});
   for(let i=0;i<ops.length;i+=25){
    const batch=ops.slice(i,i+25),wire=[];
    for(const op of batch)wire.push({kind:op.kind,record_id:op.record_id,expected_revision:op.expected_revision,deleted:op.deleted,payload:op.deleted?null:await externalize(op.payload,meta.organization,cache,op.kind==='draft'?session.user.id:'shared')});
    const result=await(await request('/rest/v1/rpc/lc_push',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({org:meta.organization,operations:wire})})).json();
    if(!Array.isArray(result)||result.length!==batch.length)throw Error('The team response was incomplete. Work remains queued.');
    for(const [n,item]of result.entries()){
     const sent=batch[n],row=item.record;if(!row||row.kind!==sent.kind||row.record_id!==sent.record_id)throw Error('Unexpected team acknowledgement.');
     if(item.status==='accepted')await change(s=>{TeamRecords.ack(s._teamMeta,row,sent);return s;});
     else if(item.status==='conflict')await mergeRemote([row],metaFor(await read()).cursor,cache);else throw Error('Unknown sync result.');
    }
   }
   state=await read();meta=metaFor(state);const remaining=TeamRecords.pending(state,meta,await hashes(state)),count=Object.keys(meta.conflicts).length;
   await change(s=>{s._teamMeta.lastSuccess=new Date().toISOString();s._teamMeta.failures=0;s._teamMeta.error='';s._teamMeta.outbox=remaining.map(o=>({kind:o.kind,id:o.record_id,hash:o.localHash}));return s;});
   emit(count?`${count} conflicting record${count===1?'':'s'} need review. Both versions are kept.`:remaining.length?`${remaining.length} changed record${remaining.length===1?'':'s'} waiting to sync.`:'Saved on this phone and synced to the team.');
   if(remaining.length)schedule(1000);
  }catch(error){
   emit(error.message);try{const s=await read();if(s._teamMeta)await change(v=>{v._teamMeta.failures=(v._teamMeta.failures||0)+1;v._teamMeta.error=error.message;v._teamMeta.retryAt=new Date(Date.now()+Math.min(60000,2000*2**Math.min(v._teamMeta.failures,5))).toISOString();return v;});}catch{}
   clearTimeout(retryTimer);retryTimer=setTimeout(()=>run(),30000);
  }finally{running=false;emit();}
 }
 function run(){if(job)return job;job=cycle().finally(()=>{job=null;});return job;}
 function schedule(ms=1200){clearTimeout(timer);timer=setTimeout(()=>{const task=()=>run();if(navigator.locks)navigator.locks.request('rr-team-sync',{ifAvailable:true},lock=>lock?task():emit('Another tab is syncing this phone.')).catch(e=>emit(e.message));else task();},ms);}
 function touch(){editGeneration++;schedule();}
 async function resolve(id,choice){await change(s=>{if(id==='catalog:sections'&&choice==='phone'&&s._teamMeta.role!=='admin')throw Error('Use the team version for shared sections. A lead publishes wording changes.');const result=TeamRecords.resolve(s,s._teamMeta,id,choice);return {...result.state,_teamMeta:result.meta};});document.dispatchEvent(new CustomEvent('rr-team-applied'));schedule(0);}
 async function clearLocal(){const s=await read();if(s._teamMeta&&(TeamRecords.pending(s,s._teamMeta,await hashes(s)).length||Object.keys(s._teamMeta.conflicts).length))throw Error('Resolve conflicts and finish syncing before clearing this phone. Export a complete backup first.');await change(v=>v._teamConfig?{_teamConfig:v._teamConfig}:{});try{localStorage.removeItem('rr-team-sections');}catch{}await signOut();}
 async function publish(sections,version){const current=await read(),data={version,reviewed:true,sections,contentReviews:current['team-catalog']?.contentReviews||[],reviewedAt:new Date().toISOString(),reviewedBy:session?.user?.id};TeamRecords.validate('catalog',data);await change(s=>{if(s._teamMeta?.role!=='admin')throw Error('Lead access required.');s['team-catalog']=data;return s;});touch();}
 async function recordReview(entry){await change(s=>{if(!session||s._teamMeta?.role!=='admin'||s._teamMeta.user!==session.user.id)throw Error('Sign in as a lead to record shared wording approval.');const catalog=s['team-catalog']||{version:'review-1',reviewed:true,sections:[],contentReviews:[]},latest=new Map((catalog.contentReviews||[]).map(r=>[r.kind+':'+r.id,r]));latest.set(entry.kind+':'+entry.id,{...entry,authenticatedReviewer:session.user.id});s['team-catalog']={...catalog,contentReviews:[...latest.values()]};return s;});touch();}
 async function info(){const state=await read();const pendingCount=state._teamMeta?TeamRecords.pending(state,state._teamMeta,await hashes(state)).length:0;return {pendingCount,configured:!!config?.configured,user:session?.user?.email||'',meta:state._teamMeta||null,message:status,running};}
 setInterval(()=>{if(document.visibilityState==='visible'&&navigator.onLine&&session)schedule(0);},60000);
 document.addEventListener('rr-local-change',touch);addEventListener('focus',()=>schedule(0));addEventListener('online',()=>schedule(0));addEventListener('offline',()=>emit(config?.configured?'Offline. Work saves on this phone. Linked records sync after reconnection and sign-in.':'Offline. Work saves on this phone. Team storage is not configured yet.'));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(0);});
 return {init,signIn,signOut,changePassword,resetPassword,memberships,enable,run,schedule,touch,resolve,clearLocal,publish,recordReview,info,read,change,digest};
})();
if(typeof window!=='undefined')TeamSync.init().catch(e=>document.dispatchEvent(new CustomEvent('rr-team-status',{detail:{message:e.message}})));
