import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const D=JSON.parse(fs.readFileSync(new URL('../data/atlas.json',import.meta.url)));
const nodes=new Map();
const el=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',style:{},dataset:{},attrs:{},open:false,isConnected:true,classList:{add(){},remove(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},focus(){},click(){},remove(){}});return nodes.get(selector);};
const saved=new Map();let downloaded;
const context={window:{ATLAS_DATA:D,addEventListener(){},scrollTo(){}},document:{querySelector:el,documentElement:el('html'),body:{style:{},appendChild(){}},addEventListener(){},createElement:()=>el('download')},location:{hash:'',href:'https://example.test/'},history:{replaceState(a,b,hash){context.location.hash=hash;}},localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},navigator:{clipboard:{writeText:async()=>{}}},URLSearchParams,URL:{createObjectURL:b=>{downloaded=b;return 'blob:test';},revokeObjectURL(){}},Blob,setTimeout:()=>0,clearTimeout(){},console};
vm.createContext(context);
let app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
app=app.replace('render();\n})();','window.test={render,evidenceFiltered,exportCSV,applyTheme,toggleTheme,openRecord,closeRecord};render();\n})();');
vm.runInContext(app,context);
const T=context.window.test;
function route(hash){context.location.hash=hash;T.render();return el('#main').innerHTML;}
assert.equal(D.sectors.length,6);assert.equal(D.records.length,32);assert(D.records.every(r=>r.verified));
assert.equal((route('#sectors').match(/class="sector-card"/g)||[]).length,6);
assert.equal((route('#sectors?scope=all').match(/class="sector-card"/g)||[]).length,6);
for(const r of ['timeline','compare','lessons','evidence','methods'])assert(route('#'+r).includes('<h1>'));
for(const s of D.sectors)for(const tab of ['overview','history','provisions','lessons']){
 const html=route(`#sector/${s.id}?tab=${tab}`);assert(html.includes(s.name.replaceAll('&','&amp;')));assert(!html.includes('undefined'));
}
for(const r of D.records){route('#evidence?record='+r.uid);assert(el('#record-dialog').open);assert(el('#record-content').innerHTML.includes(r.id));T.closeRecord();}
route('#evidence?record=record-16');assert(!el('#record-dialog').open);assert(!context.location.hash.includes('record='));
for(const s of D.sectors){route('#evidence?sector='+s.id);assert.equal(T.evidenceFiltered().length,s.count);T.exportCSV();assert.equal(el('download').download,'commitment-atlas-filtered.csv');const csv=await downloaded.text();assert(csv.includes(s.name.split(' &')[0])||csv.includes(D.records.find(r=>r.sector===s.id).title));}
route('#evidence?q=unmatched-term-zzz');assert.equal(T.evidenceFiltered().length,0);assert(el('#main').innerHTML.includes('No provisions match'));
route('#evidence?sector=03&type=Ban');assert(T.evidenceFiltered().every(r=>r.sector==='03'&&r.type==='Ban'));
const methods=route('#methods');for(const banned of ['Interface references','Why these examples are featured','Review of evidence and review of synthesis','ten sectors','66 provision'])assert(!methods.includes(banned));
assert(methods.includes('AI-assisted interpretations'));assert(methods.indexOf('snapshot-note')>methods.indexOf('class="authors"'));
T.applyTheme('light');assert.equal(el('html').dataset.theme,'light');T.toggleTheme();assert.equal(el('html').dataset.theme,'dark');assert.equal(saved.get('commitment-atlas-theme'),'dark');T.toggleTheme();assert.equal(saved.get('commitment-atlas-theme'),'light');
console.log('Passed: six-sector scope; all routes and 24 sector views; 32 dialogs; excluded-record rejection; filters, CSV exports, methods and theme persistence.');
