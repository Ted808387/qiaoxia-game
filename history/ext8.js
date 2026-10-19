
/* ═════════ 修正：搬離橋下之後，事件要知道你住哪 ═════════ */
const housed=S=>isRoom(S)||S.house==='bed'||S.house==='shelter'||S.house==='yard';
{const e=EV.fz_zheng_daughter;const t0=e.text;
 e.text=S=>housed(S)?t0(S).replace('一個三十歲左右的女人在橋下問人','你回橋下看老鄭的時候，一個三十歲左右的女人正在問人').replace('老鄭就在你旁邊的帆布裡','老鄭就在旁邊的帆布裡'):t0(S);
 const c=e.ch.find(x=>x.t==='帶她過去');const r0=c.r;c.r=S=>housed(S)?{...r0,t:r0.t.replace('他走之前，把他睡的位置讓給你。','他走之前，把那條陪了他七年的毯子塞給你：「你現在用不到了。留著，提醒你自己從哪裡來。」')}:r0;
 const c2=e.ch.find(x=>x.t==='說你沒看過這個人');const r2=c2.r;c2.r=S=>housed(S)?{...r2,t:'她謝謝你，走了。你回頭看老鄭的帆布，它一直沒有動。那天晚上你回到房間，很久都睡不著。'}:r2;}
{const q=EV.q_bridge.ch;const c=q.find(x=>x.t==='整理你的紙板和帆布');c.show=S=>!housed(S);
 q.push({t:'幫還睡在這裡的人整理帆布',show:housed,r:{t:'你幫一個老人把漏水的帆布重新綁好。他問你：「你以前也睡這裡喔？」你說對。他說：「那你現在好嗎？」',con:2,rep:2,mind:2}});}
{const f=FILL.find(x=>x.id==='f_dog2');const c0=f.cond;f.cond=S=>c0(S)&&!housed(S);}
{const e=EV.i_settle;const c=e.ch.find(x=>x.t==='把你的位置分他一半');c.t=S=>housed(S)?'讓他來你的房間打幾天地鋪':'把你的位置分他一半';const r0=c.r;c.r=S=>housed(S)?{...r0,t:'你讓他在你三坪的房間打地鋪。他睡在地上，一直說不好意思。\n\n那幾天晚上，他講了很多話，大部分是在道歉。一個禮拜後，他找到一個床位，搬走了。'}:r0;}
{const t0=legacyText;legacyText=function(S){const t=t0(S);return housed(S)?t.replace('一個剛出獄的人坐在你旁邊的紙板上。','你經過橋下的時候，一個剛出獄的人叫住你。'):t};
 const c0=legacyChoice;legacyChoice=function(S,i){const t=c0(S,i);return housed(S)&&t==='把你的位置分他一半'?'讓他來你的房間睡一晚':t};}
{const c=EV.p3_scam.ch.find(x=>x.t==='假裝答應，偷偷報警');const r0=c.r;c.r=(S,R)=>{const r=r0(S,R);return housed(S)?{...r,t:r.t.replace('第二天，你的紙板被人用刀劃爛了。','第二天，你的房門上被人用刀劃了一道。')}:r};}
{const c=EV.fz_wang_rent.ch.find(x=>x.t==='沒辦法');const r0=c.r;c.r=S=>housed(S)?{...r0,t:r0.t.replace('走之前在你的紙板上放了一個便當。','走之前在你的房門口放了一個便當。')}:r0;}
{const t0=EV.t_student.text;EV.t_student.text=S=>housed(S)?t0(S).replace('凌晨，手電筒照在你臉上。一個年輕的員警在做街友訪查。','你回橋下送東西給以前的鄰居，凌晨，手電筒照在你臉上。一個年輕的員警在做街友訪查。'):t0(S);}
{const P1=people;people=function(S){const out=P1(S);out.forEach(p=>{if(p.status==='公司倒了，睡在你旁邊。')p.status=housed(S)?'公司倒了，你收留過他。':p.status});return out}}
