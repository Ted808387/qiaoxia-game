const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const pg=await b.newPage({viewport:{width:1280,height:800}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
await pg.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await pg.waitForTimeout(400);
await pg.click('#galBtn');await pg.waitForTimeout(300);await pg.screenshot({path:'n_gallery.png'});await pg.click('#dlgBack');
await pg.click('.origin[data-k="debt"]');await pg.waitForTimeout(200);await pg.click('.scard');await pg.waitForTimeout(500);
await pg.click('#chapter:not([hidden]) .mode');await pg.waitForTimeout(300);await pg.evaluate(()=>{S.f.gear=1;S.f.phone=1;hud()});
await pg.click('#bagBtn');await pg.waitForTimeout(200);
await pg.click('.bagact[data-k="ring"]');await pg.waitForTimeout(300);await pg.screenshot({path:'n_bag.png'});
await pg.click('#dlgBack');await pg.waitForTimeout(300);await pg.screenshot({path:'n_toast.png'});
// festival
await pg.evaluate(()=>{S.ch=4;S.step=3;S.day=300;S.f.zhengFate='dead';S.f.chang=2;S.money=5000;S.queue=[];phase='outcome';next()});await pg.waitForTimeout(800);
await pg.evaluate(()=>{if(typing)typing.finish()});await pg.waitForTimeout(500);await pg.screenshot({path:'n_fest.png'});
console.log('title',await pg.textContent('#title'));
// play to end
let k=0;for(;k<900;k++){await pg.evaluate(()=>{if(typing)typing.finish()});
 if(await pg.$('#ending:not([hidden])'))break;
 {const md=await pg.$('#chapter:not([hidden]) .mode');if(md){await md.click();continue}}
 if(await pg.$('#dlg:not([hidden])')){const a=await pg.$('#dlgIn .act:not([disabled])');if(a){await a.click();continue}await pg.click('#dlgBack');continue}
 if(await pg.$('#map:not([hidden])')){const n=await pg.$('.npcb');if(n&&Math.random()<.4){await n.click();continue}await (await pg.$('#mapCards .lgo')).click();continue}
 if(await pg.$('#mini:not([hidden])')){await pg.evaluate(()=>{document.querySelector('#mini').hidden=true;endMini(miniGame,G.simMini(S,miniGame))});continue}
 const ch=await pg.$$('#choices .choice:not([disabled])');if(ch.length){await ch[Math.floor(Math.random()*ch.length)].click();continue}
 const go=await pg.$('#choices .go');if(go){await go.click();continue}
 await pg.waitForTimeout(50);}
await pg.waitForTimeout(600);await pg.screenshot({path:'n_end.png'});
await pg.evaluate(()=>document.querySelector('#ending').scrollTop=700);await pg.waitForTimeout(200);await pg.screenshot({path:'n_end2.png'});
console.log('steps',k,'errors',JSON.stringify(errs));await b.close()})();
