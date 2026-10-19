const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const pg=await b.newPage({viewport:{width:1280,height:800}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
await pg.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await pg.waitForTimeout(400);await pg.click('.origin[data-k="excon"]');await pg.waitForTimeout(300);await pg.screenshot({path:'d_cards.png'});await pg.click('.scard');
let did={job:0,npc:0},k=0;
for(;k<600;k++){await pg.evaluate(()=>{if(typing)typing.finish()});
 if(await pg.$('#ending:not([hidden])'))break;
 {const md=await pg.$('#chapter:not([hidden]) .mode');if(md){await md.click();continue}}
 if(await pg.$('#dlg:not([hidden])')){const t=await pg.$('#dlgIn .take:not([disabled])');if(t&&!did.job){await pg.screenshot({path:'d_jobs.png'});await t.click();did.job=1;await pg.waitForTimeout(400);await pg.screenshot({path:'d_toast.png'});continue}const a=await pg.$('#dlgIn .act:not([disabled])');if(a){await pg.screenshot({path:'d_npc.png'});await a.click();did.npc=1;continue}await pg.click('#dlgBack');continue}
 if(await pg.$('#map:not([hidden])')){
   if(!did.job){const j=await pg.$('.ljob');if(j){await j.click();continue}}
   if(!did.npc){const n=await pg.$('.npcb');if(n){await n.click();continue}}
   await (await pg.$('#mapCards .lgo')).click();continue}
 if(await pg.$('#mini:not([hidden])')){await pg.evaluate(()=>{document.querySelector('#mini').hidden=true;endMini(miniGame,G.simMini(S,miniGame))});continue}
 const ch=await pg.$$('#choices .choice:not([disabled])');if(ch.length){await ch[Math.floor(Math.random()*ch.length)].click();continue}
 const go=await pg.$('#choices .go');if(go){await go.click();continue}
 await pg.waitForTimeout(50);}
await pg.waitForTimeout(600);await pg.screenshot({path:'d_end.png',fullPage:false});
await pg.evaluate(()=>document.querySelector('#ending').scrollTop=99999);await pg.waitForTimeout(200);await pg.screenshot({path:'d_end2.png'});
console.log('steps',k,JSON.stringify(did),'errors',JSON.stringify(errs));await b.close()})();
