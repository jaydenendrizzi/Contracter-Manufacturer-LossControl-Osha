'use strict';
// Pure record reconciliation. A conflicting edit is never silently replaced.
const TeamRecords=(()=>{
 const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
 const key=(kind,id)=>kind+':'+id;
 function rows(state){
  const out={};
  for(const [kind,items]of [['client',state.clients||[]],['visit',state.visits||[]]])for(const item of items){if(item.id)out[key(kind,item.id)]={kind,record_id:String(item.id),payload:item,deleted:false};}
  if(state.walk?.started){const payload={...state.walk};delete payload._localRevision;out[key('draft',state.walk.started)]={kind:'draft',record_id:String(state.walk.started),payload,deleted:false};}
  for(const [k,item]of Object.entries(state))if((k.startsWith('team-draft:')||/^restored-.*-walk$/.test(k))&&item?.started&&!out[key('draft',item.started)]){const payload={...item};delete payload._localRevision;out[key('draft',item.started)]={kind:'draft',record_id:String(item.started),payload,deleted:false};}
  if(state['team-catalog'])out['catalog:sections']={kind:'catalog',record_id:'sections',payload:state['team-catalog'],deleted:false};
  return out;
 }
 function prepare(state){
  for(const v of state.visits||[])validate('visit',v);
  for(const c of state.clients||[])validate('client',c);
  if(state.walk)validate('draft',state.walk);
  return state;
 }
 function validate(kind,value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid '+kind+' record.');
  const safe=(v,k='',depth=0)=>{if(depth>40)throw Error('Record nesting is too deep.');if(typeof v==='string'&&['photos','photo','completionPhotos','afterPhotos'].includes(k)&&v&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v))throw Error('A team photo is not a saved image.');if(Array.isArray(v))v.forEach(x=>safe(x,k,depth+1));else if(v&&typeof v==='object')for(const [key,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(key))throw Error('Invalid record property.');safe(x,key,depth+1);}};safe(value);
  if(kind==='client'&&(!value.id||!String(value.displayName||'').trim()))throw Error('A client needs a name and ID.');
  if(kind==='visit'&&(!value.id||!String(value.company||'').trim()||!Array.isArray(value.findings)))throw Error('A saved visit is missing its company, ID or findings.');
  if(kind==='draft'&&(!value.started||!String(value.company||'').trim()))throw Error('An unfinished visit needs a company and ID before sharing.');
  if(kind==='catalog'){
   if(!value.version||value.reviewed!==true||!Array.isArray(value.sections)||value.sections.length>200)throw Error('A team section release needs a reviewed version.');
   const ids=new Set(),questions=new Set();for(const s of value.sections){if(!s.id||ids.has(s.id)||!s.name||!Array.isArray(s.items)||!s.items.length||!Array.isArray(s.sectors)||!s.sectors.length||s.sectors.some(x=>!['mfg','con'].includes(x)))throw Error('A shared section is incomplete or repeated.');ids.add(s.id);for(const i of s.items){if(!i.q||!i.id||questions.has(i.id))throw Error('A shared question needs wording and a unique ID.');questions.add(i.id);}}
  }
 }
 function pending(state,meta,hashes){
  const current=rows(state),out=[];
  for(const [id,row]of Object.entries(current)){
   const base=meta.bases[id];if(meta.conflicts[id]||row.kind==='catalog'&&meta.role!=='admin')continue;
   if(!base||base.hash!==hashes[id]||base.deleted)out.push({...row,expected_revision:base?.revision||0,localHash:hashes[id]});
  }
  for(const [id,base]of Object.entries(meta.bases))if(!current[id]&&!base.deleted&&!meta.conflicts[id]&&base.kind!=='catalog')out.push({kind:base.kind,record_id:base.id,expected_revision:base.revision,deleted:true,payload:null,localHash:null});
  return out;
 }
 function applyRow(state,row){
  const {kind,record_id:id,payload,deleted}=row;
  if(kind==='client'||kind==='visit'){
   const list=kind==='client'?'clients':'visits';state[list]=(state[list]||[]).filter(v=>String(v.id)!==id);if(!deleted)state[list].push(structuredClone(payload));
  }else if(kind==='draft'){
   if(String(state.walk?.started)===id){if(deleted)state.walk=null;else state.walk={...structuredClone(payload),_localRevision:(state.walk._localRevision||0)+1};}
   else if(!deleted){if(!state.walk)state.walk=structuredClone(payload);else state['team-draft:'+id]=structuredClone(payload);}
   if(deleted)delete state['team-draft:'+id];
  }else if(kind==='catalog'){if(deleted)delete state['team-catalog'];else state['team-catalog']=structuredClone(payload);}
 }
 function reconcile(state,meta,incoming,localHashes,remoteHashes,protectedKeys=[]){
  state=structuredClone(state);meta=structuredClone(meta);const current=rows(state);
  for(const row of incoming){
   const id=key(row.kind,row.record_id),base=meta.bases[id];if(base&&row.revision<=base.revision)continue;
   const local=current[id],same=row.deleted?!local:localHashes[id]===remoteHashes[id],dirty=!!local&&(!base||base.deleted||localHashes[id]!==base.hash)||!!base&&!base.deleted&&!local;
   if(!same&&(dirty||protectedKeys.includes(id))){meta.conflicts[id]={remote:row,remoteHash:remoteHashes[id]||null,detectedAt:new Date().toISOString()};continue;}
   if(!same)applyRow(state,row);
   meta.bases[id]={kind:row.kind,id:row.record_id,revision:row.revision,hash:row.deleted?null:remoteHashes[id],deleted:row.deleted};delete meta.conflicts[id];
  }
  return {state,meta};
 }
 function ack(meta,row,sent){
  meta.bases[key(row.kind,row.record_id)]={kind:row.kind,id:row.record_id,revision:row.revision,hash:sent.localHash,deleted:row.deleted};
  return meta;
 }
 function resolve(state,meta,id,choice){
  const conflict=meta.conflicts[id];if(!conflict)throw Error('This conflict has already been reviewed.');
  const remote=conflict.remote,current=rows(state)[id];
  // Preserve both versions locally even after an explicit resolution.
  state['team-resolution:'+crypto.randomUUID()]={key:id,local:current||null,remote:structuredClone(remote),choice,resolvedAt:new Date().toISOString()};
  if(choice==='team')applyRow(state,remote);else if(choice!=='phone')throw Error('Choose the phone or team version.');
  meta.bases[id]={kind:remote.kind,id:remote.record_id,revision:remote.revision,hash:remote.deleted?null:conflict.remoteHash,deleted:remote.deleted};delete meta.conflicts[id];
  return {state,meta};
 }
 function repeat(visit,{date,consultant,mode='followup',catalogVersion='built-in-2026-11'}={}){
  const open=(visit.findings||[]).map((f,i)=>({f,i})).filter(({i})=>(visit.status?.[i]||'Open')!=='Done');
  return {started:crypto.randomUUID(),clientId:visit.clientId,clientType:visit.clientType||'Prospect',company:visit.company,location:visit.location||'',sector:visit.sector||'mfg',industry:visit.industry||'',date:date||new Date().toLocaleDateString('en-CA'),consultant:consultant||visit.consultant||'',modules:mode==='repeat'?[...(visit.modules||[])]:[],answers:{},custom:[],prior:structuredClone(visit.prior||{cites:[],severe:[]}),actions:{},catalogVersion,
   followupVisitId:visit.id,followupOf:visit.date,followup:open.map(({f,i})=>({sourceFindingId:f.id||visit.id+':'+i,sourceVisitId:visit.id,title:f.title,sev:f.sev,rec:f.rec,note:f.note,owner:f.owner||'',email:f.email||'',due:f.due||'',clientStatus:visit.status?.[i]||'Open',photo:f.photos?.[0]||'',photos:structuredClone(f.photos||[]),status:undefined,fnote:''}))};
 }
 return {canonical,key,rows,prepare,validate,pending,reconcile,ack,resolve,repeat,applyRow};
})();
if(typeof module!=='undefined')module.exports=TeamRecords;
