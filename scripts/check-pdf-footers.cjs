// Run check-handouts.cjs first. Poppler's pdftotext checks the actual rendered PDF coordinates.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const folder=path.resolve(__dirname,'../review/phase1');
const files=fs.readdirSync(folder).filter(name=>/^(hazard|form)-.+-DRAFT\.pdf$/.test(name));
assert.equal(files.length,56,'Generate all 50 hazards and six forms before checking footers.');
let citations=0;
for(const name of files){
 const xml=execFileSync('pdftotext',['-bbox',path.join(folder,name),'-'],{encoding:'utf8'});
 assert.equal((xml.match(/<page /g)||[]).length,1,name+' must remain one page');
 const words=[...xml.matchAll(/<word xMin="([\d.-]+)" yMin="([\d.-]+)" xMax="([\d.-]+)" yMax="([\d.-]+)">([^<]*)<\/word>/g)].map(m=>({left:+m[1],top:+m[2],right:+m[3],bottom:+m[4],text:m[5]}));
 const refs=words.filter(w=>/^(CFR|[Rr]eference:|Sources:)$/.test(w.text));
 assert(refs.length,name+' must retain its references');
 refs.forEach(w=>{assert(w.top>600,name+': citation returned to the body/banner at '+w.top);citations++;});
 words.forEach(w=>assert(w.left>=30&&w.right<=582&&w.top>=15&&w.bottom<=785,name+': text outside printable bounds: '+JSON.stringify(w)));
}
console.log(`PASS: ${files.length} rendered PDFs; ${citations} citation/source markers stay in the bottom area; all text stays within page bounds.`);
