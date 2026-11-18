'use strict';
(() => {
  const $=s=>document.querySelector(s),selected=new Set();let hazards=[],forms=[],formId='',mode='hazards',readyFile=null,pdfUrl='',buildNumber=0,buildTimer;
  const state=()=>({client:$('#client').value.trim(),rep:$('#rep').value.trim(),phone:$('#phone').value.trim(),date:$('#date').value});
  $('#date').value=new Date().toISOString().slice(0,10);
  try{if(location.hash){const p=JSON.parse(decodeURIComponent(location.hash.slice(1)));for(const key of ['client','rep','date'])if(typeof p[key]==='string')$('#'+key).value=p[key].slice(0,key==='client'?120:80);history.replaceState(null,'',location.pathname);}}catch{}
  async function readPack(path){
    let response;
    try{response=await fetch(path);if(!response.ok)throw Error('Could not load handouts.');if('caches' in window)try{const c=await caches.open('rr-hazards-v1');await c.put(path,response.clone());}catch{}}
    catch{response='caches' in window?await caches.match(path):null;}
    if(!response?.ok)throw Error('These handouts are not saved on this phone yet. Open them with signal first.');return ContentReview.apply(await response.json(),path==='hazards.json'?'hazard':'form');
  }
  function discard(){readyFile=null;$('#create').disabled=true;$('#download').hidden=true;$('#preview').hidden=true;if(pdfUrl){URL.revokeObjectURL(pdfUrl);pdfUrl='';}}
  function renderSelection(){
    $('#chosen').replaceChildren();const docs=mode==='forms'?forms.filter(f=>f.id===formId):hazards.filter(h=>selected.has(h.id));
    $('#selection').textContent=docs.length?(mode==='forms'?docs[0].title:`${docs.length} hazard sheet${docs.length===1?'':'s'} in this PDF`):'Pick at least one sheet.';
    for(const doc of docs){const b=document.createElement('button');b.type='button';b.className='remove-pick';b.textContent=doc.title+' ×';b.setAttribute('aria-label','Remove '+doc.title);b.onclick=()=>{if(mode==='forms')formId='';else selected.delete(doc.id);render();prepare();};$('#chosen').append(b);}
  }
  function render(){
    $('#hazard-picker').hidden=mode!=='hazards';$('#form-picker').hidden=mode!=='forms';$('#show-hazards').setAttribute('aria-pressed',String(mode==='hazards'));$('#show-forms').setAttribute('aria-pressed',String(mode==='forms'));
    const list=mode==='hazards'?$('#hazard-list'):$('#form-list');list.replaceChildren();
    const query=$('#search').value.toLowerCase().trim(),category=$('#category').value;
    const rows=mode==='forms'?forms:hazards.filter(h=>(!category||h.category===category)&&h.title.toLowerCase().includes(query));
    if(mode==='hazards')$('#result-count').textContent=rows.length+' hazard sheets';
    for(const item of rows){
      const label=document.createElement('label');label.className='pick';const input=document.createElement('input');input.type=mode==='forms'?'radio':'checkbox';input.name=mode==='forms'?'blank-form':'hazard';input.value=item.id;input.checked=mode==='forms'?formId===item.id:selected.has(item.id);
      const span=document.createElement('span');span.textContent=item.title;const small=document.createElement('small');small.textContent=(item.category||'Blank form')+(item.reviewed?'':' · DRAFT');span.append(small);label.append(input,span);list.append(label);
      input.onchange=()=>{if(mode==='forms')formId=item.id;else if(input.checked)selected.add(item.id);else selected.delete(item.id);renderSelection();prepare();};
    }
    renderSelection();
  }
  function prepare(){
    clearTimeout(buildTimer);const number=++buildNumber;discard();
    const docs=mode==='forms'?forms.filter(f=>f.id===formId):hazards.filter(h=>selected.has(h.id));
    if(!docs.length){$('#message').textContent='Pick a sheet or form to get started.';return;}
    if(!$('#date').value){$('#message').textContent='Pick a date for the handout.';return;}
    const options=state(),isForm=mode==='forms';$('#message').textContent='Preparing your PDF...';
    buildTimer=setTimeout(async()=>{
      try{
        const doc=isForm?await Handouts.buildForm(docs[0],options):await Handouts.buildPacket(docs,options);
        if(number!==buildNumber)return;
        const draft=docs.some(x=>!x.reviewed),filename='RR-'+(isForm?docs[0].id:docs.length===1?'hazard-'+docs[0].id:'hazard-packet')+(draft?'-DRAFT':'')+'.pdf';
        readyFile=new File([doc.output('blob')],filename,{type:'application/pdf'});pdfUrl=URL.createObjectURL(readyFile);
        for(const id of ['download','preview']){$('#'+id).href=pdfUrl;$('#'+id).hidden=false;}$('#download').download=filename;$('#create').disabled=false;
        $('#message').textContent='Ready. Create PDF opens sharing on supported phones. Save PDF works anywhere.';
      }catch(e){if(number===buildNumber)$('#message').textContent=e.message;}
    },200);
  }
  $('#create').onclick=async()=>{
    if(!readyFile)return;const file=readyFile;
    try{if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'R&R Loss Control handout'});else $('#download').click();}
    catch(e){if(e.name!=='AbortError')$('#message').textContent='Sharing did not open. Tap Save PDF or try Create PDF again.';}
  };
  $('#clear').onclick=()=>{selected.clear();formId='';render();prepare();};
  $('#search').oninput=render;$('#category').onchange=render;
  for(const id of ['client','rep','phone','date'])$('#'+id).oninput=prepare;
  $('#show-hazards').onclick=()=>{mode='hazards';render();prepare();};
  $('#show-forms').onclick=async()=>{
    if(!forms.length){$('#message').textContent='Loading blank forms...';try{forms=await readPack('handout-forms.json');}catch(e){$('#message').textContent=e.message;return;}}
    mode='forms';render();prepare();
  };
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
  readPack('hazards.json').then(data=>{
    hazards=data;for(const category of [...new Set(hazards.map(h=>h.category))]){const option=document.createElement('option');option.value=category;option.textContent=category;$('#category').append(option);}render();prepare();
  }).catch(e=>$('#message').textContent=e.message);
  window.addEventListener('pagehide',event=>{if(!event.persisted&&pdfUrl)URL.revokeObjectURL(pdfUrl);});
})();
