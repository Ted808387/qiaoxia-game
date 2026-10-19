
/* ═════════ 第八版：配角自己的命運、主線事件池、開局卡、新路線 ═════════ */
const trustN=(S,id)=>NPCS[id]?trustOf(S,id):0;
const news=(S,t)=>{S.news=S.news||[];S.news.push({day:S.day,t})};

/* ── 主線事件池 ── */
const POOLS={c2:['m_cold','p2_flu','p2_sweep'],c3:['p3_fire','p3_scam','p3_flood'],c4:['c4_start','p4_typhoon','p4_election'],c6:['p6_quake','p6_tourist','p6_bust']};
{const p=PLAN[2];p.splice(p.indexOf('m_cold'),1);}
ins(2,'c2_cold','@c2');ins(3,'c3_work','@c3');{const p=PLAN[4];p[p.indexOf('c4_start')]='@c4';}ins(6,'c6_start','@c6');
Object.assign(EV,{
p2_flu:{scene:'station',tod:'night',title:'流感',
 text:S=>`寒流第二週，收容中心爆發流感。四十個人一間，一個傳一個。\n\n社會局把中心封了一個禮拜，新的人不收，裡面的人不能出來。${S.house==='shelter'?'你在裡面。你上鋪的人已經燒了三天。':'橋下的人說，裡面一天抬出去兩個。'}\n\n藥局的口罩一盒一百五，退燒藥兩百。`,
 ch:[
  {t:'買口罩和退燒藥，分給橋下的人',req:{money:600},r:{t:'你提著兩袋藥，從華中橋走到中正橋。有一個阿伯拿到退燒藥，當場就吞了，沒有配水。',money:-600,con:6,rep:8,log:'流感時替橋下的人買藥'}},
  {t:'離大家遠一點，自己顧好',r:(S,R)=>R()<.6?{t:'你躲在河堤最邊邊睡了一個禮拜。你沒有被傳染，也沒有人來找你。',mind:-4}:{t:'你還是燒起來了。三天，你在紙板上什麼都不記得。',hp:-14,mind:-4}},
  {t:'去收容中心當幫手，換一個床位',show:S=>S.house!=='shelter',req:{hp:50},r:(S,R)=>R()<.5?{t:'你幫忙送飯、量體溫、清嘔吐物。中心解封那天，社工替你登記了一個長期床位。',house:'shelter',con:6,rep:6,hp:-4}:{t:'你幫了五天，第六天自己倒下了。社工把你放在角落那張床，說那是你的了。',house:'shelter',con:6,hp:-15}}
 ]},
p2_sweep:{scene:'bridge',tod:'dawn',weather:'rain',title:'清掃',
 text:S=>`凌晨五點，清潔隊和警察一起來了。市府說，寒流期間要「勸導街友進收容所」，橋下的東西全部清走。\n\n${isRoom(S)?'橋下認識的人打電話給你，說他們的東西都被丟上垃圾車了。':'你的紙板、毯子、塑膠袋，正在被一件一件丟上垃圾車。'}\n\n一個社工拿著名冊，問你要不要上車去收容中心。`,
 ch:[
  {t:'搶回你的東西',show:S=>!isRoom(S),req:{hp:40},r:(S,R)=>R()<.5?{t:'你從垃圾車上搶回了你的睡袋和身分證。清潔隊員看了你一眼，沒有攔你。',mind:-2,hp:-3}:{t:'警察把你架開。你看著你的睡袋被壓縮機捲進去。',mind:-8,hp:-4,set:{gear:0}}},
  {t:'上車，去收容中心',show:S=>!isRoom(S),req:{addictMax:60},r:{t:'收容中心很暖，但東西只能帶一個袋子。你挑了身分證、一件外套，和一張照片。',house:'shelter',mind:-4,hp:4}},
  {t:'站在旁邊拍下整個過程',r:{t:'你用借來的手機拍了二十分鐘。那段影片後來被一個倡議團體轉貼，看了三萬次。有人留言說：「這些人本來就不該睡在那裡。」',rep:6,mind:-2,set:{filmed:1},log:'拍下了寒冬清掃橋下'}},
  {t:'去幫其他人搬東西',r:{t:'你幫一個坐輪椅的阿伯把他的東西搬上推車。他說：「清走了，明天還是要睡這裡啊。」',con:6,rep:5,hp:-2}}
 ]},
p3_fire:{scene:'alley',tod:'night',title:'火',
 text:S=>`凌晨兩點，西園路的一間老旅社起火了。那是一棟隔成一格一格床位的老房子，${S.house==='bed'?'你就住在二樓。':'住著三十幾個跟你一樣的人。'}\n\n濃煙從窗戶冒出來，消防車還在巷口卡著，進不來。\n\n二樓的窗戶有人在拍玻璃。`,
 ch:[
  {t:'衝進去',req:{hp:50},r:(S,R)=>R()<.55?{t:'你用濕毛巾捂著嘴衝上二樓，把一個老人背下來。出來的時候，你的手臂燙出了一整排水泡。\n\n第二天的新聞說：「熱心民眾協助救人。」沒有你的名字。',hp:-14,con:12,rep:12,log:'從火場背出一個老人'}:{t:'你只上到樓梯一半，就被煙嗆得倒下。是消防員把你拖出來的。',hp:-24,con:8}},
  {t:'在外面幫忙接人、找消防栓',r:{t:'你和幾個路人把人從一樓的窗戶接出來。天亮的時候，你數了一下，你接了七個。',hp:-4,con:6,rep:6}},
  {t:'站在對街看',r:{t:'火燒了三個小時。後來你才知道，裡面有兩個人沒出來。其中一個，你在公園跟他下過棋。',mind:-8,con:-3}},
  {t:'趁亂去撿掉在地上的東西',r:{t:'你撿到一個皮夾和一支手機。你沒有回頭。',money:2400,con:-12}}
 ]},
p3_scam:{scene:'park',tod:'day',title:'人頭',
 text:()=>'公園裡來了一個穿 polo 衫的年輕人，很客氣，一直發飲料。\n\n「大哥，有沒有存摺？借我們用三個月，一個月給你五千。不用做什麼，什麼都不會發生。」\n\n已經有好幾個人跟他走了。有人說，上次借的人，後來收到法院的傳票。',
 ch:[
  {t:'把存摺借他',show:S=>F(S,'bankAcct'),r:(S,R)=>R()<.5?{t:'三個月，一萬五。存摺還回來的時候，裡面多了很多你看不懂的交易紀錄。',money:15000,con:-8,heat:2,set:{mule:1}}:{t:'第二個月，你的帳戶被凍結了。警察找上你，說你涉嫌幫助詐欺。你連那個年輕人的名字都不知道。',money:-Math.min(5000,9e9),heat:3,mind:-12,set:{mule:1,frozen:1},log:'存摺被詐騙集團當人頭帳戶'}},
  {t:'告訴其他人不要借',r:{t:'有人聽你的，有人說你多管閒事。那個年輕人走之前，看了你很久。',con:6,rep:4}},
  {t:'假裝答應，偷偷報警',req:{mind:40},r:(S,R)=>R()<.6?{t:'警察在他下次來公園時抓到了他。他才十八歲。',con:5,rep:3}:{t:'警察來的時候，他已經不在了。第二天，你的紙板被人用刀劃爛了。',con:4,mind:-5}},
  {t:'不理他',r:{t:'你看著他把飲料發完，帶著四個人離開公園。',mind:-1}}
 ]},
p3_flood:{scene:'river',tod:'dusk',weather:'storm',title:'梅雨',
 text:S=>`梅雨鋒面連下了九天。第九天晚上，新店溪的水位漲到河堤的一半。\n\n${isRoom(S)?'你的雅房在一樓，水從門縫滲進來。':'橋下的人在搶時間把東西往上搬。'}廣播一直在說，低窪地區居民盡速撤離。\n\n${S.biz?'你的店在低窪區。':''}`,
 ch:[
  {t:'先搬自己的東西',r:S=>({t:'你保住了大部分的東西。旁邊有人的帆布被沖走了，在水裡漂了很遠。',money:S.biz?-8000:0,mind:-2})},
  {t:'幫橋下的老人撤到高處',req:{hp:40},r:{t:'你背著一個阿嬤爬上河堤，她一路都在念佛。回頭的時候，你的東西已經泡在水裡了。',con:8,rep:8,hp:-6,money:-500,set:{gear:0}}},
  {t:'去龍山寺躲',r:{t:'廟方開了偏殿讓人躲雨。你在神桌下面睡了兩個晚上，第三天水退了。',mind:3}}
 ]},
p4_typhoon:{scene:'bridge',tod:'night',weather:'storm',title:'超級颱風',
 text:S=>`氣象局發布了十年來最強的颱風警報。陣風十七級，全台停班停課。\n\n${isRoom(S)?'你的窗戶在震，玻璃上貼滿了膠帶。':'橋下的人被警察一個一個勸離。有幾個老人不肯走，說他們的東西還在。'}${S.biz?'\n\n你的店門口堆著沙包，但你知道擋不住。':''}`,
 ch:[
  {t:'陪不肯走的老人留下來',show:S=>!isRoom(S),req:{hp:45},r:(S,R)=>R()<.6?{t:'你們擠在橋墩最裡面，聽了一整夜的風。天亮的時候，大家都還在。有一個老人握著你的手，一直沒放開。',hp:-8,con:10,rep:8,log:'超級颱風夜陪老人留在橋下'}:{t:'凌晨三點，河水漫上來了。你拉著兩個老人往上爬，其中一個的拖鞋被沖走了。你們都活下來了，但你的東西全沒了。',hp:-16,con:10,rep:8,money:-Math.min(1000,9e9),set:{gear:0}}},
  {t:'去防颱收容所',show:S=>!isRoom(S),r:{t:'區公所開放了一間國小當收容所。體育館的地板很硬，但有便當。',hp:2,mind:-2}},
  {t:'守在店裡',show:S=>!!S.biz,r:(S,R)=>R()<.5?{t:'你守了一整夜，招牌被吹掉了，但鐵門擋住了。',hp:-6,money:-5000}:{t:'水淹到膝蓋。你搶出了帳本和錢，其他的都泡壞了。',hp:-8,money:-20000*L(S),mod:-.06}},
  {t:'待在家裡',show:S=>isRoom(S),r:{t:'停電了一整晚。你點著蠟燭，聽著窗外的風聲，想起橋下的人。',mind:-3}}
 ]},
p4_election:{scene:'park',tod:'day',npc:'brother',title:'作秀',
 text:()=>'一個市長候選人帶著二十台攝影機來到艋舺公園，說要「傾聽街友的聲音」。\n\n他蹲在你旁邊，握著你的手，助理在旁邊說：「看鏡頭。」\n\n他問你：「你最需要什麼？」所有的鏡頭都對著你。',
 ch:[
  {t:'說：「需要房子，不是便當。」',r:{t:'他愣了一下，笑著說：「我們會研議。」\n\n那天晚上的新聞剪掉了你的話，只剩下他握你的手。但一個記者在網路上寫了一篇文章，標題就是你那句話。',rep:8,mind:3,set:{spokeUp:1},log:'對市長候選人說：需要房子'}},
  {t:'配合拍照，收下他的紅包',r:{t:'紅包裡有兩千。你在新聞上看到自己，笑得很難看。',money:2000,mind:-4}},
  {t:'站起來走開',r:{t:'攝影機跟了你幾步，然後轉向下一個人。',mind:2}}
 ]},
p6_quake:{scene:'room',tod:'night',title:'地震',
 text:S=>`凌晨三點，一陣很長的搖晃。規模六點八，台北震度五強。\n\n${isRoom(S)?'你的天花板裂了一道縫，房東說這棟要做結構鑑定，大家先搬出去。':S.biz?'你的店面牆壁裂了，消防局貼了黃單。':'橋墩在晃，頭頂的高架橋發出很可怕的聲音。'}\n\n天亮後，新聞說萬華有三棟老公寓傾斜。`,
 ch:[
  {t:'去災區幫忙搬東西',req:{hp:40},r:{t:'你在傾斜的公寓前面幫忙搬了兩天，搬出一個老奶奶的全部家當：一台縫紉機、一盒照片、一隻貓。',hp:-6,con:8,rep:8}},
  {t:'先顧自己的損失',r:S=>({t:isRoom(S)?'你搬去朋友那裡住了兩個禮拜，多花了一筆錢。':S.biz?'你請人來補牆，停業了十天。':'你換到另一座橋下睡。',money:isRoom(S)?-4000:S.biz?-15000*L(S):0,mind:-4,days:S.biz?10:undefined})},
  {t:'申請災害救助',show:S=>isRoom(S)||!!S.biz,req:{id:1},r:{t:'表格填了三份，等了一個月，補助下來了。',money:6000,days:5,noIncome:1}}
 ]},
p6_tourist:{scene:'market',tod:'night',title:'觀光客',
 text:S=>`萬華被一部國外影集拍成了「台北最有味道的老城區」。觀光客一團一團湧進來，華西街夜市擠到走不動。\n\n${S.biz?'你的生意突然好了一倍。':'攤販到處在找臨時工。'}但房東們也看到了。巷口貼出新的公告：老公寓要改成民宿。\n\n${isRoom(S)?'你的房東說，下個月起房租漲三成。':''}`,
 ch:[
  {t:'趁這波拚命賺',r:S=>({t:'你連續一個月每天只睡五個小時。錢進來得很快，身體垮得也很快。',money:S.biz?15000*L(S):9000,hp:-10,mind:-4})},
  {t:'跟其他房客一起抗議漲租',show:S=>isRoom(S),r:(S,R)=>R()<.5?{t:'你們寫了陳情書，找了議員。房東最後只漲了一成。',rep:6,con:4}:{t:'房東把你們一個一個約談。下個月，你搬走了，因為你住不起了。',house:'bed',mind:-8}},
  {t:'帶觀光客走「萬華街友路線」導覽',req:{rep:30},r:{t:'一個社會企業找你當導覽員，帶觀光客走你睡過的橋下、領過便當的公園。一場一千五。\n\n有一次，一個外國人問你：「你現在還住在橋下嗎？」你說不。他看起來有點失望。',money:6000,rep:6,set:{guide:1},log:'當了萬華街友路線的導覽員'}}
 ]},
p6_bust:{scene:'alley',tod:'night',title:'大掃黑',
 text:S=>`新上任的警察局長宣布「萬華掃黑專案」。一個月內，華西街被臨檢了十幾次，抓了四十幾個人。\n\n${isTurf(S)?'你的茶室是名單上的第一個。':F(S,'gray')?'你替強哥做過的事，還有人記得。':'橋下的人說，最近不要在夜市晃。'}`,
 ch:[
  {t:'把帳本燒掉，所有店先關一個月',show:S=>isTurf(S),r:{t:'你燒了一整晚。阿凱說你太膽小。一個月後，三重那邊抓了十幾個人，你這邊一個都沒事。',mod:-.2,heat:-4,mind:-4}},
  {t:'照常營業，紅包加倍',show:S=>isTurf(S),req:{money:50000},r:(S,R)=>R()<.6?{t:'信封收走了，臨檢的人每次都剛好在你換班的時候來。',money:-50000,heat:1}:{t:'這次的局長不收紅包。你最大的那間茶室被抄了，帳本在抽屜裡。',money:-50000,heat:4,mod:-.3}},
  {t:'主動去派出所交代以前的事',show:S=>F(S,'gray')&&!isTurf(S),r:{t:'你在偵訊室坐了一整天。檢察官說你配合度高，最後給了你緩起訴。',heat:-4,mind:-6,con:6,days:3,noIncome:1}},
  {t:'低調一點，最近不出門',r:{t:'你在房間裡待了兩個禮拜，吃泡麵。外面的事，都跟你無關。',mind:-3,heat:-1}}
 ]}
});

/* ── 配角自己的命運 ── */
const FATES={
 wang:[{ev:'fz_wang_knee'},{ev:'fz_wang_rent'},null],
 chang:[{ev:'fz_chang_relapse'},{ev:'fz_chang_south'},null],
 lily:[{ev:'fz_lily_mother'},{ev:'fz_lily_ex'},null],
 zheng:[{ev:'fz_zheng_ill'},{ev:'fz_zheng_daughter'},null],
 luo:[{ev:'fz_luo_scam'},{ev:'fz_luo_army'},null]
};
Object.assign(EV,{
fz_wang_knee:{scene:'alley',tod:'day',npc:'wang',title:'王媽的膝蓋',skip:S=>!NPCS.wang.here(S),
 text:S=>`便當店的鐵門拉下了一半。王媽坐在門口，膝蓋包著繃帶。\n\n「醫生說要換人工關節，要躺三個月。」她看著店裡的鍋子。「三十年了，我沒有休過一個禮拜。」\n\n${trustN(S,'wang')>=55?'她看著你：「你願不願意，替我顧三個月？」':'她說，大概就收了吧。'}`,
 ch:[
  {t:'替她顧店三個月',show:S=>trustN(S,'wang')>=55&&!S.biz,r:{t:'凌晨四點熬湯，中午包便當，晚上洗碗。三個月後，王媽拄著拐杖回來，嚐了一口湯，沒有說話，又嚐了一口。\n\n「以後，這間店給你。」',job:{name:'便當店幫手',income:500,wear:.08,meals:1},set:{wangWork:1,wang:3,wangHeir:1},con:4,log:'王媽開刀時替她顧店，她說店以後給你'}},
  {t:'包一個紅包給她',req:{money:3000},r:{t:'她推了三次才收下。「你自己都不夠了。」',money:-3000,con:4,mind:2}},
  {t:'說幾句話就走',r:{t:'一個月後，你經過西昌街，鐵門上貼著「頂讓」。',mind:-4,set:{wangClosed:1}}}
 ]},
fz_wang_rent:{scene:'alley',tod:'dusk',npc:'wang',title:'漲租',skip:S=>!NPCS.wang.here(S),
 text:()=>'王媽的房東要把店面租給一間連鎖手搖飲，租金一次漲兩倍。\n\n「我做了三十年，他說要就要。」她在算帳，算了很多遍。「差兩萬。」',
 ch:[
  {t:'借她兩萬',req:{money:20000},r:{t:'她收下錢的時候手在抖。半年後，她把錢一次還給你，多了一千：「利息。」',money:-20000,con:6,set:{wangSaved:1,wang:3},log:'借王媽兩萬保住了店'}},
  {t:'幫她去跟房東談',req:{rep:40},r:(S,R)=>R()<.5?{t:'房東聽過你。他最後只漲了五成。',rep:4,set:{wang:3}}:{t:'房東說：「你是誰？」',mind:-4,set:{wangClosed:1}}},
  {t:'沒辦法',r:{t:'一個月後，便當店變成了一間手搖飲。王媽回宜蘭了，走之前在你的紙板上放了一個便當。',mind:-6,set:{wangClosed:1}}}
 ]},
fz_chang_relapse:{scene:'hospital',tod:'night',npc:'chang',title:'第一百二十天',skip:S=>!NPCS.chang.here(S),
 text:S=>`凌晨，你被叫到急診室。阿昌倒在公園的廁所裡，身邊有三個空瓶。\n\n${(S.f.changSober||0)>=2||trustN(S,'chang')>=60?'醫生說還好送得早。阿昌醒來看到你，第一句話是：「對不起。」':'醫生說，酒精中毒加上肝指數很高，能不能撐過去要看這兩天。'}`,
 ch:[
  {t:'陪他住院，出院後帶他去戒酒團體',r:S=>(S.f.changSober||0)>=1||trustN(S,'chang')>=55?{t:'你陪他住了一個禮拜。出院那天，他把口袋裡最後一瓶小米酒倒進水溝。',days:7,noIncome:1,set:{changOK:1},con:6,log:'陪阿昌熬過了第一百二十天'}:{t:'你陪他住了一個禮拜。出院第三天，他又不見了。',days:7,noIncome:1,set:{changGone:1},mind:-6}},
  {t:'付了醫藥費就走',req:{money:3000},r:{t:'你在櫃檯付了錢。你沒有回病房看他。',money:-3000,set:{changGone:1}}},
  {t:'這是他自己的選擇',r:{t:'你沒有去。後來你聽說，他被社工送進了一間安養院。',mind:-4,set:{changGone:1}}}
 ]},
fz_chang_south:{scene:'park',tod:'day',npc:'chang',title:'辦桌',skip:S=>!NPCS.chang.here(S),
 text:S=>`阿昌拿著一張紙找你，手抖得比平常厲害，是興奮。\n\n「台南以前的師兄打電話來，說他的辦桌團缺一個總鋪師。包吃住，一場三千。」他看著你。「我怕我去了又喝。」\n\n${trustN(S,'chang')>=55?'「你陪我去，好不好？就一個月。」':'他說他還在考慮。'}`,
 ch:[
  {t:'陪他去台南一個月',show:S=>trustN(S,'chang')>=55,r:{t:'一個月，你們辦了十八場。你當他的二手，切菜、端盤子、看著他不讓他碰酒。\n\n回台北的前一天，師兄留他下來了。他送你上火車，塞給你一個紅包：「你是我的貴人。」',days:30,noIncome:1,money:18000,con:6,set:{changOK:1,changSouth:1},log:'陪阿昌去台南辦桌'}},
  {t:'叫他自己去，你相信他',r:(S,R)=>R()<.5?{t:'一個月後，他寄來一張照片：他穿著廚師服，站在一百桌的流水席前面。',mind:6,set:{changSouth:1,changGone:1}}:{t:'兩個月後，你聽說他在台南被辦桌團趕走了。',mind:-4,set:{changGone:1}}},
  {t:'叫他不要去，台北比較熟',r:{t:'他點點頭，把紙摺起來。那天晚上，他喝得比平常多。',mind:-3}}
 ]},
fz_lily_mother:{scene:'market',tod:'night',npc:'lily',title:'機票',skip:S=>!NPCS.lily.here(S),
 text:()=>'莉莉收攤的時候在哭。她媽媽在越南中風了，醫生說可能撐不過這個月。\n\n來回機票加上醫藥費，她算了很久，差一萬五。她女兒在旁邊，抱著她的腿。',
 ch:[
  {t:'借她一萬五',req:{money:15000},r:{t:'她趕上了，在媽媽走之前三天。\n\n她回來的那天，帶了一包越南咖啡給你，什麼都沒說，抱了你一下。',money:-15000,con:8,set:{lilyLoyal:1},log:'借莉莉機票錢回越南'}},
  {t:'幫她顧女兒，讓她先湊錢',show:S=>trustN(S,'lily')>=50,r:{t:'你每天放學去接她女兒，陪她寫功課。莉莉跟所有越南姐妹借了一圈，兩個禮拜後湊到了。',days:14,con:6,set:{lilyLoyal:1}}},
  {t:'你幫不了',r:{t:'一個禮拜後，河粉攤收了。她帶著女兒回越南了，沒有說還會不會回來。',mind:-5,set:{lilyGone:1}}}
 ]},
fz_lily_ex:{scene:'market',tod:'night',npc:'lily',title:'前夫',skip:S=>!NPCS.lily.here(S),
 text:()=>'一個喝醉的男人在河粉攤前面大吼，說要把女兒帶走。是莉莉的前夫。\n\n「她是我的女兒！你一個外配，憑什麼！」他一腳踢翻了湯桶。\n\n莉莉擋在女兒前面，手在發抖。',
 ch:[
  {t:'擋在她們前面',req:{hp:45},r:(S,R)=>R()<.6?{t:'他推了你一把，你沒倒。整條夜市的攤販都圍過來了。他罵著走了。',hp:-4,rep:6,con:6}:{t:'他一拳打在你臉上，你倒在湯水裡。但警察來了。',hp:-12,rep:6,con:6}},
  {t:'打給林姐，幫她申請保護令',show:S=>linOK(S),r:{t:'林姐陪她去法院。保護令下來那天，莉莉的女兒畫了一張畫送你，畫裡你穿著超人披風。',con:6,set:{lilyLoyal:1}}},
  {t:'不要介入別人的家務事',r:{t:'你走開了。一個月後，你聽說莉莉帶著女兒搬去台中了。',mind:-5,set:{lilyGone:1}}}
 ]},
fz_zheng_ill:{scene:'hospital',tod:'day',npc:'zheng',title:'保證人',skip:S=>!NPCS.zheng.here(S)||S.seen.includes('c6_zheng'),
 text:S=>`老鄭在橋下咳血，被送進醫院。醫生說要做檢查，可能要開刀，但需要一個「保證人」簽名。\n\n社工問他有沒有家人。他搖頭，然後看著你。\n\n${trustN(S,'zheng')>=55?'「你簽，」他說，「出了事，不會讓你賠。」':'他沒有開口，只是看著你。'}`,
 ch:[
  {t:'簽',r:{t:'你在「與病人關係」那一欄寫了「朋友」。開刀很順利。出院那天，老鄭把他的鐵盒交給你：「替我保管。」',con:8,set:{zhengBox:1},log:'替老鄭簽了手術保證人'}},
  {t:'說你不是他的家人',r:{t:'社工把他轉去了一間安養院。他走的時候，把那條毯子留給了你。',mind:-6,set:{zhengFate:'dead',zhengNursing:1}}}
 ]},
fz_zheng_daughter:{scene:'bridge',tod:'dusk',npc:'woman',title:'辮子',skip:S=>!NPCS.zheng.here(S)||F(S,'zhengDaughter'),
 text:()=>'一個三十歲左右的女人在橋下問人，手上拿著一張舊照片：一個綁辮子的小女孩，和一個年輕的船員。\n\n「我在找我爸爸。他姓鄭，以前跑船。」\n\n老鄭就在你旁邊的帆布裡。他聽到了，把帆布拉得更緊。',
 ch:[
  {t:'帶她過去',r:{t:'老鄭從帆布裡出來的時候，頭髮亂得像草。女兒看了他很久，說：「你老了。」老鄭說：「妳長大了。」\n\n那天晚上，老鄭跟她回高雄了。他走之前，把他睡的位置讓給你。',con:8,mind:6,set:{zhengHome:1},log:'老鄭的女兒找到了他'}},
  {t:'說你沒看過這個人',r:{t:'她謝謝你，走了。老鄭在帆布裡，一整晚都沒有咳嗽。你知道他醒著。',mind:-4}},
  {t:'先問老鄭想不想見她',show:S=>trustN(S,'zheng')>=50,r:{t:'老鄭沉默了很久。「你跟她說，我明天早上在這裡。」\n\n第二天早上，他刮了鬍子，換上一件你從沒見過的襯衫。',con:6,mind:8,set:{zhengHome:1},log:'老鄭和女兒重逢'}}
 ]},
fz_luo_scam:{scene:'park',tod:'night',npc:'luo',title:'高薪工作',skip:S=>!NPCS.luo.here(S),
 text:S=>`小羅很興奮地找你：「大哥！有人要介紹我去柬埔寨做客服，月薪十萬，包機票！」\n\n他拿出手機給你看，是一個你看過很多次新聞的那種廣告。\n\n${trustN(S,'luo')>=50?'他說：「大哥你覺得呢？你說不要，我就不去。」':'他說他明天就要出發了。'}`,
 ch:[
  {t:'拉住他，把新聞給他看',show:S=>trustN(S,'luo')>=50,r:{t:'他看完新聞，臉都白了。那天晚上，他把那個介紹人的電話封鎖了，然後在你旁邊睡著了。',con:6,set:{luoSaved:1},log:'攔下了要去柬埔寨的小羅'}},
  {t:'叫他小心，有事打給你',r:{t:'三個月後，林姐跟你說，小羅被救回來了，在柬埔寨被關了兩個月，手臂上有很多傷。',mind:-6,set:{luoHurt:1}}},
  {t:'祝他好運',r:{t:'你再也沒有小羅的消息。',mind:-8,set:{luoGone:1}}}
 ]},
fz_luo_army:{scene:'station',tod:'day',npc:'luo',title:'當兵',skip:S=>!NPCS.luo.here(S),
 text:()=>'小羅收到兵單了。他穿著一件新買的白T，站在車站大廳等車。\n\n「育幼院的老師說，當兵可以學一技之長。」他笑得有點緊張。「大哥，你會來看我嗎？」',
 ch:[
  {t:'送他一個紅包',req:{money:1000},r:{t:'他把紅包收進內褲裡。你們都笑了。',money:-1000,mind:6,set:{luoArmy:1}}},
  {t:'答應他，懇親日會去',r:{t:'懇親日那天，你是他唯一的家屬。他穿著軍服，站得很直。',days:1,noIncome:1,mind:8,set:{luoArmy:1,luoVisit:1}}},
  {t:'拍拍他的肩膀',r:{t:'「錢塞內褲。」你說。',mind:3,set:{luoArmy:1}}}
 ]}
});
function initRun(S,R){
 S.pool={};for(const k in POOLS)S.pool[k]=POOLS[k][Math.floor(R()*POOLS[k].length)];
 S.fate={};for(const k in FATES){const f=FATES[k][Math.floor(R()*FATES[k].length)];if(f)S.fate[k]={ev:f.ev,day:140+Math.floor(R()*320),done:0}}
}
function dueFate(S){if(!S.fate)return null;for(const k in S.fate){const f=S.fate[k];if(f.done||S.day<f.day)continue;if(S.day>f.day+200){f.done=1;continue}if(!NPCS[k].here(S))continue;const ev=EV[f.ev];if(ev.skip&&ev.skip(S)){continue}f.done=1;return f.ev}return null}
NPCS.wang.here=(h=>S=>h(S)&&!F(S,'wangClosed'))(NPCS.wang.here);
NPCS.zheng.here=(h=>S=>h(S)&&!F(S,'zhengHome')&&!F(S,'zhengNursing'))(NPCS.zheng.here);
NPCS.luo.here=(h=>S=>h(S)&&!F(S,'luoGone')&&!F(S,'luoArmy'))(NPCS.luo.here);
{const c=EV.c4_offer.ch.find(x=>x.t==='頂下王媽的便當店');const s0=c.show;c.show=S=>(s0(S)||F(S,'wangHeir'))&&!F(S,'wangClosed');c.req=S=>F(S,'wangHeir')?{money:20000,rep:20}:{money:40000,rep:30,con:45};const r1=c.r;c.r=S=>({...r1,money:F(S,'wangHeir')?-20000:-40000,t:F(S,'wangHeir')?'王媽把鑰匙交給你：「說好的，半價。剩下的，你用湯來還。」':r1.t});}

/* ── 開局卡 ── */
const CARDS={
 dog:{name:'一條跟著你的狗',desc:'牠從車站跟你到現在。多一張嘴，也多一點陪伴。',apply:S=>{S.f.dog=1;S.mind+=5}},
 noid:{name:'包包被偷了',desc:'身分證不見了，但口袋裡還有 800 塊。',apply:S=>{S.f.noID=1;S.money+=800}},
 lottery:{name:'一張沒刮的刮刮樂',desc:'在車站撿的。可能什麼都沒有，也可能改變一切。',apply:(S,R)=>{const x=R();const w=x<.05?20000:x<.3?2000:0;S.money+=w;S.log.push({day:1,t:w?`刮刮樂中了 ${w.toLocaleString()} 元`:'刮刮樂什麼都沒中'});S.cardNote=w?`你在車站的燈下刮開它：${w.toLocaleString()} 元。`:'你在車站的燈下刮開它：銘謝惠顧。'}},
 cousin:{name:'一個遠房表哥',desc:'聽說他在台北，也聽說他在找你。不知道是好事還是壞事。',apply:S=>{S.f.cousin=1}},
 kai:{name:'欠阿凱一個人情',desc:'很久以前的事了。他記得，你也記得。',apply:S=>{S.f.strong=1;S.f.owesKai=1;S.rel=S.rel||{};S.rel.kai=50}},
 bag:{name:'一個好睡袋',desc:'軍用的，零下也撐得住。冬天會好過很多。',apply:S=>{S.f.gear=1}},
 cook:{name:'會一手好菜',desc:'以前在家裡都是你煮飯。做吃的生意會比較順。',apply:S=>{S.f.cookSkill=1}},
 phone:{name:'一支還能用的手機',desc:'有網路，就有工作的消息。臨時工排到的機會多一點。',apply:S=>{S.f.phone=1}},
 savings:{name:'藏起來的三千塊',desc:'縫在外套內裡。睡在外面，要小心。',apply:S=>{S.money+=3000}},
 sick:{name:'一身的病',desc:'健康少 15，但社福中心的林姐已經認識你了。',apply:S=>{S.hp-=15;S.f.linCard=1;S.f.lin=1}},
 zheng:{name:'一個老朋友',desc:'你上次流落街頭時，橋下有個跑船的老人照顧過你。',apply:S=>{S.f.zheng=2;S.rel=S.rel||{};S.rel.zheng=65}},
 tough:{name:'打架很兇',desc:'街上的人不太敢惹你。但你的良知少 8。',apply:S=>{S.f.tough=1;S.con-=8;S.rep+=6}}
};
function drawCards(R=Math.random){const k=Object.keys(CARDS);const out=[];while(out.length<3){const x=k[Math.floor(R()*k.length)];if(!out.includes(x))out.push(x)}return out}
function applyCard(S,key,R=Math.random){const c=CARDS[key];if(!c)return;S.card=key;c.apply(S,R);clamp(S)}
Object.assign(EV,{
fz_cousin:{scene:'station',tod:'day',title:'表哥',skip:S=>!F(S,'cousin'),
 text:()=>'社福中心轉來一個留言：一個自稱是你表哥的人在找你，留了電話。\n\n你打過去。他叫阿忠，在桃園開了一間小小的水電行。「我聽你媽說的。你過來，我這邊缺人。」\n\n他停了一下：「不過你要先借我五萬週轉。等過了這個月，我加倍還你。」',
 ch:[
  {t:'去桃園，但不借錢',r:(S,R)=>R()<.6?{t:'阿忠聽到你不借錢，沉默了一下，還是讓你留下來。水電行的工作很累，但每天都有。',job:{name:'表哥的水電行學徒',income:600,wear:.1},set:{cousinJob:1},log:'去表哥的水電行當學徒'}:{t:'你到了桃園，水電行的鐵門拉著，貼著法院的封條。',money:-300,mind:-6}},
  {t:'借他錢',req:{money:50000},r:(S,R)=>R()<.4?{t:'一個月後，他真的還了你十萬。你看著存摺，不敢相信。',money:50000,mind:6}:{t:'電話打不通了。你媽說，他也跟她借了錢。',money:-50000,mind:-12,log:'借給表哥的錢沒了'}},
  {t:'不理他',r:{t:'你把那張紙條丟了。',mind:-1}}
 ]}
});
ins(3,'c3_room','fz_cousin');

/* ── 新的翻身路線 ── */
Object.assign(EV,{
r_school:{scene:'office',tod:'dusk',npc:'lin',title:'補校',skip:S=>!linOK(S)||S.origin==='teacher',
 text:()=>'林姐拿著一張單子：「萬華有一間高職進修部，晚上上課，學費有補助，一學期自付八千。讀完有高職文憑，可以考證照。」\n\n「白天工作，晚上讀書，很累。」她說。「但有了文憑，很多門就打開了。」',
 ch:[
  {t:'報名',req:{money:8000,id:1,mind:35},r:{t:'第一天上課，你坐在最後一排，旁邊是一個十七歲的小孩和一個六十歲的阿嬤。老師叫你的名字，你愣了一下才舉手。',money:-8000,set:{school:1},mind:4,log:'報名了高職進修部'}},
  {t:'現在先顧生活',r:{t:'林姐把單子收起來：「明年還有。」',mind:-1}}
 ]},
r_school2:{scene:'office',tod:'night',title:'期末考',skip:S=>!F(S,'school'),
 text:S=>`進修部讀了一年多。白天${S.job?'上工':'找工作'}，晚上上課，你常常在課堂上睡著。\n\n期末考要考會計和電工實務。考過了，再一學期就能畢業，可以考丙級證照。\n\n考試那天，${S.job?'老闆說你請假就不用回來了':'外面在下大雨'}。`,
 ch:[
  {t:'去考試',r:(S,R)=>R()<.35+S.mind/150?{t:'你寫到最後一題，手在抖。成績出來那天，你在公布欄前面站了很久：及格。\n\n半年後，你拿到了畢業證書，還有一張電工丙級證照。',set:{schoolDone:1,skill:1},rep:6,mind:12,log:'高職進修部畢業，考到電工證照'}:{t:'你考砸了。老師說可以重修，再讀一年。',mind:-8}},
  {t:'放棄學業，工作要緊',r:{t:'你把書包放在床底下。後來那些課本，你拿去回收場賣了，一公斤一塊八。',mind:-6,set:{school:0}}}
 ]},
r_voice:{scene:'office',tod:'day',title:'公聽會',skip:S=>!(F(S,'protest')||F(S,'spokeUp')||F(S,'filmed')||S.f.reporter==='named'),
 text:()=>'一個街友權益團體的年輕人找到你。他們看過你說的話、拍的影片。\n\n「市議會下個月有一場街友政策公聽會，我們想請你上台，講三分鐘。」他說。「議員們聽過很多專家，沒聽過真的睡過橋下的人。」\n\n台下會有攝影機，還有記者。',
 ch:[
  {t:'上台',req:{mind:40},r:{t:'你拿著稿子上台，講到一半就不看稿了。你講老鄭的鐵盒、寒流夜的紙板、紅紙上「不收街友」那四個字。\n\n台下有一個議員在滑手機，也有一個在擦眼淚。',rep:12,con:6,mind:4,set:{voice:1},log:'在市議會公聽會上發言'}},
  {t:'幫他們寫稿，但不露臉',r:{t:'公聽會上，另一個街友念了你寫的稿子。念到一半，他哭了。',rep:4,con:4,set:{voice:1}}},
  {t:'拒絕，你不想被消費',r:{t:'年輕人點點頭：「我懂。」他留下名片。',mind:2}}
 ]},
r_voice2:{scene:'park',tod:'day',title:'遊行',skip:S=>!F(S,'voice'),
 text:()=>'市府要在萬華蓋一棟社會住宅，但說「不保留名額給街友」，理由是「鄰居會反對」。\n\n倡議團體要辦一場遊行，從艋舺公園走到市政府。他們問你，願不願意站在第一排，拿麥克風。\n\n站在第一排的人，名字會被記住。被誰記住，就不知道了。',
 ch:[
  {t:'站在第一排',req:{rep:35},r:(S,R)=>R()<.5+S.rep/250?{t:'兩千多個人跟著你走過忠孝西路。市長在三天後宣布，社會住宅將保留百分之五給「脫離街頭者」。\n\n林姐打電話來，只說了一句：「你做到了。」',rep:15,con:8,mind:10,set:{voice:2},log:'帶領遊行，爭取到社宅名額'}:{t:'遊行很順利，新聞也播了。但市府說「會研議」，然後就沒有然後了。\n\n你走回萬華的時候，覺得很累。',rep:8,mind:-6,set:{voice:2}}},
  {t:'在後面幫忙發水',r:{t:'你發了一整天的水。有一個坐輪椅的阿伯跟你說：「謝謝你，少年耶。」他不知道你是誰。',con:4,rep:3}},
  {t:'不去',r:{t:'那天你在工作。晚上看新聞，看到很多你認識的臉。',mind:-2}}
 ]},
r_leave:{scene:'station',tod:'dawn',title:'離開台北',skip:S=>!!S.biz||S.path==='peer',
 text:S=>`人力仲介的騎樓下，貼著兩張新的單子。\n\n一張是屏東的食品工廠：「包吃包住，宿舍八人一間，月薪兩萬八，簽一年。」\n\n一張是遠洋漁船：「兩年約，月薪四萬五，出海就是十個月。不問過去。」仲介小聲說：「有人回來買了房子，也有人沒有回來。」\n\n這是一個讓台北的一切都留在台北的機會。${S.house?'你現在的生活，就要放下了。':''}`,
 ch:[
  {t:'去屏東的工廠',req:{id:1,addictMax:50},r:{t:'',end:'south'}},
  {t:'上遠洋漁船',req:{hp:55,addictMax:40},r:(S,R)=>R()<.2?{t:'',end:'lost_sea'}:{t:'',end:'sea'}},
  {t:'留在台北',r:{t:'你把兩張單子都看了很久，然後走回萬華。這裡有你認識的每一根柱子。',mind:2}}
 ]}
});
ins(3,'c3_huei2','r_school');ins(5,'c5_start','r_school2');ins(4,'c4_crisis','r_voice');ins(6,'g6_politic','r_voice2');ins(4,'c4_chang2','r_leave');
Object.assign(ENDINGS,{
 voice:{name:'發聲',req:'站上議會、走在遊行第一排 · 人脈 45 · 良知 55',tier:4},
 diploma:{name:'畢業證書',req:'讀完補校，拿到證照 · 自己的房間',tier:4},
 south:{name:'南方',req:'離開台北，去屏東的工廠重新開始',tier:3},
 sea:{name:'遠洋',req:'簽下兩年的遠洋漁船合約',tier:3},
 lost_sea:{name:'沒有回來的船',req:'上了遠洋漁船，然後……',tier:0}
});
Object.assign(EXT_END,{
 voice:S=>`${S.f.voice>=2?'社會住宅落成的那天，你被邀請去剪綵。你沒有去。你在艋舺公園，跟第一批要搬進去的人一起吃了一頓便當。':'那場公聽會之後，你常常被請去演講：大學、教會、扶輪社。'}\n\n有人說你是街友的代言人。你不喜歡這個說法。你只是一個睡過橋下、剛好還記得那裡是什麼樣子的人。\n\n每次上台前，你都會先摸一下口袋。裡面是一張很舊的紅紙，上面寫著：「不收街友」。`,
 diploma:S=>`畢業典禮在進修部的禮堂，晚上七點。你穿著借來的西裝，跟一群十八歲的孩子一起上台。\n\n校長念到你的名字，台下有人在喊。${linOK(S)?'是林姐，她站在最後面，用力地拍手。':'你不知道是誰。'}\n\n你用那張電工證照，找到了一份大樓水電的工作。第一次領到有勞健保的薪資單，你把它影印了一份，貼在雅房的牆上。`,
 south:S=>'屏東的工廠在一片香蕉田的旁邊。宿舍八個人一間，有一半是從越南和印尼來的移工。\n\n十二小時輪班，你負責把罐頭裝箱。沒有人知道你睡過橋下，也沒有人問。\n\n第一年過年，你沒有回台北。你跟室友們在宿舍頂樓煮了一鍋火鍋，看著遠方的煙火。有一個印尼室友問你，台北是什麼樣子。你想了很久，說：「很亮。」',
 sea:S=>'船從前鎮漁港出發的時候，你站在甲板上，看著高雄慢慢變小。\n\n十個月，你沒有看過陸地。你學會了在浪裡睡覺、在暴風雨裡收網，也學會了老鄭說過的那件事：在海上，你不怕死，只怕死了沒人知道。\n\n兩年後，你帶著一筆錢回到萬華。橋下的人換了一輪，沒有人認得你。你在華西街吃了一碗麵，然後去看了一間房子。',
 lost_sea:S=>'船在第七個月失去了聯絡。最後的定位，在南太平洋的一片海域。\n\n漁業署發了一份新聞稿，船員名單上有你的名字，旁邊寫著「本國籍」。\n\n林姐在報紙上看到，把那一頁剪下來，夾在你的個案資料裡。資料的最後一頁，還寫著你第一次來中心時說的話：「我不需要人可憐。」'
});
Object.assign(ENDGROUP,{diploma:'stable',lost_sea:'death'});
{const T0=tenYears;tenYears=function(S,key){const out=T0(S,key);const A=AGE[S.origin]+12;
 const Y={voice:`你 ${A} 歲了。你寫了一本書，書名叫《紅紙》。版稅全部捐給了社福中心。`,diploma:`你 ${A} 歲了。你是大樓的水電主任，手下有三個人。其中一個，是你從進修部帶出來的學弟。`,south:`你 ${A} 歲了。你在屏東娶了一個在工廠認識的女人，養了兩隻狗。你偶爾會想起台北，但很少想起橋下。`,sea:`你 ${A} 歲了。你又跑了兩趟船，然後在前鎮漁港開了一間修漁網的小店。每次有新的年輕船員來，你都會跟他們說：在海上，要讓人知道你在哪裡。`,lost_sea:`十年過去了。那艘船一直沒有找到。`};
 if(Y[key])out[0]=Y[key];
 if(F(S,'zhengHome'))out.push('老鄭在高雄跟女兒住了五年，走的時候很安詳。他女兒寫信給你，說他最後幾年常常提到「台北那個少年」。');
 if(F(S,'luoSaved'))out.push('小羅後來去考了導遊證照，專帶東南亞的旅行團。他說他最會跟客人講：不要相信網路上的高薪工作。');
 else if(F(S,'luoArmy'))out.push('小羅當完兵，留營當了職業軍人。他每年過年都會寄一張穿軍服的照片給你。');
 if(F(S,'wangHeir')&&!S.biz)out.push('王媽的便當店後來還是收了。她說，她本來要留給你的。');
 return out.slice(0,7)}}
{const E0=epilogue2;epilogue2=function(S){const e=E0(S);const f=k=>F(S,k);
 if(f('wangClosed'))e.push('王媽的店收了。西昌街那間便當店，現在是一間手搖飲。');
 if(f('changSouth'))e.push('阿昌在台南辦桌。每年過年，他寄一箱烏魚子給你。');
 if(f('lilyGone'))e.push('莉莉回越南以後，再也沒有消息。');
 if(f('zhengBox'))e.push('老鄭的鐵盒還在你這裡。你一直沒有打開。');
 if(f('guide'))e.push('你的導覽路線上了一本旅遊書，書裡寫：「由真正的前街友帶路。」');
 return e}}
