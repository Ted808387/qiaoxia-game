
/* ═════════ 修正：工作顯示、換工作提示、兼差上限 ═════════ */
let CUR=null;
const SIDE={f1_guitar:['地下道賣唱','gig'],f2_redeem:['地下道賣唱','gig'],f3_busk:['街頭藝人演出','gig'],t_letters:['代寫文件','gig'],t_class:['識字班鐘點費','gig'],i_son:['志豪跟著你做工','gig'],i_settle:['黃老闆的分期賠償','income'],t_scam:['車手家屬每月還款','income']};
function sideOf(id,t){if(id==='w5_side')return /外送/.test(t)?['晚上跑外送','gig']:['代收包裹','gig'];if(id==='c6_start')return /更生/.test(t)?['更生方案每月 8,000','cost']:['爸爸的看護費','cost'];return SIDE[id]||['其他收入','income']}
const MAXGIG=2;
{const C0=choose;choose=function(S,id,i,R){const v=choiceList(S,EV[id])[i];CUR={id,t:v?String(val(v.c.t,S)):''};try{return C0(S,id,i,R)}finally{CUR=null}}}
{const A0=apply;apply=function(S,r){
 const before=S.job?S.job.name:null;
 if(r&&r.addInc&&!r._sided){S.side=S.side||[];const [name,kind0]=CUR?sideOf(CUR.id,CUR.t):['其他收入','income'];const kind=r.addInc<0?'cost':kind0;
  const same=S.side.find(x=>x.name===name);
  if(same&&kind==='gig'){r={...r,addInc:0,_sided:1}}
  else{S.side.push({name,inc:r.addInc,kind});
   const gigs=S.side.filter(x=>x.kind==='gig');
   if(kind==='gig'&&gigs.length>MAXGIG){const drop=gigs[0];S.side=S.side.filter(x=>x!==drop);S.extra=(S.extra||0)-drop.inc;S.notices=(S.notices||[]).concat(`你沒有時間同時做那麼多事，「${drop.name}」只好停了。兼差最多兩份。`);S.log.push({day:S.day,t:`停掉了兼差「${drop.name}」`})}
   r={...r,_sided:1};
   if(kind==='gig')S.notices=(S.notices||[]).concat(`多了一份兼差：「${name}」，每天約 +${r.addInc}。`)}}
 const out=A0(S,r);
 const after=S.job?S.job.name:null;
 if(before!==after&&!(S.biz&&S.job&&S.job.biz&&before&&before.indexOf(S.biz.name)===0)){S.notices=(S.notices||[]).concat(after?(before?`換了工作：「${before}」→「${after}」`:`有工作了：「${after}」`):`你現在沒有工作了（原本是「${before}」）。`)}
 return out}}
function jobInfo(S){const side=(S.side||[]).map(x=>({...x}));const known=side.reduce((a,x)=>a+x.inc,0);if((S.extra||0)!==known&&S.extra)side.push({name:'其他收入',inc:(S.extra||0)-known,kind:'income'});
 return {job:S.job?{name:S.job.name,income:S.job.income,stable:!!S.job.biz||STABLE.test(S.job.name),biz:!!S.job.biz,meals:!!S.job.meals}:null,side}}
function takeNotices(S){const n=S.notices||[];S.notices=[];return n}
{const T0=takeJob;takeJob=function(S,key){return T0(S,key)}}
{const Q0=quitJob;quitJob=function(S){const n=S.job&&S.job.name;const r=Q0(S);if(r)S.notices=(S.notices||[]).filter(x=>!/沒有工作了/.test(x)).concat(`你辭掉了「${n}」。現在沒有正職。`);return r}}
