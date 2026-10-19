
/* ═════════ 第十版：好人路線的考驗 ═════════ */
const clean=S=>{S.f.cleanTests=(S.f.cleanTests||0)+1};
Object.assign(EV,{
s_recruit:{scene:'alley',tod:'night',npc:'kai',skip:S=>S.path!=='peer',title:'阿豪',
 text:()=>'阿豪是你從橋下拉起來的第一個個案。十九歲，你陪他補了身分證、找了洗車場的工作，上個月他還傳訊息給你說領到第一份薪水。\n\n這個禮拜，他沒去上班，電話也不接。\n\n洗車場的老闆說，有兩個穿 polo 衫的人常來找他。你在華西街一間茶室的門口看到他，他穿著新的球鞋，正在幫人看門。他看到你，把頭轉開了。',
 ch:[
  {t:'報警，說他可能被控制',r:(S,R)=>{clean(S);return R()<.5?{t:'警察臨檢了那間茶室。阿豪被帶回派出所，坐在你旁邊哭了很久。他說他們答應給他一個月三萬，他只是想快一點。',con:6,mind:2,set:{haoSaved:1},log:'報警把阿豪從茶室帶回來'}:{t:'警察去的時候，茶室乾乾淨淨。阿豪不見了。三天後，你的辦公室門口被人潑了一桶油漆。',con:4,mind:-8,set:{haoLost:1}}}},
  {t:'自己走進茶室，把他帶出來',req:{hp:45},r:(S,R)=>{clean(S);return R()<.55?{t:'你走進去，抓住阿豪的手臂就往外走。沒有人攔你。走到巷口，你才發現自己的手一直在抖。',con:8,rep:6,mind:4,set:{haoSaved:1},log:'自己走進茶室帶回阿豪'}:{t:'你還沒碰到阿豪，就被兩個人架到後巷。你醒來的時候在急診室。阿豪沒有來看你。',hp:-20,con:6,mind:-6,set:{haoLost:1}}}},
  {t:'透過阿凱跟三重談條件，把人換回來',r:{t:'阿凱聽完，笑了一下：「你們社工也會來找我們喔？」\n\n兩天後，阿豪回到洗車場上班，什麼都沒說。阿凱傳了一封簡訊給你：「你欠我一次。」',set:{haoSaved:1,owesKai:1,strong:1,dealtGang:1},con:-6,log:'透過阿凱把阿豪換回來'}},
  {t:'他已經成年了，那是他的選擇',r:{t:'你把阿豪的個案資料夾闔上，在「結案原因」那一欄，寫了「失聯」。',con:-6,mind:-8,set:{haoLost:1}}}
 ]},
s_fund:{scene:'office',tod:'day',npc:'lin',skip:S=>S.path!=='peer'&&S.f.office!=='li',title:'基金會',
 text:()=>'社會局的補助被砍了三成，中心下個月要裁掉兩個社工。林姐這個禮拜都睡在辦公室。\n\n一個叫「萬心慈善基金會」的單位，說願意每年捐兩百萬，條件只有一個：活動上掛他們的名字。\n\n林姐把資料推給你：「董事名單裡，有三個人是三重那邊的。」她看著你。「你說，我們要不要收？」',
 ch:[
  {t:'不收',r:S=>{clean(S);return {t:'林姐點點頭，好像早就知道你會這樣說。下個月，中心裁掉了兩個人，你接下了他們一半的個案。\n\n你每天工作到半夜，有幾個你在追的人，就這樣斷了聯絡。',mind:-8,rep:-2,hp:-4,set:{fundRefused:1},log:'拒絕了三重背景的基金會捐款'}}},
  {t:'收下，錢沒有顏色',r:{t:'錢進來了，兩個社工留下來了，中心的冰箱裡多了很多便當。\n\n活動背板上，「萬心慈善基金會」的字很大。你每次站在背板前面拍照，都覺得自己在笑一件不好笑的事。',con:-10,mind:2,set:{fundTaken:1,dealtGang:1},log:'收下了三重背景的基金會捐款'}},
  {t:'先收下，偷偷查他們的帳',req:{mind:45},r:(S,R)=>{clean(S);return R()<.5?{t:'你花了兩個月，查到基金會的錢是從十幾個人頭帳戶進來的。你把資料交給林姐，林姐交給檢調。\n\n基金會被搜索的那天，新聞說「社福團體主動舉報」。',rep:10,con:6,set:{fundExposed:1},log:'查出基金會在洗錢並舉報'}:{t:'你查到一半，基金會突然撤資了。有人在中心門口放了一個花圈，上面沒有寫字。',mind:-10,set:{fundRefused:1}}}}
 ]},
s_office:{scene:'office',tod:'night',npc:'brother',skip:S=>!(S.job&&S.job.name==='議員服務處助理'),title:'名單',
 text:()=>'你在議員服務處做了三個月。你負責的「街友關懷活動」辦得很成功：發睡袋、發便當、拍照。\n\n有一天加班，你在影印機旁邊看到一份名單。是你發過睡袋的每一個人，名字、身分證字號、睡在哪座橋下。旁邊用紅筆寫著：「已發」「可動員」「需再跑」。\n\n負責「跑」的人，你認得。是強哥以前的人。',
 ch:[
  {t:'把名單交給記者',r:(S,R)=>{clean(S);return R()<.6?{t:'報導刊出來的隔天，你被解僱了。但那份名單上的人，都收到了一封社福中心寄去的信：「你的票，是你自己的。」',job:null,rep:12,con:8,mind:2,set:{officeExposed:1},log:'揭發議員服務處的動員名單'}:{t:'報導刊出來了，但議員說是「助理個人行為」，把你推出去。你被解僱，還收到一封律師函。',job:null,money:-Math.min(S.money,20000),rep:4,con:6,mind:-10,set:{officeExposed:1}}}},
  {t:'辭職，什麼都不說',r:S=>{clean(S);return {t:'你把識別證放在主任桌上。主任沒有問你為什麼。他知道。',job:null,con:4,mind:-2}}},
  {t:'當作沒看到',r:{t:'你繼續辦活動，繼續發睡袋。發的時候，你不再看他們的臉。\n\n年底，你的薪水調了一級。',con:-12,money:6000,set:{dealtGang:1}}},
  {t:'留下來，偷偷蒐證',req:{mind:50},r:{t:'你把每一份名單都拍了下來，存在一個隨身碟裡，藏在雅房的天花板上。\n\n你不知道你會不會用到它。',set:{officeUSB:1},mind:-4}}
 ]},
s_poldeal:{scene:'alley',tod:'night',npc:'leopard',skip:S=>!F(S,'polRan')||F(S,'polDone')||F(S,'gangBacked'),title:'三重的票',
 text:S=>`選前兩個月，三重的人約你在一間海產店。他沒有點菜，只倒了兩杯酒。\n\n「萬華有三千票在我們手上。」他說。「你選上以後，華西街那幾間茶室，不要讓警察太常去就好。」\n\n他把酒推給你。${poll(S)}`,
 ch:[
  {t:'喝下那杯酒',r:{t:'他笑了，又倒了一杯。\n\n從那天起，你的掃街行程上多了很多你不認識的「志工」，每一個都很會拉票。',vote:14,con:-12,heat:1,set:{polDirty:1,sanchongDeal:1,dealtGang:1},log:'跟三重談好了選票交易'}},
  {t:'不喝，起身離開',r:S=>{clean(S);return {t:'你走出海產店的時候，聽到他在後面說：「你會後悔的。」\n\n那個禮拜，你的看板被割破了三次。',vote:-3,mind:-4}}},
  {t:'不喝，但把對話錄下來交給檢調',req:{con:55,mind:45},r:(S,R)=>{clean(S);return R()<.5?{t:'檢調在選前一週約談了那個人。新聞標題是：「黑道介入選舉，候選人主動檢舉」。\n\n你的民調一夜之間往上跳。',vote:8,rep:6,log:'錄下三重的選舉交易並檢舉'}:{t:'錄音交出去了，案子卻沒有下文。選前三天，你的競選總部被砸了，兩個志工受傷。',vote:-6,mind:-10,hp:-4}}}
 ]}
});
ins(5,'p5_rule','s_recruit');ins(6,'p6_burnout','s_fund');ins(6,'p6_choice','s_office');ins(5,'pol_canvass','s_poldeal');
{const t0=EV.pol_smear.text;EV.pol_smear.text=S=>{let t=t0(S);if(F(S,'dealtGang')&&!F(S,'gray'))t=t.replace('\n\n記者打電話來','\n\n黑函最後一頁，是一張你走出華西街海產店的照片。\n\n記者打電話來');return t}}
{const ok=k=>['peer','voice','lizhang','councilor','diploma'].includes(k);const E3=endingText3;endingText3=function(S,key){let t=E3(S,key);if(ok(key)&&(S.f.cleanTests||0)>=2&&!F(S,'dealtGang'))t+='\n\n這一路上，有好幾次，你可以伸手。茶室的人、基金會的錢、海產店裡那杯酒。你都沒有。\n\n你比很多人窮，比很多人慢。但你晚上睡得著。';return t}}
{const E0=epilogue2;epilogue2=function(S){const e=E0(S);const f=k=>F(S,k);
 if(f('haoSaved'))e.push(f('dealtGang')&&f('owesKai')?'阿豪後來在洗車場做到店長。他一直不知道，你是用什麼把他換回來的。':'阿豪後來在一間修車廠當學徒。他說，那天你走進來的樣子，他一輩子都記得。');
 else if(f('haoLost'))e.push('阿豪的個案資料夾，你一直放在抽屜最上面。');
 if(f('fundRefused'))e.push('那個基金會後來被查出在洗錢。林姐打電話給你，只說了一句：「還好我們沒拿。」');
 else if(f('fundTaken'))e.push('那個基金會後來被查出在洗錢。社福中心被搜索，林姐被約談了三次。她從來沒有說，是誰決定收的。');
 else if(f('fundExposed'))e.push('基金會的案子判了，十二個人被起訴。社福中心的補助，第二年恢復了。');
 if(f('officeExposed'))e.push('那份名單上的人，有一半在選舉那天沒有去投票。有一個人去了，他說：「我想投給我自己想投的人。」');
 if(f('officeUSB'))e.push('那個隨身碟還藏在天花板上。有時候下雨，你會擔心它會不會受潮。');
 if(f('sanchongDeal'))e.push('三重的人每年過年都會送一盒烏魚子到你的服務處。你從來沒有打開過。');
 return e}}
