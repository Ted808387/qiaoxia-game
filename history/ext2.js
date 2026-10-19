
/* ═════════ 第四版：萬華地圖與小遊戲 ═════════ */
const MAPLOC={
 station:{name:'台北車站',desc:'人最多的地方。有錢掉在地上，也有人在等著撿你的。'},
 ximen:{name:'西門町',desc:'觀光客、街頭藝人、霓虹燈。可能遇到認識你的人。'},
 site:{name:'康定路工地',desc:'早上五點有人在點人頭。錢多，傷身。'},
 temple:{name:'龍山寺',desc:'可以求籤、躲雨。廟會的時候有東西吃。'},
 park:{name:'艋舺公園',desc:'睡覺的、喝酒的、發便當的，都在這裡。'},
 market:{name:'華西街夜市',desc:'攤販缺人叫賣。也有人在找你要錢。',mini:'hawk'},
 bridge:{name:'環河南路橋下',desc:'紙板和帆布搭成的村子。警察偶爾會來。'},
 yard:{name:'萬大路回收場',desc:'把撿來的東西換成錢。要看清楚那台秤。',mini:'scale'},
 office:{name:'萬華社福中心',desc:'林姐在這裡。可以領物資、問問題。',need:S=>linOK(S)||F(S,'census')}
};
const FLOC={f_bento:'market',f_wire:'site',f_rain:'station',f_drink:'park',f_church:'park',f_wallet:'station',f_cops:'bridge',f_black:'park',f_debt:'market',f_shelter:'station',f_frost:'bridge',f_movers:'site',f_overtime:'site',f_luo:'park',f_daughter:'bridge',f_huei3:'station',f_mom:'station',f_zheng4:'bridge',f_chang3:'park',f_funeral:'park',f_gamble:'market',f_lily2:'market',f_temple:'temple',f_dog:'park',f_dog2:'bridge',f_fight:'market',f_photo:'park',f_ghost:'temple',f_jobscam:'site',f_lottery:'station',f_oldfriend:'ximen',f_heat:'bridge',f_scooter:'ximen',f_pickpocket:'market',f_census:'park'};
const FSTORY=['f_daughter','f_huei3','f_zheng4','f_luo','f_chang3','f_mom','f_lily2','f_kid'];
const FDANGER=['f_black','f_debt','f_cops','f_fight','f_pickpocket'];
FILL.forEach(f=>{f.loc=FLOC[f.id]||'*';if(FSTORY.includes(f.id))f.story=1;if(FDANGER.includes(f.id))f.danger=1});
function eligibleFill(S){const wt=f=>typeof f.w==='function'?f.w(S):(f.w??1);
 return FILL.filter(f=>f.ch.includes(S.ch)&&!S.recent.includes(f.id)&&(EV[f.id].repeat||f.repeat?true:!S.seen.includes(f.id))&&(!f.cond||f.cond(S))&&wt(f)>0).map(f=>({f,w:wt(f)}))}
const LNPC={
 bridge:S=>[S.f.zhengFate!=='dead'&&(F(S,'zheng')||S.f.zhengFate)?'老鄭':null,F(S,'huangFriend')?'黃老闆':null],
 office:S=>[F(S,'lin')?'林姐':null],
 market:S=>[S.f.wang&&!F(S,'wangHurt')?'王媽':null,S.f.lily&&!F(S,'lilyGone')?'莉莉':null],
 park:S=>[S.f.chang&&!F(S,'changGone')&&!F(S,'changHired')?'阿昌':null,F(S,'luo')&&!F(S,'luoHired')?'小羅':null,S.seen.includes('c1_bag')&&!F(S,'blackDone')&&!F(S,'blackLoyal')?'黑仔':null],
 yard:S=>[S.f.cai&&!F(S,'caiExposed')?'阿財':null],
 site:S=>[F(S,'chen')?'陳老闆':null],
 alley:S=>[],station:S=>[],ximen:S=>[F(S,'busk')?'拉二胡的阿伯':null],temple:S=>[]
};
function mapInfo(S){const el=eligibleFill(S);
 return Object.entries(MAPLOC).map(([k,L0])=>{const open=!L0.need||L0.need(S);const here=el.filter(x=>x.f.loc===k);
  const mini=L0.mini?{game:L0.mini,label:L0.mini==='hawk'?(S.biz&&['cart','stall'].includes(S.biz.type)?'顧自己的攤，大聲叫賣':'幫攤販叫賣，一晚算錢'):(S.biz&&S.biz.type==='recycle'?'站在自己的磅秤旁邊':'推回收去賣，看緊那台秤')}:null;
  return {key:k,name:L0.name,desc:L0.desc,open,story:here.some(x=>x.f.story),danger:here.some(x=>x.f.danger),npcs:(LNPC[k]?LNPC[k](S):[]).filter(Boolean),mini}})}
function visit(S,loc,R=Math.random){
 S.lastLoc=loc;const el=eligibleFill(S);
 const story=el.filter(x=>x.f.loc===loc&&x.f.story);
 if(story.length&&R()<.85)return story[Math.floor(R()*story.length)].f.id;
 const pool=el.filter(x=>x.f.loc===loc||x.f.loc==='*');
 if(!pool.length||R()<.22)return 'q_'+loc;
 const tot=pool.reduce((a,x)=>a+x.w,0);let r=R()*tot;
 for(const x of pool){r-=x.w;if(r<=0)return x.f.id}
 return pool[pool.length-1].f.id;
}
const pickL=(R,a)=>a[Math.floor(R()*a.length)];
const RNG=()=>Math.random();
Object.assign(EV,{
q_station:{scene:'station',repeat:1,title:'人潮',text:()=>pickL(RNG,['下班的人潮從你身邊經過，沒有人看你。','車站大廳的冷氣很強。你坐在柱子旁邊，看著電子看板換了一百次。','一個背包客在問路，他問的是你。你指給他看，他說謝謝，你愣了一下。']),
 ch:[{t:'在大廳坐一下午',r:{t:'保全繞了兩圈，沒有趕你。',mind:2}},{t:'去地下街問有沒有零工',r:(S,R)=>R()<.5?{t:'一間鞋店要人搬貨，三百塊。',money:300,hp:-2}:{t:'問了六間店，沒有人要。',mind:-2}}]},
q_ximen:{scene:'ximen',repeat:1,title:'西門町',text:()=>pickL(RNG,['街頭藝人在唱歌，觀光客在拍照。','電影院前面排了很長的隊，空氣裡都是爆米花的味道。','一群高中生在跳舞，手機架在地上錄。']),
 ch:[{t:'站在旁邊看表演',r:{t:'你看了很久，久到忘了自己在哪裡。',mind:3}},{t:'撿觀光客丟掉的飲料杯去回收',r:{t:'一個晚上撿了兩大袋，換了六十塊。',money:60,hp:-1}}]},
q_temple:{scene:'temple',repeat:1,title:'香火',text:()=>pickL(RNG,['誦經的聲音從正殿傳出來，一句一句，很慢。','香爐的煙很重。一個阿嬤在跟神明講她孫子的事，講了很久。','廟埕上有人在發平安符。']),
 ch:[{t:'坐在廊下休息',r:{t:'你閉上眼睛，聽了一個下午的經。',mind:3,hp:1}},{t:'幫廟方收拾供桌',r:{t:'廟公給你一百塊和兩顆橘子。',money:100,rep:1}}]},
q_park:{scene:'park',repeat:1,title:'涼亭',text:()=>pickL(RNG,['涼亭裡有人在下象棋，旁邊圍了一圈人。','公園的廁所又壞了一間。','鴿子在搶一個掉在地上的饅頭。']),
 ch:[{t:'在涼亭睡一覺',r:{t:'難得睡得很沉。醒來的時候，鞋子還在。',hp:3}},{t:'跟老人下一盤棋',r:{t:'你輸了。老人說你的車用得太急，「人生也是」。',mind:3,rep:2}}]},
q_bridge:{scene:'bridge',repeat:1,title:'橋下',text:()=>pickL(RNG,['頭頂的車一台一台開過去，水泥一直在震。','河邊有人在釣魚，釣了一整天都沒有東西。','新來的人在橋墩旁邊鋪紙板，鋪得很不整齊。']),
 ch:[{t:'整理你的紙板和帆布',r:{t:'你把帆布重新綁了一次。至少今晚不會漏水。',hp:1,mind:1}},{t:'去河邊坐著看水',r:{t:'河水很慢。你想起很多事，又決定不要想。',mind:4}}]},
q_market:{scene:'market',repeat:1,title:'香味',text:()=>pickL(RNG,['夜市的香味讓你的胃一直叫。','一個攤販在吆喝「最後五份」。','觀光客排隊在買一碗你以前不會多看一眼的麵。']),
 ch:[{t:'幫攤販搬東西，換一份炒麵',r:{t:'炒麵很油，你吃得很乾淨。',hp:4}},{t:'逛一圈，什麼都不買',r:{t:'你走了一圈，口袋裡的錢一塊都沒少。胃很空。',mind:-1}}]},
q_site:{scene:'site',repeat:1,title:'工地',text:()=>pickL(RNG,['工地外面的鐵皮圍籬上貼著「誠徵臨時工」。','打樁機的聲音整條街都聽得到。','幾個工人在工地門口吃便當，安全帽放在地上。']),
 ch:[{t:'問有沒有臨時工',req:{hp:40},r:(S,R)=>R()<.5?{t:'搬了一天的磚，九百塊。',money:900,hp:-5}:{t:'工頭看了你一眼，說今天人滿了。',mind:-2}},{t:'撿工地丟出來的廢鐵去賣',r:{t:'兩百塊。手被鐵絲劃了一道。',money:200,hp:-2}}]},
q_yard:{scene:'yard',repeat:1,title:'鐵皮圍牆',text:()=>pickL(RNG,['回收場的狗趴在磅秤旁邊睡覺。','一台卡車在卸貨，壓扁的鋁罐像下雨一樣掉下來。','排隊賣東西的人，推車一台比一台高。']),
 ch:[{t:'幫忙卸貨',req:{hp:30},r:{t:'卸完一整車，兩百五。',money:250,hp:-3}},{t:'坐一下就走',r:{t:'狗走過來聞了聞你的手。',mind:1}}]},
q_office:{scene:'office',repeat:1,title:'等候區',text:()=>pickL(RNG,['社福中心的等候區坐滿了人，叫號機一直跳。','公布欄上貼了新的職缺單和一張戒酒團體的海報。','林姐在電話裡跟某個房東吵架。']),
 ch:[{t:'領物資',r:{t:'一袋米、兩罐鮪魚、一包衛生紙。',hp:4}},{t:'跟林姐聊聊',show:S=>F(S,'lin'),r:{t:'她問你最近好不好。你說還好。她說：「還好就是不好。」',mind:5}}]},
m_cold:{scene:'bridge',tod:'night',weather:'rain',title:'第二波寒流',
 text:S=>`一月，第二波寒流。氣象局說今晚平地最低五度，還會下雨。\n\n${isRoom(S)||S.house==='shelter'||S.house==='yard'?'你有地方睡。但你知道橋下還有人。':'橋下所有人都醒著，沒有人睡得著。'}${S.f.zhengFate&&S.f.zhengFate!=='dead'?'老鄭縮在帆布裡，咳嗽聲比上次還重。':''}一個撿回收的阿嬤、一個剛上街、喝得醉醺醺的年輕人阿峰，都擠在同一根橋墩下。\n\n紙板四張，毯子不夠，熱水只有一瓶。牆邊擋風的位置，只有兩個。`,
 ch:[
  {t:'陪大家撐過今晚（小遊戲：分配紙板和毯子）',r:{mini:'cold'}},
  {t:'留在屋子裡',show:S=>isRoom(S)||S.house==='shelter'||S.house==='yard',r:{t:'你躺在床上，聽著外面的雨，一直沒睡著。\n\n第二天早上，你沒有去橋下問。',con:-4,mind:-3}}
 ]}
});
ins(2,'c2_cold','m_cold');

/* 小遊戲設定與結算 */
function miniSetup(S,game,R=Math.random){
 const D=DIFF[S.diff||'street'];
 if(game==='scale'){
  const mk=[
   ()=>{const n=150+Math.floor(R()*110);return {name:'鋁罐 · 一大袋',hint:`你在橋下一個一個數過：${n} 個，一個大約 15 克。`,price:26,kg:n*.015}},
   ()=>{const n=80+Math.floor(R()*60);return {name:'寶特瓶 · 兩袋',hint:`一共 ${n} 個，一個大約 30 克。`,price:8,kg:n*.03}},
   ()=>{const n=8+Math.floor(R()*9);return {name:'紙箱 · 一疊',hint:`${n} 片壓平的紙箱，一片大約 0.4 公斤。`,price:1.8,kg:n*.4}},
   ()=>{const k=Math.round((.8+R()*.8)*10)/10;return {name:'銅線 · 一綑',hint:`你在公園的體重計上秤過：${k.toFixed(1)} 公斤。`,price:210,kg:k}},
   ()=>{const n=3+Math.floor(R()*4);return {name:'鐵條',hint:`${n} 根，一根大約 0.75 公斤。`,price:7,kg:n*.75}},
   ()=>{const n=30+Math.floor(R()*31);return {name:'舊報紙',hint:`一疊 ${n} 份，一份大約 0.12 公斤。`,price:3,kg:n*.12}}
  ];
  const order=mk.map((f,i)=>[R(),i]).sort((a,b)=>a[0]-b[0]).slice(0,5).map(x=>mk[x[1]]());
  const rigP=S.biz&&S.biz.type==='recycle'?.1:(F(S,'caiExposed')||F(S,'caiFixed'))?.18:.45;
  return {time:Math.max(6,D.timer-2),owner:!!(S.biz&&S.biz.type==='recycle'),rounds:order.map(it=>{const rig=R()<rigP;const shown=Math.round(it.kg*(rig?.82+R()*.06:.985+R()*.03)*100)/100;return {...it,kg:Math.round(it.kg*100)/100,shown,rig}})};
 }
 if(game==='hawk'){const own=!!(S.biz&&['cart','stall'].includes(S.biz.type));return {dur:30,bpm0:72,bpm1:S.diff==='hell'?140:124,cop:W_(S,'election')?.16:.1,own,pay:own?90:30,base:own?0:200,name:own?S.biz.name:'河粉攤'}}
 if(game==='cold'){
  const dm=Math.min(1.35,D.dmg)*(W_(S,'harsh')?1.15:1);
  const ppl=[{id:'you',name:'你',w:Math.round(42+S.hp/4),frail:S.hp<40?1.2:1,me:1}];
  if(S.f.zhengFate&&S.f.zhengFate!=='dead')ppl.push({id:'zheng',name:'老鄭',w:46,frail:1.3});
  else if(S.f.chang&&!F(S,'changGone'))ppl.push({id:'chang',name:'阿昌',w:54,frail:1.1,drunk:1});
  else ppl.push({id:'chen',name:'老陳',w:50,frail:1.2});
  ppl.push({id:'ama',name:'阿嬤',w:52,frail:1.2},{id:'feng',name:'阿峰',w:62,frail:1,drunk:1});
  return {people:ppl,cardboard:4,blanket:F(S,'gear')?2:1,thermos:1,wall:2,base:[9,12,15,16].map(x=>x*dm),hours:['22:00','01:00','03:00','05:00','天亮']};
 }
}
function miniR(S,game,res){
 if(game==='scale'){const m=Math.round(res.money);const own=res.owner;
  const txt=own?`你站在自己的磅秤旁邊，看著一台一台推車。${res.caught?`你抓到 ${res.caught} 次秤錯，當場改了回來。`:''}今天收了 ${res.right} 筆公道的帳。`:`五袋東西，換了 ${m} 元。${res.caught?`你抓到 ${res.caught} 次被少算，${res.caught>=2?'老闆看你的眼神變了：「你很會算。」':'老闆嘟囔著重秤了一次。'}`:''}${res.missed?`有 ${res.missed} 次，你沒發現秤被動過手腳。`:''}${res.wrong?`你冤枉了老闆 ${res.wrong} 次，他扣了你的錢。`:''}`;
  return {t:txt,money:m,rep:res.caught*2-res.wrong*2,mind:res.right>=4?3:res.missed>=2?-3:0,hp:-2,log:res.caught>=3?'在回收場抓到好幾次秤被動手腳':null};}
 if(game==='hawk'){const acc=res.total?res.hits/res.total:0;let money=res.base+res.hits*res.pay-res.cops*(res.own?600:200);
  const r={t:`一個晚上，你喊來了 ${res.hits} 個客人${res.perfect?`（${res.perfect} 次喊得剛剛好）`:''}，錯過了 ${res.missed} 個。${res.cops?`\n\n你對著警察喊了 ${res.cops} 次「來喔」。${res.own?'他開了一張罰單給你。':'攤販老闆被開了單，扣了你的錢。'}`:''}${acc>=.8?'\n\n收攤的時候，隔壁攤問你要不要來他那裡做。':''}`,money:Math.max(0,money)-(money<0?0:0),rep:Math.floor(res.hits/12)+(acc>=.8?3:0),hp:-2,heat:res.cops?1:0};
  if(res.own&&acc>=.75)r.mod=.03;if(money<0)r.money=money;return r;}
 if(game==='cold'){const you=res.people.find(p=>p.id==='you');const lost=res.people.filter(p=>p.id!=='you'&&p.w<=0);const saved=res.people.filter(p=>p.id!=='you'&&p.w>0);
  const r={t:'',hp:you.w<=0?-28:you.w>=40?2:you.w>=20?-6:-14,con:saved.length*3-lost.length*5,mind:-lost.length*6+(lost.length?0:6),rep:saved.length*2,set:{}};
  r.t=(you.w<=0?'天快亮的時候，你自己也開始不發抖了。救護車來的時候，你已經叫不出聲音。\n\n':'天亮了。雨停了。')+(lost.length?`${lost.map(p=>p.name).join('、')}沒有撐住，被救護車載走了。${lost.some(p=>p.id==='zheng')?'老鄭被抬上擔架的時候，手還抓著帆布。':''}`:'橋下的人，一個都沒有少。')+(saved.length&&lost.length?`\n\n${saved.map(p=>p.name).join('、')}撐過來了。`:'');
  if(lost.some(p=>p.id==='zheng'))r.set.zhengFate='hospital';
  r.log=lost.length?`寒流夜，${lost.map(p=>p.name).join('、')}失溫送醫`:'寒流夜裡，橋下的人一個都沒少';
  if(!lost.length)r.set.coldHero=1;return r;}
}
function finishMini(S,game,res){
 const r=miniR(S,game,res);const before={};SNAPK.forEach(k=>before[k]=S[k]);
 apply(S,r);const delta={};SNAPK.forEach(k=>{const d=S[k]-before[k];if(Math.abs(d)>=.5)delta[k]=Math.round(d)});
 const up=upkeep(S,CH[S.ch].days);return {text:r.t,delta,up};
}
function simMini(S,game,R=Math.random){const c=miniSetup(S,game,R);
 if(game==='scale'){let money=0,caught=0,missed=0,wrong=0,right=0;c.rounds.forEach(x=>{const prot=R()<.5;if(x.rig&&prot){caught++;right++;money+=x.kg*x.price}else if(x.rig){missed++;money+=x.shown*x.price}else if(prot){wrong++;money+=x.shown*x.price*.8}else{right++;money+=x.shown*x.price}});return {money,caught,missed,wrong,right,owner:c.owner}}
 if(game==='hawk'){const total=40+Math.floor(R()*20),hits=Math.floor(total*R());return {total,hits,perfect:Math.floor(hits*R()),missed:total-hits,cops:R()<.3?1:0,own:c.own,pay:c.pay,base:c.base}}
 if(game==='cold'){return {people:c.people.map(p=>({...p,w:Math.round(R()*80-20)}))}}
}
