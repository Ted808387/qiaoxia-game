
/* ═════════ 第七版：黑道分級、自己找工作、主動找人、十年後 ═════════ */
const isTurf=S=>!!(S.biz&&S.biz.type==='turf');
/* ── 黑道的其他入口 ── */
Object.assign(EV,{
g_cellmate:{scene:'park',tod:'night',npc:'kai',skip:onlyFor('excon',S=>F(S,'gray')||F(S,'strongEnemy')),title:'阿龍',
 text:()=>'一個手臂上刺著龍的男人在公園找到你。是阿龍，你在裡面同一個工場的。他早你半年出來。\n\n「強哥那邊缺人，」他遞給你一根菸，「我們這種人，外面沒有人會用。他會。」\n\n他說得對。你這陣子去應徵的工作，看到你的良民證，沒有一個打過電話來。',
 ch:[
  {t:'跟他去見強哥',r:{t:'強哥看了你一眼：「阿龍說你在裡面很硬。」他沒有問你犯了什麼，只問你會不會騎機車。\n\n你點頭。從這天起，你是強哥的人了。',con:-6,rep:6,set:{gray:1,strong:1},log:'透過獄友阿龍搭上強哥'}},
  {t:'謝謝他，但你不想再回去',r:{t:'阿龍笑了笑：「每個人出來都這樣說。」他把一張寫著電話的紙條塞進你口袋。',mind:2}}
 ]},
g_leopard:{scene:'alley',tod:'night',npc:'leopard',skip:onlyFor('debt',S=>F(S,'debtLegal')||F(S,'gray')||F(S,'strongEnemy')),title:'收帳的缺',
 text:()=>'豹哥這次沒有要錢。他坐在茶室門口，叫你坐下。\n\n「我收帳的小弟進去了，缺一個人。你欠我的利息，你來幫我收帳抵。」他吐了一口菸。「你以前是老闆，你知道欠錢的人會說什麼謊。」\n\n茶室的招牌上，有強哥的名字。',
 ch:[
  {t:'答應，幫他收帳',r:{t:'第一個你去收的人，是一個開麵攤的阿伯。他跪在地上的樣子，跟你兩年前一模一樣。\n\n你收到了。豹哥說你很有天分。',job:{name:'豹哥的收帳小弟',income:700,wear:.04},con:-12,rep:6,heat:1,set:{gray:1,grayJob:1,strong:1},log:'替豹哥收帳抵利息'}},
  {t:'拒絕',r:{t:'豹哥點點頭：「利息照算。」',mind:-3}}
 ]},
f_gang:{scene:'market',tod:'night',npc:'kai',title:'缺人',
 text:()=>'阿凱在夜市口叫住你。皮夾克，脖子上的刺青。\n\n「強哥那邊缺跑腿的，一天一千，現領。不用打卡，不用身分證。」他上下打量你。「你看起來需要錢。」',
 ch:[
  {t:'跟他走',r:{t:'他帶你去華西街一間茶室的後門。強哥在裡面喝茶，看你的眼神像在估一輛二手機車。\n\n「先做做看。」',con:-6,set:{gray:1,strong:1},log:'被阿凱帶去見強哥'}},
  {t:'搖頭',r:{t:'阿凱聳聳肩：「想通了，來夜市找我。」',mind:1}}
 ]},
/* ── 黑道第五、六章 ── */
g5_drugs:{scene:'alley',tod:'night',npc:'leopard',skip:S=>!isTurf(S),title:'貨',
 text:()=>'三重的人約你在一間 KTV 的包廂。桌上放著一個運動背包。\n\n「安非他命。你的茶室、你的人，幫我們走貨。抽三成。」他把背包拉鍊拉開一點。「一個月，比你現在一年賺的還多。」\n\n強哥當年有一條規矩：茶室不碰毒。你一直守著。',
 ch:[
  {t:'接',r:{t:'錢真的很多。第一個月，你點鈔點到手指發麻。\n\n第二個月，你的一個小弟在廁所裡被發現，嘴角都是白沫。',mod:.45,heat:3,con:-16,rep:6,set:{drugs:1},log:'讓茶室開始走毒品'}},
  {t:'不接，守強哥的規矩',r:{t:'三重的人把背包拉上，笑了：「強哥的規矩，強哥自己都進去了。」\n\n他們走的時候，把你的酒杯打翻了。你知道這件事還沒完。',con:4,rep:4,set:{noDrugs:1,sanchongAngry:1}}},
  {t:'假裝考慮，私下跟刑警搭線',req:{mind:45},r:{t:'刑事組的王組長在一間早餐店跟你見面。他說只要你給他三重的貨路，你的帳他可以「看不見」。\n\n你走出早餐店的時候，覺得自己變成了一個你以前最看不起的人。',heat:-2,mind:-6,set:{informant:1,sanchongAngry:1},log:'成了刑警的線民'}}
 ]},
g5_traitor:{scene:'alley',tod:'night',npc:'kai',skip:S=>!isTurf(S),title:'帳',
 text:()=>'阿凱把一個年輕的小弟押到你面前。小弟叫阿傑，十九歲，是你一年前從公園帶回來的。\n\n「他把我們收帳的路線賣給三重。」阿凱說。「大家都在看你怎麼處理。」\n\n阿傑跪著，一直在發抖。他的樣子，讓你想起剛上街的自己。',
 ch:[
  {t:'照規矩，讓阿凱處理',r:{t:'你轉過身，聽見阿傑的叫聲。那天之後，沒有人再敢賣你的消息。\n\n也沒有人再敢跟你說真話。',con:-14,rep:10,heat:1,set:{traitorPunished:1},log:'讓阿凱處理了叛徒'}},
  {t:'放他走，叫他永遠不要回萬華',r:{t:'阿傑磕了三個頭，跑了。阿凱看著你很久：「你會後悔的。」\n\n手下的人開始在背後說，你心軟。',con:6,rep:-8,set:{traitorSpared:1}}},
  {t:'把他留下來，自己盯著',req:{rep:40},r:{t:'你讓阿傑跟在你身邊，每天跟你吃同一桌飯。他後來成了你最忠心的人，也可能不是。你永遠不會知道。',rep:2,set:{traitorKept:1}}}
 ]},
g6_war:{scene:'alley',tod:'night',weather:'rain',skip:S=>!isTurf(S),title:'三重',
 text:S=>`${F(S,'sanchongAngry')?'三重的人終於來了。':'三重的人說，華西街以後要分一半。'}這個禮拜，你的兩間茶室被砸，一個收帳的小弟被打斷了手。\n\n阿凱說，大家在等你一句話。\n\n${F(S,'informant')?'王組長傳了一封簡訊給你：「這幾天不要有動作。」':''}`,
 ch:[
  {t:'開戰',req:{rep:45},r:(S,R)=>R()<(S.rep>=65?.6:.42)?{t:'那一夜，西昌街的鐵門全都拉下來了。第二天早上，三重的人退回了淡水河對岸。\n\n整條華西街的人看你的眼神，跟以前看強哥一樣。',hp:-12,rep:15,heat:2,con:-8,mod:.15,set:{warWon:1},log:'和三重開戰，贏了'}:{t:'你們輸了。你在急診室醒來，肚子上縫了二十幾針。你的人跑了一半，地盤丟了一半。',hp:-30,rep:-12,heat:2,mod:-.35,set:{warLost:1},log:'和三重開戰，輸了'}},
  {t:'談判，分地盤',req:{rep:50},r:{t:'你們在一間海產店談了一整晚。最後，西昌街歸你，廣州街以南歸他們。\n\n你少了一半的錢，多了一個不會半夜砸你店的鄰居。',mod:-.2,rep:4,set:{truce:1},log:'和三重談判分地盤'}},
  {t:'花錢找議員和警察擺平',req:{money:150000},r:{t:'你包了一個很厚的紅包給一位議員的服務處主任。一個禮拜後，三重那邊的兩間賭場被臨檢。\n\n議員過年來華西街發紅包的時候，特別跟你握了手。',money:-150000,heat:-1,set:{politician:1,truce:1},log:'花錢找議員擺平三重'}},
  {t:'讓王組長去處理',show:S=>F(S,'informant'),r:{t:'警察在三重抄了一個倉庫。報紙寫「警方破獲大型毒品集散地」。\n\n三重的人退了。他們在找是誰說的。',heat:-2,mind:-6,set:{truce:1,informantUsed:1}}}
 ]},
g6_politic:{scene:'office',tod:'day',npc:'brother',skip:S=>!isTurf(S),title:'選舉',
 text:()=>'一位要選連任的議員，親自到你的茶室泡茶。\n\n「華西街的票，你幫我顧。」他笑得很客氣。「選上了，你那些店，就是我的選民服務對象。」\n\n他的意思是：你可以變成一個正當的生意人。只要你先替他做一些不正當的事。',
 ch:[
  {t:'幫他買票、顧樁腳',r:{t:'你的人挨家挨戶送了兩個月的禮盒。他高票連任。\n\n慶功宴上，他把你介紹給一個建設公司的老闆：「這位是我們萬華的企業家。」',money:-50000,heat:1,con:-8,set:{politician:1},log:'替議員顧票'}},
  {t:'客氣地拒絕',r:{t:'他還是笑得很客氣：「沒關係，大家交個朋友。」\n\n一個月後，你的茶室被臨檢了三次。',mod:-.1,mind:-3}},
  {t:'錄下他說的話',req:{mind:50},r:{t:'你沒有用那段錄音。你只是把它鎖在保險箱裡。\n\n有些東西，比錢更像護身符。',set:{tape:1},mind:4}}
 ]}
});
ins(2,'c2_strong','g_cellmate');ins(3,'c3_start','g_leopard');
ins(5,'b5_rival','g5_drugs','g5_traitor');ins(6,'b6_betray','g6_war');ins(6,'b6_injury','g6_politic');
FILL.push({id:'f_gang',ch:[2,3],loc:'market',cond:S=>S.con<60&&!F(S,'gray')&&!F(S,'strongEnemy')&&!F(S,'strongGone')});
{const c=EV.c4_offer.ch.find(x=>x.t==='接手強哥留下的地盤');c.req={conMax:42,rep:35,money:15000};c.r={...c.r,money:-15000};}
{const c=EV.c3_start.ch.find(x=>x.t==='跟著強哥做事');c.show=S=>F(S,'gray')&&!F(S,'strongEnemy')&&!F(S,'grayJob');}
Object.assign(ENDINGS,{
 dabo:{name:'萬華大佬',req:'吃下整條華西街，活到最後',tier:5},
 whitewash:{name:'洗白',req:'黑道起家，靠議員和錢變成「企業家」',tier:5},
 jiaotou:{name:'角頭',req:'顧著幾間茶室，看三重的臉色',tier:3},
 killed:{name:'雨夜',req:'在華西街的位子上，被人做掉',tier:0}
});
ENDINGS.boss.req='接手強哥的地盤，做到地下錢莊';
Object.assign(EXT_END,{
 jiaotou:S=>'你顧著西昌街的三間茶室。每個月初，你要親自給三重的人送紅包，他們叫你「小的」。\n\n你手下有五個人，每個都比你年輕，每個都在等你犯錯。\n\n收帳的路上，你常常經過艋舺公園，看到那根你以前睡過的柱子。你沒有停下來。',
 dabo:S=>`整條華西街都是你的。茶室、賭場、地下錢莊，每個月的帳本厚得像電話簿。${F(S,'truce')?'三重的人過年會派人送禮來。':'三重的人退到了淡水河對岸，再也沒有過橋。'}議員的助理會在選前來泡茶。\n\n你出門坐在後座，車窗是黑的。你已經很久沒有走路了。\n\n有一天晚上，你讓司機在龍山寺前面停車。你搖下車窗，看著廟埕上一個剛上街的年輕人在鋪紙板。你叫小弟拿一千塊過去。小弟回來說：「他問你是誰。」你想了很久，說：「跟他說，是一個以前睡這裡的人。」`,
 whitewash:S=>`${F(S,'sold')?'你把華西街賣給了三重，價錢談了三個月。':'你把茶室一間一間收掉，換成了一間「建設公司」。'}你的名片上印著「董事長」，辦公室在信義區，牆上掛著議員送的匾：「熱心公益」。\n\n每年除夕，你在艋舺公園擺圍爐，記者會來拍。你站在鍋子後面舀湯，笑得很標準。\n\n只有你知道，那些湯是用什麼錢煮的。${F(S,'drugs')?'也只有你知道，那個在廁所裡嘴角都是白沫的小弟，叫什麼名字。':''}`,
 killed:S=>`${F(S,'traitorSpared')?'你放走的那個阿傑，帶著三重的人回來了。':F(S,'warLost')?'輸了那一仗以後，你的人一個一個離開。最後只剩下阿凱，然後阿凱也不見了。':'三重的人沒有再來談。'}\n\n那天晚上下著雨。你從茶室後門出來，巷口站著兩個戴全罩安全帽的人。\n\n新聞只播了二十秒：「萬華角頭深夜遭砍，送醫不治。」畫面裡，警察拉起封鎖線，背景是你以前睡過的那座橋。\n\n強哥在監獄裡看到新聞，對獄友說：「我早就跟他說過，這個位子坐不久。」`
});
Object.assign(ENDGROUP,{dabo:'dark',whitewash:'dark',jiaotou:'dark',killed:'death'});
function turfEnd(S,R){const lvl=S.biz?S.biz.lvl:(S.f.soldLvl||0);
 if(F(S,'sold'))return 'whitewash';
 if(S.heat>=6&&!F(S,'informant')&&R()<.6)return 'caught';
 if(S.heat>=5&&!F(S,'politician')&&!F(S,'informant')&&R()<.4)return 'caught';
 if(F(S,'warLost')||(F(S,'traitorSpared')&&R()<.45)||(lvl>=1&&!F(S,'truce')&&!F(S,'warWon')&&R()<.3))return 'killed';
 if(F(S,'informantUsed')&&R()<.35)return 'killed';
 if(lvl>=2)return (F(S,'politician')&&S.money>=200000)?'whitewash':'dabo';
 if(lvl===1)return F(S,'politician')&&S.money>=300000?'whitewash':'boss';
 return 'jiaotou';}

/* ── 自己找工作 ── */
const JOBS={
 sign:{loc:'station',name:'舉牌',income:320,wear:.08,desc:'八小時，站著不准坐。仲介抽成。'},
 porter:{loc:'station',name:'地下街搬貨',income:420,wear:.12,req:{hp:40},desc:'商店街凌晨補貨，扛箱子。'},
 nightclean:{loc:'station',name:'車站夜班清潔',income:460,wear:.06,stable:1,req:{id:1,addictMax:50},desc:'外包清潔公司，每天都有班，要身分證。'},
 flyer:{loc:'ximen',name:'發傳單',income:300,wear:.05,desc:'站在西門町路口，一張一張遞出去。'},
 delivery:{loc:'ximen',name:'外送',income:620,wear:.1,req:{id:1,flag:'scooter'},desc:'要有機車。下雨天單比較多，也比較危險。'},
 tempsite:{loc:'site',name:'工地臨時工',income:620,wear:.2,req:{hp:50,id:1},desc:'早上五點騎樓下點人頭，有點到才有錢。'},
 rebar:{loc:'site',name:'工地綁鐵',income:660,wear:.2,req:{hp:50,id:1,flag:'chenJob'},desc:'陳老闆的固定班。下雨沒錢。'},
 mover:{loc:'site',name:'搬家工',income:560,wear:.16,req:{hp:50,id:1},desc:'五樓沒電梯，冰箱和鋼琴。'},
 temple:{loc:'temple',name:'廟務雜工',income:340,wear:.05,stable:1,req:{con:50},desc:'掃廟埕、收供品、整理金紙。廟方只用老實人。'},
 dish:{loc:'market',name:'夜市洗碗',income:380,wear:.08,meals:1,desc:'洗到半夜兩點，包一餐。'},
 stallhelp:{loc:'market',name:'攤販幫手',income:450,wear:.08,meals:1,req:{rep:15},desc:'切菜、收錢、招呼客人。要有人介紹。'},
 recycle:{loc:'yard',name:'撿回收',income:140,wear:.05,desc:'沒有門檻，也沒有底薪。'},
 sorter:{loc:'yard',name:'回收場分類工',income:450,wear:.12,stable:1,req:{hp:40,flag:'caiJob'},desc:'阿財的固定班，要會估價。'},
 publicwork:{loc:'office',name:'以工代賑清潔',income:380,wear:.08,stable:1,req:{id:1,addictMax:55},desc:'市政府的方案，掃公園、清水溝，要驗酒測。'}
};
const FLAGNAME={scooter:'有機車',chenJob:'陳老闆的介紹',caiJob:'阿財的介紹'};
function jobsAt(S,loc){if(S.biz||S.path==='peer')return [];return Object.entries(JOBS).filter(([k,j])=>j.loc===loc).map(([k,j])=>{const req={...(j.req||{})};const fl=req.flag;delete req.flag;const reqs=reqList(S,req);if(fl)reqs.push({l:FLAGNAME[fl]||fl,ok:F(S,fl)});return {key:k,name:j.name,income:j.income,wear:j.wear,stable:!!j.stable,meals:!!j.meals,desc:j.desc,reqs,ok:reqs.every(r=>r.ok),current:!!(S.job&&S.job.name===j.name)}})}
function takeJob(S,key){const j=JOBS[key];const info=jobsAt(S,j.loc).find(x=>x.key===key);if(!info||!info.ok)return false;apply(S,{job:{name:j.name,income:j.income,wear:j.wear,meals:j.meals?1:0},log:`開始做「${j.name}」`});if(S.path!=='biz')S.path='work';return true}
function quitJob(S){if(!S.job||S.biz)return false;const n=S.job.name;S.job=null;if(F(S,'grayJob')&&/強哥|豹哥/.test(n))S.f.grayQuit=1;S.log.push({day:S.day,t:`辭掉了「${n}」`});return true}

/* ── 主動找人 ── */
const NPCS={
 zheng:{name:'老鄭',loc:'bridge',here:S=>(F(S,'zheng')||F(S,'zhengHostile')||S.f.zhengFate)&&S.f.zhengFate!=='dead',base:S=>(S.f.zheng===2?60:F(S,'zheng')?45:F(S,'zhengHostile')?15:35)+(['saved','hospital'].includes(S.f.zhengFate)?15:0),loan:2000,
  sp:{label:'聽他講跑船的故事',r:S=>({t:pickL(RNG,['他講好望角的浪，浪高到船頭整個埋進海裡。他說那時候他不怕死，只怕死了沒人知道。','他講他女兒小時候，每次他出海前都要把辮子綁得很緊，說這樣爸爸就會回來。','他講他在南非港口喝醉，被人偷光了錢，在碼頭睡了三天。「跟現在一樣，」他笑，「只是那時候年輕。」']),mind:7})}},
 lin:{name:'林姐',loc:'office',here:S=>F(S,'lin')||F(S,'linCard'),base:S=>F(S,'lin')?55:40,loan:0,
  sp:{label:'請她幫忙',r:S=>F(S,'noID')?{t:'林姐陪你去戶政事務所補辦身分證，規費她先墊。',set:{noID:0,lin:1},days:5,noIncome:1,mind:4,log:'林姐幫忙補辦身分證'}:(!isRoom(S)&&S.money>=2000)?{t:'林姐幫你申請了租屋補助，親自打給房東作保。',house:'room_sub',money:-2000,set:{lin:1},mind:8,log:'林姐幫忙申請租屋補助'}:{t:'她沒有給你什麼，只是陪你坐了一個下午，聽你說話。',mind:8,set:{lin:1}}}},
 wang:{name:'王媽',loc:'market',here:S=>S.f.wang&&!F(S,'wangHurt'),base:S=>25+(S.f.wang||0)*12+(F(S,'wangSaved')?15:0),loan:3000,
  sp:{label:'跟她學滷肉',trust:45,r:S=>{const r={t:'她教你先炒糖色，再下醬油，「火要小，人要有耐心」。你滷壞了三鍋，她罵了你三次，第四鍋她吃了一口，沒說話，又吃了一口。',set:{cookSkill:1},mind:5,log:'跟王媽學會了滷肉'};if(S.biz&&['stall','cart'].includes(S.biz.type))r.mod=.12;return r}}},
 chang:{name:'阿昌',loc:'park',here:S=>S.f.chang&&!F(S,'changGone')&&!F(S,'changHired'),base:S=>S.f.chang===2?55:40,loan:0,
  sp:{label:'陪他去戒酒團體',r:S=>({t:'團體在教會的地下室，十幾個人圍成一圈。輪到阿昌的時候，他說：「我叫阿昌，我是酒鬼。」然後哭了。\n\n回來的路上，他說下禮拜還要來。',addict:-6,con:3,set:{changSober:(S.f.changSober||0)+1},mind:3})}},
 lily:{name:'莉莉',loc:'market',here:S=>S.f.lily&&!F(S,'lilyGone')&&!F(S,'lilyHired'),base:S=>30+(S.f.lily||0)*10,loan:1500,
  sp:{label:'幫她顧攤一晚',r:{t:'她去學校接女兒的時候，你替她顧攤。你煮的河粉被一個客人退了，她回來笑了很久。她塞給你五百塊。',money:500,hp:-3,mind:3}}},
 luo:{name:'小羅',loc:'park',here:S=>F(S,'luo')&&!F(S,'luoHired'),base:S=>50,loan:0,
  sp:{label:'教他認字',r:{t:'他把自己的名字寫了二十遍。最後一遍，羅這個字終於沒有寫錯。',con:4,mind:4}}},
 kai:{name:'阿凱',loc:'market',here:S=>(F(S,'strong')||F(S,'strongNoticed')||F(S,'gray'))&&!F(S,'kaiGone')&&!F(S,'strongEnemy')&&!S.biz,base:S=>25+(F(S,'gray')?15:0)+(F(S,'grayJob')?10:0),loan:5000,loanRate:1.4,
  sp:{label:'接一件私活',r:{t:'一個信封，送到三重的一間檳榔攤。你沒問裡面是什麼，阿凱也沒說。回來的時候，他塞給你兩千五。',money:2500,heat:1,con:-6,set:{gray:1,strong:1},log:'替阿凱跑了一件私活'}}},
 cai:{name:'阿財',loc:'yard',here:S=>S.f.cai&&!F(S,'caiExposed'),base:S=>30+(F(S,'caiPartner')?15:0)+(S.f.cai===2?10:0),loan:2000,
  sp:{label:'跟他學分類和估價',trust:40,r:{t:'銅、鋁、不鏽鋼、白鐵，一摸就知道。他說你學得比他兒子快，「他兒子只會花錢」。\n\n他說場裡缺一個分類工，你可以來。',set:{caiJob:1},mind:3,log:'跟阿財學會估價'}}},
 chen:{name:'陳老闆',loc:'site',here:S=>F(S,'chen'),base:S=>45,loan:5000,
  sp:{label:'問他有沒有固定的工',r:{t:'陳老闆嚼著檳榔看你：「綁鐵，一天兩千，下雨沒錢。明天五點。」',set:{chenJob:1},mind:3}}},
 black:{name:'黑仔',loc:'park',here:S=>S.seen.includes('c1_bag')&&!F(S,'blackDone')&&S.ch<5,base:S=>F(S,'blackEnemy')?10:25,loan:0,
  sp:{label:'分他一包菸',r:{t:'他接過菸，看了你很久：「你跟別人不一樣。」那天晚上，公園裡沒有人碰你的東西。',money:-100,mind:2}}},
 wife:{name:'美玲',loc:'market',here:S=>S.origin==='debt'&&S.f.wife&&S.f.wife!=='avoid',base:S=>S.f.wife==='money'?45:40,loan:0,
  sp:{label:'等她收攤，陪她走回家',r:S=>({t:'你們沿著西園路走，誰都沒說話。到她家樓下，她說：「小晴問過你。」然後上樓了。',mind:6})}},
 sister:{name:'小雯',loc:'ximen',here:S=>S.origin==='family'&&S.f.sister&&S.f.sister!=='cut',base:S=>55,loan:3000,
  sp:{label:'聽她講家裡的事',r:{t:'她說爸最近開始用手機了，只會傳貼圖，傳的都是早安圖。「他每天都傳一張給我，叫我轉給你。」她把手機給你看，三十幾張早安圖。',mind:8}}},
 officer:{name:'張觀護人',loc:'office',here:S=>S.origin==='excon'&&!!S.f.parole,base:S=>S.f.parole==='honest'?50:S.f.parole==='ok'?55:30,loan:0,
  sp:{label:'主動去報到，說說你的近況',r:S=>({t:'張觀護人聽你講完，在資料上寫了很久。最後他說：「你是我這個月第一個主動來的。」',set:{parole:S.f.parole==='lie'?'lie':'ok'},mind:4})}},
 student:{name:'陳志明',loc:'bridge',here:S=>S.origin==='teacher'&&F(S,'studentCop'),base:S=>55,loan:3000,
  sp:{label:'請他喝一杯咖啡',r:{t:'他穿著便服，坐得還是很直。他說他現在帶新人，第一件事就是教他們盤查時要先說「您好」。「老師以前說，對人要先有禮貌。」',mind:8,money:-100}}}
};
function trustOf(S,id){S.rel=S.rel||{};if(S.rel[id]==null)S.rel[id]=Math.max(0,Math.min(100,NPCS[id].base(S)));return S.rel[id]}
function addTrust(S,id,d){trustOf(S,id);S.rel[id]=Math.max(0,Math.min(100,S.rel[id]+d))}
function npcsAt(S,loc){return Object.entries(NPCS).filter(([k,n])=>n.loc===loc&&n.here(S)).map(([k,n])=>{const tr=trustOf(S,k);const owe=(S.owe||{})[k]||0;const sp=n.sp;const acts=[
  {key:'chat',label:'聊聊天',ok:true},
  {key:'treat',label:'請他吃一頓飯（200 元）',ok:S.money>=200,why:'錢不夠'},
  {key:'help',label:'幫他做點事',ok:S.hp>=25,why:'你自己都快撐不住了'},
  {key:'special',label:sp.label,ok:tr>=(sp.trust||25),why:`信任 ${sp.trust||25} 以上`}];
 if(owe)acts.push({key:'repay',label:`還錢（${owe.toLocaleString()} 元）`,ok:S.money>=owe,why:'錢不夠'});
 else if(n.loan)acts.push({key:'borrow',label:`跟他借 ${n.loan.toLocaleString()} 元${n.loanRate?'（要還 '+Math.round(n.loan*n.loanRate).toLocaleString()+'）':''}`,ok:tr>=55,why:'信任 55 以上'});
 return {id:k,name:n.name,trust:tr,owe,acts}})}
const CHAT={zheng:['他說今天的風跟南非的一樣。','他問你身分證有沒有藏好。','他把半個麵包分給你。'],lin:['她問你最近睡得好不好。','她在電話和你之間來回，講了一個小時。','她說她女兒今年考大學。'],wang:['她一邊切菜一邊罵隔壁攤的老闆。','她問你有沒有在喝酒。','她說她的膝蓋又在痛了。'],chang:['他說他以前辦桌，一天出一百桌。','他手一直在抖，但是講到菜的時候不抖。','他問你想不想吃他煮的東西。'],lily:['她女兒在旁邊寫功課，問你「萬」字怎麼寫。','她說她想回越南看媽媽，機票太貴。','她教你說一句越南話：謝謝。'],luo:['他說他今天舉牌被老闆稱讚。','他問你，以後會不會好一點。','他說育幼院的老師以前也叫他錢要藏好。'],kai:['他說強哥那邊最近缺人。','他問你最近手頭緊不緊。','他抽完一整包菸，什麼重要的都沒說。'],cai:['他說這個月銅價又跌了。','他說他兒子在台中當工程師，一年回來一次。','他給狗吃了半個便當。'],chen:['他說老鄭欠他一條命，也救過他一條命。','他說現在的年輕人都不想做工。','他問你腰還行不行。'],black:['他說他以前是開計程車的。','他沒說什麼，一直看著公園的門口。','他問你有沒有菸。'],wife:['她說小晴最近在準備考試。','她說麵攤老闆對她不錯。','她問你有沒有好好吃飯。'],sister:['她說她交了男朋友，爸不知道。','她說媽的膝蓋開刀了，很順利。','她說五金行的招牌換了。'],officer:['他問你最近有沒有工作。','他說他快退休了。','他提醒你下次報到的日期。'],student:['他說他女兒出生了。','他說他還記得你上課講的〈出師表〉。','他說萬華的治安比以前好了一點。']};
function meet(S,id,act){const n=NPCS[id];const info=npcsAt(S,n.loc).find(x=>x.id===id);const a=info&&info.acts.find(x=>x.key===act);if(!a||!a.ok)return null;let r;
 if(act==='chat'){r={t:`你去${MAPLOC[n.loc].name}找${n.name}。${pickL(RNG,CHAT[id]||['你們聊了很久。'])}`,mind:3};addTrust(S,id,5)}
 else if(act==='treat'){r={t:`你請${n.name}吃了一頓飯。${pickL(RNG,['他吃得很慢，好像捨不得吃完。','吃完，他說下次換他請。你們都知道沒有下次，但都很高興。','他把剩下的打包，說要留給別人。'])}`,money:-200,mind:4,hp:2};addTrust(S,id,9)}
 else if(act==='help'){r={t:`你幫${n.name}${pickL(RNG,['搬了一整天的東西。','修好了漏水的帆布。','跑了一趟腿，排了兩個小時的隊。'])}他沒說謝謝，但下次見面時，他先跟你打了招呼。`,hp:-4,con:2,rep:2};addTrust(S,id,7)}
 else if(act==='special'){const sp=n.sp;r=typeof sp.r==='function'?sp.r(S):{...sp.r};r.t=`你去${MAPLOC[n.loc].name}找${n.name}。\n\n`+r.t;addTrust(S,id,6)}
 else if(act==='borrow'){S.owe=S.owe||{};const back=Math.round(n.loan*(n.loanRate||1));S.owe[id]=back;S.oweDay=S.oweDay||{};S.oweDay[id]=S.day;r={t:`${n.name}看了你很久，從${id==='kai'?'皮夾克裡':'口袋裡'}掏出 ${n.loan.toLocaleString()} 元。「${id==='kai'?'一個月內還，'+back.toLocaleString()+'。':'有了再還。'}」`,money:n.loan,mind:-2};addTrust(S,id,-10)}
 else if(act==='repay'){const v=S.owe[id];delete S.owe[id];r={t:`你把 ${v.toLocaleString()} 元還給${n.name}。他數都沒數就收起來了。`,money:-v,mind:3};addTrust(S,id,14)}
 const before={};SNAPK.forEach(k=>before[k]=S[k]);apply(S,r);const delta={};SNAPK.forEach(k=>{const d=S[k]-before[k];if(Math.abs(d)>=.5)delta[k]=Math.round(d)});
 const up=upkeep(S,r.days??CH[S.ch].days,{noIncome:r.noIncome});
 if(S.owe)for(const k in S.owe){if(S.day-(S.oweDay[k]||S.day)>60){addTrust(S,k,-8);S.oweDay[k]=S.day;if(k==='kai'){S.owe[k]=Math.round(S.owe[k]*1.2);S.hp-=6}}}
 return {text:r.t,delta,up,title:n.name}}
{const P1=people;people=function(S){const out=P1(S);const nm={};for(const k in NPCS)nm[NPCS[k].name]=k;out.forEach(p=>{const k=nm[p.name];if(k&&S.rel&&S.rel[k]!=null){p.trust=Math.round(S.rel[k]);if(S.owe&&S.owe[k])p.status+=` 你欠他 ${S.owe[k].toLocaleString()} 元。`}});return out}}

/* ── 十年後 ── */
const AGE={debt:42,excon:35,injury:48,family:23,teacher:66};
function tenYears(S,key){const A=AGE[S.origin]+12,f=k=>F(S,k),out=[];const T=k=>S.rel&&S.rel[k]!=null?S.rel[k]:null;
 const Y={
  tycoon:`你 ${A} 歲了。公司有兩百多個員工，你已經記不住每個人的名字。每年寒流來的那個晚上，你會一個人開車到環河南路，坐在車裡看橋下，坐到天亮。`,
  tycoon_dark:`你 ${A} 歲了。勞檢開了你第十七張罰單，你付錢像付電費。醫生叫你戒酒，你說等明年。你已經說了五年。`,
  whitewash:`你 ${A} 歲了。你的建設公司在萬華蓋了一棟大樓，就蓋在你以前睡過的那座橋旁邊。銷售海報上寫著「河岸第一排」。`,
  dabo:S.heat>=4?`你 ${A} 歲了，在台北監獄過了第四個生日。華西街現在是阿凱的。他每年託人送一條菸進來，從來沒有來看過你。`:`你 ${A} 歲了。在華西街，坐這個位子的人很少撐過十年。你撐過了。你身邊的人，換了三輪。`,
  boss:`你 ${A} 歲了。你的地下錢莊借錢給一個開早餐店的人，他想撐過連鎖店開幕的那幾個月。你看著他簽名，想起了一個人，但想不起是誰。`,
  jiaotou:`你 ${A} 歲了。三間茶室剩下一間。三重的人換了老大，新老大比你小二十歲，叫你「阿伯」。`,
  stall:`你 ${A} 歲了。店門口那句「要不要？反正要倒掉」，現在是你的徒弟在說。他以前也睡過公園。`,
  foreman:`你 ${A} 歲了。你的工班出過一次意外，你第一個打了一一九。現在換你的領班，在早上五點的騎樓下點人頭。`,
  recycler:`你 ${A} 歲了。回收場的磅秤換成電子秤了，你每個月親自校正一次。推車來賣東西的人，你都叫得出名字。`,
  cart:`你 ${A} 歲了。你的攤子從夜市最邊邊，搬到了夜市口。招牌換過兩次，字還是你自己寫的。`,
  peer:`你 ${A} 歲了。林姐退休那天，把她的背心給你。去年，你把你的背心給了另一個人，一個你在橋下拉起來的人。`,
  teacher:`你 ${A} 歲了。識字班辦到了第十屆。第一屆的那個阿伯走了，告別式上，他的兒子念了一封信，是阿伯自己寫的。`,
  singer:`你 ${A} 歲了。〈五金行〉被一個樂團翻唱，在網路上紅了一陣子。版稅不多，夠你每個月寄一點錢回台中。`,
  exonerated:`你 ${A} 歲了。你在法扶當志工，專門陪人聲請再審。成功的案子不多，你每一件都記得。`,
  family_home:S.origin==='teacher'?`你 ${A} 歲了。你在台中的公園教了十年的字，有一個外籍看護考上了華語教師證照，她說要回印尼教書。`:`你 ${A} 歲了。五金行的招牌換了，上面多了你的名字。你爸坐在門口的板凳上，每天傳一張早安圖給小雯。`,
  debtfree:`你 ${A} 歲了。你還是每天早上四點醒來。樓下的早餐店換了老闆，你每天去買一份蛋餅，跟老闆聊兩句煎台的火候。`,
  father:`你 ${A} 歲了。志豪結婚了，喜帖上父親那一欄寫著你的名字。你穿著西裝，腰還是會痛。`,
  home:`你 ${A} 歲了。你還住在一個小房間裡，窗戶一樣對著別人家的陽台。你學會了存錢，學會了一個人過年，也學會了在下雨天不去想以前。`,
  edge:`你 ${A} 歲了。你換過五份工作，搬過四次家，有兩次差點又回到橋下。你都撐住了。撐住，就是你這十年最大的成就。`,
  street:`你 ${A} 歲了，還在街上。橋下的人換了好幾輪，你成了最老的那一個。新來的人叫你「老鄭」，因為你也開始教別人，錢要塞內褲。`,
  bankrupt:`你 ${A} 歲了。你又開過一次店，又倒了一次。第三次，你在夜市擺了一個小攤，不借錢，不擴張，賣到現在。`,
  prison:`你 ${A} 歲了。你出獄的那天，${T('lin')>=55?'林姐站在門口等你。她的頭髮白了一半。':'門口一個人都沒有。'}`,
  caught:`你 ${A} 歲了。出獄後，你在一間洗車場工作，老闆也是更生人。他從不問你的過去，你也不問他的。`,
  revoked:`你 ${A} 歲了。你終於服完了所有的刑期。張觀護人退休了，他寄給你一張明信片，上面只寫了一句：「地址寫真的。」`,
  dead:`十年過去了。橋下已經沒有人記得你。`,
  killed:`十年過去了。華西街換了三個老大。你被砍的那條巷子，現在開了一間手搖飲料店。`,
  broken:`你 ${A} 歲了，還在療養院。你每天坐在窗邊，看著外面的樹，有時候會突然說一句：「錢要塞內褲。」護理師不知道是什麼意思。`
 };
 out.push(Y[key]||`你 ${A} 歲了。`);
 const cand=[];const add=(k,txt,w)=>{if(txt)cand.push({w,txt})};
 const tz=T('zheng');if(S.f.zhengFate&&S.f.zhengFate!=='dead'&&!S.seen.includes('c6_zheng'))add('zheng',tz>=60?'老鄭走的時候，是你替他辦的後事。骨灰撒在基隆外海，那天浪很大，他會喜歡的。':'老鄭後來住進了安養院。你去看過他一次，他已經不認得你了，只一直說南非的浪。',tz||30);
 else if(S.seen.includes('c6_zheng'))add('zheng','每年老鄭的忌日，你都會去八斗子站一下。',50);
 const tl=T('lin');if(tl!=null)add('lin',tl>=60?'林姐退休了。她在龍山寺附近開了一間小小的二手書店，你每個月去一次，她每次都問你最近睡得好不好。':'林姐退休了。你在報紙上看到她拿了一個社工的獎，照片裡她還是綁著馬尾。',tl);
 const tw=T('wang');if(tw!=null)add('wang',f('cookSkill')?'王媽回宜蘭帶孫子了。她教你的滷肉，你現在閉著眼睛都會做。':tw>=55?'王媽回宜蘭了。每年過年，她寄一箱自己醃的菜脯給你。':'王媽的店收掉了，那裡現在是一間便利商店。',tw);
 if(S.f.huei==='saved')add('huei',f('hueiLoan')?'阿惠在台東開了一間汽車修理廠。她寄了一張照片給你，她穿著工作服，站在一台吊起來的車子下面。':'阿惠結婚了，喜帖寄到社福中心給「車站那個大哥」。',60);
 else if(f('hueiFreed'))add('huei','茶室那個女孩，林姐說她在台東當了社工。',45);
 const tc=T('chang');if(S.f.chang)add('chang',f('changOK')||(S.f.changSober||0)>=2?'阿昌戒酒十年了。他在南部重新辦桌，每年請你回去吃一次，坐主桌。':'阿昌的消息，你已經很久沒有聽到了。',tc||35);
 const ty=T('lily');if(S.f.lily&&!f('lilyGone'))add('lily',f('lilyLoyal')||(ty||0)>=60?'莉莉的女兒考上了法律系。她說畢業以後，要幫她媽媽那樣的人打官司。':'莉莉回越南了。她女兒留在台灣讀大學。',ty||35);
 const tk=T('kai');if(T('kai')!=null||f('kaiHired'))add('kai',['dabo','boss','jiaotou'].includes(key)?'阿凱一直在你身邊。你不知道他在等什麼。':'阿凱在一次火拼裡受了傷，現在在三重開計程車。',tk||30);
 if(f('luo'))add('luo','小羅開了一間機車行。他還是把錢塞在內褲裡，雖然他現在有銀行帳戶了。',(T('luo')||45));
 if(f('blackLoyal'))add('black','黑仔走了，是你替他簽的死亡證明書。在「與死者關係」那一欄，你寫：朋友。',55);
 const fam={debt:S.f.daughter?(f('gradAttend')?'小晴當了會計師。她的事務所在南京東路，辦公桌上放著一張你在畢業典禮最後一排的照片。':'小晴大學畢業了。你是從美玲那裡聽說的。'):null,
  excon:f('brotherGrave')||f('brotherKnows')?'阿德把公司交給了專業經理人，自己去當了更生保護會的志工。':f('brotherPaid')?'阿德的公司上市了。你在財經新聞上看到他，他看起來很老。':null,
  injury:f('sonSchool')?'志豪成了工安檢查員。他第一次去工地稽查，就開了一張未設安全扣環的罰單。':f('sonWork')?'志豪接下了你的工具，現在帶著自己的工班。':f('sonSite')?'志豪在一次工地意外中摔斷了腿。你去醫院看他，他說：「爸，我現在知道了。」':null,
  family:f('dadCame')?'你爸八十歲了。他還在顧五金行，每天下午在店門口彈你送他的那把吉他，彈得很爛，很大聲。':S.f.sister&&S.f.sister!=='cut'?'小雯生了一個女兒，取名叫「雯晴」。她說，晴是希望以後天氣都很好。':null,
  teacher:f('plaqueBack')?'俊宏的兒子上小學了。他第一次寫作文，題目是〈我的爺爺〉，寫的是一個在萬華教人寫字的老師。':f('kidsKnow')?'雅婷每年帶著孩子來萬華一次，坐在識字班的最後一排。':null};
 if(fam[S.origin])add('fam',fam[S.origin],90);
 cand.sort((a,b)=>b.w-a.w);cand.slice(0,4).forEach(c=>out.push(c.txt));
 if(['dead','killed'].includes(key)){const best=Object.entries(S.rel||{}).filter(([k,v])=>v>=60&&NPCS[k]).sort((a,b)=>b[1]-a[1])[0];out.push(best?`只有${NPCS[best[0]].name}，每年寒流來的那一天，會在你睡過的那根柱子旁邊，放一個便當。`:'只有那根柱子還在，被新的紙板和帆布圍著。')}
 return out}
