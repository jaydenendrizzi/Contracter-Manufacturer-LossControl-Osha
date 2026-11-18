/* Hazard sample renderer. Client wording stays DRAFT until reviewed in hazards.json. */
'use strict';
const Handouts = (() => {
  const C = {navy:'#1F4244',tan:'#B8A77F',teal:'#006B6E',green:'#2e7d4f',cream:'#f7f5ef',gray:'#5b6466',line:'#d9dfdb',ink:'#2B2F31',white:'#ffffff'};
  let assets;
  const bytes64 = b => { let s=''; new Uint8Array(b).forEach(v=>s+=String.fromCharCode(v)); return btoa(s); };
  const disclaimer = co => `This report reflects conditions observed by R&R Insurance loss control at the time of the visit and is intended to help ${co} reduce the risk of injury and loss. It is not a guarantee that the site is free of hazards, and it is not a determination of compliance with OSHA or any other law, regulation or standard. Recommendations are advisory. Decisions about whether and how to implement them remain with ${co}.`;
  const load = () => assets ||= Promise.all([400,700,800].map(async w => {
    const r=await fetch(`fonts/overpass-${w}.ttf`); if(!r.ok) throw Error('Font is not saved on this phone yet. Open this page with signal first.'); return bytes64(await r.arrayBuffer());
  })).then(async fonts => {const r=await fetch('rr-logo.png');if(!r.ok)throw Error('Logo could not load.');return {fonts,logo:'data:image/png;base64,'+bytes64(await r.arrayBuffer())};}).catch(e=>{assets=null;throw e;});
  async function build(h, options={}) {
    const a=await load(), doc=options.document || new window.jspdf.jsPDF({unit:'pt',format:'letter',compress:true});
    if(options.document) doc.addPage();
    else a.fonts.forEach((f,i)=>{const style=['normal','bold','heavy'][i];doc.addFileToVFS(`Overpass-${style}.ttf`,f);doc.addFont(`Overpass-${style}.ttf`,'Overpass',style);});
    const M=36,W=540, R=576;
    const text=(s,x,y,size=9,color=C.ink,style='normal',width=540,align='left')=>{
      doc.setFont('Overpass',style);doc.setFontSize(size);doc.setTextColor(color);
      const lines=doc.splitTextToSize(String(s),width);doc.text(lines,x,y,{lineHeightFactor:1.22,align});return lines.length*size*1.22;
    };
    const box=(x,y,w,h,fill=C.white,stroke=C.line,r=6)=>{doc.setFillColor(fill);doc.setDrawColor(stroke);doc.setLineWidth(.7);doc.roundedRect(x,y,w,h,r,r,'FD');};
    const line=(x,y,w,color=C.line,weight=.7)=>{doc.setDrawColor(color);doc.setLineWidth(weight);doc.line(x,y,x+w,y);};
    const date=options.date||new Date().toISOString().slice(0,10),co=(options.client||'the client').trim()||'the client';
    doc.setProperties({title:`${h.title} | R&R Loss Control`,author:'R&R Insurance, Loss Control'});
    const logo=doc.getImageProperties(a.logo);doc.addImage(a.logo,'PNG',M,28,95,95*logo.height/logo.width);
    text('LOSS CONTROL',R,40,11,C.navy,'heavy',200,'right');
    text(h.reviewed?'Reviewed hazard sheet':'DRAFT | Wording review pending',R,54,8,C.gray,'normal',220,'right');
    if(options.client) text('Client: '+co,R,67,6.5,C.gray,'normal',300,'right');
    line(M,76,W,C.tan,1.8);
    box(M,86,W,120,C.navy,C.navy,9);box(M+4,90,W-8,112,C.navy,'#F4F6F3',6);
    text('Loss control hazard sheet',M+16,105,8,C.tan,'heavy');
    text(`${date} | Prepared by R&R Insurance, Loss Control`,M+16,119,7.5,'#cfe0df');
    text(h.title.toUpperCase(),M+16,140,16,C.white,'heavy',W-32);
    text(`Category: ${h.category}`,M+16,169,8,C.white,'bold',W-32);
    text(`Industries: ${h.industries.join(', ')}`,M+16,182,7.5,C.white,'normal',W-32);
    const pill=h.reference_summary || 'No specific OSHA standard';
    box(M+16,190,310,15,'#F4F6F3','#F4F6F3',3);text(pill,M+22,200,7,C.navy,'bold',300);
    let y=222;
    text(h.what_happens,M,y,10,C.navy,'bold',W);y+=22;
    if(h.wisconsin_metrics){
      const m=h.wisconsin_metrics;box(M,y,W,56);text('Wisconsin environmental heat reports',M+10,y+13,9,C.navy,'bold');
      m.values.forEach((v,i)=>{const x=M+10+i*(W/m.values.length);text(v.label,x,y+27,6.5,C.gray);text(String(v.value),x,y+41,15,C.green,'heavy',120);text(v.caption,x,y+51,6.5,C.gray,'normal',125);});y+=65;
    }
    text('Five things to check',M,y,11,C.navy,'heavy');y+=10;
    h.checks.forEach((v,i)=>{const x=M+i*109;box(x,y,104,85,'#f6f7f5');line(x+7,y+7,90,C.green,2);text(`${i+1}. ${v.label}`,x+7,y+20,8,C.navy,'bold',90);text(v.caption,x+7,y+40,6.8,C.gray,'normal',90);text('Check / Watch / Fix',x+7,y+80,5.5,C.gray,'bold',90);});y+=99;
    text('Circle a status in each tile:   Check = in place   /   Watch = follow up   /   Fix = act now',M,y,7,C.gray);y+=13;
    box(M,y,W,52);doc.setFillColor(C.green);doc.rect(M,y,3,52,'F');
    text('If you fix these first',M+12,y+18,9,C.navy,'heavy',125);
    h.checks.slice(0,3).forEach((v,i)=>text(`${i+1}. ${v.label}`,M+155,y+14+i*13,8.5,C.ink,'bold',W-170));y+=65;
    const leftW=260,rightX=M+276;
    text('What to do this week',M,y,10,C.navy,'heavy',leftW);line(M,y+7,leftW,C.tan,1);
    box(rightX,y-10,264,96,C.cream,C.tan,0);
    text("What this means for your workers' comp",rightX+10,y+5,9,C.navy,'heavy',244);
    let cy=y+25;h.workers_comp.forEach(v=>{cy+=text('• '+v,rightX+10,cy,8,C.ink,'normal',241)+7;});
    let ry=y+22;h.this_week.forEach(v=>{text(v.when,M,ry,7,C.gray,'bold',73);const dh=text(v.action,M+80,ry,8,C.ink,'normal',180);ry+=Math.max(dh,13)+6;line(M,ry-6,leftW);});
    y=Math.max(ry,y+98)+12;
    text('OSHA reference',M,y,9,C.navy,'heavy');y+=14;
    if(h.reference_status==='standard') { y+=text('General industry: '+h.osha_reference.general_industry,M,y,7,C.gray,'normal',W)+3;
    y+=text('Construction: '+h.osha_reference.construction,M,y,7,C.gray,'normal',W)+3; } else { y+=text(h.reference_status==='guidance_only'?'No specific federal OSHA standard. OSHA guidance only.':'No specific OSHA standard is cited for this general hazard.',M,y,7,C.gray,'normal',W)+3; }
    if(h.reference_note) y+=text(h.reference_note,M,y,7,C.gray,'normal',W);
    const ctaY=644;
    if(y>ctaY-10) throw Error('Sheet content exceeds its one-page layout: '+y);
    box(M,ctaY,W,53,C.navy,C.navy,8);box(M+4,ctaY+4,W-8,45,C.navy,'#F4F6F3',5);
    text('Want help closing these out?',M+15,ctaY+22,12,C.white,'heavy',310);
    text('Pick an owner and a next step with your rep.',M+15,ctaY+37,8,'#cfe0df','normal',310);
    text(options.rep||'Rep: __________________',R-14,ctaY+16,8,C.tan,'bold',200,'right');
    text(options.phone||'Phone: _________________',R-14,ctaY+29,7.5,C.white,'normal',200,'right');
    text('Loss Control, R&R Insurance',R-14,ctaY+41,7,C.white,'normal',200,'right');
    line(M,704,W,C.tan,1.5);
    let fy=715;
    const sources=h.sources || 'Sources: eCFR, 29 CFR sections listed above, checked '+h.verified_on+'.';
    fy+=text(sources,M,fy,6,C.gray,'normal',W)+3;
    if(h.wisconsin_metrics)fy+=text(h.wisconsin_metrics.caveat,M,fy,6,C.gray,'normal',W)+2;
    fy+=text('This sheet is a starting point for the client’s own program.',M,fy,6,C.gray,'bold',W)+2;
    fy+=text(disclaimer(co),M,fy,6,C.gray,'normal',W)+3;
    text(h.reviewed?'Reviewed by '+(h.reviewMetadata?.reviewer||'R&R')+' | '+(h.reviewMetadata?.reviewedAt||'').slice(0,10)+' | '+(h.reviewMetadata?.version||''): 'DRAFT | R&R wording review required before client use',M,fy,6.5,C.navy,'bold',W);
    if(fy>778)throw Error('Footer exceeds the page.');
    return doc;
  }
  async function buildForm(f, options={}) {
    const a=await load(),doc=new window.jspdf.jsPDF({unit:'pt',format:'letter',compress:true});
    a.fonts.forEach((v,i)=>{const style=['normal','bold','heavy'][i];doc.addFileToVFS(`Overpass-${style}.ttf`,v);doc.addFont(`Overpass-${style}.ttf`,'Overpass',style);});
    const M=36,W=540,R=576,co=(options.client||'the client').trim()||'the client';
    const text=(s,x,y,size=9,color=C.ink,style='normal',width=W,align='left')=>{
      doc.setFont('Overpass',style);doc.setFontSize(size);doc.setTextColor(color);const lines=doc.splitTextToSize(String(s),width);doc.text(lines,x,y,{align,lineHeightFactor:1.22});return lines.length*size*1.22;
    };
    const line=(x,y,w,color=C.line,weight=.7)=>{doc.setDrawColor(color);doc.setLineWidth(weight);doc.line(x,y,x+w,y);};
    const box=(x,y,w,h,fill,stroke=fill)=>{doc.setFillColor(fill);doc.setDrawColor(stroke);doc.roundedRect(x,y,w,h,6,6,'FD');};
    doc.setProperties({title:f.title+' | R&R Loss Control',author:'R&R Insurance, Loss Control'});
    const logo=doc.getImageProperties(a.logo);doc.addImage(a.logo,'PNG',M,28,95,95*logo.height/logo.width);
    text('LOSS CONTROL',R,40,11,C.navy,'heavy',200,'right');text(f.reviewed?'Reviewed blank form':'DRAFT | Wording review pending',R,55,8,C.gray,'normal',240,'right');line(M,76,W,C.tan,1.8);
    box(M,86,W,83,C.navy);doc.setDrawColor('#F4F6F3');doc.roundedRect(M+4,90,W-8,75,5,5,'S');
    text('Loss control blank form',M+16,105,8,C.tan,'heavy');text((options.date||new Date().toISOString().slice(0,10))+' | Prepared by R&R Insurance, Loss Control',M+16,119,7.5,'#cfe0df');text(f.title.toUpperCase(),M+16,146,18,C.white,'heavy',W-32);
    text('Client: '+(options.client||'________________________________________'),M,188,9,C.navy,'bold',W);
    let y=210;
    for(const block of f.blocks){
      text(block.label,M,y,9,C.navy,'bold');y+=12;
      if(block.type==='lines'){
        for(let i=0;i<block.rows;i++){line(M,y+12,W);y+=20;}
      }else{
        const cols=block.columns.length,cw=W/cols;
        doc.setFillColor('#f6f7f5');doc.rect(M,y-2,W,20,'F');block.columns.forEach((v,i)=>text(v,M+i*cw+5,y+9,7,C.gray,'bold',cw-10));line(M,y+18,W,C.navy,1);y+=18;
        const rowHeight=f.id==='jsa'?36:24;
        for(let j=0;j<block.rows;j++){
          line(M,y+rowHeight,W);for(let i=1;i<cols;i++){doc.setDrawColor(C.line);doc.line(M+i*cw,y,M+i*cw,y+rowHeight);}y+=rowHeight;
        }
      }
      y+=10;
    }
    if(y>680)throw Error(f.title+' does not fit its page.');
    text('Reference: '+f.reference,M,694,7,C.gray,'bold');text(f.reference_note,M,707,7,C.gray,'normal',W);
    line(M,730,W,C.tan,1.5);let fy=742;
    fy+=text('This form is a starting point for the client’s own program.',M,fy,6,C.gray,'bold')+2;
    fy+=text(disclaimer(co),M,fy,6,C.gray,'normal',W)+3;
    text(f.reviewed?'Reviewed by '+(f.reviewMetadata?.reviewer||'R&R')+' | '+(f.reviewMetadata?.reviewedAt||'').slice(0,10)+' | '+(f.reviewMetadata?.version||''): 'DRAFT | R&R wording review required before client use',M,fy,6.5,C.navy,'bold');
    if(fy>783)throw Error('Form footer exceeds its page.');return doc;
  }
  async function buildPacket(hazards,options={}){
    if(!hazards.length)throw Error('Pick at least one hazard.');let doc;
    for(const h of hazards)doc=await build(h,{...options,document:doc});
    doc.setProperties({title:'Loss control hazard packet',author:'R&R Insurance, Loss Control'});return doc;
  }

  async function buildSnapshot(m,options={}){
    const a=await load(),d=new window.jspdf.jsPDF({unit:'pt',format:'letter',compress:true});
    a.fonts.forEach((f,i)=>{const s=['normal','bold','heavy'][i];d.addFileToVFS(s+'.ttf',f);d.addFont(s+'.ttf','Overpass',s);});
    const M=36,W=540,co=m.client.displayName;
    const t=(s,x,y,size=9,color=C.ink,style='normal',w=W)=>{d.setFont('Overpass',style);d.setFontSize(size);d.setTextColor(color);const lines=d.splitTextToSize(String(s??'').replace(/\u2014/g,'-'),w);d.text(lines,x,y,{lineHeightFactor:1.2});return lines.length*size*1.2;};
    const box=(x,y,w,h,color=C.white,stroke=C.line)=>{d.setFillColor(color);d.setDrawColor(stroke);d.setLineWidth(.7);d.roundedRect(x,y,w,h,6,6,'FD');};
    const short=(s,n=95)=>String(s||'').length>n?String(s).slice(0,n-1)+'…':String(s||'');
    const footer=page=>{d.setDrawColor(C.tan);d.line(M,708,576,708);let y=719;y+=t('Source: visit history saved on this phone. As of '+m.asOf+'. Page '+page+' of 2.',M,y,6,C.gray)+2;y+=t('Starting point for the client’s own program. Status reflects saved records, not a new site visit. Missing close dates are excluded from timing metrics.',M,y,6,C.gray)+2;y+=t(disclaimer(co),M,y,5.8,C.gray)+2;t(m.reviewed?'Reviewed':'DRAFT | R&R wording review required before client use',M,y,6,C.navy,'bold');};
    const head=(subtitle)=>{const im=d.getImageProperties(a.logo);d.addImage(a.logo,'PNG',M,23,90,90*im.height/im.width);t('R&R INSURANCE, LOSS CONTROL',350,40,9,C.navy,'bold',225);box(M,77,W,100,C.navy,C.navy);d.setDrawColor('#F4F6F3');d.roundedRect(M+4,81,W-8,92,5,5,'S');box(496,85,67,17,C.cream,C.cream);t(m.reviewed?'Reviewed':'DRAFT',505,97,8,C.navy,'bold',55);t('Client status snapshot | As of '+m.asOf,M+16,95,8,C.tan,'bold');t(short(co,70).toUpperCase(),M+16,119,18,C.white,'heavy',W-32);t(subtitle,M+16,158,8,C.white,'normal',W-32);};
    d.setProperties({title:co+' | Client status snapshot',author:'R&R Insurance, Loss Control'});
    const locations=[...new Set(m.visits.map(v=>v.location).filter(Boolean))];head('Last visit: '+(m.visits[0]?.date||'None')+' | Locations: '+short(locations.join('; ')||'Not recorded',90));
    const metrics=[['Open items',m.open.length],['Overdue',m.overdue.length],['Closed since last visit',m.closedSince.length],['Close rate',m.closeRate===null?'n/a':m.closeRate+'%']];
    box(M,190,W,60);metrics.forEach(([label,value],i)=>{const x=M+12+i*134;t(label,x,207,7,C.gray,'normal',125);t(value,x,232,22,i===1&&m.overdue.length?'#b3261e':C.teal,'heavy',125);});
    t('Open items by walkthrough section',M,273,11,C.navy,'heavy');
    const sections=m.sections.slice(0,8);sections.forEach((s,i)=>{const x=M+(i%4)*137,y=285+Math.floor(i/4)*65;box(x,y,129,58,'#f6f7f5');t(short(s.name,26),x+7,y+13,7,C.navy,'bold',115);t(`${s.open} open / ${s.closed} closed`,x+7,y+29,8,C.teal,'bold',115);d.setFillColor('#d9dfdb');d.rect(x+7,y+39,115,4,'F');d.setFillColor(C.green);d.rect(x+7,y+39,115*(s.closed/(s.open+s.closed||1)),4,'F');});
    t(m.sections.length>8?`Showing 8 of ${m.sections.length} sections. Full detail is in the snapshot data file.`:'Bars show closed items as a share of all findings in that section.',M,421,7,C.gray);
    box(M,435,W,84);d.setFillColor(C.green);d.rect(M,435,3,84,'F');t('If you close these first',M+12,452,10,C.navy,'heavy');
    const first=m.open.filter(f=>f.sev==='High').slice(0,3);if(!first.length)t('No open High-priority items in the saved records.',M+12,474,8);
    first.forEach((f,i)=>t(`${i+1}. ${short(f.title,65)} | ${short(f.owner||'Owner not set',26)} | Due ${f.due||'not set'}`,M+12,470+i*18,7,C.ink,'normal',514));
    const stats=[['Visits',m.visits.length],['Total findings',m.findings.length],['Closed',m.closed.length],['Median days to close',m.median===null?'n/a':m.median]];stats.forEach(([label,value],i)=>{const x=M+i*135;box(x,533,135,55);t(value,x+10,555,18,C.navy,'heavy',115);t(label,x+10,574,7,C.gray,'normal',115);});
    t('Closed since last visit uses the latest visit date through the as-of date, inclusive.',M,604,7,C.gray);t('Close rate = Done findings / all findings. Client declined stays unresolved.',M,618,7,C.gray);
    box(M,647,W,48,C.navy,C.navy);t('Want help closing these out?',M+12,669,13,C.white,'heavy');t(short(options.rep||m.visits[0]?.consultant||'Rep: __________________',38),365,665,8,C.tan,'bold',200);t(options.phone||'Loss Control, R&R Insurance',365,683,7,C.white,'normal',200);footer(1);
    d.addPage();head('Open and closed items across all saved visits and locations');
    const table=(title,rows,x,w,max,closed=false)=>{t(title,x,199,11,C.navy,'heavy',w);let y=216;t(closed?'Item / closed date':'Item / owner / due / priority',x,y,7,C.gray,'bold',w);y+=12;
      for(const f of rows.slice(0,max)){d.setDrawColor(C.line);d.line(x,y-4,x+w,y-4);t(short(f.title,60),x,y+5,7.5,C.navy,'bold',w);t(closed?`${f.closed||(f.closedObservedOn?'Confirmed '+f.closedObservedOn:'Date not recorded')} | ${short(f.location,25)}${f.clientUpdate?' | '+short(f.clientUpdate,45):''}${f.completionPhotos?.length?' | Photo saved':''}`:`${short(f.owner||'Owner not set',24)} | ${f.due||'No due date'} | ${f.sev||'Medium'}${f.status==='Client declined'?' | Declined':''}`,x,y+27,6.5,C.gray,'normal',w);y+=42;}
      t(rows.length?`Showing ${Math.min(rows.length,max)} of ${rows.length}.`:'None recorded.',x,Math.min(y+5,608),7,C.gray,'bold',w);};
    table('Open items',m.open,M,263,9);table('What was closed',m.closed,313,263,9,true);
    box(M,625,W,65,C.cream,C.tan);t('Coming due in the next 30 days',M+12,640,10,C.navy,'heavy');t(m.coming.length?m.coming.slice(0,3).map(f=>`${short(f.title,55)} (${f.due})`).join('; '):'No items with due dates in this period.',M+12,655,7,C.ink,'normal',514);t(`Total coming due: ${m.coming.length}. Tables show priority items; download snapshot data for every item.`,M+12,681,6.5,C.gray,'normal',514);footer(2);return d;
  }

  async function buildOpenItems(m,options={}){
    const a=await load(),d=new window.jspdf.jsPDF({unit:'pt',format:'letter',compress:true});a.fonts.forEach((f,i)=>{const s=['normal','bold','heavy'][i];d.addFileToVFS(s+'.ttf',f);d.addFont(s+'.ttf','Overpass',s);});
    let y=0,page=0;const M=36,W=540,clean=s=>String(s??'').replace(/\u2014/g,'-');
    const text=(s,x,yy,size=9,color=C.ink,style='normal')=>{d.setFont('Overpass',style);d.setFontSize(size);d.setTextColor(color);d.text(clean(s),x,yy);};
    const footer=()=>{d.setDrawColor(C.tan);d.line(M,708,576,708);d.setFont('Overpass','normal');d.setFontSize(6);d.setTextColor(C.gray);const lines=d.splitTextToSize('Source: saved visit history on this phone. Starting point for the client’s own program. '+disclaimer(m.client.displayName),W);d.text(lines,M,720,{lineHeightFactor:1.15});text((m.reviewed?'Reviewed':'DRAFT | R&R wording review required before client use')+' | Page '+page,M,782,6,C.navy,'bold');};
    const next=()=>{if(page){footer();d.addPage();}page++;const im=d.getImageProperties(a.logo);d.addImage(a.logo,'PNG',M,24,90,90*im.height/im.width);d.setFillColor(C.navy);d.roundedRect(M,77,W,86,6,6,'F');text('Client open-items list | '+m.asOf,M+14,96,9,C.tan,'bold');text(m.client.displayName.slice(0,60),M+14,120,15,C.white,'heavy');text(`${m.open.length} unresolved items | All locations | Prepared by R&R Insurance, Loss Control`,M+14,147,8,C.white);y=188;};
    const paragraph=(value,style='normal',size=9)=>{d.setFont('Overpass',style);d.setFontSize(size);const lines=d.splitTextToSize(clean(value),W);for(const line of lines){if(y>686)next();text(line,M,y,size,C.ink,style);y+=size*1.35;}y+=5;};
    next();if(!m.open.length)paragraph('No unresolved items in the saved records.');m.open.forEach((f,i)=>{if(y>615)next();paragraph(`${i+1}. ${f.title}`,'heavy',11);paragraph(`Priority: ${f.sev||'Medium'} | Status: ${f.status} | Owner: ${f.owner||'Not assigned'} | Due: ${f.due||'Not set'}`,'bold',8);paragraph(`Location: ${f.location||'Not recorded'} | Visit: ${f.visitDate} | Section: ${f.module||'Other'}`, 'normal',8);if(f.rec)paragraph('Next step: '+f.rec);if(f.note)paragraph('Visit note: '+f.note);if(f.clientUpdate)paragraph('Client update: '+f.clientUpdate);if((f.completionPhotos||[]).length)paragraph('Follow-up photos saved: '+f.completionPhotos.length,'normal',8);y+=7;});footer();d.setProperties({title:m.client.displayName+' | Full open-items list',author:'R&R Insurance, Loss Control'});return d;
  }

  return {build,buildForm,buildPacket,buildSnapshot,buildOpenItems,wordingTemplate:()=>disclaimer('the client')+build.toString()+buildForm.toString()};
})();
