
/* ═════════ 第十四版：背包與當舖、成就與轉捩點、節慶與人情 ═════════ */

/* ── 信任可以寫在結果裡：trust:{wang:8} ── */
{const A0=apply;apply=function(S,r){const out=A0(S,r);
 if(r&&r.trust)for(const k in r.trust)if(NPCS[k])addTrust(S,k,r.trust[k]);
 if(r&&(r.loan||r.loan2))S.f.everLoan=1;
 S.pk=S.pk||{addict:S.addict};S.pk.addict=Math.max(S.pk.addict,S.addict);
 return out}}

/* ── 背包 ── */
const KEEP={
 ring:{name:'婚戒',origin:'debt',val:6000,desc:'結婚那年在迪化街買的。美玲那只，她說早就賣了。'},
 bracelet:{name:'媽媽的金手鍊',origin:'excon',val:5000,desc:'你進去那年，媽媽託人送來的：「出來的時候，換一點錢用。」你一直沒換。'},
 watch:{name:'老婆送的手錶',origin:'injury',val:4000,desc:'結婚十週年她送的。錶帶斷過一次，你用鐵絲綁起來。'},
 medal:{name:'退休紀念金牌',origin:'teacher',val:8000,desc:'三十八年的教職，換來一面兩錢重的金牌。'}
};
const FLAGIT={
 gear:{name:'睡袋',val:300,desc:'露宿的時候，寒氣少一半。',steal:1},
 phone:{name:'手機',val:900,desc:'有網路就有工作的消息，排到工的機會多一點。',steal:1},
 scooter:{name:'機車',val:9000,desc:'跑外送一定要有。',steal:0}
};
const PAWNDAYS=90,PAWNRATE=1.3;
const homeless=S=>!S.house||S.house==='shelter'||S.house==='yard';
function invOf(S){if(!S.inv){S.inv={};for(const k in KEEP)if(KEEP[k].origin===S.origin)S.inv[k]='have'}S.pawn=S.pawn||{};return S.inv}
function items(S){invOf(S);const out=[];
 out.push({id:'idcard',name:'身分證',desc:F(S,'noID')?'不見了。找工作、租房子都要它。':'找工作、租房子、看病，什麼都要它。',status:F(S,'noID')?'gone':'have',fixed:1,sellID:!F(S,'noID')&&!F(S,'soldID')});
 for(const k in KEEP)if(S.inv[k]){const st=S.inv[k];out.push({id:k,name:KEEP[k].name,desc:KEEP[k].desc,status:st,keep:1,val:KEEP[k].val,cost:S.pawn[k]?S.pawn[k].cost:0,due:S.pawn[k]?S.pawn[k].due:0})}
 for(const k in FLAGIT){const t=FLAGIT[k];if(S.f[k])out.push({id:k,name:t.name,desc:t.desc,status:'have',val:t.val});else if(S.pawn[k])out.push({id:k,name:t.name,desc:t.desc,status:'pawned',val:t.val,cost:S.pawn[k].cost,due:S.pawn[k].due})}
 if(S.origin==='family'){const st=F(S,'guitarLost')?'lost':F(S,'guitarPawn')?'pawned':'have';out.push({id:'guitar',name:'纏著電火布的吉他',desc:'你從家裡帶出來的唯一一樣東西。',status:st,val:3000,cost:4500,due:0,keep:1})}
 return out}
function pawnItem(S,id){const it=items(S).find(x=>x.id===id);if(!it||it.status!=='have'||it.fixed)return null;
 if(id==='guitar'){S.f.guitarPawn=1}else{S.pawn[id]={due:S.day+PAWNDAYS,cost:Math.round(it.val*PAWNRATE)};if(KEEP[id])S.inv[id]='pawned';else delete S.f[id]}
 S.money+=it.val;S.f.everPawn=1;S.log.push({day:S.day,t:`把「${it.name}」拿去當了 ${it.val.toLocaleString()} 元`});
 if(it.keep)S.mind-=4;
 S.notices=(S.notices||[]).concat(id==='guitar'?`你把吉他當了 3,000。贖回來要 4,500。`:`你把「${it.name}」當了 ${it.val.toLocaleString()}。第 ${S.day+PAWNDAYS} 天以前，拿 ${Math.round(it.val*PAWNRATE).toLocaleString()} 才贖得回來。`);
 clamp(S);return it.val}
function redeemItem(S,id){const it=items(S).find(x=>x.id===id);if(!it||it.status!=='pawned'||S.money<it.cost)return null;
 S.money-=it.cost;
 if(id==='guitar'){S.f.guitarPawn=0;delete S.f.guitarPawn;const c0=CUR;CUR={id:'f2_redeem',t:''};try{if(!F(S,'busk')){apply(S,{addInc:140,set:{busk:1}})}}finally{CUR=c0}}
 else{delete S.pawn[id];if(KEEP[id])S.inv[id]='have';else S.f[id]=1}
 if(it.keep){S.f.redeemed=1;S.mind+=6}
 S.log.push({day:S.day,t:`把「${it.name}」贖了回來`});S.notices=(S.notices||[]).concat(`「${it.name}」贖回來了。`);clamp(S);return it.cost}
function sellID(S){if(F(S,'noID')||F(S,'soldID'))return null;apply(S,{money:3000,con:-8,heat:1,set:{noID:1,soldID:1,soldIDDay:S.day},log:'把身分證賣給收人頭的人'});S.notices=(S.notices||[]).concat('三千塊到手了。你的名字，現在在別人手上。');return 3000}
/* 流當、被偷 */
{const U0=upkeep;upkeep=function(S,days,opt){const u=U0(S,days,opt);invOf(S);
 for(const k in S.pawn){const p=S.pawn[k];if(S.day>p.due){delete S.pawn[k];const nm=KEEP[k]?KEEP[k].name:FLAGIT[k].name;if(KEEP[k])S.inv[k]='lost';S.notices=(S.notices||[]).concat(`「${nm}」過了贖回的期限，流當了。`);S.log.push({day:S.day,t:`「${nm}」流當了`})}}
 if(homeless(S)&&!(S.f&&S.f.bankAcct&&S.house==='shelter')){const pool=[...Object.keys(KEEP).filter(k=>S.inv[k]==='have'),...Object.keys(FLAGIT).filter(k=>FLAGIT[k].steal&&S.f[k])];
  if(pool.length&&Math.random()<1-Math.pow(1-.0035,days)){const k=pool[Math.floor(Math.random()*pool.length)];const nm=KEEP[k]?KEEP[k].name:FLAGIT[k].name;if(KEEP[k])S.inv[k]='stolen';else delete S.f[k];S.mind-=4;u.lostItem=nm;S.notices=(S.notices||[]).concat(`你醒來的時候，「${nm}」不見了。睡在外面，什麼都留不住。`);S.log.push({day:S.day,t:`「${nm}」被偷了`})}}
 S.pk=S.pk||{addict:S.addict};S.pk.addict=Math.max(S.pk.addict,S.addict);
 if(F(S,'soldID')&&!F(S,'idCop')&&S.day-(S.f.soldIDDay||S.day)>=45&&!S.queue.includes('it_idcop')){S.f.idCop=1;S.queue.push('it_idcop')}
 return u}}
EV.it_idcop={scene:'alley',tod:'day',title:'人頭帳戶',
 text:()=>'兩個便衣在早餐店門口叫住你。\n\n「你的名字開了四個帳戶、兩支門號，上個月有三個老人的退休金，從這些帳戶裡轉走了。」其中一個把一張照片推到你面前，是一個哭紅了眼睛的阿嬤。\n\n「你說，身分證是被偷的，還是你賣的？」',
 ch:[
  {t:'說實話，是你賣的',r:{t:'你被移送地檢署。檢察官看了你很久，最後給了緩起訴，條件是一百二十個小時的社區服務。\n\n掃廟埕的時候，你一直想起那個阿嬤的臉。',con:6,mind:-6,heat:1,days:10,noIncome:1,log:'承認賣了身分證，緩起訴'}},
  {t:'說是被偷的',r:(S,R)=>R()<.55?{t:'他們看了你很久，最後讓你在筆錄上簽名，叫你去補辦身分證。\n\n你走出派出所，覺得自己又欠了一筆不知道要還給誰的債。',con:-6,mind:-3}:{t:'買你身分證的那個人已經被抓了，他記得你的臉，記得你收了三千。\n\n說謊，又多了一條罪。',heat:2,con:-4,mind:-10,hp:-4,money:-Math.min(S.money,10000),log:'賣身分證又說謊，被罰了錢'}}
 ]};
/* 送東西 */
const GIFTLINE={gear:{zheng:'老鄭摸著睡袋的拉鍊，摸了很久：「我跑船的時候，也有一個這種的。」',luo:'小羅當天晚上就睡在裡面，早上起來說，他第一次睡到天亮。'},phone:{luo:'小羅抱著手機，問你怎麼打字。你教他打自己的名字。',lily:'莉莉用它跟越南的媽媽視訊。她把螢幕轉過來，讓媽媽看你。'}};
{const N0=npcsAt;npcsAt=function(S,loc){const out=N0(S,loc);invOf(S);const gifts=items(S).filter(x=>x.status==='have'&&!x.fixed&&x.id!=='scooter');
 out.forEach(p=>{gifts.forEach(g=>p.acts.push({key:'gift:'+g.id,label:`送他「${g.name}」`,ok:true,gift:1}))});return out}}
{const M0=meet;meet=function(S,id,act){
 if(act==='borrow')S.f.everLoan=1;
 if(!act||act.indexOf('gift:')!==0)return M0(S,id,act);
 const k=act.slice(5);const n=NPCS[id];const it=items(S).find(x=>x.id===k&&x.status==='have');if(!it||!n.here(S))return null;
 if(k==='guitar')S.f.guitarLost=1;else if(KEEP[k])S.inv[k]='gift';else delete S.f[k];
 const line=(GIFTLINE[k]&&GIFTLINE[k][id])||(it.keep?`${n.name}看著「${it.name}」，沒有馬上收下：「這是你的東西。」你說，放在你那裡比較安全。他收下了，用手帕包了兩層。`:`${n.name}收下「${it.name}」，看了你一眼：「那你呢？」你說你還有辦法。`);
 const r={t:`你去${MAPLOC[n.loc].name}找${n.name}。\n\n`+line,mind:it.keep?2:3,con:it.keep?4:2,log:`把「${it.name}」送給了${n.name}`};
 addTrust(S,id,it.keep?24:16);S.f.gave=(S.f.gave||0)+1;
 const before={};SNAPK.forEach(x=>before[x]=S[x]);apply(S,r);const delta={};SNAPK.forEach(x=>{const d=S[x]-before[x];if(Math.abs(d)>=.5)delta[x]=Math.round(d)});
 const up=upkeep(S,CH[S.ch].days,{});return {text:r.t,delta,up,title:n.name}}}

/* ── 轉捩點 ── */
{const C1=choose;choose=function(S,id,i,R){const ev=EV[id];let pre=null;
 try{const cl=choiceList(S,ev);const okc=cl.filter(x=>x.ok&&x.c!==FALLBACK);if(okc.length>=2&&cl[i]){pre={title:String(val(ev.title,S)),pick:String(val(cl[i].c.t,S)),alts:okc.filter(x=>x!==cl[i]).map(x=>String(val(x.c.t,S))).slice(0,2),b:{con:S.con,money:S.money,rep:S.rep,hp:S.hp,mind:S.mind,biz:!!S.biz,house:S.house,path:S.path,job:S.job&&S.job.name}}}}catch(e){pre=null}
 const day=S.day;const out=C1(S,id,i,R);
 if(out&&!out.mini&&pre){const b=pre.b;let w=Math.abs(S.con-b.con)*1.3+Math.abs(S.money-b.money)/500+Math.abs(S.rep-b.rep)*.8+Math.abs(S.hp-b.hp)*.5+Math.abs(S.mind-b.mind)*.5;
  if(!!S.biz!==b.biz)w+=18;if(S.house!==b.house)w+=8;if(S.path!==b.path)w+=10;if((S.job&&S.job.name)!==b.job)w+=5;if(S.end)w+=25;if(S.log.length&&S.log[S.log.length-1].day===day)w+=6;
  S.tp=(S.tp||[]);S.tp.push({day,title:pre.title,pick:pre.pick,alts:pre.alts,w:Math.round(w)});S.tp.sort((a,b)=>b.w-a.w);S.tp=S.tp.slice(0,6)}
 return out}}
function turning(S){return (S.tp||[]).slice(0,3).sort((a,b)=>a.day-b.day)}

/* ── 結局提示 ── */
const HINT={
 tycoon:'一門生意做到最大，而且一路上沒有把良心賣掉。',tycoon_dark:'一門生意做到最大，代價是別人的。',boss:'接下強哥留下的東西。',stall:'王媽的鍋鏟，總有一天要交給一個人。',foreman:'工地上，有人需要一個帶班的。',recycler:'阿財的秤，最後會在誰手上？',cart:'夜市的一盞燈，從一台推車開始。',peer:'你被人拉過一把。換你回頭拉別人。',
 home:'一扇自己的門、穩定的收入、一筆不會一下就用完的存款。',edge:'有工作，或有屋頂，但還沒有兩個都抓住。',street:'什麼都沒有，但撐過了兩年。',bankrupt:'生意做起來了，然後倒了。',prison:'有人要你替他扛下一件事。',caught:'灰色的路，走得太深。',broken:'精神撐不住，第二次。',dead:'身體撐不住，第二次。',
 exonerated:'剛出獄的人，心裡一直有一件沒說的事。',singer:'和家裡斷了的人，把吉他留在身邊，練到有人願意聽。',teacher:'一個老師，在萬華還能教誰？',debtfree:'生意倒了的人，總要面對那筆債。',father:'工地摔下來的人，兒子的書還沒念完。',family_home:'有人在等你。你得先願意回去。',revoked:'對觀護人說的謊，總有一天會被拆穿。',
 dabo:'華西街整條都是你的，而且你還活著。',whitewash:'黑的錢，洗成白的。需要一個議員朋友。',jiaotou:'守著幾間茶室，看別人的臉色。',killed:'坐上那個位子，有人不高興。',voice:'把街上的事，說給會開會的人聽。',diploma:'回學校。晚上的那種。',south:'有時候，離開台北也是一條路。',sea:'老鄭那條路：簽下合約，上船。',lost_sea:'上了船，海不一定讓你回來。',
 councilor:'從橋下選上議員，一毛不該拿的都沒拿。',blackgold:'選上了，靠的是不該靠的東西。',lizhang:'選一個小一點的位子，守一個里。',lost_election:'出來選了。',indicted:'選上了，然後買票被查到。'
};

/* ── 成就 ── */
const SAVED=S=>[S.f.huei==='saved',F(S,'luo')&&!F(S,'luoLost'),F(S,'haoSaved'),['saved','hospital'].includes(S.f.zhengFate),F(S,'wangSaved'),(S.f.changSober||0)>=2||F(S,'changOK'),F(S,'luoSafe'),F(S,'changWang')].filter(Boolean).length;
const DIRTY=S=>['gray','grayJob','dealtGang','caiPartner','polDirty','sanchongDeal','fundTaken','soldID'].some(k=>F(S,k));
const GANGEND=['boss','dabo','whitewash','jiaotou','killed','blackgold','indicted','caught','prison','tycoon_dark'];
const ACH=[
 {id:'sober',name:'滴酒不沾',desc:'撐到結局，酒癮從來沒有超過 20。',test:(S,k)=>ENDINGS[k].tier>=1&&(S.pk?S.pk.addict:S.addict)<=20},
 {id:'clean',name:'乾淨的手',desc:'走到三級以上的結局，一次都沒有碰過黑錢、封口費或人頭。',test:(S,k)=>ENDINGS[k].tier>=3&&!DIRTY(S)&&!GANGEND.includes(k)},
 {id:'hell',name:'從地獄回來',desc:'在「地獄」難度撐過兩年。',test:(S,k)=>S.diff==='hell'&&ENDINGS[k].tier>=1},
 {id:'hellup',name:'地獄裡的燈',desc:'在「地獄」難度走到四級以上的結局。',test:(S,k)=>S.diff==='hell'&&ENDINGS[k].tier>=4},
 {id:'helper',name:'拉人一把',desc:'一輪裡，把三個以上的人拉離最壞的那條路。',test:S=>SAVED(S)>=3},
 {id:'friends',name:'這條街的朋友',desc:'結局時，有五個人對你的信任在 70 以上。',test:S=>Object.values(S.rel||{}).filter(v=>v>=70).length>=5},
 {id:'noloan',name:'不欠任何人',desc:'走到三級以上的結局，從來沒有借過錢。',test:(S,k)=>ENDINGS[k].tier>=3&&!F(S,'everLoan')},
 {id:'redeem',name:'贖回來了',desc:'把當掉的傳家物贖回來。',test:S=>F(S,'redeemed')},
 {id:'keep',name:'沒有當掉的東西',desc:'窮到最低的時候，也沒有進過當舖，最後還是走到三級以上的結局。',test:(S,k)=>ENDINGS[k].tier>=3&&!F(S,'everPawn')&&!F(S,'guitarPawn')},
 {id:'giver',name:'送出去的',desc:'把三樣東西送給這條街上的人。',test:S=>(S.f.gave||0)>=3},
 {id:'ghost',name:'普渡',desc:'中元普渡那天，請橋下的人吃一頓。',test:S=>F(S,'ghostFeast')},
 {id:'million',name:'百萬',desc:'結局時，身價超過一百萬。',test:S=>worth(S)>=1000000},
 {id:'poor',name:'兩袖清風',desc:'良知 80 以上，存款不到一千，還是走到三級以上的結局。',test:(S,k)=>S.con>=80&&S.money<1000&&ENDINGS[k].tier>=3},
 {id:'dog',name:'黑輪',desc:'結局時，身邊還有一隻狗。',test:S=>F(S,'dog')},
 {id:'nonet',name:'沒有第二次',desc:'不靠任何一次安全網，走到二級以上的結局。',test:(S,k)=>ENDINGS[k].tier>=2&&!S.seen.includes('net_hp')&&!S.seen.includes('net_mind')},
 {id:'lives',name:'五種人生',desc:'用每一種出身，各走完一輪。',test:(S,k,m)=>Object.keys(ORIGINS).every(o=>(m.origins||[]).includes(o))},
 {id:'col10',name:'十種結局',desc:'解鎖十個不同的結局。',test:(S,k,m)=>(m.got||[]).length>=10},
 {id:'col25',name:'二十五種結局',desc:'解鎖二十五個不同的結局。',test:(S,k,m)=>(m.got||[]).length>=25},
 {id:'colall',name:'萬華的每一條路',desc:'解鎖所有結局。',test:(S,k,m)=>Object.keys(ENDINGS).every(x=>(m.got||[]).includes(x))}
];
function achCheck(S,key,meta){meta=meta||{};return ACH.filter(a=>{try{return a.test(S,key,meta)}catch(e){return false}}).map(a=>a.id)}

/* ── 節慶：依日期觸發，一輪各一次 ── */
const md=day=>{const d=dateOf(day);return (d.getMonth()+1)*100+d.getDate()};
const FEST=[
 {id:'fest_ny',on:S=>{const x=md(S.day);return x>=1225||x<=108}},
 {id:'fest_mazu',on:S=>{const x=md(S.day);return x>=320&&x<=510}},
 {id:'fest_ghost',on:S=>{const x=md(S.day);return x>=808&&x<=915}}
];
{const AD0=advance;advance=function(S,R){
 if(!S.end&&S.hp>.5&&S.mind>.5&&!S.queue.length&&S.ch>=1){const f=FEST.find(x=>!S.seen.includes(x.id)&&!(S.festDone||[]).includes(x.id)&&x.on(S));if(f){S.festDone=(S.festDone||[]).concat(f.id);return {type:'event',id:f.id}}}
 return AD0(S,R)}}
const changOK2=S=>S.f.chang&&!F(S,'changGone')&&((S.f.changSober||0)>=1||S.f.chang===2||F(S,'changOK'));
Object.assign(EV,{
fest_ghost:{scene:'temple',tod:'night',days:3,title:'普渡',
 text:S=>`農曆七月十五。整條廣州街的騎樓都擺滿了供桌：整隻的雞、一箱一箱的泡麵和罐頭、插著三角旗的米山。龍山寺前的香爐燒了一整天，煙把路燈都熏黃了。\n\n普渡拜的是「好兄弟」，那些沒有人祭拜的人。${S.f.zhengFate==='dead'?'\n\n你想到老鄭。今年，大概沒有人會為他燒一張紙。':''}\n\n廟方在找人搬供品、顧流水席；${F(S,'gray')&&!F(S,'strongEnemy')?'阿凱在人群裡跟你招手，強哥承包了今年的普渡攤位；':''}橋下的人都在等收桌，等那些拜完的東西。`,
 ch:[
  {t:'去廟口顧流水席，做一天工',req:{hp:35},r:{t:'從早上六點搬到半夜。收桌的時候，廟公塞給你一千二，又多塞了一袋拜過的罐頭：「好兄弟吃過的，你吃了會平安。」',money:1200,hp:-5,rep:4}},
  {t:'跟橋下的人一起等收桌',r:S=>({t:housed(S)?'你提了兩大袋罐頭和泡麵，走回橋下分給以前的鄰居。有個老人說：「你現在有房子了，還記得回來喔。」':'收桌的時候大家一擁而上。你搶到一袋米和六個罐頭，還被人推倒，膝蓋擦破了一大塊。\n\n那袋米，你吃了半個月。',hp:housed(S)?2:5,money:housed(S)?0:300,con:housed(S)?4:0,rep:housed(S)?4:1})},
  {t:'請阿昌掌廚，給橋下的人辦一桌',show:changOK2,req:{money:2000},r:{t:'阿昌借了一個卡式爐、兩口大鍋，在橋下煮了一整個下午：滷肉、白斬雞、一鍋菜頭排骨湯。\n\n二十幾個人圍著帆布吃。阿昌一滴酒都沒喝，最後自己端著一碗湯，走到河堤邊，倒了一半在地上：「這碗給沒來的。」',money:-2000,rep:10,con:6,mind:6,trust:{chang:14},set:{ghostFeast:1,changCooked:1},log:'中元普渡，請阿昌給橋下的人辦了一桌'}},
  {t:'自己出錢，給橋下的人辦一桌',show:S=>!changOK2(S),req:{money:2500},r:{t:'你去黃昏市場買了雞和豬肉，跟廟口借了桌子。煮得不怎麼樣，但二十幾個人都吃完了。\n\n有人問你為什麼。你說，普渡嘛。',money:-2500,rep:8,con:5,mind:4,set:{ghostFeast:1},log:'中元普渡，給橋下的人辦了一桌'}},
  {t:'幫阿凱顧強哥的普渡攤位',show:S=>F(S,'gray')&&!F(S,'strongEnemy')&&!F(S,'strongGone'),r:{t:'攤位賣的是香、金紙和「平安符」。一份平安符賣六百，成本二十。你負責收錢，阿凱負責跟每一個不想買的人「聊聊」。\n\n收攤的時候，阿凱分給你三千。',money:3000,con:-7,heat:1,trust:{kai:8},set:{gray:1}}},
  {t:'為老鄭燒一份紙錢',show:S=>S.f.zhengFate==='dead',req:{money:200},r:{t:'你買了一疊金紙和一包他以前抽的那種菸，在河堤邊燒。風很大，紙灰一直往你臉上吹。\n\n你點了一根菸，放在石頭上，看它燒完。',money:-200,mind:9,con:2,log:'中元普渡，為老鄭燒了紙錢'}},
  {t:'去廟後面的四色牌桌碰碰運氣',req:{money:500},r:(S,R)=>R()<.42?{t:'你連贏了五把。旁邊的人開始叫你「七月仔」。你拿著三千塊離開的時候，手還在發抖。',money:2500,addict:3,mind:3}:{t:'你輸了第一把，然後想贏回來。天亮的時候，你身上只剩回程的公車錢。',money:-Math.min(S.money-20,3000),addict:4,mind:-8,log:'普渡夜在四色牌桌輸光了'}}
 ]},
fest_mazu:{scene:'temple',tod:'day',days:3,title:'遶境',
 text:S=>`三月，媽祖遶境經過萬華。鞭炮從早上炸到晚上，紅色的炮屑在西園路上積了一層，像下過一場紅色的雪。\n\n陣頭的少年臉上畫著臉譜，踩著七星步走過去。宮廟在招扛轎的人，一天兩千。${F(S,'luo')?'\n\n你在八家將的隊伍裡，看到一張熟悉的臉。是小羅。他身邊那個拿著扇子、一直在講電話的人，你認得，是阿凱的手下。':''}`,
 ch:[
  {t:'去扛轎',req:{hp:45},r:{t:'轎子比你想的重。你的肩膀磨破了皮，腳底起了三個水泡。轎子在廟前「起駕」的那一刻，所有人都在喊，你也在喊，喊什麼你自己也不知道。\n\n兩千塊，還有一條平安符。',money:2000,hp:-7,mind:5,rep:6}},
  {t:'把小羅從隊伍裡拉出來',show:S=>F(S,'luo'),r:(S,R)=>R()<.6||S.rep>=40?{t:'你等到隊伍休息的時候，把他拉到騎樓下。他說陣頭的人對他很好，給他吃住，「只是偶爾幫忙送東西」。\n\n你說，送的是什麼東西？他沒有回答。那天晚上，他把八家將的衣服還了回去。',con:6,rep:-2,trust:{luo:12,kai:-10},set:{luoSafe:1},log:'把小羅從陣頭拉了出來'}:{t:'阿凱的手下擋在你們中間：「他是我們的人。」小羅低著頭，沒有跟你走。\n\n你回去的路上，一直在想你剛上街的時候，是誰把你拉住的。',con:3,mind:-6,trust:{luo:4},set:{luoLost:1}}},
  {t:'在路邊賣水和涼茶',req:{money:300},r:S=>S.biz&&['stall','cart'].includes(S.biz.type)?{t:'你把攤子推到遶境路線上，涼茶一杯三十，一個下午賣了四百杯。香客說你的茶比廟裡的平安符還靈。',money:9000,hp:-3,rep:4}:{t:'你批了兩箱礦泉水，一瓶賣二十。一個下午賣完。廟方的人過來要你繳「清潔費」三百。',money:600,hp:-3}},
  {t:'跪下來求一支籤',r:(S,R)=>{const q=pickL(R,[['第三十二籤，中平：「勞心汩汩竟何歸，疾病兼多是與非。」','解籤的阿伯說：「身體顧好，其他的慢慢來。」'],['第七籤，上上：「雲開月出正分明，不須進退問前程。」','解籤的阿伯說：「你最近遇到的人，有一個是你的貴人。」'],['第五十三籤，下下：「看君來問心中事，積善之家慶有餘。」','解籤的阿伯說：「下下籤不是壞事，是叫你多做好事。」']]);return {t:`香煙很濃，你跪在蒲團上，把這兩年的事一件一件在心裡說了一遍。\n\n${q[0]}\n\n${q[1]}`,mind:8,con:2}}}
 ]},
fest_ny:{scene:'ximen',tod:'night',days:2,title:'跨年',
 text:S=>`十二月三十一日。西門町擠滿了人，大家都在往同一個方向看：一○一的方向。\n\n${isRoom(S)?'你的房間在巷子裡，看不到煙火，只聽得到聲音。':'橋下有人生了一小堆火，把收音機開得很大聲。'}\n\n倒數之前，你可以待在任何地方。`,
 ch:[
  {t:'在西門町撿瓶子',r:{t:'跨年夜的人潮，留下了一整條街的寶特瓶和鋁罐。你撿到凌晨四點，裝滿了三大袋。\n\n倒數的時候你正蹲在垃圾桶旁邊。你抬頭看了一下天空，然後繼續撿。',money:900,hp:-4,mind:-1}},
  {t:'回橋下，跟大家一起倒數',r:S=>({t:`${housed(S)?'你提了一袋滷味回去。':'你們把最後半瓶米酒輪流喝完。'}倒數到零的時候，遠遠的煙火在高架橋的縫隙裡炸開，只看得到一角。\n\n有人說：「明年一定會比較好。」每個人都說好，沒有人相信，但大家都笑了。`,mind:8,rep:4,addict:housed(S)?0:2})},
  {t:'打給一個很久沒聯絡的人',req:{money:20},r:S=>({t:{debt:'你打給美玲。她沒接。三分鐘後，她傳了一則訊息：「小晴說新年快樂。」',excon:'你打給姐姐。她接起來，聽到你的聲音，沉默了很久，說：「媽在問你。」',injury:'你打給兒子。他在跟同學跨年，電話那頭很吵。他大聲說：「爸！新年快樂！」然後就斷了。',family:'你打給小雯。她說：「爸在旁邊。」你等了很久，電話裡只有電視的聲音。最後她說：「他點頭了。」',teacher:'你打給以前的同事。他說學校改建了，你的教室變成電腦教室。'}[S.origin]||'電話響了很久，沒有人接。',money:-20,mind:6})},
  {t:'一個人去河堤看煙火',r:{t:'從河堤看過去，一○一很小，煙火更小，像有人在很遠的地方點了一根火柴。\n\n你一個人看完了。冷，但很安靜。',mind:5,hp:-1}}
 ]},

/* ── 人情：NPC 之間的事 ── */
lk_chang_wang:{scene:'market',tod:'day',npc:'wang',title:'掌廚',
 text:()=>'王媽的膝蓋開刀，至少要休息三個月。便當店的灶，沒有人顧。\n\n「我認識一個以前辦桌的，」你說。王媽的眼睛亮了一下，聽到名字，又暗下去：「阿昌？那個酒鬼？」\n\n她看著你。「你要是幫他作保，他出了事，就算你的。」',
 ch:[
  {t:'幫阿昌作保',r:(S,R)=>R()<((S.f.changSober||0)>=2||F(S,'changOK')?.85:.6)?{t:'阿昌第一天上工，比王媽還早到。他的滷肉跟王媽的不一樣，多了一點南部的甜。客人吃了，沒有人抱怨。\n\n王媽出院那天，吃了一口他的滷肉，說：「還可以。」阿昌在廚房裡偷偷擦眼睛。',rep:6,con:4,mind:5,trust:{wang:10,chang:15},set:{changWang:1},log:'替阿昌作保，讓他在王媽的店掌廚'}:{t:'第二個禮拜，阿昌沒有來。你在公園找到他，旁邊三個空瓶。\n\n王媽在電話裡沒有罵你，只說：「我早就知道。」那比罵你還難受。',mind:-6,rep:-3,trust:{wang:-15,chang:-5},set:{changRelapse:1}}},
  {t:'你自己去幫忙顧灶',show:S=>!S.biz,r:{t:'你每天早上四點去開灶。滷肉的火候、白飯的水量，你都是照王媽在病床上用電話教的。\n\n三個月，你瘦了四公斤。王媽回來那天，把店裡的鑰匙多打了一副給你。',hp:-6,money:4000,trust:{wang:15},mind:3}},
  {t:'不要多管',r:{t:'王媽關了店三個月。她回來的時候，隔壁開了一間連鎖便當，熟客少了一半。',trust:{wang:-4}}}
 ]},
lk_lin_kai:{scene:'office',tod:'day',npc:'lin',title:'林姐看見了',
 text:()=>'林姐約你在社福中心見面。她沒有拿你的個案資料，只是把手機推到你面前：一張照片，你和阿凱站在華西街的茶室門口。\n\n「我不是要管你，」她說，「我只是想知道，我花在你身上的時間，有沒有被拿去餵給他們。」\n\n她在等你說話。',
 ch:[
  {t:'跟她說實話',r:S=>({t:'你從第一包菸講起，講到那些信封、那些地址。林姐一直沒有打斷你。\n\n講完，她說：「你要是想離開，我可以幫你。但你要先自己想離開。」'+(F(S,'grayJob')&&!F(S,'grayQuit')?'\n\n那個禮拜，你把阿凱給你的手機還了回去。':''),con:6,mind:2,trust:{lin:10,kai:-8},job:F(S,'grayJob')&&!F(S,'grayQuit')?null:undefined,set:F(S,'grayJob')&&!F(S,'grayQuit')?{grayQuit:1,linKnows:1}:{linKnows:1},log:'跟林姐坦白了和阿凱的事'})},
  {t:'說只是剛好遇到',r:{t:'林姐看了你很久，把手機收回去：「好。」\n\n她還是會幫你，但她開始把你的資料，鎖在另一個抽屜裡。',con:-3,trust:{lin:-15},set:{linDoubt:1}}},
  {t:'反問她：不然要靠什麼活？',r:{t:'「你們社工有薪水，」你說，「我們有什麼？」\n\n林姐沒有生氣。她說：「你說得對。所以我才一直在這裡。」她站起來，把你的豆漿錢付了。',mind:-3,trust:{lin:-4}}}
 ]},
lk_huei_lily:{scene:'market',tod:'night',npc:'lily',title:'河粉攤的新人',
 text:()=>'莉莉的河粉攤多了一個幫手。你走近才認出來，是阿惠，車站那個坐在行李箱上的女孩。她長高了，頭髮剪短了，在攤子後面切九層塔。\n\n莉莉把你拉到一邊：「她說她是你介紹來的？她以前……是做什麼的？有人跟我說，她跟茶室的人有關係。」',
 ch:[
  {t:'說她是你妹妹，替她作保',r:{t:'「她是我妹妹，」你說。這是你第二次說這句話。莉莉看了你一眼，沒有再問。\n\n阿惠後來在攤子上做了一年，學會了越南話的數字。莉莉的女兒叫她「惠姐姐」。',con:5,rep:3,trust:{lily:8},set:{hueiLily:1},log:'替阿惠作保，讓她在莉莉的攤子工作'}},
  {t:'跟莉莉說實話',r:(S,R)=>R()<.5?{t:'莉莉聽完，沉默了很久，然後走回攤子，把一碗河粉放在阿惠面前：「先吃。吃完再切。」\n\n你這才想起來，莉莉也是一個人，從很遠的地方來到這裡的。',con:7,trust:{lily:12},set:{hueiLily:1}}:{t:'莉莉沒說什麼。但第二個禮拜，阿惠就不在攤子上了。你在車站找到她，她說：「沒關係，我習慣了。」',con:2,mind:-6,trust:{lily:-4},set:{hueiGone:1}}},
  {t:'說你不清楚',r:{t:'莉莉點點頭。阿惠留了下來，只是莉莉每天收攤都會自己數一次錢。阿惠知道，她什麼都沒說。',con:-3}}
 ]},
lk_cai_luo:{scene:'yard',tod:'night',npc:'cai',title:'夜班',
 text:S=>`阿財問你，小羅那個孩子做事老不老實。「我缺一個顧夜場的，」他說，「包住，一個月八千。」\n\n八千，是小羅撿一個月回收的兩倍。${F(S,'caiPartner')||F(S,'caiQuiet')?'\n\n你想到磅秤底下那塊磁鐵。顧夜場的人，遲早也會看到。':''}`,
 ch:[
  {t:'推薦小羅，什麼都不提',r:S=>({t:'小羅搬進回收場的角落，第一個月就胖了兩公斤。'+(F(S,'caiPartner')?'\n\n有一天他問你：「哥，秤底下那個是什麼？」你說，不要問。':''),con:F(S,'caiPartner')?-5:0,trust:{cai:6,luo:8},set:{luoYard:1}})},
  {t:'推薦小羅，但先教他怎麼看秤',r:{t:'你教小羅認磅秤的刻度、教他每天開工前拿一塊知道重量的鐵試一次秤。\n\n阿財後來發現，夜班的秤怎麼也動不了手腳。他看了你很久，什麼都沒說。',con:6,trust:{cai:-6,luo:12},set:{luoYard:1,luoScale:1},log:'讓小羅去回收場，教他看秤'}},
  {t:'叫小羅去陳老闆那裡',show:S=>F(S,'chen'),r:{t:'「工地辛苦，」你跟小羅說，「但是陳老闆不會騙你。」\n\n小羅去了。第一天回來，手上全是水泡，但他說工頭稱讚他。',trust:{luo:10,chen:4,cai:-3},set:{luoSite:1}}}
 ]}
});
FILL.push(
 {id:'lk_chang_wang',ch:[4,5,6],loc:'market',cond:S=>S.f.wang&&!F(S,'wangHurt')&&changOK2(S)&&!F(S,'changHired'),w:3},
 {id:'lk_lin_kai',ch:[3,4,5],loc:'office',cond:S=>F(S,'lin')&&(F(S,'strong')||F(S,'gray'))&&!F(S,'strongEnemy'),w:3},
 {id:'lk_huei_lily',ch:[4,5,6],loc:'market',cond:S=>S.f.huei==='saved'&&S.f.lily&&!F(S,'lilyGone'),w:3},
 {id:'lk_cai_luo',ch:[4,5,6],loc:'yard',cond:S=>F(S,'luo')&&S.f.cai&&!F(S,'caiExposed')&&!F(S,'luoHired')&&!F(S,'luoLost'),w:3}
);
{const E0=epilogue2;epilogue2=function(S){const e=E0(S);const f=k=>F(S,k);invOf(S);
 for(const k in KEEP){const st=S.inv[k];if(!st)continue;const nm=KEEP[k].name;
  if(st==='lost')e.push(`「${nm}」流當以後，你去當舖問過一次。老闆說，早就被人買走了。你有時候還會下意識地去摸那個位置。`);
  else if(st==='stolen')e.push(`「${nm}」被偷的那個晚上，你一直記得。你後來在每一間當舖的櫥窗前，都會多看一眼。`);
  else if(st==='gift')e.push(`你把「${nm}」送給了別人。你不後悔。有些東西，放在對的人身上，比放在自己身上更安全。`);
  else if(st==='have'&&f('redeemed'))e.push(`「${nm}」贖回來以後，你再也沒有拿去當過。`);
  else if(st==='have')e.push(`「${nm}」一直在你身上。最窮的時候，你也沒有把它拿出來。`)}
 if(f('soldID'))e.push('那四個人頭帳戶，後來又被拿去騙了兩個人。你一直不知道他們的名字。');
 if(f('changWang'))e.push('王媽的便當店後來換了招牌，叫「王媽阿昌」。阿昌在廚房裡掌廚，再也沒有喝過一滴酒。');
 else if(f('changRelapse'))e.push('阿昌那次之後，又戒了兩次酒。王媽說，第三次她還會讓他回來。');
 if(f('hueiLily'))e.push('阿惠後來跟莉莉一起，把河粉攤開成了一間小店。招牌上的越南字，是阿惠寫的。');
 if(f('luoScale'))e.push('小羅在回收場做到領班。每天開工前，他還是會拿那塊鐵試一次秤。');
 else if(f('luoSafe'))e.push('小羅後來沒有再碰陣頭。他在廟裡幫忙掃地，每年遶境都會站在路邊，看那些跟他當年一樣大的少年走過去。');
 if(f('ghostFeast'))e.push('那年普渡的那一桌，橋下的人講了很多年。每年七月，都會有人問：「今年還辦不辦？」');
 if(f('linKnows'))e.push('林姐後來說，你是她遇過最難的個案，也是她最常跟新進社工講的故事。');
 return e}}
