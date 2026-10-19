
/* ═════════ 第三版擴充：難度、局勢、方針、出身主線 ═════════ */
const DIFF={
 street:{name:'街頭',desc:'標準。健康和精神各有一次被救回來的機會。限時抉擇 12 秒。',nets:2,cost:1,dmg:1,timer:12},
 winter:{name:'寒冬',desc:'物價和傷害多三成。健康和精神共用一次安全網。限時 9 秒。',nets:1,cost:1.3,dmg:1.3,timer:9},
 hell:{name:'地獄',desc:'物價和傷害多六成，沒有安全網。限時 6 秒。',nets:0,cost:1.6,dmg:1.6,timer:6}
};
const WORLD={
 inflation:{name:'物價上漲',desc:'一個便當從八十漲到一百零五。'},
 boom:{name:'景氣熱',desc:'工地和店家都缺人，工錢多一成五。'},
 harsh:{name:'嚴冬',desc:'冬天露宿的傷害多五成。'},
 election:{name:'選舉年',desc:'為了市容，盤查和驅趕變多了。'},
 renewal:{name:'都更潮',desc:'老房子一棟一棟拆，房租多三成。'},
 typhoon:{name:'颱風年',desc:'颱風一個接一個，從春天就開始。'},
 kind:{name:'好心人多',desc:'教會和善心團體的物資特別多，沒錢吃飯的日子沒那麼傷。'}
};
function pickWorld(R){const k=Object.keys(WORLD);const a=k.splice(Math.floor(R()*k.length),1)[0];return [a,k[Math.floor(R()*k.length)]]}
const W_=(S,k)=>!!(S.world&&S.world.includes(k));
const MODES={
 normal:{name:'照常過',desc:'不多做，也不少做。'},
 hustle:{name:'拚命賺',desc:'收入多兩成五。健康和精神每天多耗。'},
 frugal:{name:'省吃儉用',desc:'一天一餐，飯錢省一半。健康會慢慢掉。'},
 rest:{name:'顧身體',desc:'收入少一成五。健康和精神慢慢回來。'},
 social:{name:'跑人脈',desc:'請客、搏感情。收入少一成，每天多花三十，人脈慢慢上升。'}
};
ORIGINS.debt.trait='做過老闆：做生意收入多一成五。代價：債主一直在找你，你越有錢，他們越容易找到你。';
ORIGINS.excon.trait='裡面學的：灰色地帶賺的錢多三成。代價：盤查必被刁難，銀行不借你錢，還有觀護人要報到。';
ORIGINS.injury.trait='老師傅：工地類工作收入多三成。代價：腰傷每天都在耗健康。';
ORIGINS.family.trait='年輕：健康每天恢復得比較快，背包裡還有一把吉他。代價：精神比較脆，打擊多一成五。';
ORIGINS.teacher={name:'退休老師',who:'六十六歲 · 退休金被騙光',desc:'你教了三十五年國文。一通「檢察官」的電話，讓你把退休金全部匯了出去。你不敢告訴兒女，自己搬了出來。',st:{hp:45,mind:40,con:75,rep:10,addict:0,money:300},trait:'識字的人：能代寫文件賺錢，社福的路比較好走。代價：年紀大了，所有健康門檻多 10。',locked:1};
LOC.temple='龍山寺';LOC.river='新店溪 · 河堤';LOC.ximen='西門町';LOC.underpass='台北車站 · 地下道';LOC.sea='基隆 · 八斗子';LOC.office='萬華社福中心';

function scaleR(S,r){const D=DIFF[S.diff||'street'];const x={...r};
 if(x.hp<0)x.hp=x.hp*D.dmg;
 if(x.mind<0)x.mind=x.mind*D.dmg*(S.origin==='family'?1.15:1);
 if(S.origin==='excon'&&x.heat>0&&x.money>0)x.money=Math.round(x.money*1.3);
 return x}
const TODS={station:['night','night','dusk'],bridge:['night','dawn','night','dusk'],park:['night','day','dawn','dusk'],alley:['night','dusk','night'],site:['day','day','dusk'],market:['night'],yard:['night','day','dawn'],temple:['dusk','night','day'],river:['dusk','dawn','night','day'],ximen:['night','dusk'],underpass:['night'],sea:['day','dusk'],office:['day','day','dusk'],room:['night','dusk','day'],hospital:['day']};
function autoTod(sc,id,day){const a=TODS[sc]||['night'];let h=day;for(const c of id)h=(h*31+c.charCodeAt(0))%997;return a[h%a.length]}
function panicOn(id,txt){const c=EV[id].ch.find(c=>c.t===txt);if(!c)throw new Error('panic '+id+txt);c.panic=1}

/* ── 回憶：每章一段，揭露出身的過去 ── */
const MEM={
 debt:['早餐店開了十一年。每天凌晨四點拉開鐵門，煎台上第一顆蛋的聲音，是你一天裡最安靜的時候。後來隔壁開了連鎖早餐，你借了第一筆錢，想撐過去。','第一筆是二十萬，月息三分。第二筆是為了還第一筆的利息。你記得美玲把存摺拿出來的那天晚上，她沒有哭，只是把電視關了。','紅漆潑在鐵門上的那天，小晴在上學的路上看到了。她回來沒說話。晚上你聽見她在房間裡打電話給同學，說「我爸生病了」。','你離開的那天早上，在煎台上留了一張紙條：「債是我的，不要替我還。」你不知道美玲有沒有照做。你只知道後來她的手機也換了號碼。','你常常夢到早餐店。夢裡永遠是凌晨四點，蛋還沒下鍋，你站在煎台前面，不知道要做什麼。','你算過，如果當年沒借第一筆，你現在大概還在煎蛋。賺得不多，但每天回家。你不常算這個。'],
 excon:['六年前，哥哥阿德叫你幫他把一個包裹從高雄送到台北。警察在交流道攔車的時候，他在電話裡說：「你先扛，我會照顧媽。」你扛了。','在裡面的第一年，媽媽每個月來會客。第二年開始，她沒有來。管理員說，家屬沒有再登記。','你在裡面學了很多事：怎麼睡在吵的地方，怎麼看人，怎麼不說話。這些在外面都還用得上。','出監的時候，你身上有兩千三百塊保管金和一個地址。地址是媽媽的。你去的時候，那裡已經是一間手搖飲料店。','你一直沒問自己一個問題：如果重來一次，你還會不會扛。你怕答案是會。','你在裡面認識的人，有一半又回去了。你數過。你不想變成那一半。'],
 injury:['你做了二十六年的模板工。你可以閉著眼睛在三樓的鷹架上走，你也是這樣摔下來的。那天，安全帶的扣環是壞的，你跟黃老闆講過三次。','醫生說，腰椎兩節骨折，以後不能搬重物。你問他，那我要做什麼？他說，這要問社工。','志豪那年十三歲。你躺在床上的那幾個月，他每天放學回來幫你翻身，從來不抱怨。有一天你聽見他跟他媽說：「爸好像變小了。」','你開始吃止痛藥，然後是藥酒，然後是米酒。老婆說她不是因為窮才走的，是因為你喝醉的時候，眼神像另一個人。','你常常在下雨的時候腰痛。你在橋下聽雨聲，想起以前在工地，下雨就是放假，大家擠在貨櫃屋裡打牌。','你不怪黃老闆。你只是想知道，他有沒有想過你。'],
 family:['你爸開了三十年的五金行。他要你考土木，接店，娶隔壁巷子陳家的女兒。你只想彈吉他。','摔門那晚，你爸把你的吉他從二樓丟下去。琴頸裂了一道縫，你用電火布纏起來，到現在還在用。','你在台北的第一個月住朋友家的沙發。第二個月，朋友的女朋友搬進來了。第三個月，你在台北車站睡了第一晚，告訴自己這是在體驗生活。','小雯小你五歲。你走的那天，她站在樓梯口，什麼都沒說，只是把她存的零用錢塞進你的吉他袋。你後來才發現，兩千三百塊，全是十塊錢銅板。','你寫過一首歌，叫〈五金行〉。你沒唱給任何人聽過。','你常常想，你爸到底是氣你不接店，還是氣你跟他年輕的時候一模一樣。媽媽說過，你爸年輕時也想去台北。'],
 teacher:['你在國中教了三十五年國文。退休那天，學生送你一塊匾，上面寫「春風化雨」。你把它掛在客廳，每天擦。','那通電話說，你的帳戶涉及洗錢，檢察官要「監管」你的存款。你是教書的。你信公文，你信制服，你信檢察官這三個字。','你一共匯了五次。第五次，銀行的行員問你：「老師，您確定嗎？」你說確定。你記得她看你的眼神。','你沒有告訴兒女。女兒在台中當護理師，兒子在上海。你只說你想一個人住，搬去台北「離老同事近一點」。那塊匾，你留在舊家了。','以前你教〈琵琶行〉，教到「同是天涯淪落人」，學生都覺得好老。你現在在橋下想起這一句，覺得一點都不老。','你最怕的不是窮，是有一天在街上遇到以前的學生，他叫你一聲老師。']
};
function memory(S,ch){return (MEM[S.origin]||[])[ch-1]||''}

/* ── 舊事件補上入鏡人物、場景與限時 ── */
const setv=(id,k,v)=>{EV[id][k]=v};
setv('c1_zheng','npc','zheng');setv('c2_start','npc','zheng');setv('c2_cold','npc',S=>S.f.zhengFate==='dead'?null:'zheng');
setv('c2_lin','npc','lin');setv('c2_chang','npc','chang');setv('c1_cai','npc','cai');setv('c3_scale','npc','cai');
setv('f_bento','npc','wang');setv('c1_huei','npc','kai');setv('c1_huei','weather','rain');setv('c2_strong','npc','kai');
setv('c3_lily','npc','lily');setv('c4_reporter','npc','reporter');setv('c4_reporter','scene','office');setv('c4_chang2','npc','chang');
setv('c5_old','npc','black');setv('f_luo','npc','luo');setv('f_huei3','npc','girl');setv('c3_huei2','npc','girl');
setv('f_daughter','npc','woman');setv('c1_sign','npc','broker');setv('f_mom','npc','mom');setv('f_zheng4','npc','zheng');
setv('c2_newyear','scene','temple');setv('c4_start','scene','river');setv('f_kid','scene','office');setv('c3_room','tod','day');
setv('c6_zheng','scene',S=>S.f.zhengFate==='dead'?'bridge':'sea');setv('c6_zheng','npc',S=>S.f.zhengFate==='dead'?'woman':'zheng');
setv('f_typhoon','weather','storm');setv('c2_start','weather','rain');setv('f_rain','weather','rain');setv('f_rain','scene','temple');
setv('p5_rule','npc','drunk');setv('p5_rule','weather','rain');setv('c1_start','scene','station');
setv('c1_bag','timer',1);panicOn('c1_bag','裝睡，不敢動');
setv('f_black','timer',1);panicOn('f_black','跑');
setv('f_cops','timer',1);panicOn('f_cops','轉身就跑');
setv('f_debt','timer',1);panicOn('f_debt','跪下來求他寬限');
setv('c3_work','timer',S=>workBranch(S)!=='other');panicOn('c3_work','照規矩收');panicOn('c3_work','照領班的話做');panicOn('c3_work','不要出頭，讓王媽自己付');
setv('c3_huei2','timer',S=>S.f.huei==='lost');panicOn('c3_huei2','走開');

{const t0=EV.c1_start.text;EV.c1_start.text=S=>S.origin==='teacher'?`晚上十一點，台北車站大廳的廣播播完最後一班區間車。保全開始一排一排地把坐在地上的人叫起來。\n\n你身上穿著一件洗得很乾淨的襯衫，口袋插著一支紅筆。三十五年，你習慣身上有一支紅筆。你把它拿出來看了一下，又插回去。\n\n你身上剩 ${S.money} 元。外面在起風。`:t0(S);}
{const r0=EV.c2_newyear.ch[0].r;EV.c2_newyear.ch[0].r=S=>S.origin==='teacher'?{t:'你打給女兒，說你在台北過得很好，和老同事一起圍爐。\n\n她說：「爸，你那邊好安靜。」你說老同事都睡了。掛掉電話以後，你在電話亭裡站了很久。',mind:-4,set:{kidsCall:1}}:r0(S);}
{const t0=EV.c4_reporter.text;EV.c4_reporter.text=S=>S.origin==='teacher'?t0(S)+'你想起你以前的學生，可能會看到。':t0(S);}
{const t0=EV.c6_start.text;EV.c6_start.text=S=>S.origin==='teacher'?'刑事局打電話到社福中心找你。\n\n騙走你退休金的那個集團，主嫌在台中被抓了，帳戶裡還有一些錢沒被領走。如果你出庭作證，有機會發還一部分。\n\n但對方的律師會在法庭上，當著所有人的面問你：一個老師，怎麼會這麼笨。':t0(S);
 const ch=EV.c6_start.ch;ch.pop();
 ch.push({t:'去台中出庭作證',show:S=>S.origin==='teacher',r:(S,R)=>R()<.6?{t:'你出庭了三次。對方律師問你：「一個國文老師，怎麼會相信這種電話？」你說：「因為我教了三十五年，要學生相信白紙黑字。」\n\n法院發還了你被騙的一部分錢：十八萬。',money:180000,days:6,noIncome:1,mind:6,log:'出庭作證，拿回一部分被騙的錢'}:{t:'你出庭了三次。主嫌的帳戶早就被掏空了，被害人太多，能發還的很少。你拿到三千兩百塊，和一句「節哀」。',money:3200,days:6,noIncome:1,mind:-8}});
 ch.push({t:'這件事，你不管',r:S=>({t:o(S,{family:'你沒有回去，也沒有寄錢。三個月後，你媽寄來一張照片，你爸坐在輪椅上，背面沒有字。',injury:'你說你沒錢。前妻掛掉電話。兒子從此不再寫信。',debt:'你換了手機，搬了家。你知道他們還會再找到你。',excon:'你關上門。隔著門，他說：「我在裡面幫過你。」然後腳步聲走遠了。',teacher:'你沒有去。你不想再聽一次那個問題：為什麼你會相信。'}),mind:-10,con:-6})});
}

/* ── 出身主線事件 ── */
const onlyFor=(org,extra)=>S=>S.origin!==org||(extra?extra(S):false);
Object.assign(EV,{
/* 生意倒了 */
d_wife:{scene:'market',npc:'wife',tod:'night',skip:onlyFor('debt'),title:'洗碗槽',
 text:()=>'華西街夜市，你蹲在一個麵攤後面撿紙箱。洗碗槽前面站著一個女人，袖子捲到手肘，手泡得發白。是美玲。\n\n她以前是早餐店的老闆娘，最會做蛋餅皮。她抬頭看到你，手上的碗滑進水裡。\n\n「他們每個禮拜都來，」她說，聲音很平。「我跟他們說我們離婚了。他們不信。」',
 ch:[
  {t:'跟她說對不起，問她要不要一起想辦法',req:{mind:30},r:{t:'你們在收攤後的騎樓下站了一個小時。她說她不要你回來，你回來，債主就有人可以找。\n\n「你要真的想辦法，就去把債處理掉，不是躲。」她給了你一張社福中心的名片，說是她自己去問過的。',mind:3,set:{wife:'talk',linCard:1},log:'在夜市遇到前妻美玲'}},
  {t:'把身上的錢全部塞進她圍裙口袋，轉身就走',show:S=>S.money>0,r:S=>({t:'你什麼也沒說。走到巷口，你聽見她在後面叫你的名字，你沒回頭。\n\n那一個禮拜，你吃的都是廟口的供品。',money:-S.money,con:6,mind:-2,set:{wife:'money'},log:'把身上的錢全給了美玲'})},
  {t:'低頭，裝作不認識',r:{t:'她看了你很久，然後低頭繼續洗碗。你聽見瓷碗互相碰撞的聲音，一直到你走出夜市。',mind:-6,set:{wife:'avoid'}}}
 ]},
d_daughter:{scene:'office',npc:'daughter',tod:'day',skip:onlyFor('debt'),title:'切結書',
 text:()=>'社福中心的會談室，林姐帶進來一個穿高中制服的女孩。你還沒認出她，她先開口了：「爸。」\n\n小晴十六歲了。她要申請學費減免，社工說要證明「父親未盡扶養義務」，需要你在一份切結書上簽名。\n\n「簽了，我一學期可以省兩萬八。」她看著桌面。「簽了，就是說你不是我爸。至少在紙上。」',
 ch:[
  {t:'簽',r:{t:'你的手抖到第一次簽歪了，林姐又印了一張。小晴把文件收進書包，站起來，走到門口停了一下：「爸，你要吃飯。」\n\n她走了。你在會談室裡坐到中心關門。',con:6,mind:-12,set:{daughter:'signed',lin:1},log:'在女兒的切結書上簽了名'}},
  {t:'不簽。把你存的錢給她當學費',req:{money:28000},r:{t:'你把存摺裡的錢領出來，用橡皮筋綁好，放在桌上。小晴看著那疊錢，很久都沒伸手。\n\n「這是你睡在外面存的？」她問。你說不是，你說你有在工作。她不信，但她收下了。',money:-28000,mind:10,con:4,set:{daughter:'paid'},log:'替女兒付了一學期學費'}},
  {t:'不簽，說學費你會想辦法',r:{t:'她點點頭，說好。你們都知道這句話是什麼意思。\n\n她沒有再來。',mind:-6,set:{daughter:'promise'}}}
 ]},
d_final:{scene:'alley',npc:'leopard',tod:'night',skip:onlyFor('debt'),title:'豹哥',
 text:S=>`豹哥親自來了。就是那個在你店門口潑紅漆的人，現在頭髮白了一半，走路有點跛。\n\n「你的債，我要轉賣給三重的人了。他們不像我，他們會去學校找你女兒。」他點了根菸。「我給你最後一次機會。」\n\n${F(S,'debtLegal')?'你口袋裡有法扶律師給你的文件。你不知道在這種人面前，一張紙有沒有用。':'你知道他說的是真的。'}`,
 ch:[
  {t:'一次還清本金',req:{money:200000},r:{t:'豹哥數了很久，數完把借據撕了，丟進水溝。「你是我收過最慢的一個。」\n\n你走回家的路上，第一次沒有回頭看。',money:-200000,mind:15,set:{debtCleared:1},log:'還清了地下錢莊的債'}},
  {t:'讓他用你的名字開人頭帳戶抵債',r:{t:'你簽了三份文件，交出身分證影本。債一筆勾銷了。\n\n你不知道你的名字，接下來會出現在哪一份詐騙案的起訴書上。',heat:3,con:-12,set:{debtCleared:1,mule:1},log:'用自己的名字當人頭抵債'}},
  {t:'拿出法扶的文件給他看',show:S=>F(S,'debtLegal'),req:{mind:40},r:{t:'「法院說，你的利息是違法的。」豹哥看著文件，看了很久，笑出來：「你學會了。」\n\n他把菸丟在地上踩熄。「三重那邊，我會說你沒錢。」',mind:10,set:{debtCleared:1},log:'用法律擋下了錢莊'}},
  {t:'報警',req:{con:50},r:(S,R)=>R()<.5?{t:'警察查到豹哥的帳本，整間錢莊被抄了。你的借據被認定是重利，不用還了。\n\n你在派出所門口坐了很久，不知道該打給誰。',mind:12,set:{debtCleared:1},log:'報警抄了錢莊'}:{t:'豹哥被帶去做了筆錄，兩天就出來了。一個禮拜後，小晴的學校門口出現兩個穿 polo 衫的人。\n\n你在豹哥家門口跪了一整晚，把身上所有的錢都給了他。',money:-Math.min(S.money,30000),mind:-18,set:{debtSold:1}}},
  {t:'不理他',r:{t:'「隨便你。」豹哥走了，跛得比來的時候慢。',mind:-8,set:{debtSold:1}}}
 ]},
/* 剛出獄 */
e_parole:{scene:'office',npc:'officer',tod:'day',skip:onlyFor('excon'),title:'觀護人',
 text:()=>'地檢署的觀護室，冷氣很強。你的觀護人姓張，五十幾歲，桌上一疊和你一樣的資料夾。\n\n「假釋期間每個月報到一次，要有固定住址，要有工作或在找工作。」他推了推眼鏡。「你現在住哪？」\n\n住址那一欄是空的。如果他知道你睡在橋下，可能會被認定「生活不穩定」。',
 ch:[
  {t:'照實說，你睡在橋下',r:{t:'張觀護人沉默了一下，在表格上寫了很久。然後他撕了一張便條紙給你：更生保護會的地址，「去那裡，說是我叫你去的。」\n\n更保給了你一千五的急難救助。他沒有說這會不會影響你的假釋。',money:1500,mind:2,con:3,set:{parole:'honest'},log:'對觀護人說了實話'}},
  {t:'說你住在姊姊家',r:{t:'你寫下姊姊的地址。張觀護人點點頭，蓋了章。「下次訪視，我會過去看看。」\n\n你走出地檢署，覺得自己剛剛又欠了一筆債。',mind:-2,set:{parole:'lie'}}},
  {t:'說你還在找',r:{t:'「下個月之前要補。」他在你的資料上畫了一個紅圈。',mind:-4,set:{parole:'pending'}}}
 ]},
e_parole2:{scene:S=>isRoom(S)?'room':'office',npc:'officer',skip:onlyFor('excon'),title:'訪視',
 text:S=>S.f.parole==='lie'?'張觀護人打電話來，說下週二要去你姊姊家訪視。\n\n你姊姊不知道你寫了她的地址。她連你出獄了都不太想知道。':`張觀護人說，下週要去你「現在住的地方」訪視。\n\n${isRoom(S)?'你有一間雅房。你第一次覺得，有一個地方可以讓人看。':'你還睡在外面。'}`,
 ch:[
  {t:'打給姊姊，求她配合',show:S=>S.f.parole==='lie',r:{t:'姊姊在電話裡沉默了很久。「最後一次。」\n\n訪視那天，她煮了一桌菜，演得比你還像。張觀護人走後，她坐在客廳哭了。你不知道她是在哭你，還是在哭媽。',mind:-6,set:{parole:'ok',sisterHelp:1}}},
  {t:'跟張觀護人坦白，你說了謊',show:S=>S.f.parole==='lie',r:(S,R)=>R()<.6?{t:'張觀護人嘆了一口氣：「我知道。你姊姊的鄰居說沒看過你。」\n\n他沒有報撤銷，只是把報到改成兩個禮拜一次。',con:6,mind:4,set:{parole:'ok'},log:'向觀護人坦白說了謊'}:{t:'他說這件事他必須往上報。兩個禮拜後，你收到通知。',end:'revoked'}},
  {t:'那天不出現',show:S=>S.f.parole==='lie',r:{t:'你沒有出現。三週後，警察在橋下找到你。',end:'revoked'}},
  {t:'帶他來看你的房間',show:S=>S.f.parole!=='lie'&&isRoom(S),r:{t:'張觀護人在你三坪的房間裡站了一下，看了看窗台上的薄荷，在表格上打了一個勾。「不錯。」\n\n那是你出獄以後，第一次有人跟你說不錯。',mind:8,set:{parole:'ok'}}},
  {t:'帶他去橋下',show:S=>S.f.parole!=='lie'&&!isRoom(S),r:{t:'他在橋下站了很久，看著你的紙板和帆布。「這樣不行，」他說，「不過我會寫『積極改善中』。」\n\n他當場幫你登記了收容中心的床位。',house:'shelter',mind:-2,set:{parole:'ok'}}},
  {t:'躲起來',show:S=>S.f.parole!=='lie',r:(S,R)=>R()<.5?{t:'張觀護人來了兩次，都沒找到你。第三次，他帶著警察。',end:'revoked'}:{t:'他找不到你，留了一張紙條在社福中心：「下次再不見，我就沒辦法了。」',mind:-8,set:{parole:'ok'}}}
 ]},
e_brother:{scene:'station',tod:'night',skip:onlyFor('excon'),title:'電視牆',
 text:()=>'車站大廳的電視牆在播財經新聞。一個穿西裝的男人在剪綵，字幕寫著：「德昇營造董事長 林志德：從小地方做起，要回饋社會。」\n\n你盯著那張臉，一直看到新聞結束。是阿德。是叫你「先扛」的那個人。\n\n他的公司在內湖，三十層樓。走路過去，大概兩個小時。',
 ch:[
  {t:'走過去',r:{t:'你走了兩個小時，在大樓的警衛室被攔下來。你留了一張紙條：「我出來了。」署名是你的小名。\n\n三天後，一個陌生號碼打到社福中心找你。',mind:-3,set:{brother:1},log:'去找了哥哥阿德'}},
  {t:'把這則新聞告訴記者',show:S=>!!S.f.reporter,r:{t:'記者聽完，眼睛亮了：「你有證據嗎？」你沒有。你只有六年。\n\n她說她會去查。一個禮拜後，阿德的秘書打電話來約你。',rep:2,set:{brother:1,brotherPress:1},log:'把哥哥的事告訴記者'}},
  {t:'不去。你已經扛過了',r:{t:'你看著電視牆換成下一則新聞。你發現自己一點都不意外。',mind:-5,con:2,set:{brotherNo:1}}}
 ]},
e_brother2:{scene:'office',npc:'brother',tod:'dusk',skip:onlyFor('excon',S=>!S.f.brother),title:'和解書',
 text:S=>`阿德約你在一間咖啡廳的包廂。他胖了，手上的錶你不認得是什麼牌子。他先開口：「媽走的時候，我有去。我想說你在裡面，告訴你也沒用。」\n\n他推過來一個信封和一份文件。「三十萬。簽了這個，以前的事就過去了。」文件上寫著「和解及保密協議」。${F(S,'brotherPress')?'\n\n他看著你：「我知道有記者在問。」':''}`,
 ch:[
  {t:'簽，拿三十萬',r:{t:'你簽了。他鬆了一口氣，拍拍你的肩膀，像小時候一樣。\n\n三十萬放在你口袋裡，比六年還輕。',money:300000,con:-10,mind:-8,set:{brotherPaid:1},log:'收了哥哥的三十萬，簽了保密協議'}},
  {t:'不簽。只要他去媽媽的墳前上一炷香',r:{t:'他愣住了。那個週末，你們在新竹的公墓站了一個下午。他哭了，你沒有。\n\n下山的時候，他問你要不要來他公司上班。你說不用。',mind:15,con:6,set:{brotherGrave:1},log:'和哥哥去了媽媽的墳'}},
  {t:'去他的公司上班',r:{t:'他給你一個工地主任的職位，薪水很好，辦公室在內湖。你知道他要你待在他看得到的地方。',job:{name:'德昇營造 工地主任',income:1300,wear:.06},con:-4,set:{brotherJob:1},log:'進了哥哥的公司'}},
  {t:'把一切交給記者，聲請再審',req:{con:55,mind:40},r:(S,R)=>R()<.55?{t:'報導刊出來三個月後，阿德被檢察官約談。當年的證人改口了，法院裁定再審。\n\n裁定那天，你一個人坐在法院門口的台階上，抽完了一整包菸。',rep:15,mind:12,heat:-5,set:{exonerated:1},log:'聲請再審成功'}:{t:'報導刊出來了，但證據不夠。阿德的律師告你誹謗，你賠了錢，也丟了現在的工作。',money:-Math.min(S.money,80000),job:null,mind:-15,rep:4}}
 ]},
/* 工地摔下來 */
i_sue:{scene:'office',tod:'day',skip:onlyFor('injury'),title:'求償',
 text:()=>'法律扶助基金會的律師很年輕，一直在翻你的資料。\n\n「沒保勞保、安全設備不合格，你的前雇主黃老闆要負全責。醫療費、薪資損失、勞動能力減損，加起來可能有幾十萬。」她抬頭，「但訴訟要一年多，每次出庭都要請假。黃老闆也會請律師，說是你自己不小心。」\n\n黃老闆是你同鄉。你們一起做了十年。',
 ch:[
  {t:'提告',r:{t:'你在委任狀上簽了名。律師說，接下來會很漫長。',days:3,noIncome:1,mind:-3,set:{suing:1},log:'對前雇主黃老闆提告'}},
  {t:'先去找黃老闆談',r:{t:'黃老闆在新的工地，看到你，臉色變了。他塞給你三千塊：「我也很難，公司快倒了。」\n\n你看到他手上的金錶不見了，換成一支電子錶。',money:3000,mind:-2,set:{talkHuang:1}}},
  {t:'不告了',r:{t:'「他也不容易。」你說。律師沒有說話，把資料夾闔上。',con:3,mind:-4,set:{noSue:1}}}
 ]},
i_settle:{scene:S=>F(S,'suing')?'office':'bridge',npc:S=>F(S,'suing')?null:'broker',skip:onlyFor('injury'),title:S=>F(S,'suing')?'和解':'新來的人',
 text:S=>F(S,'suing')?'開庭第四次。黃老闆的律師提出和解：十二萬，一次付清，條件是撤告。\n\n你的律師私下說：「判下來可能有六十萬，也可能更少。法官看起來同情你，但安全扣環的證據不完整。」\n\n黃老闆坐在被告席上，頭髮全白了。他一直沒有看你。':'你在橋下看到一個新來的人，正笨手笨腳地鋪紙板。他抬頭，你們都愣住了。\n\n是黃老闆。公司倒了，房子被法拍，老婆帶著孩子回娘家。\n\n他看著你的腰：「我現在知道你那時候的感覺了。」',
 ch:[
  {t:'和解，拿十二萬',show:S=>F(S,'suing'),r:{t:'你在和解書上簽了名。走出法院時，黃老闆在後面叫住你，說了一聲「歹勢」，很小聲。',money:120000,mind:4,set:{settled:1},log:'和黃老闆和解，拿了十二萬'}},
  {t:'打到底',show:S=>F(S,'suing'),r:(S,R)=>R()<.45?{t:'判決下來：黃老闆應賠償六十二萬。他繳不出來，法院讓他分期，第一筆先付十五萬，之後每個月一萬二。',money:150000,addInc:400,mind:8,log:'打贏官司，判賠六十二萬'}:{t:'判決下來：證據不足，大部分駁回，只判賠八萬，扣掉律師費剩五萬。\n\n律師說可以上訴。你說不用了。',money:50000,mind:-8,days:2,noIncome:1}},
  {t:'撤告，什麼都不要',show:S=>F(S,'suing'),r:{t:'黃老闆在法院走廊上追到你，抓著你的手，說不出話。',con:8,mind:2,set:{forgave:1}}},
  {t:'把你的位置分他一半',show:S=>!F(S,'suing'),r:{t:'你教他錢要塞內褲，身分證要藏好。他學得很慢。\n\n那天晚上，他在你旁邊說了很久的話，大部分是在道歉。',con:8,rep:4,set:{huangFriend:1},log:'在橋下收留了黃老闆'}},
  {t:'告訴他，那個扣環你跟他講過三次',show:S=>!F(S,'suing'),r:{t:'他低著頭，很久，才說：「我記得。」\n\n那天晚上，他睡到另一座橋去了。',mind:6,con:-2}},
  {t:'什麼都不說，走開',show:S=>!F(S,'suing'),r:{t:'你走了。你沒有回頭看他鋪好紙板沒有。',mind:-3}}
 ]},
i_son:{scene:'station',npc:'son',tod:'dusk',skip:onlyFor('injury'),title:'志豪',
 text:()=>'志豪來找你了。十七歲，比你高。他說他媽媽生病開刀，家裡沒錢，他想休學去工地，「一天兩千，比讀書有用」。\n\n他看著你的腰。「你以前也是這樣養我們的。」\n\n你知道工地給過你什麼，也拿走過你什麼。',
 ch:[
  {t:'讓他跟著你做，你親自帶',show:S=>!!S.job,r:{t:'他學得很快，比你當年快。每天上鷹架前，你親手幫他檢查安全扣環，三次。',addInc:450,mind:4,set:{sonWork:1},log:'兒子志豪休學跟你做事'}},
  {t:'給他五萬，叫他回去讀書',req:{money:50000},r:{t:'他收下錢，說：「我會還你。」你說：「讀完書，就是還了。」',money:-50000,mind:8,set:{sonSchool:1},log:'拿五萬讓兒子回去讀書'}},
  {t:'罵他，叫他滾回去讀書',r:(S,R)=>R()<.5?{t:'他走的時候紅著眼睛。一個月後，你收到他的簡訊：「我回去上課了。你很兇。」',mind:-2,set:{sonSchool:1}}:{t:'他走的時候紅著眼睛。你後來聽說，他去了別的工地。',mind:-8,set:{sonSite:1}}}
 ]},
/* 和家裡斷了 */
f1_guitar:{scene:'underpass',tod:'night',skip:onlyFor('family'),title:'電火布',
 text:()=>'你的背包裡有一把吉他，琴頸上纏著電火布。那是你離家時唯一帶走的東西。\n\n地下街的當舖老闆看了一眼：「三千，不能再多。九十天內可以贖。」\n\n地下道裡，一個拉二胡的阿伯面前擺著琴盒，裡面有一些零錢。',
 ch:[
  {t:'當掉，三千塊',r:{t:'當舖老闆把吉他掛在牆上，和一排別人的東西放在一起。你拿著當票，覺得自己把什麼抵押出去了。',money:3000,mind:-4,set:{guitarPawn:1},log:'把吉他當了三千塊'}},
  {t:'在地下道彈唱',r:{t:'你彈了一整晚。大部分的人沒停。一個喝醉的上班族丟了一張一百塊，說：「唱得比我老闆好。」\n\n拉二胡的阿伯收攤時，把他的位子讓給你：「晚上十點以後，這裡是你的。」',addInc:140,mind:5,rep:3,set:{busk:1},log:'開始在地下道賣唱'}},
  {t:'留著，不碰它',r:{t:'你把吉他抱在懷裡睡。至少還有一樣東西是你的。',mind:2}}
 ]},
f2_sister:{scene:'ximen',npc:'sister',tod:'dusk',skip:onlyFor('family'),title:'小雯',
 text:()=>'一個 IG 帳號私訊了你很久沒登入的舊帳號：「哥，是我。」\n\n小雯約你在西門町的電影院前面。她長高了，穿著大學的系服。她從包包裡拿出一個信封：「五千，我打工存的。」\n\n「爸每天晚上都會去你房間站一下。他不會說的。」她看著你。「你要不要回家？」',
 ch:[
  {t:'收下錢，說你還不能回去',r:{t:'她點點頭，好像早就知道。「那你要回我訊息。」',money:5000,mind:4,set:{sister:1},log:'妹妹小雯找到了你'}},
  {t:'收下錢，請她吃一頓飯，聽她講家裡的事',r:{t:'你們吃了一碗滷肉飯。她講了媽的膝蓋、隔壁陳家女兒結婚、五金行換了新招牌。\n\n她沒講爸。你也沒問。',money:4700,mind:8,set:{sister:2},log:'和妹妹吃了一頓飯'}},
  {t:'不收，叫她不要再來找你',r:{t:'她把信封捏得皺皺的，最後還是收回去了。「你跟爸一模一樣。」',mind:-8,set:{sister:'cut'}}}
 ]},
f2_redeem:{scene:'underpass',tod:'night',skip:onlyFor('family',S=>!F(S,'guitarPawn')),title:'當票',
 text:()=>'當票上的日期是下禮拜。贖回要四千五。\n\n你經過當舖，那把纏著電火布的吉他還掛在牆上，旁邊多了一支金錶和一台相機。',
 ch:[
  {t:'贖回來',req:{money:4500},r:{t:'你把吉他背回肩上，重量剛剛好。那天晚上，你在地下道彈到十二點。',money:-4500,mind:8,addInc:140,set:{guitarPawn:0,busk:1},log:'贖回了吉他'}},
  {t:'放棄',r:{t:'你沒有去。一個禮拜後，你經過當舖，牆上那個位置空了。',mind:-10,set:{guitarLost:1},log:'吉他流當了'}}
 ]},
f3_busk:{scene:'ximen',tod:'night',skip:onlyFor('family',S=>F(S,'guitarPawn')||F(S,'guitarLost')),title:'紅樓廣場',
 text:()=>'台北市街頭藝人證照考試，在西門町的紅樓廣場。三分鐘，三個評審，一百多個人報名。\n\n你排在一個表演火舞的人後面。評審在吃便當。\n\n你要唱什麼？',
 ch:[
  {t:'唱流行歌，大家都會跟著唱的那種',r:(S,R)=>R()<.45+S.mind/250?{t:'唱到副歌，排隊的人跟著哼了起來。評審抬頭看了你一眼。你拿到了證照。',addInc:220,rep:5,mind:5,set:{buskLicense:1},log:'考到街頭藝人證照'}:{t:'評審說謝謝。下一位。',mind:-5}},
  {t:'唱你自己寫的〈五金行〉',r:(S,R)=>R()<.3+S.mind/200?{t:'唱到第二段，吃便當的評審放下了筷子。唱完，廣場上有人鼓掌。\n\n你拿到了證照，還有一張 Live house 老闆的名片。',addInc:300,rep:8,mind:10,set:{buskLicense:1,liveHouse:1},log:'在紅樓廣場唱了〈五金行〉'}:{t:'你唱到一半忘詞了。你站在台上，三秒鐘，像三年。',mind:-12}},
  {t:'不考了，在地下道唱就好',r:{t:'地下道沒有評審，只有回音。',mind:1}}
 ]},
f4_home:{scene:'station',tod:'dawn',skip:onlyFor('family',S=>!S.f.sister||S.f.sister==='cut'),title:'兩張車票',
 text:()=>'小雯傳了一張照片給你：你爸坐在五金行的櫃檯後面，戴著老花眼鏡，在修一把壞掉的吉他。\n\n「爸說修好要拿去二手店賣，」她寫，「但他已經修三個月了。」\n\n最後一行：「哥，我買了回台中的車票，明天早上七點。兩張。」',
 ch:[
  {t:'去車站',req:{mind:40},r:{t:'',end:'family_home'}},
  {t:'回她：還不是時候',r:{t:'她傳了一個「好」。過了一個小時，又傳來一張照片：那把修好的吉他，弦是新的。',mind:4,set:{homeLater:1}}},
  {t:'不讀不回',r:{t:'早上七點，你在地下道醒來，看著手機上的時間，一直到七點十分。',mind:-8,con:-2}}
 ]},
/* 退休老師 */
t_letters:{scene:'office',tod:'day',skip:onlyFor('teacher'),title:'這格要寫什麼',
 text:()=>'社福中心門口，一排人在等著填表。低收入戶申請、急難救助、身分證補發，每一張都要寫。\n\n一個阿伯拿著表格站了很久，最後問你：「你識字嗎？這格要寫什麼？」\n\n你教了三十五年書。你的字，以前是被貼在公布欄上的。',
 ch:[
  {t:'擺張小板凳，幫人代寫，一份五十',r:{t:'第一天你寫了十一份。有人寫申請書，有人寫給女兒的信。你寫得很慢，因為你一直想改他們的錯字。',addInc:110,rep:5,set:{scribe:1},log:'在社福中心門口幫人代寫'}},
  {t:'免費幫，一個一個寫',r:{t:'你寫到中心關門。林姐出來看到你，站了很久，問你以前是做什麼的。你說了。她說：「明天也來好不好。」',rep:10,con:6,hp:-2,set:{scribe:2,lin:1},log:'免費幫人寫表格，認識了林姐'}},
  {t:'假裝自己也不識字',r:{t:'你怕有人認出你。你在自己的表格「職業」那一欄，寫了「無」。',mind:-4}}
 ]},
t_scam:{scene:'office',npc:'kid',tod:'day',skip:onlyFor('teacher'),title:'車手',
 text:()=>'你在派出所補辦文件的時候，走廊上坐著一個戴手銬的少年，十七歲左右，低著頭在哭。\n\n你認得他。兩年前，就是他穿著西裝來你家，說他是「金管會專員」，拿走了你的提款卡。\n\n員警說他是車手，這次被抓到了。「你要提告嗎？可以附帶民事求償，不過他大概賠不出來。」他的媽媽坐在走廊另一頭，穿著清潔隊的背心。',
 ch:[
  {t:'提告，求償',r:(S,R)=>R()<.35?{t:'法院判他賠你十萬。他媽媽每個月來社福中心，交給你一個裝著兩千塊的信封，每次都鞠躬。你每次都不知道該怎麼辦。',money:2000,addInc:65,con:-4,set:{scamSue:1}}:{t:'判決下來了，他沒有財產。你拿到一張債權憑證，和他媽媽在法院門口的一個眼神。',con:-4,mind:-4,set:{scamSue:1}}},
  {t:'不提告，但要他當面跟你道歉',r:{t:'他道歉的時候，一直沒有抬頭。你問他讀到幾年級，他說國二就沒讀了。',con:4,mind:4}},
  {t:'去少年法庭替他說情，條件是他每週來找你上課',r:{t:'法官看了你很久，問你為什麼。你說：「因為我是老師。」\n\n少年第一次來上課，遲到了二十分鐘。他坐在最後面，把手藏在桌子底下。',con:8,mind:6,days:2,noIncome:1,set:{studentKid:1},log:'替騙走你退休金的少年說情'}}
 ]},
t_class:{scene:'office',npc:'lin',tod:'dusk',skip:onlyFor('teacher'),title:'識字班',
 text:()=>'林姐找你：「中心想開一個識字班，給街友和新住民。一週三個晚上，沒有薪水，只有便當。」\n\n「很多人不是不想找工作，是看不懂招工的單子。」她看著你。「你是老師。」\n\n你有很長一段時間，沒有被人叫過老師了。',
 ch:[
  {t:'接',req:{mind:35},r:{t:'第一堂課來了四個人。你在黑板上寫了自己的名字，然後停了一下，在後面加了兩個字：老師。',con:6,mind:10,rep:8,set:{literacy:1,lin:1},log:'在社福中心開了識字班'}},
  {t:'接，但要收一點鐘點費',r:{t:'林姐想了一下，說可以從方案經費裡撥。一堂課四百。你上課的時候，總覺得那四百塊在看你。',addInc:150,con:-2,rep:4,set:{literacy:1}}},
  {t:'不接，你怕遇到以前的學生',r:{t:'林姐點點頭，說她懂。你走出中心，覺得自己在躲的，好像不只是學生。',mind:-4}}
 ]},
t_kids:{scene:'office',npc:'daughter',tod:'day',skip:onlyFor('teacher'),title:'雅婷',
 text:S=>`女兒雅婷站在社福中心門口。${S.f.reporter==='named'?'她看到了那篇報導。':'有人在網路上貼了你在中心門口代寫文件的照片。'}\n\n「你為什麼不說？」她的聲音在抖。「我們會幫你啊！你寧願睡橋下，也不讓我們知道？」\n\n她說要接你去台中住。她家有一間空房，窗戶對著一個小公園。`,
 ch:[
  {t:'跟她回台中',r:{t:'',end:'family_home'}},
  {t:'留在萬華，你的學生在這裡',show:S=>F(S,'literacy'),r:{t:'雅婷在教室裡看了很久。黑板上寫著一個「家」字，下面有十幾個歪歪扭扭的「家」。\n\n她說她每個月會上來看你。',mind:12,set:{kidsKnow:1},log:'女兒知道了一切'}},
  {t:'收下她給的錢，但不跟她走',r:{t:'她把三萬塊塞進你手裡，說你很固執。你說你以前就是這樣教她的。',money:30000,mind:-4,set:{kidsKnow:1}}},
  {t:'說你很好，叫她不要擔心',r:{t:'她走了。你知道她不信。',mind:-6}}
 ]},
/* 前世 */
z_legacy:{scene:S=>legacyScene(S),tod:'dusk',skip:S=>!S.legacy,title:'另一個人',
 text:S=>legacyText(S),
 ch:[
  {t:S=>legacyChoice(S,0),r:S=>legacyR(S,0)},
  {t:S=>legacyChoice(S,1),r:S=>legacyR(S,1)}
 ]}
});
function legacyTier(S){const e=ENDINGS[S.legacy.ending];return e?e.tier:1}
function legacyScene(S){const k=S.legacy.ending;return ['dead','broken'].includes(k)?'office':['tycoon','tycoon_dark','stall','cart'].includes(k)?'park':['singer'].includes(k)?'underpass':'bridge'}
function legacyText(S){const L0=S.legacy,k=L0.ending,on=L0.oname;
 if(k==='dead')return `林姐請你幫忙，去公立納骨塔整理一批沒有人認領的骨灰罈。\n\n其中一個罈子上沒有名字，只有一個編號和兩個字。林姐說，那是在橋下走的一個人，「${on}」，在街上撐了 ${L0.day} 天。\n\n「他跟你一樣，」她說，「也是從台北車站的第一晚開始的。」`;
 if(k==='broken')return `療養院的志工日，你被分配去陪一個老病人聊天。他不太說話，只是一直重複一句：「錢要塞內褲。」\n\n護理師說，他以前在萬華的橋下睡過，「${on}」，後來就走失了。\n\n他突然抓住你的手，看著你，好像認得你。`;
 if(['prison','caught','revoked'].includes(k))return `一個剛出獄的人坐在你旁邊的紙板上。他說他以前也是「${on}」，後來替人扛了一件事，關了好幾年。\n\n「外面變好多，」他說，「車站的椅子都改成有扶手的了，不能躺。」\n\n他問你，有沒有地方可以借他睡一晚。`;
 if(k==='tycoon')return `除夕前，艋舺公園擺了三十桌圍爐。一個穿西裝的頭家站在鍋子後面，親自舀湯。\n\n他舀給你的時候，看了你很久：「你剛上街喔？我以前，也是「${on}」。在那根柱子旁邊睡了好幾個月。」\n\n他遞給你一張名片。`;
 if(k==='tycoon_dark')return `早上五點的騎樓，一台黑色休旅車停下來，下來一個戴墨鏡的人。仲介對他鞠躬，叫他「董仔」。\n\n他點人頭的時候，看到你，停了一下：「你喔，我以前也是「${on}」。」他笑了。「現在換我挑人。」\n\n他開的價錢，比別人多三成。他的工地，聽說不保險。`;
 if(['stall','cart','recycler','foreman'].includes(k))return `收攤的時候，一個老闆提著一袋賣剩的東西走過來：「要不要？反正要倒掉。」\n\n他說他以前也是「${on}」，在萬華撐了兩年，才有現在這攤。「有人這樣給過我，」他說。\n\n他問你，要不要來幫忙。`;
 if(k==='singer')return `地下道裡，有人在唱一首你沒聽過的歌，叫〈五金行〉。唱歌的人說，這首歌是他在橋下寫的，那時候他是「${on}」。\n\n他唱完，把琴盒裡一半的零錢倒給你：「這裡是大家的。」`;
 if(k==='peer'||k==='teacher')return `一個穿社福背心的人，提著兩杯熱豆漿蹲在你面前。\n\n「我以前也是「${on}」，」他說，「睡在那根柱子旁邊。」他遞給你一杯。\n\n「身分證、看病、工作、住的地方，都可以談。」`;
 return `橋下一個老住戶跟你說了一個故事：兩年前，有一個「${on}」的人，跟你一樣從台北車站開始。他撐了 ${L0.day} 天，最後「${(ENDINGS[k]||{}).name||'不知道去了哪裡'}」。\n\n「每個人都覺得自己會不一樣，」老住戶說，「他也是。」`;}
function legacyChoice(S,i){const k=S.legacy.ending;
 if(k==='dead')return ['替他上一炷香','把他的編號抄下來，放進你的身分證夾層'][i];
 if(k==='broken')return ['陪他坐到志工時間結束','跟他說，你會把錢塞好'][i];
 if(['prison','caught','revoked'].includes(k))return ['把你的位置分他一半','給他一百塊，叫他去收容中心'][i];
 if(k==='tycoon')return ['收下名片，去他的公司上班','謝謝他，但你想自己來'][i];
 if(k==='tycoon_dark')return ['去他的工地，錢多就好','不去'][i];
 if(['stall','cart','recycler','foreman'].includes(k))return ['去幫忙','收下東西，說你再想想'][i];
 if(k==='singer')return ['收下零錢，跟他學一首歌','把零錢倒回琴盒'][i];
 if(k==='peer'||k==='teacher')return ['跟他談','只拿豆漿'][i];
 return ['問他，那個人後來怎麼了','說你不一樣'][i];}
function legacyR(S,i){const k=S.legacy.ending;
 if(k==='dead')return i?{t:'你把編號抄在一張紙上，放進身分證夾層。你不知道為什麼要這樣做。',mind:3,set:{legacyMet:1}}:{t:'香燒得很慢。你站到它燒完。',mind:6,con:4,set:{legacyMet:1},log:'在納骨塔為另一個人上香'};
 if(k==='broken')return i?{t:'他點點頭，鬆開了你的手，好像放心了。',mind:4,set:{legacyMet:1}}:{t:'你們什麼也沒說，坐了兩個小時。離開的時候，你覺得自己好像也在那裡坐過。',mind:5,con:3,set:{legacyMet:1}};
 if(['prison','caught','revoked'].includes(k))return i?{t:'他接過一百塊，說謝謝，往車站的方向走了。',money:-Math.min(S.money,100),con:2,set:{legacyMet:1}}:{t:'那晚他講了很多裡面的事。天亮前，他說：「不要替別人扛。」然後就走了。',con:6,rep:4,set:{legacyMet:1},log:'收留了一個剛出獄的人'};
 if(k==='tycoon')return i?{t:'他笑了：「我當年也這樣說。」',mind:6,set:{legacyMet:1}}:{t:'他的公司裡，三成的人睡過橋下。沒有人問你的過去。',job:{name:'頭家公司的雜工',income:800,wear:.08},rep:6,set:{legacyMet:1},log:'去了一個以前也睡過橋下的頭家公司上班'};
 if(k==='tycoon_dark')return i?{t:'你看著休旅車開走。仲介說你傻。',mind:2,set:{legacyMet:1}}:{t:'錢真的比較多。第三天，你旁邊的人從二樓摔下來，工頭叫大家繼續做。',job:{name:'董仔的工地',income:950,wear:.24},con:-6,set:{legacyMet:1}};
 if(['stall','cart','recycler','foreman'].includes(k))return i?{t:'東西還是熱的。你想起了某個人，雖然你不知道是誰。',hp:5,mind:3,set:{legacyMet:1}}:{t:'他什麼都教你，連帳怎麼算都教。「以後換你給別人。」',job:{name:'小老闆的幫手',income:560,wear:.08,meals:1},rep:5,set:{legacyMet:1},log:'被一個以前也睡過橋下的老闆收留'};
 if(k==='singer')return i?{t:'他看著你，點點頭，把零錢收回去了。',con:3,set:{legacyMet:1}}:{t:'他教你那首〈五金行〉。你唱的時候，覺得裡面有你的事。',money:300,mind:8,set:{legacyMet:1}};
 if(k==='peer'||k==='teacher')return i?{t:'他把名片放在你旁邊的地上：「你想通了再打。」',mind:3,set:{linCard:1,legacyMet:1}}:{t:'他幫你填了三張表格。他的字很醜，但每一格都填得很仔細。',mind:6,set:{lin:1,legacyMet:1},log:'被一個以前也睡過橋下的輔導員幫助'};
 return i?{t:'老住戶笑了：「他也這樣說。」',mind:-2,set:{legacyMet:1}}:{t:'「沒有後來，」老住戶說，「這裡的人，都沒有後來。」他頓了一下。「所以你要有。」',mind:4,set:{legacyMet:1}};}

/* ── 新的隨機事件 ── */
Object.assign(EV,{
f_temple:{scene:'temple',tod:'dusk',title:'求籤',
 text:()=>'龍山寺的香爐前面煙霧很重。一個阿嬤擲筊擲了十幾次，終於笑出來。\n\n籤筒就在旁邊，求一支籤不用錢。',
 ch:[
  {t:'擲筊，求一支籤',r:(S,R)=>{const x=R();return x<.3?{t:'聖筊。第四十二籤：「寒夜孤燈照舊橋，春風自有過河時。」\n\n解籤的阿伯說：「上籤。你的苦，快過了。」',mind:8}:x<.75?{t:'聖筊。第十七籤：「水到渠成莫強求，半山雲霧半山晴。」\n\n解籤的阿伯說：「中籤。照你的步調走就好。」',mind:3}:{t:'聖筊。第八十一籤：「船行逆水風又急，且把篙收待月明。」\n\n解籤的阿伯看了你一眼：「下籤。最近不要做大決定。」',mind:-6}}},
  {t:'只拜，不求',r:{t:'你雙手合十，不知道該說什麼，最後只說了自己的名字。',mind:2}},
  {t:'拿供桌上一顆蘋果',r:{t:'沒有人看到。蘋果很甜。',hp:3,con:-2}}
 ]},
f_dog:{scene:'park',tod:'day',title:'小黑',
 text:()=>'一隻瘦得看得到肋骨的黑狗，已經跟著你三天了。你睡覺，牠睡在你腳邊；你走，牠就跟著走。\n\n養一隻狗，一天至少要二十塊。',
 ch:[
  {t:'留下牠，分牠吃的',r:{t:'你叫牠小黑。牠好像不在意名字，只在意你手上的東西。那天晚上，有人經過你的紙板，小黑低吼了一聲。',mind:6,set:{dog:1},log:'收留了一隻黑狗'}},
  {t:'趕牠走',r:{t:'你丟了一顆石頭，沒有打到牠。牠站在遠處看了你很久才走。',mind:-3,set:{dogGone:1}}},
  {t:'帶牠去動物之家',r:{t:'志工說會幫牠找人認養。你走的時候，牠在籠子裡一直叫。',con:1,mind:-2,set:{dogGone:1}}}
 ]},
f_dog2:{scene:'bridge',tod:'night',title:'低吼',
 text:()=>'凌晨，小黑突然站起來，對著黑暗低吼。有人蹲在你的袋子旁邊，手伸到一半停住了。',
 ch:[
  {t:'放小黑過去',r:{t:'那個人尖叫一聲跑了。小黑叼回來一隻拖鞋，很得意。',rep:4,mind:4}},
  {t:'叫住小黑，問那個人要什麼',r:{t:'是一個很年輕的人，說他兩天沒吃了。你分了他半個麵包。',con:4,money:-30}}
 ]},
f_fight:{scene:'alley',tod:'night',timer:1,title:'推車',
 text:()=>'巷子裡，兩個醉漢在搶一個撿回收的阿嬤的推車。阿嬤死命抓著把手，被拖在地上。\n\n附近沒有別人。',
 ch:[
  {t:'衝上去',req:{hp:45},r:(S,R)=>R()<.6?{t:'你推倒了其中一個，另一個罵了幾句就跑了。阿嬤一直跟你鞠躬，塞給你一袋鋁罐。',hp:-8,rep:8,con:6,log:'在巷子裡替阿嬤擋了醉漢'}:{t:'其中一個抓起一根鐵管。你醒來的時候躺在地上，阿嬤坐在你旁邊，用她的毛巾按著你的頭。',hp:-18,con:6,rep:4}},
  {t:'大聲喊人來',r:(S,R)=>R()<.5?{t:'你喊得整條巷子的燈都亮了。醉漢罵了一聲，丟下推車跑了。',con:3,rep:2}:{t:'沒有人出來。醉漢轉頭看你，朝你走了過來。',hp:-6,con:3}},
  {t:'轉身走開',panic:1,r:{t:'你走到巷口，還聽得到阿嬤在叫。',con:-5,mind:-3}}
 ]},
f_photo:{scene:'park',tod:'day',title:'紀錄片',
 text:()=>'兩個大學生拿著攝影機蹲在你面前，說他們在拍畢業製作，主題是「城市的邊緣人」。\n\n「我們可以給你五百塊。」其中一個說，「可以講得……比較有故事一點嗎？就是，越慘越好。」',
 ch:[
  {t:'照他們要的講',r:{t:'你講了一個你自己都不太認得的故事。他們很滿意，說會寄成品給你。你沒有地址。',money:500,mind:-4}},
  {t:'講真話',r:{t:'你講的很平淡：吃什麼、睡哪、怎麼找工作。他們聽得有點失望，還是給了你五百。',money:500,mind:3}},
  {t:'不拍',r:{t:'「我不是你們的作業。」你說。',mind:2}}
 ]},
f_ghost:{scene:'temple',tod:'dusk',title:'普渡',
 text:()=>'農曆七月，廟口的中元普渡。供桌從廟門排到巷口：整隻的雞、成箱的泡麵、疊成塔的罐頭。\n\n拜完以後，這些東西大部分會被分掉。阿伯說，好兄弟吃過的，人吃了會被跟。',
 ch:[
  {t:'等拜完，去領供品',r:{t:'你領到兩包泡麵、一罐鳳梨罐頭、一包餅乾。那個禮拜，你吃得比平常好。',hp:6}},
  {t:'幫廟方搬供桌，換一個便當',req:{hp:35},r:{t:'你搬了三個小時。廟公給你一個雞腿便當和三百塊紅包：「好兄弟有看到。」',hp:3,rep:3,money:300}},
  {t:'不去，你不想被跟',r:{t:'那晚你聽著廟口的鑼鼓聲睡著。',mind:1}}
 ]},
f_jobscam:{scene:'alley',tod:'day',title:'包吃住',
 text:()=>'騎樓下一個穿 polo 衫的人在發傳單：「南部食品工廠，月薪三萬五，包吃包住，免經驗。」\n\n「先繳三千塊制服費和體檢費，明天就有車載你去。」好幾個人在排隊。',
 ch:[
  {t:'繳三千',req:{money:3000},r:(S,R)=>R()<.3?{t:'車真的來了。工廠在屏東，十二小時輪班，宿舍八個人一間。薪水真的有發。',money:-3000,job:{name:'食品工廠作業員',income:650,wear:.1,meals:1},house:'room_sub',mind:2,log:'去了南部的工廠'}:{t:'第二天早上，騎樓下沒有車。傳單上的電話是空號。排隊的人站到中午才散。',money:-3000,mind:-6}},
  {t:'不繳',r:{t:'你把傳單摺成紙飛機，丟進水溝。',mind:1}},
  {t:'打給林姐問問看',show:linOK,r:{t:'林姐說這種她看過一百次了。她報了警，那個人第二天就沒出現了。',con:3}}
 ]},
f_lottery:{scene:'station',tod:'night',repeat:1,title:'刮刮樂',
 text:()=>'彩券行的燈很亮。玻璃上貼著「本店開出頭獎兩百萬」。一張刮刮樂兩百。',
 ch:[
  {t:'買一張',req:{money:200},r:(S,R)=>{const x=R();return x<.04?{t:'你刮到第三格的時候，手開始抖。兩萬。老闆幫你放了一串鞭炮。',money:19800,mind:8,addict:2,log:'刮中兩萬'}:x<.25?{t:'中五百。你又買了兩張，都沒中。',money:100,addict:2}:{t:'銘謝惠顧。',money:-200,mind:-1,addict:2}}},
  {t:'不買',r:{t:'兩百塊，是兩天的飯。',mind:1}}
 ]},
f_bedbug:{scene:'room',tod:'night',title:'床蝨',
 text:()=>'你身上開始出現一排一排的紅點，癢到睡不著。翻開床墊，縫線裡有一顆一顆的小黑點。\n\n床蝨。',
 ch:[
  {t:'換床墊，買殺蟲劑',req:{money:1500},r:{t:'你把舊床墊拖到樓下，噴了整個房間。三天後，紅點慢慢退了。',money:-1500,mind:2}},
  {t:'忍著',r:{t:'你每天晚上都抓到流血。白天上工的時候，手一直在抖。',hp:-5,mind:-7}}
 ]},
f_oldfriend:{scene:'ximen',tod:'dusk',title:'認出你的人',
 text:S=>`捷運車廂裡，一個人一直看你。他越過人群走過來：「你是不是……？」\n\n${o(S,{debt:'他是早餐店的老客人，每天點一份蘿蔔糕加蛋，不要醬油膏。',excon:'他是你國中同學，以前坐你後面，現在在做保險。',injury:'他是你以前工班的同事阿忠，現在自己接案。',family:'他是你高中樂團的鼓手，現在在銀行上班。',teacher:'他是你以前的學生。他叫你：「老師？」'})}`,
 ch:[
  {t:'跟他打招呼',r:(S,R)=>R()<.55?{t:'他請你喝了一杯咖啡，聽你講完，沉默了很久。他給你一千塊和他的電話：「有工作我叫你。」',money:1000,rep:5,mind:3}:{t:'他聽了兩句，眼神就變了。他說他到站了，其實還有三站。',mind:-5}},
  {t:'說他認錯人了',r:{t:'他說了聲抱歉，回到原來的位置。他一直到下車都沒再看你。',mind:-3}},
  {t:'在下一站下車',r:{t:'你在一個不認識的站下車，走了四十分鐘回萬華。',hp:-2,mind:-2}}
 ]},
f_heat:{scene:'river',tod:'day',timer:1,title:'中暑',
 text:()=>'河堤上，一個騎腳踏車的阿伯突然連人帶車倒在地上，臉漲得發紅，叫不醒。\n\n太陽很大，附近沒有樹。',
 ch:[
  {t:'把他拖到橋下陰涼處，打一一九',r:{t:'你拖著他走了三十公尺，自己也差點倒下。救護車來的時候，他醒了，抓著你的手不放。\n\n三天後，他的家人到社福中心找你，留了兩千塊和一盒蛋捲。',hp:-4,con:6,money:2000,rep:4,log:'救了一個中暑的阿伯'}},
  {t:'把你的水倒在他頭上，然後走',r:{t:'他動了一下。你走的時候，有人停下來了。你沒有回頭看結果。',con:1}},
  {t:'快走，不要惹麻煩',panic:1,r:{t:'晚上的新聞說，河堤上一名騎士中暑送醫，「所幸無大礙」。你鬆了一口氣，又覺得很難受。',con:-5,mind:-4}}
 ]},
f_scooter:{scene:'alley',tod:'night',title:'擦撞',
 text:()=>'一台機車從巷口衝出來，把你撞倒在地上。騎士是個大學生，嚇得臉都白了。\n\n「大哥，拜託不要報警，我沒有保險……我給你三千，私了好不好？」',
 ch:[
  {t:'收三千，私了',r:{t:'他把錢包裡的錢全部掏出來，三千二。他走了以後，你發現膝蓋腫得很大。',money:3200,hp:-6}},
  {t:'報警驗傷',r:(S,R)=>R()<.5?{t:'他家裡出面賠了一萬二。你休息了兩天。',money:12000,hp:-4,days:2,noIncome:1}:{t:'筆錄做了一整個下午，對方說是你自己衝出來的。沒有監視器。',hp:-6,mind:-5,days:1,noIncome:1}},
  {t:'算了，叫他走',r:{t:'他一直跟你道歉，騎走的時候還回頭看。',hp:-6,con:4}}
 ]},
f_pickpocket:{scene:'market',tod:'night',timer:1,title:'皮夾',
 text:()=>'夜市人很多。一個小孩從你身邊擦過去，你感覺到口袋一沉。\n\n你伸手一摸，是一個不是你的皮夾。前面一個觀光客在大叫，到處找。兩個警察正在往這邊走。',
 ch:[
  {t:'走過去，把皮夾還給觀光客',r:{t:'觀光客愣了一下，然後一直跟你說謝謝。警察看了你很久，什麼都沒說。',con:6,rep:3}},
  {t:'交給警察，說是小孩塞的',r:(S,R)=>R()<.5?{t:'警察相信了你。他們在下一個路口抓到那個小孩，他才十二歲。',con:4}:{t:'警察不相信。你在派出所坐了一整晚，直到調出監視器。',mind:-6,heat:1,days:1,noIncome:1}},
  {t:'鑽進人群，把錢留下來',r:{t:'皮夾裡有兩千多塊和一張你看不懂的卡片。你把皮夾丟進垃圾桶的時候，手在抖。',money:2300,con:-8}},
  {t:'愣在原地',panic:1,r:{t:'警察走到你面前，從你的口袋裡拿出那個皮夾。',heat:1,mind:-8,days:1,noIncome:1,log:'被當成扒手帶回派出所'}}
 ]},
f_census:{scene:'park',tod:'night',title:'普查',
 text:()=>'一群穿背心的志工拿著平板，在做市府的街友普查。「登記了，就能領物資卡，也能排社宅。」\n\n「不過，」其中一個小聲說，「名單會給警察局一份。」',
 ch:[
  {t:'登記',r:{t:'你在平板上簽了名。第二週，你收到一張物資卡，可以領米、罐頭和衛生紙。',hp:4,set:{linCard:1,census:1}}},
  {t:'不登記',r:{t:'你說你只是坐在這裡休息。志工點點頭，走向下一個人。',mind:1}}
 ]}
});
FILL.push(
 {id:'f_temple',ch:[1,2,3,4,5,6]},
 {id:'f_dog',ch:[1,2,3],cond:S=>!F(S,'dog')&&!F(S,'dogGone')},
 {id:'f_dog2',ch:[2,3,4],cond:S=>F(S,'dog')&&!S.biz},
 {id:'f_fight',ch:[2,3,4,5]},
 {id:'f_photo',ch:[1,2,3,4],cond:S=>!isRoom(S)},
 {id:'f_ghost',ch:[4],w:2},
 {id:'f_jobscam',ch:[2,3,4],cond:S=>!S.biz&&(!S.job||S.job.income<500)},
 {id:'f_lottery',ch:[2,3,4,5,6],cond:S=>S.money>=200},
 {id:'f_bedbug',ch:[3,4,5,6],cond:S=>isRoom(S)||S.house==='bed'},
 {id:'f_oldfriend',ch:[2,3,4,5]},
 {id:'f_heat',ch:[4,6]},
 {id:'f_scooter',ch:[3,4,5,6]},
 {id:'f_pickpocket',ch:[2,3,4,5]},
 {id:'f_census',ch:[1,2,3],cond:S=>!isRoom(S)}
);
{const f=FILL.find(x=>x.id==='f_cops');f.w=S=>W_(S,'election')?4:1;}
{const f=FILL.find(x=>x.id==='f_typhoon');f.ch=[3,4,5,6];f.w=S=>W_(S,'typhoon')?4:(season(S.day)==='夏'?1:0);}
{const f=FILL.find(x=>x.id==='f_church');f.w=S=>W_(S,'kind')?3:1;}
{const f=FILL.find(x=>x.id==='f_bento');f.w=S=>W_(S,'kind')?3:1;}
{const f=FILL.find(x=>x.id==='f_debt');f.w=S=>F(S,'debtCleared')?0:(S.money>5000?5:2)*(F(S,'debtSold')?2:1);f.cond=S=>S.origin==='debt'&&!F(S,'debtCleared');}

function ins(ch,after,...ids){const p=PLAN[ch];const i=after?p.indexOf(after)+1:0;if(after&&i===0)throw new Error('plan '+after);p.splice(i,0,...ids)}
ins(1,'c1_start','f1_guitar');ins(1,'c1_bag','e_parole');ins(1,'c1_sign','t_letters');
ins(2,'c2_lin','d_wife','i_sue');ins(2,'c2_chang','f2_sister');ins(2,'c2_newyear','f2_redeem');
ins(3,'c3_room','z_legacy');ins(3,'c3_scale','d_daughter','e_parole2','f3_busk','t_scam');
ins(4,'c4_reporter','e_brother','i_settle','f4_home','t_class');
ins(5,'c5_old','d_final','e_brother2','i_son','t_kids');

Object.assign(ENDINGS,{
 exonerated:{name:'清白',req:'剛出獄 · 揭發哥哥，再審成功',tier:4},
 singer:{name:'五金行',req:'和家裡斷了 · 街頭藝人證照 · 人脈 40 · 精神 45',tier:4},
 teacher:{name:'黑板',req:'退休老師 · 開了識字班 · 良知 60',tier:4},
 debtfree:{name:'最後一筆',req:'生意倒了 · 了結地下錢莊的債 · 自己的房間',tier:3},
 father:{name:'畢業典禮',req:'工地摔下來 · 兒子回去讀書 · 自己的房間',tier:3},
 family_home:{name:'回家',req:'有人在等你回去，而你回去了',tier:3},
 revoked:{name:'撤銷假釋',req:'剛出獄 · 對觀護人的謊被拆穿',tier:0}
});
const EXT_END={
 revoked:S=>'撤銷假釋的通知寄到了你寫的那個地址。姊姊打電話來的時候在哭。\n\n你回去服完剩下的刑期，一年八個月。這次出來，你知道住址那一欄該怎麼填了：寫真的。\n\n出監那天，張觀護人在門口等你。他沒說什麼，只遞給你一張更生保護會的地址。',
 exonerated:S=>`再審判決那天，法官念了很久，你只聽清楚一句：「原判決撤銷。」\n\n六年，換來一張紙。你拿著那張紙去了新竹的公墓，蹲在媽媽的墓前，把它念了一遍。\n\n${F(S,'brotherGrave')?'阿德後來自己去了地檢署，判了四年。他入監那天，是你去送他的。你跟他說：「你先扛，我會照顧你。」':'阿德請了很好的律師，最後判了緩刑。你沒有再見過他。'}`,
 debtfree:S=>`你把最後一張借據燒掉，是在雅房的陽台上。火很小，一下就沒了。\n\n${S.f.daughter==='signed'?'小晴的學費減免證明上，你還是「未扶養」。但她上大學那天，你去了。你站在校門口對面，她看到你，揮了揮手。':S.f.daughter==='paid'?'小晴升高三了。她說她想讀會計，「這樣以後就不會被騙」。':'你換回了原本的手機號碼。第一通打進來的電話，是美玲。'}\n\n你沒有再開早餐店。但每天早上四點，你還是會醒來。`,
 father:S=>'志豪的高職畢業典禮在一個很熱的早上。你穿著二手店買的襯衫，腰還是會痛，但你站了整整兩個小時。\n\n他上台領獎的時候，往台下找了很久。找到你的時候，他笑了，跟他十三歲幫你翻身時一模一樣。\n\n你有一間三坪的房間。牆上貼著他的畢業照，旁邊是你以前的模板工識別證。',
 singer:S=>`你的第一張 EP 只印了三百張，名字叫《五金行》。\n\n${F(S,'liveHouse')?'在西門町的 Live house，你唱完最後一首歌，燈亮起來，你看到最後一排坐著一個戴老花眼鏡的人。他沒有鼓掌，只是坐在那裡，一直到所有人都走了。':'你還是在地下道唱。只是現在，路過的人會停下來。'}\n\n拉二胡的阿伯說，你的歌裡有橋下的聲音。你說，那是因為你在那裡寫的。`,
 family_home:S=>S.origin==='teacher'?'你跟雅婷回到台中。她的空房對著一個小公園，早上有人在打太極拳。\n\n你在公園的涼亭裡，教幾個外籍看護寫中文字，不收錢。\n\n有時候你會想起萬華的橋下。你想，那裡應該還有人，不知道表格上那一格要寫什麼。':S.origin==='family'?'早上七點的區間車。小雯在車上睡著了，頭靠在你肩膀上。\n\n五金行的鐵門開著。你爸站在櫃檯後面，看到你，把老花眼鏡拿下來，又戴回去。他把那把修好的吉他推到你面前：「弦是新的。」\n\n那天晚上你彈了〈五金行〉。你爸在樓下顧店，收音機一直沒開。':'你回去了。不是每個人都有地方可以回去，你知道。\n\n那天晚上，你睡在一張真的床上，聽著冰箱的聲音，一直到天亮都沒睡著。',
 teacher:S=>`識字班的黑板是二手的，左下角有一道刮痕。每週一、三、五晚上七點，教室裡坐著十幾個人：撿回收的阿伯、剛出獄的年輕人、從越南嫁來的媽媽${F(S,'studentKid')?'，還有一個騙過你的少年':''}。\n\n第一天，你在黑板上寫了一個字：「家」。\n\n你說：「上面是屋頂，下面是一隻豬。以前的人覺得，有屋頂、有東西吃，就是家。」後排有人笑了。你也笑了。`
};
function endingText2(S,key){return EXT_END[key]?EXT_END[key](S):endingText(S,key)}
function epilogue2(S){const e=epilogue(S);const f=k=>F(S,k);
 if(S.origin==='debt'){if(S.f.daughter==='signed')e.push('小晴考上了大學。她畢業那天，寄了一張穿學士服的照片給你，背面寫：「爸，我有吃飯。」');else if(S.f.daughter==='paid')e.push('小晴每學期開學，都會傳一張繳費收據的照片給你。');else if(S.f.daughter==='promise')e.push('你一直沒存到那筆學費。小晴後來自己去辦了助學貸款。');
  if(S.f.wife==='money')e.push('美玲託人帶話給你：那筆錢，她拿去繳了小晴的補習費。');else if(S.f.wife==='talk')e.push('美玲還在夜市洗碗。有時候她會在收攤後，留一碗麵給你。');
  if(f('mule'))e.push('兩年後，你收到一張法院傳票。你的名字，出現在一份詐騙案的被告名單裡。');}
 if(S.origin==='excon'){if(f('brotherPaid'))e.push('阿德的公司上市了。新聞上，他說他最感謝的是家人。');else if(f('brotherJob'))e.push('你在阿德的公司做了很久。他從來沒有在員工面前叫過你弟弟。');else if(f('brotherGrave')&&!f('exonerated'))e.push('每年清明，阿德會開車來萬華接你，一起去新竹。車上你們不太說話。');
  if(S.f.parole==='ok')e.push('假釋期滿那天，張觀護人請你喝了一杯咖啡。「你是我少數不用擔心的。」');}
 if(S.origin==='injury'){if(f('sonSchool'))e.push('志豪讀完高職，考上科大的土木系。他說他以後要當工安檢查員。');else if(f('sonWork'))e.push('志豪在工地做得很好。每天早上，他都會自己檢查三次安全扣環。');else if(f('sonSite'))e.push('志豪在別的工地做模板。你每次經過鷹架，都會抬頭看很久。');
  if(f('huangFriend'))e.push('黃老闆在橋下睡了半年，然後去了南部，說要重新開始。他走之前，把他的電子錶送給你。');else if(f('settled')||f('forgave'))e.push('黃老闆過年時寄了一盒鳳梨酥給你，沒有寫卡片。');}
 if(S.origin==='family'){if(f('guitarLost'))e.push('那把纏著電火布的吉他，你在二手樂器行的櫥窗裡看過一次。你沒有進去。');if(S.f.sister&&S.f.sister!=='cut')e.push('小雯每個月都會傳一張爸的照片給你。他在照片裡，從來不看鏡頭。');}
 if(S.origin==='teacher'){if(f('literacy'))e.push('識字班的第一個畢業生，是那個問你「這格要寫什麼」的阿伯。他用自己的字，寫了一張低收入戶申請書。');if(f('studentKid'))e.push('那個車手少年，每個禮拜三都來上課。他的字很醜，但每一個字都寫完。');}
 if(f('dog'))e.push('小黑老了，走路很慢，但每天晚上還是睡在你腳邊。');
 if(f('legacyMet'))e.push('你有時候會想起那個跟你很像的人。你不知道，他算不算是你。');
 return e}

function people(S){const f=k=>F(S,k);const P=[
 ['老鄭','跑船二十年，橋下的老住戶',()=>{const z=S.f.zhengFate;if(!f('zheng')&&!f('zhengHostile')&&!z)return null;if(z==='dead')return f('zhengDaughter')?'寒流裡走了。鐵盒寄回了他女兒手上。':'寒流裡走了。';if(S.seen.includes('c6_zheng'))return '肺癌末期。';if(f('zhengHostile'))return '你們搶過位子，他不太理你。';return z?'撐過了寒流。':'教你錢要塞內褲。'}],
 ['林姐','萬華社福中心的社工',()=>f('lin')?'幫過你很多次。':f('linCard')?'名片還在你口袋裡。':null],
 ['王媽','西昌街便當店',()=>f('wangHurt')?'你替強哥向她收過帳。':f('wangSaved')?'你偷偷替她墊過帳。':S.f.wang>=3?'你在店裡替她擋過人。':f('wangWork')?'你在她店裡工作。':S.f.wang?'她給過你賣剩的便當。':null],
 ['阿惠','車站行李箱上的女孩',()=>({saved:f('hueiLoan')?'在讀夜校。你借過她報名費。':'你從皮夾克男人手上帶走了她。',hint:'寄過明信片給你。',lost:f('hueiFreed')?'從茶室出來了。':'你最後一次看到她，是在茶室門口。'})[S.f.huei]||null],
 ['強哥','華西街茶室的大哥',()=>f('strongGone')?'被判了七年。':f('strongEnemy')?'你們結過梁子。':f('grayJob')?'你替他做事。':f('gray')?'你替他送過貨。':(f('strong')||f('strongNoticed'))?'他記得你。':null],
 ['阿凱','強哥的人，皮夾克',()=>f('kaiGone')?'不在你身邊了。':f('owesKai')?'你欠他一次。':f('kaiHired')?'幫你管人。':(f('strong')||f('strongNoticed'))?'脖子上有刺青。':null],
 ['黑仔','公園的小偷',()=>f('blackLoyal')?'你替他繳過健保，現在天天來幫忙。':S.seen.includes('c5_old')?'肝硬化。':f('blackEnemy')?'你們打過一架。':S.seen.includes('c1_bag')?'半夜翻過你的袋子。':null],
 ['阿財','萬大路底的回收場',()=>f('caiExposed')?'你揭穿了他的秤。':f('caiPartner')?'你收過他的封口費。':f('caiFixed')?'被罰了錢，不知道是你。':S.f.cai===2?'你在他場裡顧夜。':S.f.cai?'他的秤怪怪的。':null],
 ['阿昌','酗酒的總鋪師',()=>f('changOK')?'戒酒了，湯還是一樣好喝。':f('changGone')?'消失了。':f('changHired')?'在你這裡掌廚。':f('changPartner')?'你的合夥人。':S.f.chang===3?'你陪他進過急診。':S.f.chang?'欠你三百。':null],
 ['莉莉','夜市河粉攤',()=>f('lilyLoyal')?'你替她扛過一張欠條。':f('lilyGone')?'搬走了，沒有留電話。':f('lilyHired')?'在你這裡做事。':S.f.lily?'被老闆欠了三個月薪水。':null],
 ['小羅','育幼院出來的年輕人',()=>f('luoHired')?'在你這裡打雜。':f('luo')?'你教他錢要塞內褲。':null],
 ['陳老闆','康定路工程行',()=>f('chen')?'老鄭的老同事。':null],
 ['小黑','一隻黑狗',()=>f('dog')?'每天晚上睡在你腳邊。':f('dogGone')?'你沒有留下牠。':null],
 ['美玲','前妻，在夜市洗碗',()=>S.origin!=='debt'?null:({talk:'叫你把債處理掉，不要躲。',money:'你把身上的錢都給了她。',avoid:'你裝作不認識她。'})[S.f.wife]||null],
 ['小晴','女兒，十六歲',()=>S.origin!=='debt'?null:({signed:'你在她的切結書上簽了名。',paid:'你替她付了一學期學費。',promise:'你說學費你會想辦法。'})[S.f.daughter]||null],
 ['豹哥','地下錢莊',()=>S.origin!=='debt'||!S.seen.includes('d_final')?null:f('debtCleared')?'債了結了。':'債被轉賣給了三重的人。'],
 ['張觀護人','地檢署觀護人',()=>S.origin!=='excon'||!S.f.parole?null:({honest:'你對他說了實話。',lie:'你騙他說住在姊姊家。',pending:'你的資料上有一個紅圈。',ok:'他說你不錯。'})[S.f.parole]],
 ['阿德','哥哥，德昇營造董事長',()=>S.origin!=='excon'||!S.seen.includes('e_brother')?null:f('exonerated')?'再審之後，真相大白。':f('brotherPaid')?'你收了他的三十萬。':f('brotherGrave')?'你們一起去了媽媽的墳。':f('brotherJob')?'你在他的公司上班。':f('brotherNo')?'你沒有去找他。':'你留了紙條給他。'],
 ['黃老闆','以前的雇主',()=>S.origin!=='injury'||!S.seen.includes('i_sue')?null:f('huangFriend')?'公司倒了，睡在你旁邊。':f('settled')?'和解了。':f('forgave')?'你撤告了。':f('suing')?'你在告他。':f('talkHuang')?'他塞給你三千塊。':'你沒有告他。'],
 ['志豪','兒子',()=>S.origin!=='injury'||!S.seen.includes('i_son')?(f('kid')?'除夕和你講了三分鐘電話。':null):f('sonSchool')?'回去讀書了。':f('sonWork')?'跟著你做事。':'去了別的工地。'],
 ['小雯','妹妹，大學生',()=>S.origin!=='family'||!S.f.sister?null:S.f.sister==='cut'?'你叫她不要再來。':'偷偷存錢給你。'],
 ['爸爸','台中五金行',()=>S.origin!=='family'?null:S.seen.includes('f4_home')?'在修一把吉他。':'把你的吉他從二樓丟下去。'],
 ['阿翔','騙走你退休金的車手',()=>S.origin!=='teacher'||!S.seen.includes('t_scam')?null:f('studentKid')?'每週三來上課。':f('scamSue')?'你告了他。':'他跟你道過歉。'],
 ['雅婷','女兒，台中的護理師',()=>S.origin!=='teacher'?null:f('kidsKnow')?'知道了一切。':f('kidsCall')?'除夕問你那邊為什麼那麼安靜。':null]
 ];
 const out=P.map(([n,r,fn])=>{const s=fn();return s?{name:n,role:r,status:s}:null}).filter(Boolean);
 if(S.legacy&&f('legacyMet'))out.push({name:'另一個人',role:`上一輩子的「${S.legacy.oname}」`,status:`${(ENDINGS[S.legacy.ending]||{}).name||''}，撐了 ${S.legacy.day} 天。`,past:1});
 return out}
