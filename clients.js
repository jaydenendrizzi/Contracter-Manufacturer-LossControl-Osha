/* Local-first client records. Team sync preserves the existing visit and photo fields. */
'use strict';
const Clients = (() => {
  const normalize=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\bl[.\s]*l[.\s]*c\b/g,' ').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&!['the','inc','incorporated','llc','ltd','corp','corporation'].includes(w)).join(' ');
  const names=c=>[c.displayName,...(c.aliases||[])].map(normalize).filter(Boolean);
  const matches=(c,name)=>names(c).includes(normalize(name));
  const similar=(a,b)=>{const x=normalize(a),y=normalize(b);return !!(x&&y&&(x.split(' ')[0]===y.split(' ')[0]||x.includes(y)||y.includes(x)));};
  const create=(name,type='Prospect')=>({id:crypto.randomUUID(),displayName:name||'Unnamed visit',normalizedName:normalize(name),aliases:[],primaryContactName:'',email:'',phone:'',type:type==='Client'?'Client':'Prospect',notes:'',externalId:'',snapshotReviewed:false});
  function migrate(visits,clients=[],walk=null){
    clients=structuredClone(clients);visits=structuredClone(visits);
    const attach=v=>{let c=clients.find(c=>c.id===v.clientId);if(!c){const found=clients.filter(c=>matches(c,v.company));c=found.length===1?found[0]:create(v.company,v.clientType);if(!clients.some(x=>x.id===c.id))clients.push(c);}v.clientId=c.id;v.clientType=c.type;return v;};
    visits.forEach(attach);if(walk)walk=attach(structuredClone(walk));return {visits,clients,walk};
  }
  function merge(state,from,to){
    if(from===to)throw Error('Pick two different clients.');const source=state.clients.find(c=>c.id===from),target=state.clients.find(c=>c.id===to);if(!source||!target)throw Error('Client no longer exists.');
    target.snapshotReviewed=false;
    target.aliases=[...new Set([...(target.aliases||[]),source.displayName,...(source.aliases||[])])].filter(n=>n!==target.displayName);
    for(const key of ['primaryContactName','email','phone'])if(!target[key])target[key]=source[key];
    target.notes=[target.notes,source.notes, ...['primaryContactName','email','phone'].filter(k=>source[k]&&target[k]!==source[k]).map(k=>`${source.displayName} ${{primaryContactName:'contact',email:'email',phone:'phone'}[k]}: ${source[k]}`)].filter(Boolean).join('\n');
    state.clients=state.clients.filter(c=>c.id!==from);for(const v of [...state.visits,...(state.walk?[state.walk]:[])])if(v.clientId===from){v.clientId=to;v.clientType=target.type;}return state;
  }
  const openDB=()=>new Promise((resolve,reject)=>{const q=indexedDB.open('rr-loss-control',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});
  async function transaction(change){
    const db=await openDB();return new Promise((resolve,reject)=>{
      const tx=db.transaction('kv','readwrite'),store=tx.objectStore('kv'),keys=['visits','clients','walk','client-migration-backup-v1'],values={};let left=keys.length,result;
      tx.oncomplete=()=>{db.close();if(change&&typeof document!=='undefined')document.dispatchEvent(new Event('rr-local-change'));resolve(result);};tx.onerror=()=>{db.close();reject(tx.error||Error('Could not save clients.'));};tx.onabort=()=>{db.close();reject(tx.error||Error('Could not save clients.'));};
      keys.forEach(k=>{const q=store.get(k);q.onsuccess=()=>{values[k]=q.result;if(--left)return;
        try{if(!values['client-migration-backup-v1'])store.put({visits:values.visits||[],walk:values.walk||null},'client-migration-backup-v1');
          result=migrate(values.visits||[],values.clients||[],values.walk||null);if(change)result=change(result)||result;
          store.put(result.visits,'visits');store.put(result.clients,'clients');if(result.walk)store.put(result.walk,'walk');
        }catch(e){reject(e);tx.abort();}
      };});
    });
  }
  function snapshot(state,id,asOf=new Date().toISOString().slice(0,10)){
    const client=state.clients.find(c=>c.id===id);if(!client)throw Error('Client not found.');
    const visits=state.visits.filter(v=>v.clientId===id&&v.date<=asOf).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    const findings=visits.flatMap(v=>(v.findings||[]).map((f,i)=>({...f,visitId:v.id,findingIndex:i,location:v.location||'',visitDate:v.date,status:v.status?.[i]||'Open',closed:f.closed||''})));
    for(const v of visits)for(const f of v.followup||[]){if(f.status!=='fixed')continue;const candidates=findings.filter(x=>(v.followupVisitId?x.visitId===v.followupVisitId:x.visitDate===v.followupOf&&x.location===(v.location||''))&&(f.sourceFindingId?(x.id||x.visitId+':'+x.findingIndex)===f.sourceFindingId:x.title===f.title));if(candidates.length===1&&candidates[0].status!=='Done'){candidates[0].status='Done';candidates[0].closedObservedOn=v.date;}}
    const rank={High:0,Medium:1,Low:2};const open=findings.filter(f=>f.status!=='Done').sort((a,b)=>(rank[a.sev]??1)-(rank[b.sev]??1)||(a.due||'9999').localeCompare(b.due||'9999'));
    const closed=findings.filter(f=>f.status==='Done').sort((a,b)=>b.closed.localeCompare(a.closed));
    const times=closed.filter(f=>/^\d{4}-\d{2}-\d{2}$/.test(f.closed)&&f.closed>=f.visitDate&&f.closed<=asOf).map(f=>(Date.parse(f.closed)-Date.parse(f.visitDate))/86400000).filter(Number.isFinite).sort((a,b)=>a-b);
    const median=times.length?(times[Math.floor((times.length-1)/2)]+times[Math.floor(times.length/2)])/2:null;
    const sections=[...new Set(findings.map(f=>f.module||'Other'))].map(name=>({name,open:open.filter(f=>(f.module||'Other')===name).length,closed:closed.filter(f=>(f.module||'Other')===name).length})).sort((a,b)=>b.open-a.open);
    const until=new Date(Date.parse(asOf)+30*86400000).toISOString().slice(0,10);
    return {client,asOf,visits,findings,open,closed,sections,median,overdue:open.filter(f=>f.due&&f.due<asOf),closedSince:closed.filter(f=>f.closed&&f.closed>=(visits[0]?.date||asOf)&&f.closed<=asOf),coming:open.filter(f=>f.due>=asOf&&f.due<=until),closeRate:findings.length?Math.round(closed.length/findings.length*100):null,reviewed:client.snapshotReviewed===true};
  }
  function importClients(state,payload){
    if(payload?.format!=='rr-loss-control-clients/1'||!Array.isArray(payload.clients)||payload.clients.length>10000)throw Error('Choose an R&R client JSON export.');
    for(const row of payload.clients){
      if(!row||typeof row.displayName!=='string'||!row.displayName.trim()||row.displayName.length>300||!Array.isArray(row.aliases||[])||(row.aliases||[]).some(x=>typeof x!=='string'||x.length>300))throw Error('The client file contains an invalid record.');
      const found=state.clients.filter(c=>matches(c,row.displayName)||(row.aliases||[]).some(n=>matches(c,n)));
      if(found.length>1)throw Error('An imported name matches several clients. Rename or merge those clients first.');
      let c=found[0];if(!c){c=create(row.displayName,row.type);state.clients.push(c);}
      c.aliases=[...new Set([...(c.aliases||[]),...(row.aliases||[]),row.displayName])].filter(n=>n!==c.displayName);
      for(const k of ['primaryContactName','email','phone'])if(!c[k]&&typeof row[k]==='string')c[k]=row[k].slice(0,500);
      if(typeof row.notes==='string'&&row.notes&&!c.notes.includes(row.notes))c.notes=[c.notes,row.notes.slice(0,10000)].filter(Boolean).join('\n');
    }return state;
  }
  return {normalize,matches,similar,create,migrate,merge,transaction,snapshot,importClients};
})();
if(typeof module!=='undefined')module.exports=Clients;
