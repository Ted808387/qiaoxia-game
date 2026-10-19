
/* ═════════ 第九版：從街頭選上去 ═════════ */
function polEntry(S){if(F(S,'voice'))return 'voice';if(S.path==='peer')return 'peer';if(isTurf(S)&&S.rep>=40)return 'gang';if(S.rep>=55||(F(S,'spokeUp')&&S.rep>=40))return 'local';return null}
const polNeed=S=>S.f.office==='council'?72:52;
function supporters(S){const out=[];for(const k in NPCS){if(!NPCS[k].here(S))continue;if(trustOf(S,k)>=50)out.push(NPCS[k].name)}if(S.f.huei==='saved')out.push('阿惠');if(F(S,'luoSaved')||F(S,'luoArmy'))out.push('小羅');if(F(S,'blackLoyal'))out.push('黑仔');return [...new Set(out)]}
function poll(S){const v=(S.vote||0)+S.rep*.45+supporters(S).length*4;const need=polNeed(S);const d=v-need;return d>=8?'民調：你領先。':d>=-4?'民調：雙方差距在誤差範圍內。':d>=-14?'民調：你落後。':'民調：你大幅落後。'}
const OPP=S=>S.f.office==='council'?'尋求三連任的林議員':'做了二十年的陳萬福里長';
Object.assign(EV,{
pol_offer:{scene:'office',tod:'day',npc:'brother',skip:S=>!!S.f.polRan||!polEntry(S),title:'參選',
 text:S=>{const e=polEntry(S);return ({
  voice:'倡議團體的年輕人帶著一份連署書來找你，上面有八百多個名字。\n\n「明年的地方選舉，我們想推你出來。」他說。「里長也好，議員也好。議會裡沒有一個人睡過橋下。」\n\n他頓了一下：「我們沒什麼錢。但我們有很多人。」',
  peer:'林姐把一張表格放在你面前：「萬華的里長選舉。社福圈有人在問，你願不願意出來。」\n\n「你跑過每一條巷子，認識每一個睡在外面的人。」她說。「里長管的就是這些事。」\n\n她停了一下：「不過選舉很髒。你要想清楚。」',
  gang:'那位你幫過的議員，親自到你的茶室泡茶。\n\n「明年我要退了，」他笑著說，「我的位子，需要一個顧得住萬華的人。」他推過來一個很厚的信封。「選舉的錢，我出。樁腳，我給你。」\n\n你知道他給的不是位子，是一條繩子。',
  local:'里民大會散會後，幾個阿伯阿嬸圍住你。\n\n「少年耶，你出來選啦！陳萬福做二十年了，水溝還是一下雨就淹。」一個賣菜的阿嬸說。「你認識的人比他多。」\n\n大家都在笑。你發現他們不是在開玩笑。'})[e]},
 ch:[
  {t:'參選里長',req:{rep:35,money:30000},r:{t:'你去區公所登記參選。承辦人員看了你的資料，抬頭看了你一眼，什麼都沒說，蓋了章。\n\n競選總部是一間借來的鐵皮屋，在你以前睡過的那座橋旁邊。',money:-30000,set:{polRan:1,office:'li'},log:'登記參選里長'}},
  {t:'參選市議員',show:S=>polEntry(S)!=='gang',req:S=>({rep:50,money:polEntry(S)==='voice'||polEntry(S)==='peer'?60000:150000}),r:S=>({t:'你拿著政黨的推薦函，去選委會登記。保證金二十萬，倡議團體湊了一半。\n\n記者在門口等你：「請問你真的睡過橋下嗎？」你說：「睡了很久。」',money:polEntry(S)==='voice'||polEntry(S)==='peer'?-60000:-150000,set:{polRan:1,office:'council'},log:'登記參選市議員'})},
  {t:'收下信封，參選市議員',show:S=>polEntry(S)==='gang',r:{t:'信封裡是兩百萬。議員把他的樁腳名單交給你，每一個名字旁邊，都寫著一個數字。',money:200000,set:{polRan:1,office:'council',gangBacked:1,polDirty:1},heat:1,con:-8,vote:12,log:'議員出錢，參選市議員'}},
  {t:'不選',r:{t:'你說你只想把手上的事做好。大家很失望，也有人鬆了一口氣。',mind:2}}
 ]},
pol_canvass:{scene:'market',tod:'dusk',skip:S=>!F(S,'polRan')||F(S,'polDone'),title:'掃街',
 text:S=>{const sp=supporters(S);return `競選背心很新，你穿起來不太習慣。你的對手是${OPP(S)}，他的看板掛滿了整條西園路。\n\n${sp.length?`願意替你站台的人：${sp.join('、')}。`:'你數了一下，真正願意替你站出來的人，一個都沒有。'}\n\n${poll(S)}`},
 ch:[
  {t:'一戶一戶走，從橋下走到菜市場',req:{hp:40},r:{t:'你走了一個月，鞋底磨穿了兩雙。有一個阿嬤握著你的手說：「我知道你，你以前睡在龍山寺。」她說她會投給你。',hp:-10,vote:9,rep:4,days:20}},
  {t:'請最信任你的人一起拉票',show:S=>supporters(S).length>=2,r:S=>({t:`${supporters(S).slice(0,3).join('、')}陪你走了好幾天。他們介紹你的時候，說的不是政見，是你以前做過的事。`,vote:7+Math.min(8,supporters(S).length*2),rep:3})},
  {t:'在網路上直播你的故事',req:{mind:40},r:(S,R)=>R()<.6?{t:'直播的時候你沒有稿子，講到老鄭的鐵盒，你停了很久。那段影片被轉了十幾萬次。',vote:12,rep:6}:{t:'留言區被洗了一整晚：「遊民也想當官？」「先去洗澡吧。」你看到凌晨三點。',vote:-4,mind:-10}},
  {t:'花錢買宣傳車和看板',req:{money:40000},r:{t:'宣傳車每天繞萬華三圈，喇叭裡播著你的名字。有人說很吵，也有人記住了。',money:-40000,vote:8}}
 ]},
pol_smear:{scene:'station',tod:'night',skip:S=>!F(S,'polRan')||F(S,'polDone'),title:'黑函',
 text:S=>`選前一個月，萬華的信箱裡出現了一份黑函。標題是：「${({debt:'欠債跑路的人，能替你管錢嗎？',excon:'他坐過六年牢，你知道為什麼嗎？',injury:'酒鬼、遊民、拋家棄子',family:'連自己的家都待不住的人',teacher:'連詐騙都看不出來，怎麼替你看預算？'})[S.origin]}」\n\n${F(S,'gray')?'裡面還有你在華西街茶室門口的照片。':''}${F(S,'mule')?'裡面還附了一張你的存摺影本，和一份詐騙案的起訴書。':''}\n\n記者打電話來，要你回應。${poll(S)}`,
 ch:[
  {t:'開記者會，全部坦白',req:{con:45},r:S=>({t:`你站在橋下開記者會，把黑函上的每一件事都講了一遍，包括黑函沒寫到的。\n\n${S.con>=60?'第二天的報紙標題是：「他沒有否認任何一件事」。':'有人說你很勇敢，也有人說你在作秀。'}`,vote:S.con>=60?9:3,rep:5,mind:-3})},
  {t:'否認，說是抹黑',r:(S,R)=>R()<.5?{t:'風波過了一個禮拜就沒人提了。萬華的人很忙，沒空記得太久。',vote:1}:{t:'第二週，記者找到了你的舊資料。標題變成：「說謊的候選人」。',vote:-12,mind:-6}},
  {t:'反擊，挖出對手的黑料',show:S=>F(S,'gray')||S.rep>=55,r:{t:'你找人查到對手的里辦公處經費有問題。你把資料丟給記者。\n\n選戰變成了互相丟泥巴。你贏了這一輪，但你洗手的時候，覺得洗不乾淨。',vote:6,con:-10,set:{polDirty:1}}},
  {t:'不回應',r:{t:'你繼續掃街。有人當面問你黑函的事，你只說：「你可以去橋下問。」',vote:-3}}
 ]},
pol_buy:{scene:'alley',tod:'night',skip:S=>!F(S,'polRan')||F(S,'polDone'),title:'一票五百',
 text:S=>`一個樁腳約你在茶室後面見面。他抽著菸，說得很直接：\n\n「${S.f.office==='council'?'議員選舉，一票一千':'里長選舉，一票五百'}。對手已經在發了。你不發，那些阿伯阿嬸就不會出門投票。」\n\n他把一份名單攤開，上面每一個名字都有一個數字。${poll(S)}`,
 ch:[
  {t:'買',req:S=>({money:S.f.office==='council'?80000:25000}),r:S=>({t:'紅包一個一個發出去。你沒有親手發，但你知道每一個紅包的數字。',money:S.f.office==='council'?-80000:-25000,vote:15,con:-12,heat:2,set:{bought:1,polDirty:1},log:'選舉時買了票'})},
  {t:'不買',r:{t:'樁腳把名單收起來，搖搖頭：「你會輸的。」他走了，帶走了他的那些阿伯阿嬸。',vote:-4,con:4}},
  {t:'錄音，向檢調檢舉對手買票',req:{con:55,mind:40},r:(S,R)=>R()<.55?{t:'檢調在選前三天搜索了對手的競選總部。新聞連播了三天。',vote:10,rep:4}:{t:'檢舉被吃案了。對手知道是你，選前最後一週，他的人天天在你總部門口按喇叭。',vote:-2,mind:-6}}
 ]},
pol_vote:{scene:'office',tod:'night',skip:S=>!F(S,'polRan')||F(S,'polDone'),title:'開票',
 text:S=>`投票日。你一早去投了票，然後坐在競選總部的鐵皮屋裡，看著電視上的開票數字一格一格跳。\n\n${supporters(S).length?`${supporters(S).slice(0,4).join('、')}都來了，擠在小小的屋子裡。`:'屋子裡只有你和幾個志工。'}\n\n晚上九點，最後一個投開票所的結果出來了。`,
 ch:[{t:'看結果',r:(S,R)=>{const v=(S.vote||0)+S.rep*.45+supporters(S).length*4+(R()*16-8);const win=v>=polNeed(S);
   return win?{t:S.f.office==='council'?`你以第三高票當選市議員。\n\n鐵皮屋裡的人都在尖叫。你走到外面，橋下有幾個人在鋪紙板，他們不知道今天選了什麼。你走過去，蹲下來，跟他們說了一聲：「我選上了。」\n\n其中一個說：「喔。那你明天還會來嗎？」`:`你以兩百一十七票之差，贏了陳萬福。\n\n他打電話來恭喜你，聲音很沙啞：「水溝的事，就交給你了。」`,set:{polWon:1,polDone:1},rep:12,mind:12,log:S.f.office==='council'?'當選市議員':'當選里長'}
   :{t:`你輸了。差了${S.f.office==='council'?'四千多':'三百多'}票。\n\n你在鐵皮屋裡坐到所有人都走了。最後一個走的是${supporters(S)[0]||'一個志工'}，他拍拍你的肩膀，沒有說話。`,set:{polLost:1,polDone:1},mind:-10,log:'選舉落選'}}}]},
pol_term:{scene:S=>S.f.office==='council'?'office':'bridge',tod:'day',skip:S=>!F(S,'polWon'),title:S=>S.f.office==='council'?'都更案':'連署',
 text:S=>S.f.office==='council'?'一間建設公司的董事長約你吃飯，在一間看得到一○一的餐廳。\n\n「萬華那塊河岸地的都更案，下個月要進議會。」他推過來一個紙袋。「三百萬，你只要投贊成票。」\n\n那塊河岸地，就是你以前睡過的那座橋下。都更以後，那裡會蓋一棟豪宅。':'里民們連署要求，把橋下的街友「請走」。連署書上有四百多個名字，說他們「影響市容、治安不好、小孩不敢經過」。\n\n帶頭連署的，是那天叫你出來選的賣菜阿嬸。\n\n橋下現在睡著十幾個人。其中一個，是你剛上街時，分你半個麵包的人。',
 ch:[
  {t:'收下，投贊成票',show:S=>S.f.office==='council',r:{t:'你投了贊成票。豪宅預售的時候，廣告上寫著「河岸第一排，尊榮生活」。\n\n橋下的人被清走那天，你在議會開會。',money:300000,con:-18,heat:2,set:{polDirty:1,bribed:1},log:'收了建商的錢，投下都更贊成票'}},
  {t:'不收，在議會公開這件事',show:S=>S.f.office==='council',r:{t:'你在質詢台上，把紙袋放在桌上。全場安靜了五秒，然後所有的鏡頭都轉向你。\n\n都更案被退回了。你多了一個很有錢的敵人。',rep:14,con:10,set:{polClean:1},log:'在議會揭發建商行賄'}},
  {t:'不收，但拿都更案去換社宅名額',show:S=>S.f.office==='council',req:{rep:55},r:{t:'你跟建商談了三個月。都更案過了，但豪宅旁邊，多了一棟有一百戶的社會住宅，其中三十戶保留給脫離街頭的人。\n\n有人說你妥協了。你說，三十戶，就是三十個不用睡橋下的人。',rep:8,con:2,set:{polDeal:1},log:'用都更案換到三十戶社宅'}},
  {t:'站在橋下的人這邊，拒絕驅離',show:S=>S.f.office==='li',r:{t:'你在里民大會上說：「他們也是里民。」台下有人噓你，賣菜阿嬸當場撕了你的競選小卡。\n\n但那年冬天，橋下沒有一個人被趕走。',con:10,rep:-6,set:{polClean:1}}},
  {t:'依里民的意見，請市府驅離',show:S=>S.f.office==='li',r:{t:'清潔隊來的那天，你站在橋上看。分你半個麵包的那個人，看到你，認出你了。他沒有說話。',con:-16,rep:6,set:{polDirty:1},log:'當里長後同意驅離橋下的人'}},
  {t:'辦一場協調會，讓里民和街友坐下來談',show:S=>S.f.office==='li',req:{rep:45},r:{t:'協調會吵了三個小時。最後的結論是：橋下裝路燈、設一個流動廁所，社福中心每週來兩次。\n\n賣菜阿嬸說：「好啦，至少有燈。」',rep:8,con:6,set:{polClean:1},log:'辦了里民與街友的協調會'}}
 ]}
});
ins(5,'r_school2','pol_offer');ins(5,'w5_side','pol_canvass');ins(5,'x5_article','pol_smear');ins(5,'w5_cart','pol_buy');ins(5,'b5_winter','pol_vote');ins(6,'@c6','pol_term');
{const A0=apply;apply=function(S,r){if(r&&r.vote)S.vote=(S.vote||0)+r.vote;return A0(S,r)}}
Object.assign(ENDINGS,{
 councilor:{name:'議員',req:'從橋下選上市議員，沒有拿不該拿的錢',tier:5},
 blackgold:{name:'黑金',req:'選上市議員，但買了票、收了錢',tier:5},
 lizhang:{name:'里長伯',req:'選上里長，守著一個里',tier:4},
 lost_election:{name:'落選',req:'出來選了，然後輸了',tier:2},
 indicted:{name:'賄選',req:'選上了，但買票被查到',tier:0}
});
Object.assign(EXT_END,{
 councilor:S=>`你的議員研究室在市議會七樓，窗戶看得到萬華。你在桌上放了一張很舊的紅紙，上面寫著「不收街友」。\n\n${F(S,'polDeal')?'那三十戶社宅落成的時候，你去剪綵。第一個拿到鑰匙的人，是以前睡在你隔壁柱子的阿伯。他拿著鑰匙，問你：「真的可以關門嗎？」':F(S,'polClean')?'你在議會質詢了十幾次街友政策。每次質詢，台下都坐著幾個以前睡同一座橋的人，他們是你請來的。':'你在議會裡學會了很多事：怎麼質詢、怎麼協商、怎麼在鏡頭前面笑。'}\n\n每週五晚上，你還是會提著熱豆漿，去橋下走一圈。助理說這很危險。你說，這才是你的選區。`,
 blackgold:S=>`你選上了。慶功宴辦在一間五星級飯店，三重的人坐在主桌，${F(S,'bribed')?'建設公司的董事長':'那位退休的議員'}在台上致詞，說你是「萬華之光」。\n\n你的研究室裡掛著很多匾，都是別人送的。你的質詢稿，都是別人寫的。\n\n有一天，你在議會的走廊上看到一份陳情書，是橋下的人寫的，請求「不要都更」。你看了很久，然後把它交給助理：「歸檔。」`,
 lizhang:S=>`里辦公處在一棟老公寓的一樓，門口有一張藤椅。你每天早上坐在那裡，處理路燈、水溝、鄰居吵架，還有一些別人不想管的事。\n\n${F(S,'polClean')?'橋下裝了路燈。社福中心的人每週二、五會來。冬天，你在里辦公處放了一箱睡袋，誰需要誰拿。':F(S,'polDirty')?'橋下沒有人了。里民說治安變好了。你有時候晚上經過那裡，覺得太安靜。':'你做得不算好，也不算差。'}\n\n里民叫你「里長伯」。你第一次聽到的時候，想起老鄭。`,
 lost_election:S=>`你輸了。競選總部的鐵皮屋拆掉那天，你一個人把看板一片一片拔下來。\n\n欠的錢，你花了很久才還完。但你走過的那些巷子，到現在還有人叫你的名字。賣菜的阿嬸會多給你一把蔥；橋下的人看到你，會說：「候選人，來坐。」\n\n下一屆選舉，有人問你還要不要出來。你說，再說吧。`,
 indicted:S=>`當選後的第三個月，檢調帶著搜索票進了你的服務處。樁腳的名單上，每一個數字旁邊，都有你的名字。\n\n法院判你當選無效，加上三年六個月。\n\n你被帶走的那天，記者擠滿了服務處門口。你看到人群後面，有一個你在橋下認識的人。他沒有擠進來，只是遠遠地看著，然後轉身走了。`
});
{const T0=tenYears;tenYears=function(S,key){const out=T0(S,key);const A=AGE[S.origin]+12;
 const Y={councilor:`你 ${A} 歲了。你連任了兩屆。第三屆，你沒有再選，把位子讓給了一個你在社福中心認識的年輕社工。`,blackgold:`你 ${A} 歲了。你是議會裡最資深的議員之一。你已經想不起來，你第一次睡在台北車站時，身上剩多少錢。`,lizhang:`你 ${A} 歲了，連任了三屆里長。里辦公處門口的藤椅換過一次，你坐壞的。`,lost_election:`你 ${A} 歲了。你沒有再選。但每次選舉，都有候選人來找你，說想「請教萬華的事」。`,indicted:`你 ${A} 歲了。出獄後，你在一間便當店洗碗。老闆不知道你以前是誰，也不想知道。`};
 if(Y[key])out[0]=Y[key];return out}}
