import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/atlas.json'),'utf8'));
const allowedSectors=['01','02','03','06','07','10'];
if(data.sectors.length!==6||data.sectors.some(s=>!allowedSectors.includes(s.id)))throw new Error('Only the six paper sectors may be published.');
if(data.records.length!==32||new Set(data.records.map(r=>r.uid)).size!==32)throw new Error('Verified record count or unique keys changed. Review the dataset before publishing.');
if(data.records.some(r=>r.verified!==true||!allowedSectors.includes(r.sector)))throw new Error('Unverified or out-of-scope record in the public dataset.');
for(const s of data.sectors){
  if(s.count!==data.records.filter(r=>r.sector===s.id).length)throw new Error('Incorrect sector count: '+s.id);
  for(const uid of [...s.refs,...s.featured])if(!data.records.some(r=>r.uid===uid&&r.sector===s.id))throw new Error('Unresolved sector reference: '+uid);
}
for(const l of data.lessons){
  for(const uid of l.refs)if(!data.records.some(r=>r.uid===uid))throw new Error('Unresolved lesson reference: '+uid);
  if(l.sectors.some(id=>!allowedSectors.includes(id)))throw new Error('Out-of-scope lesson sector.');
}
for(const m of data.milestones)if(!allowedSectors.includes(m.sector)||!m.linkedRecordUids?.length)throw new Error('Out-of-scope or unsupported milestone.');
for(const m of data.milestones)for(const uid of m.linkedRecordUids||[])if(!data.records.some(r=>r.uid===uid))throw new Error('Unresolved milestone reference: '+uid);
const safeScript=s=>s.replace(/<\/script/gi,'<\\/script');
fs.writeFileSync(path.join(dist,'data.js'),'window.ATLAS_DATA = '+JSON.stringify(data)+';\n');
fs.writeFileSync(path.join(dist,'atlas-data.json'),JSON.stringify(data,null,2));
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+fs.readFileSync(path.join(dist,'styles.css'),'utf8')+'\n</style>');
html=html.replace('<script src="data.js" defer></script>','').replace('<script src="app.js" defer></script>','');
html=html.replace('</body>','<script>\n'+safeScript(fs.readFileSync(path.join(dist,'data.js'),'utf8'))+'\n'+safeScript(fs.readFileSync(path.join(dist,'app.js'),'utf8'))+'\n</script>\n</body>');
fs.mkdirSync(path.join(root,'output'),{recursive:true});
fs.writeFileSync(path.join(root,'output/commitment-atlas.html'),html);
console.log(`Built a self-contained dashboard with ${data.records.length} provisions, ${data.sectors.length} sectors and ${data.milestones.length} milestones.`);
