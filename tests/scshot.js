const {chromium}=require('playwright');const out=process.argv[2]||'base';
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const pg=await b.newPage({viewport:{width:1280,height:800}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
await pg.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await pg.waitForTimeout(400);await pg.evaluate(()=>{document.querySelector('#intro').hidden=true});
const L=[['station','night','zheng'],['bridge','night',null],['park','dusk','wang'],['alley','night','kai'],['site','day','luo'],['market','night','chang'],['room','night',null],['yard','night',null],['hospital','day',null],['temple','dusk',null],['river','dusk',null],['ximen','night',null],['underpass','night',null],['sea','dawn',null],['office','day','lin']];
const t0=Date.now();
for(const [sc,td,np] of L){await pg.evaluate(([sc,td,np])=>Scene.set(sc,{season:'秋',stage:1,tod:td,npc:np,dog:true,look:{bag:1}}),[sc,td,np]);await pg.waitForTimeout(1100);await pg.locator('#scene').screenshot({path:`${out}/${sc}.png`})}
const fps=await pg.evaluate(()=>new Promise(r=>{let n=0,s=performance.now();const f=()=>{n++;if(performance.now()-s<2000)requestAnimationFrame(f);else r(n/2)};requestAnimationFrame(f)}));
console.log('fps',fps,'errors',JSON.stringify(errs));await b.close()})();
