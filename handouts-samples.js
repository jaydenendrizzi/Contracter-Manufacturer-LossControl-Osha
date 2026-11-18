'use strict';
const sampleDate=document.querySelector('#date');sampleDate.value=new Date().toISOString().slice(0,10);
let hazardSamples=[];
fetch('hazards.json').then(r=>{if(!r.ok)throw Error('Hazard samples are not saved on this phone yet. Open with signal first.');return r.json();}).then(async data=>{
  data=await ContentReview.apply(data,'hazard');
  data=data.filter(h=>["9","2","32"].includes(h.id));
  hazardSamples=data;
  for(const h of data){
    const card=document.createElement('section');card.className='sample';
    const title=document.createElement('h2');title.textContent=h.title;card.append(title);
    const actions=document.createElement('div');actions.className='actions';card.append(actions);
    const button=document.createElement('button');button.textContent='Create PDF';actions.append(button);
    let currentUrl;
    button.onclick=async()=>{
      button.disabled=true;document.querySelector('#message').textContent='Building the DRAFT PDF...';
      try{
        const options={client:document.querySelector('#client').value,rep:document.querySelector('#rep').value,phone:document.querySelector('#phone').value,date:sampleDate.value};
        const doc=await Handouts.build(h,options),blob=doc.output('blob');
        const file=new File([blob],`RR-hazard-${h.id}${h.reviewed?'':'-DRAFT'}.pdf`,{type:'application/pdf'});
        if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(blob);
        actions.querySelector('.download')?.remove();const link=document.createElement('a');link.className='download';link.textContent='Save PDF';link.href=currentUrl;link.download=file.name;actions.append(link);
        card.querySelector('iframe')?.remove();const frame=document.createElement('iframe');frame.className='preview';frame.title=h.title+' PDF preview';frame.src=currentUrl;card.append(frame);
        const share=document.createElement('button');share.textContent='Share PDF';actions.querySelector('[data-share]')?.remove();share.dataset.share='true';actions.append(share);
        share.onclick=async()=>{try{if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:h.title});else link.click();}catch(e){if(e.name!=='AbortError')document.querySelector('#message').textContent='Sharing did not open. Use Save PDF.';}};
        document.querySelector('#message').textContent='DRAFT PDF ready. Tap Share PDF to open the phone share sheet, or Save PDF.';
      }catch(e){document.querySelector('#message').textContent=e.message;}finally{button.disabled=false;}
    };
    document.querySelector('#samples').append(card);
  }
}).catch(e=>document.querySelector('#message').textContent=e.message);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
