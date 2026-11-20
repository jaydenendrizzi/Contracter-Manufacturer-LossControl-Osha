'use strict';
(()=>{
 const $=s=>document.querySelector(s);let rendering=false,selectedFile=null;
 const say=s=>$('#team-message').textContent=s;
 const button=(parent,label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>Promise.resolve(fn()).catch(e=>say(e.message));parent.append(b);return b;};
 async function render(){if(rendering)return;rendering=true;try{
  const info=await TeamSync.info(),state=await TeamSync.read();$('#team-setup').hidden=info.configured;$('#team-signin').hidden=!info.configured||!!info.user;$('#team-account').hidden=!info.user;say(info.message);
  $('#team-user').textContent=info.user;$('#team-detail').textContent=info.meta?`Last team sync: ${info.meta.lastSuccess?new Date(info.meta.lastSuccess).toLocaleString():'not completed'}. Queued records: ${info.pendingCount||0}. Conflicts: ${Object.keys(info.meta.conflicts).length}.`:'This phone is not linked yet. Starting sharing includes existing clients, visits and their photos.';
  $('#team-lead').hidden=info.meta?.role!=='admin';$('#team-now').disabled=info.running||!info.meta;
  if(info.user&&navigator.onLine){try{const options=await TeamSync.memberships(),select=$('#team-org'),previous=select.value;select.replaceChildren();for(const r of options)select.add(new Option((r.lc_organizations?.name||'R&R team')+' ('+r.role+')',r.organization_id));select.value=info.meta?.organization||previous||options[0]?.organization_id||'';}catch(e){say(e.message);}}
  const conflicts=$('#team-conflicts');conflicts.replaceChildren();
  for(const [id,c]of Object.entries(info.meta?.conflicts||{})){
   const box=document.createElement('section');box.className='sample';const title=document.createElement('h3');title.textContent=id;box.append(title);
   const local=TeamRecords.rows(state)[id];for(const [label,value]of [['Phone',local?.payload||'Deleted on this phone'],['Team',c.remote.deleted?'Deleted by the team':c.remote.payload]]){
    const details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent=label+' version';pre.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px';pre.textContent=JSON.stringify(value,(_,v)=>typeof v==='string'&&v.startsWith('data:image/')?'[Saved photo]':v,2);details.append(summary,pre);const images=new Set(),collect=v=>{if(typeof v==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(v))images.add(v);else if(Array.isArray(v))v.forEach(collect);else if(v&&typeof v==='object')Object.values(v).forEach(collect);};collect(value);for(const src of [...images].slice(0,8)){const img=document.createElement('img');img.src=src;img.alt=label+' saved photo';img.style.cssText='width:140px;max-width:100%;height:auto;margin:8px';details.append(img);}if(images.size>8){const note=document.createElement('p');note.textContent='Showing 8 of '+images.size+' saved photos. All photos remain in the record and backup.';details.append(note);}box.append(details);
   }
   const actions=document.createElement('div');actions.className='actions';if(id!=='catalog:sections'||info.meta.role==='admin')button(actions,'Use phone version',()=>TeamSync.resolve(id,'phone').then(render));button(actions,'Use team version',()=>TeamSync.resolve(id,'team').then(render));box.append(actions);conflicts.append(box);
  }
  if(!conflicts.children.length)conflicts.textContent='No conflicts waiting for review.';
  const drafts=$('#team-drafts');drafts.replaceChildren();for(const [key,v]of Object.entries(state))if(key.startsWith('team-draft:')&&v){button(drafts,`Resume ${v.company} (${v.date||'undated'})`,async()=>{await TeamSync.change(s=>{if(s.walk)s['restored-'+crypto.randomUUID()+'-walk']=s.walk;s.walk=v;delete s[key];return s;});TeamSync.touch();location.href='index.html#walk';});}
  if(!drafts.children.length)drafts.textContent='No other unfinished team visits on this phone.';
  const catalog=state['team-catalog'];$('#team-catalog').textContent=catalog?`Current shared version: ${catalog.version}. ${catalog.sections.length} sections.`:'No shared section release yet.';
 }catch(error){say(error.message);}finally{rendering=false;}}
 $('#team-signin').onsubmit=async e=>{e.preventDefault();try{await TeamSync.signIn($('#team-email').value.trim(),$('#team-password').value);$('#team-password').value='';await render();}catch(e){say(e.message);}};
 $('#team-reset').onclick=async()=>{try{await TeamSync.resetPassword($('#team-email').value.trim());say('If this staff account exists, a reset email will arrive.');}catch(e){say(e.message);}};
 $('#team-enable').onclick=async()=>{try{await TeamSync.enable($('#team-org').value);await render();}catch(e){say(e.message);}};
 $('#team-now').onclick=()=>TeamSync.run().then(render);
 $('#team-signout').onclick=()=>TeamSync.signOut().then(render);
 $('#team-password-save').onclick=async()=>{try{await TeamSync.changePassword($('#team-new-password').value);$('#team-new-password').value='';say('Password saved.');}catch(e){say(e.message);}};
 $('#team-template-file').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>1000000)throw Error('The template file is too large.');const data=JSON.parse(await f.text());if(data.format!=='rr-loss-control-templates/1')throw Error('Choose an R&R template export.');selectedFile=data.sections;say('Template file ready for lead review.');}catch(e){selectedFile=null;say(e.message);}};
 $('#team-publish').onclick=async()=>{try{if(!$('#team-template-reviewed').checked)throw Error('Review the section wording and references first.');let sections=selectedFile||JSON.parse(localStorage.getItem('rr-templates')||'[]');sections=sections.map(s=>({...s,id:s.id.startsWith('team-')?s.id:'team-'+s.id,items:s.items.map(i=>({...i,id:i.id.startsWith('team-')?i.id:'team-'+i.id}))}));await TeamSync.publish(sections,$('#team-template-version').value.trim());await TeamSync.run();await render();}catch(e){say(e.message);}};
 $('#team-clear').onclick=async()=>{if(!confirm('Have you exported a complete backup? Clear the local team copy from this phone?'))return;try{await TeamSync.clearLocal();location.href='index.html#walk';}catch(e){say(e.message);}};
 document.addEventListener('rr-team-status',render);document.addEventListener('rr-team-applied',render);render().catch(e=>say(e.message));
 if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
})();
