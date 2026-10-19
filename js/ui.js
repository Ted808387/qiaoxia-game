/* ───────── 介面 ───────── */
const $=s=>document.querySelector(s);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let S=null,cur=null,phase='intro',typing=null,timerId=null,selDiff='street';
const SAVE='qiaoxia.save.v10',DONE='qiaoxia.endings.v1',LAST='qiaoxia.last.v1',DIFFK='qiaoxia.diff';
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const STAT=[['hp','健康','var(--brick)'],['mind','精神','var(--steel)'],['con','良知','var(--paper)'],['rep','人脈','var(--sodium)'],['addict','酒癮','var(--olive)']];
const CHSCENE={1:['station','night'],2:['temple','dusk'],3:['alley','day'],4:['river','dusk'],5:['market','night'],6:['ximen','night']};

function buildHud(){
 $('#ladder').innerHTML=G.STAGES.map((s,i)=>`<div class="rung" data-i="${i}"><i></i><span>${s}</span></div>`).join('');
 $('#stats').innerHTML=STAT.map(([k,l,c])=>`<div class="stat" data-k="${k}"><div class="row"><span>${l}</span><em>0</em></div><div class="bar"><i style="background:${c}"></i></div></div>`).join('')+`<div class="stat money" data-k="money"><span class="cash">NT$ 0</span><span class="sub"></span></div>`;
}
function hud(){
 if(!S)return;
 const st=G.stageOf(S);
 document.querySelectorAll('.rung').forEach(r=>{const i=+r.dataset.i;r.classList.toggle('on',i<=st);r.classList.toggle('now',i===st)});
 $('#goal').innerHTML=`<b>${G.STAGES[st]}</b> · ${G.goalText(S)}`;
 for(const [k] of STAT){const el=document.querySelector(`.stat[data-k="${k}"]`);const v=Math.round(S[k]);el.querySelector('em').textContent=v;el.querySelector('.bar i').style.width=v+'%'}
 const m=document.querySelector('.stat.money');m.querySelector('.cash').textContent='NT$ '+S.money.toLocaleString();
 m.querySelector('.sub').textContent=S.biz?`身價 ${G.worth(S).toLocaleString()}${S.loan?` · 欠 ${S.loan.left.toLocaleString()}`:''}`:`日收入約 ${((S.job?S.job.income:0)+(S.extra||0)).toLocaleString()}`;
 {const ji=G.jobInfo(S);const gigs=ji.side.filter(x=>x.kind==='gig'),other=ji.side.filter(x=>x.kind!=='gig');
  $('#jobline').innerHTML=`<span class="jl"><b>${ji.job?(ji.job.biz?'經營':'正職'):'正職'}</b>${ji.job?`${esc(ji.job.name)} <em>${ji.job.income}/天</em> <small class="${ji.job.stable?'st':'un'}">${ji.job.biz?'收入浮動':ji.job.stable?'固定班':'不一定有工'}</small>`:'<i>沒有工作</i>'}</span>`+
   `<span class="jl"><b>兼差</b>${gigs.length?gigs.map(x=>`${esc(x.name)} <em>+${x.inc}</em>`).join('、'):'<i>無</i>'}<small class="cap">${gigs.length}/2</small></span>`+
   (other.length?`<span class="jl"><b>其他</b>${other.map(x=>`${esc(x.name)} <em>${x.inc>0?'+':''}${x.inc}</em>`).join('、')}</span>`:'')}
 flushNotices();
 const hl={room:'雅房',room_sub:'雅房（補助）',bed:'旅社床位',shelter:'收容中心',yard:'回收場角落'}[S.house]||'露宿';
 const net=S.sharedNet?`<span><i class="${S.netHp||S.netMind?'used':''}"></i>共用安全網</span>`:`<span><i class="${S.netHp?'used':''}"></i>健康網</span><span><i class="${S.netMind?'used':''}"></i>精神網</span>`;
 $('#nets').innerHTML=`${net}<span>住：${hl}</span><span>方針：${G.MODES[S.mode||'normal'].name}</span>${S.f.noID?'<span>沒有身分證</span>':''}${S.biz?`<span>${esc(S.biz.name)} · ${G.BIZ[S.biz.type].lv[S.biz.lvl]}</span>`:''}`;
 $('#date').textContent=`${G.dateStr(S.day)} · ${G.season(S.day)} · 第 ${S.day} 天 · ${G.DIFF[S.diff].name}`;
}
let toastT=null;
function flushNotices(){if(!S)return;const n=G.takeNotices(S);if(!n.length)return;const t=$('#toast');t.innerHTML=n.map(x=>`<p>${esc(x)}</p>`).join('');t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),5200)}
function floats(delta){
 let big=false;
 for(const k in delta){const d=delta[k];const el=document.querySelector(`.stat[data-k="${k}"]`);if(!el)continue;const f=document.createElement('span');const good=k==='addict'?d<0:d>0;f.className='float '+(good?'up':'down');f.textContent=(d>0?'+':'')+(k==='money'?d.toLocaleString():d);el.appendChild(f);setTimeout(()=>f.remove(),1700);if(k==='hp'&&d<=-5)big=true}
 if(big){Scene.hit();if(!RM){const g=$('#game');g.classList.remove('hit');void g.offsetWidth;g.classList.add('hit')}}
}
function paras(s){return s.split('\n\n').filter(Boolean)}
function type(el,text,done){
 el.innerHTML='';const ps=paras(text).map(t=>{const p=document.createElement('p');el.appendChild(p);return {p,t}});
 if(RM){ps.forEach(x=>x.p.textContent=x.t);done&&done();return}
 let pi=0,ci=0;
 const finish=()=>{clearInterval(typing.id);ps.forEach(x=>x.p.textContent=x.t);typing=null;done&&done()};
 typing={finish,id:setInterval(()=>{if(pi>=ps.length)return finish();const x=ps[pi];ci+=2;x.p.textContent=x.t.slice(0,ci);if(ci>=x.t.length){pi++;ci=0}},22)};
}
$('#story').addEventListener('click',e=>{if(typing&&!e.target.closest('button'))typing.finish()});
function scrollDown(){const s=$('#story');s.scrollTop=s.scrollHeight}
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}$('#choices').classList.remove('urgent')}
function sceneOpts(v){const st=G.stageOf(S);return {season:G.season(S.day),stage:st,hat:!!(S.job&&/工地|工班|工頭|包商|工程|綁鐵/.test(S.job.name)),tod:v.tod,npc:v.npc,weather:v.weather,dog:!!S.f.dog,look:{bag:st===0,guitar:!!S.f.busk&&!S.f.guitarPawn&&!S.f.guitarLost}}}

function showEvent(id){
 stopTimer();cur=id;phase='event';save();
 const v=G.view(S,id);
 Scene.set(v.scene,sceneOpts(v));
 $('#loc').textContent=v.loc;
 $('#chl').textContent=`${G.CH[S.ch].num} · ${G.CH[S.ch].name}`;
 $('#title').textContent=v.title;$('#outcome').innerHTML='';$('#upkeep').innerHTML='';$('#choices').innerHTML='';
 $('#story').scrollTop=0;hud();
 type($('#text'),v.text,()=>renderChoices(v));
}
const NUM=['一','二','三','四','五','六'];
function renderChoices(v){
 const box=$('#choices');box.innerHTML='';
 if(v.timer){const tm=document.createElement('div');tm.className='timer';tm.innerHTML=`<span>來不及想了</span><i style="--dur:${v.timer}s"></i><b>${v.timer}</b>`;box.appendChild(tm);box.classList.add('urgent')}
 v.choices.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='choice';b.style.animationDelay=(i*70)+'ms';b.disabled=!c.ok;
  b.innerHTML=`<span class="n">${NUM[i]||i+1}</span><span><span class="t"></span>${c.reqs.length?`<span class="reqs">${c.reqs.map(r=>`<span class="req ${r.ok?'ok':'no'}">${r.ok?'':'✕ '}${r.l}</span>`).join('')}</span>`:''}</span>`;
  b.querySelector('.t').textContent=c.t;b.addEventListener('click',()=>pick(i));box.appendChild(b)});
 const h=document.createElement('div');h.className='hint';h.textContent=v.timer?`${v.timer} 秒內不選，你會被情勢推著走`:'按數字鍵也可以選擇 · 標紅的是還沒達到的門檻';box.appendChild(h);
 if(v.timer){let left=v.timer;const lab=box.querySelector('.timer b');timerId=setInterval(()=>{left--;if(lab)lab.textContent=Math.max(0,left);if(left<=0){stopTimer();pick(v.panic,true)}},1000)}
 setTimeout(scrollDown,60);
}
function pick(i,forced){
 if(phase!=='event')return;
 stopTimer();
 const res=G.choose(S,cur,i);if(!res)return;
 if(res.mini){startMini(res.mini);return}
 phase='outcome';save();
 $('#choices').innerHTML='';
 floats(res.delta);hud();
 const after=()=>{
  if(res.up)$('#upkeep').innerHTML=upText(res.up);
  const b=document.createElement('button');b.type='button';b.className='go';b.textContent=res.end?'看結局':'繼續';b.addEventListener('click',next);$('#choices').appendChild(b);b.focus({preventScroll:true});
  setTimeout(scrollDown,60);
 };
 const txt=(forced?'你還沒想好，事情就發生了。\n\n':'')+(res.text||'');
 if(txt.trim())type($('#outcome'),txt,after);else after();
 setTimeout(scrollDown,60);
}
function upText(u){
 const bits=[`這 ${u.days} 天`];
 if(u.inc)bits.push(u.inc>0?`收入 +${u.inc.toLocaleString()}`:`生意虧損 −${(-u.inc).toLocaleString()}`);
 if(u.food)bits.push(`吃飯 −${u.food.toLocaleString()}`);
 if(u.rent)bits.push(`住宿 −${u.rent.toLocaleString()}`);
 if(u.drink)bits.push(`喝酒 −${u.drink.toLocaleString()}`);
 if(u.loan)bits.push(`還債 −${u.loan.toLocaleString()}`);
 if(u.misc)bits.push(`雜支 −${u.misc.toLocaleString()}`);
 const dh=Math.round(u.dhp),dm=Math.round(u.dmind);
 if(dh)bits.push(`健康 ${dh>0?'+':''}${dh}`);if(dm)bits.push(`精神 ${dm>0?'+':''}${dm}`);
 let s=bits.join(' · ');
 if(u.idle)s+=`<br>有 ${u.idle} 天沒排到工作。`;
 if(u.free)s+=`<br><span class="warn">有 ${u.free} 天沒錢吃飯，只能去排免費餐。</span>`;
 if(u.lostItem)s+=`<br><span class="warn">「${esc(u.lostItem)}」被偷了。</span>`;
 if(u.stolen)s+=`<br><span class="warn">你藏在身上的錢被偷了 ${u.stolen.toLocaleString()} 元。睡在外面，錢放身上不安全。</span>`;
 if(u.shock)s+=`<br><span class="warn">${u.shockWhat}，花掉 ${u.shock.toLocaleString()} 元。</span>`;
 if(u.evicted)s+=`<br><span class="warn">付不出住宿費，你又回到街上了。</span>`;
 return s;
}
function next(){
 if(!S||!['outcome','chapter','intro'].includes(phase))return;
 stopTimer();
 const a=G.advance(S);
 if(a.type==='chapter')showChapter(a);
 else if(a.type==='map')showMap();
 else if(a.type==='end')showEnding(a.key);
 else showEvent(a.id);
}
function showChapter(a){
 phase='chapter';save();hud();
 const c=G.CH[a.ch],sc=CHSCENE[a.ch];
 Scene.set(sc[0],{season:G.season(S.day),stage:G.stageOf(S),tod:sc[1],dog:!!S.f.dog,look:{bag:G.stageOf(S)===0}});
 $('#chSign').innerHTML=`<div><div class="k">${c.num}</div><div class="big">${c.name}</div><div class="s">${c.line}</div></div>`;
 $('#chSign').style.animation='none';void $('#chSign').offsetWidth;$('#chSign').style.animation='';
 $('#chMem').textContent=G.memory(S,a.ch);
 $('#chGap').innerHTML=(a.up?`時間過去了。${upText(a.up)}`:`${G.dateStr(S.day)} · 你的身分：${G.STAGES[G.stageOf(S)]}`)+(a.ch===1&&S.card?`<br>你帶著：${G.CARDS[S.card].name}。${S.cardNote||''}`:'');
 $('#chWorld').innerHTML=a.ch===1?`<span class="sect">這兩年的台北</span><div class="tags">${S.world.map(k=>`<span class="tagw"><b>${G.WORLD[k].name}</b>${G.WORLD[k].desc}</span>`).join('')}</div>`:'';
 $('#chModes').innerHTML=Object.entries(G.MODES).map(([k,m],i)=>`<button type="button" class="mode ${S.mode===k?'on':''}" data-k="${k}"><b>${i+1} · ${m.name}</b><span>${m.desc}</span></button>`).join('');
 document.querySelectorAll('#chModes .mode').forEach(b=>b.addEventListener('click',()=>{S.mode=b.dataset.k;$('#chapter').hidden=true;hud();next()}));
 $('#chapter').hidden=false;$('#chapter').scrollTop=0;
 const on=document.querySelector('#chModes .mode.on');(on||document.querySelector('#chModes .mode')).focus({preventScroll:true});
}


/* ───────── 萬華地圖 ───────── */
const PINS={station:[468,52],ximen:[372,104],site:[300,150],market:[236,196],temple:[300,214],park:[352,250],bridge:[122,236],yard:[226,356],office:[402,318]};
const MAPSVG=`<svg class="mapsvg" viewBox="0 0 560 420" role="img" aria-label="萬華地圖">
 <defs><pattern id="mgrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="var(--line)" stroke-width=".5" opacity=".5"/></pattern></defs>
 <rect width="560" height="420" fill="var(--bg)"/><rect width="560" height="420" fill="url(#mgrid)"/>
 <path d="M70 0 C 40 80, 96 150, 70 230 S 40 360, 86 420 L 0 420 L 0 0 Z" fill="#14202b"/>
 <path d="M70 0 C 40 80, 96 150, 70 230 S 40 360, 86 420" fill="none" stroke="#2b4558" stroke-width="2"/>
 <text x="22" y="190" class="mlab river" transform="rotate(-80 22 190)">淡水河</text>
 <g class="roads" fill="none" stroke="#353c43" stroke-linecap="round">
  <path d="M96 0 C 70 80, 118 150, 98 230 S 72 360, 110 420" stroke-width="5"/>
  <path d="M96 120 H 540" stroke-width="4"/><path d="M96 280 H 540" stroke-width="5"/><path d="M110 330 H 520" stroke-width="3"/>
  <path d="M228 0 V 420" stroke-width="4"/><path d="M300 60 V 420" stroke-width="3"/><path d="M430 0 V 420" stroke-width="5"/>
  <path d="M260 280 L 200 420" stroke-width="4"/><path d="M330 0 L 380 120" stroke-width="3"/>
 </g>
 <path d="M446 0 V 420" stroke="#4a4f55" stroke-width="2" stroke-dasharray="8 6"/>
 <text x="104" y="114" class="mlab">長沙街</text><text x="104" y="274" class="mlab">和平西路</text><text x="234" y="16" class="mlab">西園路</text><text x="436" y="16" class="mlab">中華路</text><text x="214" y="404" class="mlab">萬大路</text><text x="306" y="400" class="mlab">康定路</text>
 <g id="pins"></g>
</svg>`;
function showMap(){
 phase='map';save();hud();
 const info=G.mapInfo(S);
 $('#mapHead').innerHTML=`<span class="sect">第 ${S.day} 天 · ${G.CH[S.ch].num}</span><h2 class="mtitle">這幾天，你要去哪裡？</h2><p class="mhelp">每一次出門，會過掉 ${G.CH[S.ch].days} 天。有<b class="dot hot"></b>的地方，有人在找你；有<b class="dot danger"></b>的地方，可能有麻煩。</p>`;
 if(!$('#mapSvg').innerHTML)$('#mapSvg').innerHTML=MAPSVG;
 $('#pins').innerHTML=info.map(L=>{const [x,y]=PINS[L.key];return `<g class="pin ${L.open?'':'off'} ${L.story?'hot':''} ${S.lastLoc===L.key?'here':''}" data-k="${L.key}" transform="translate(${x} ${y})" tabindex="-1">${L.story?'<circle class="ring" r="14"/>':''}<circle class="dot0" r="7"/>${L.danger?'<circle class="dng" cx="8" cy="-8" r="3.5"/>':''}<text class="plab" x="12" y="4">${L.name}</text></g>`}).join('');
 $('#mapCards').innerHTML=info.map(L=>`<div class="lcard ${L.open?'':'off'} ${L.story?'hot':''}" id="lc_${L.key}">
   <div class="lhead"><h3>${L.name}</h3>${L.story?'<span class="tg hot">有人在找你</span>':''}${L.danger?'<span class="tg danger">麻煩</span>':''}</div>
   <p>${L.open?L.desc:'你還不知道這個地方能幫你什麼。'}</p>
   ${(()=>{if(!L.open)return '';const pp=G.npcsAt(S,L.key);const names=pp.map(x=>x.name);const other=L.npcs.filter(n=>!names.includes(n));return (pp.length?`<div class="lppl"><span>去找：</span>${pp.map(x=>`<button type="button" class="npcb" data-n="${x.id}" data-k="${L.key}">${x.name}${tbar(x.trust)}${x.owe?'<small>欠錢</small>':''}</button>`).join('')}</div>`:'')+(other.length?`<p class="npcs">也常在這裡：${other.join('、')}</p>`:'')})()}
   <div class="lbtns">${L.open?`<button type="button" class="lgo" data-k="${L.key}">去${L.name}</button>${L.mini?`<button type="button" class="lmini" data-k="${L.key}" data-g="${L.mini.game}">${L.mini.label}<small>小遊戲</small></button>`:''}${G.jobsAt(S,L.key).length?`<button type="button" class="ljob" data-k="${L.key}">找工作<small>${G.jobsAt(S,L.key).filter(j=>j.ok).length} 個可應徵</small></button>`:''}`:''}</div></div>`).join('');
 document.querySelectorAll('#mapCards .lgo').forEach(b=>b.addEventListener('click',()=>{$('#map').hidden=true;const id=G.visit(S,b.dataset.k);showEvent(id)}));
 document.querySelectorAll('#mapCards .ljob').forEach(b=>b.addEventListener('click',()=>showJobs(b.dataset.k)));
 document.querySelectorAll('#mapCards .npcb').forEach(b=>b.addEventListener('click',()=>showNpc(b.dataset.n,b.dataset.k)));
 document.querySelectorAll('#mapCards .lmini').forEach(b=>b.addEventListener('click',()=>{$('#map').hidden=true;S.lastLoc=b.dataset.k;startMini(b.dataset.g)}));
 document.querySelectorAll('#pins .pin').forEach(g=>g.addEventListener('click',()=>{const c=$('#lc_'+g.dataset.k);if(c){c.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'});c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash');const b=c.querySelector('button');b&&b.focus({preventScroll:true})}}));
 const sc={station:'station',ximen:'ximen',site:'site',market:'market',temple:'temple',park:'park',bridge:'bridge',yard:'yard',office:'office'}[S.lastLoc]||'bridge';
 Scene.set(sc,{season:G.season(S.day),stage:G.stageOf(S),tod:'dusk',dog:!!S.f.dog,look:{bag:G.stageOf(S)===0}});
 $('#loc').textContent=G.LOC[sc]||'萬華';
 $('#map').hidden=false;$('#map').scrollTop=0;
 const f=document.querySelector('#mapCards .hot .lgo')||document.querySelector('#mapCards .lgo');f&&f.focus({preventScroll:true});
}

/* ───────── 小遊戲 ───────── */
let miniGame=null,miniCleanup=null;
function startMini(game){
 phase='mini';miniGame=game;save();
 const cfg=G.miniSetup(S,game);
 const sc={scale:'yard',hawk:'market',cold:'bridge'}[game];
 Scene.set(sc,{season:G.season(S.day),stage:G.stageOf(S),tod:'night',weather:game==='cold'?'rain':null,dog:!!S.f.dog,look:{bag:G.stageOf(S)===0}});
 $('#loc').textContent=G.LOC[sc];
 $('#miniIn').innerHTML='';$('#mini').hidden=false;$('#mini').scrollTop=0;
 const done=res=>{if(miniCleanup){miniCleanup();miniCleanup=null}endMini(game,res)};
 ({scale:runScale,hawk:runHawk,cold:runCold})[game](cfg,done);
}
function endMini(game,res){
 const out=G.finishMini(S,game,res);miniGame=null;
 $('#mini').hidden=true;phase='outcome';save();
 $('#chl').textContent=`${G.CH[S.ch].num} · ${G.CH[S.ch].name}`;
 $('#title').textContent={scale:'磅秤',hawk:'叫賣',cold:'寒流夜'}[game];$('#text').innerHTML='';$('#choices').innerHTML='';$('#upkeep').innerHTML='';$('#story').scrollTop=0;
 floats(out.delta);hud();
 type($('#outcome'),out.text,()=>{if(out.up)$('#upkeep').innerHTML=upText(out.up);const b=document.createElement('button');b.type='button';b.className='go';b.textContent='繼續';b.addEventListener('click',next);$('#choices').appendChild(b);b.focus({preventScroll:true});setTimeout(scrollDown,60)});
}

/* 磅秤 */
function runScale(cfg,done){
 const box=$('#miniIn');let i=0,acc={money:0,caught:0,missed:0,wrong:0,right:0,owner:cfg.owner},tm=null;
 const MAX=8;
 const ang=kg=>-120+Math.min(kg,MAX)/MAX*240;
 const ticks=Array.from({length:17},(_,k)=>{const a=(-120+k*15)*Math.PI/180,big=k%2===0;const r1=big?70:75,r2=84;return `<line x1="${Math.sin(a)*r1}" y1="${-Math.cos(a)*r1}" x2="${Math.sin(a)*r2}" y2="${-Math.cos(a)*r2}" stroke="var(--paper)" stroke-width="${big?2:1}"/>${big?`<text x="${Math.sin(a)*58}" y="${-Math.cos(a)*58+4}" text-anchor="middle" class="dialn">${k/2}</text>`:''}`}).join('');
 const round=()=>{const r=cfg.rounds[i];
  box.innerHTML=`<span class="sect">萬大路回收場 · 第 ${i+1} / ${cfg.rounds.length} 袋</span><h2 class="mtitle">${cfg.owner?'你的磅秤':'看緊那台秤'}</h2>
  <p class="mhelp">${cfg.owner?'你是老闆，但秤是員工在看的。':'老闆把你的東西放上秤。'}先自己算一下應該有多重，再看秤上的數字。少了一成以上，就是被動過手腳。</p>
  <div class="scalewrap">
   <svg class="dial" viewBox="-100 -100 200 130" aria-hidden="true"><path d="M-92 18 A 92 92 0 1 1 92 18" fill="none" stroke="var(--line)" stroke-width="2"/>${ticks}<text y="-28" text-anchor="middle" class="dialn">公斤</text><g class="needle" id="needle" style="transform:rotate(-120deg)"><line x1="0" y1="8" x2="0" y2="-80" stroke="var(--brick)" stroke-width="2.5"/></g><circle r="6" fill="var(--paper)"/></svg>
   <div class="readout"><span>秤上顯示</span><b id="ro">— —</b><span>公斤</span></div>
  </div>
  <div class="item"><h3>${r.name}</h3><p>${r.hint}</p><p class="price">收購價：一公斤 ${r.price} 元</p></div>
  <div class="timer" id="stimer" hidden><span>老闆在等你</span><i style="--dur:${cfg.time}s"></i><b>${cfg.time}</b></div>
  <div class="mrow"><button class="choice2" id="sOk" disabled>秤得準，收錢</button><button class="choice2 warnb" id="sNo" disabled>${cfg.owner?'叫員工重秤':'少算了，叫他重秤'}</button></div>
  <div class="mres" id="sRes"></div>`;
  requestAnimationFrame(()=>{const n=$('#needle');n.style.transition=RM?'none':'transform 1.1s cubic-bezier(.3,1.6,.5,1)';n.style.transform=`rotate(${ang(r.shown)}deg)`});
  setTimeout(()=>{window.__amb&&window.__amb.sfx('clunk');$('#ro').textContent=r.shown.toFixed(2);$('#sOk').disabled=false;$('#sNo').disabled=false;$('#sOk').focus({preventScroll:true});
   const st=$('#stimer');st.hidden=false;let left=cfg.time;tm=setInterval(()=>{left--;const b=st.querySelector('b');if(b)b.textContent=Math.max(0,left);if(left<=0){clearInterval(tm);decide(false,true)}},1000)},RM?50:1200);
  $('#sOk').addEventListener('click',()=>decide(false));$('#sNo').addEventListener('click',()=>decide(true));
 };
 const decide=(protest,late)=>{clearInterval(tm);const r=cfg.rounds[i];$('#sOk').disabled=true;$('#sNo').disabled=true;$('#stimer').hidden=true;let msg,cls;
  if(r.rig&&protest){acc.caught++;acc.right++;acc.money+=r.kg*r.price;msg=`重秤一次：<b>${r.kg.toFixed(2)}</b> 公斤。${cfg.owner?'員工低下頭。':'老闆嘟囔著說秤「有時候會卡」。'}`;cls='good'}
  else if(r.rig){acc.missed++;acc.money+=r.shown*r.price;msg=`${late?'你還在算，老闆已經把錢塞給你了。':''}你後來才想到：應該有 <b>${r.kg.toFixed(2)}</b> 公斤。你被少算了 ${Math.round((1-r.shown/r.kg)*100)}%。`;cls='bad'}
  else if(protest){acc.wrong++;acc.money+=r.shown*r.price*.8;msg=`重秤一次，還是 <b>${r.shown.toFixed(2)}</b> 公斤。${cfg.owner?'員工覺得你不信任他。':'老闆把錢摔在桌上：「浪費我時間，扣兩成。」'}`;cls='bad'}
  else{acc.right++;acc.money+=r.shown*r.price;msg=`${late?'你沒開口，老闆就照秤付了錢。':''}這次秤得準。應該是 ${r.kg.toFixed(2)} 公斤。`;cls='good'}
  $('#sRes').innerHTML=`<p class="${cls}">${msg}</p><button class="go" id="sNext">${i+1<cfg.rounds.length?'下一袋':'結算'}</button>`;$('#sNext').focus({preventScroll:true});
  $('#sNext').addEventListener('click',()=>{i++;if(i<cfg.rounds.length)round();else done(acc)});
 };
 miniCleanup=()=>clearInterval(tm);
 round();
}

/* 叫賣 */
function runHawk(cfg,done){
 const box=$('#miniIn');
 box.innerHTML=`<span class="sect">華西街夜市 · ${cfg.own?'顧你的攤：'+esc(cfg.name):'幫河粉攤叫賣'}</span><h2 class="mtitle">叫賣</h2>
 <p class="mhelp">客人走進燈下的那一刻喊一聲：按空白鍵、點畫面，或按下面的按鈕。<b>戴紅帽的是警察</b>，他經過的時候不要喊。三十秒。</p>
 <div class="hawkwrap"><canvas id="hawkCv"></canvas><div class="hawkhud"><span id="hkScore">0 位客人</span><span id="hkCombo"></span><span id="hkTime">30</span></div></div>
 <div class="mrow"><button class="go big" id="hkStart">開始</button><button class="go big" id="hkShout" hidden>來喔！</button></div>`;
 const cv=$('#hawkCv'),c=cv.getContext('2d');let W2=0,H2=0;
 const fit=()=>{const r=cv.getBoundingClientRect();const d=Math.min(2,devicePixelRatio||1);W2=r.width;H2=r.height;cv.width=W2*d;cv.height=H2*d;c.setTransform(d,0,0,d,0,0)};fit();
 const TRAVEL=2.1,WIN=.16,PERF=.07;const notes=[];let t=1.6;const KINDS=[['伯','#c9b77a'],['學','#7f9bb3'],['侶','#c96f8a'],['客','#86a98f'],['姨','#d6a99a']];
 while(t<cfg.dur){const bpm=cfg.bpm0+(cfg.bpm1-cfg.bpm0)*(t/cfg.dur);const iv=60/bpm;if(Math.random()<.74){const cop=Math.random()<cfg.cop;notes.push({t,cop,k:KINDS[Math.floor(Math.random()*KINDS.length)],j:0});if(!cop&&Math.random()<.14&&t>8)notes.push({t:t+iv/2,cop:false,k:KINDS[Math.floor(Math.random()*KINDS.length)],j:0})}t+=iv}
 const total=notes.filter(n=>!n.cop).length;let st={hits:0,perfect:0,missed:0,cops:0,wild:0},combo=0,t0=0,running=false,raf=0,pops=[],flashR=0,flashG=0;
 const SH=['來喔！','好吃喔！','三份一百！','剛滷好的！','帥哥看一下！','阿姨來坐！','現煮的喔！','最後五份！'];
 const zone=()=>W2*.2,spd=()=>(W2-zone())/TRAVEL;
 const shout=()=>{if(!running)return;const now=(performance.now()-t0)/1000;let best=null,bd=9;for(const n of notes){if(n.j)continue;const d=Math.abs(n.t-now);if(d<=WIN&&d<bd){bd=d;best=n}}
  if(best&&!best.cop){best.j=1;st.hits++;window.__amb&&window.__amb.sfx('ding');combo++;if(bd<=PERF)st.perfect++;flashG=1;pops.push({txt:SH[Math.floor(Math.random()*SH.length)],x:zone(),y:H2*.3,a:1,g:bd<=PERF})}
  else if(best&&best.cop){best.j=2;st.cops++;window.__amb&&window.__amb.sfx('buzz');combo=0;flashR=1;pops.push({txt:'「你在喊什麼？」',x:zone(),y:H2*.3,a:1,bad:1})}
  else{st.wild++;combo=0;pops.push({txt:'……',x:zone(),y:H2*.35,a:.7,bad:1})}};
 const draw=()=>{const now=running?(performance.now()-t0)/1000:0;
  const g=c.createLinearGradient(0,0,0,H2);g.addColorStop(0,'#0f0c0e');g.addColorStop(1,'#241914');c.fillStyle=g;c.fillRect(0,0,W2,H2);
  for(let k=0;k<12;k++){const x=k/11*W2,y=H2*.12+Math.sin(k/11*Math.PI)*10;const gg=c.createRadialGradient(x,y,0,x,y,12);gg.addColorStop(0,'rgba(255,215,150,.9)');gg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gg;c.fillRect(x-12,y-12,24,24)}
  const gy=H2*.82;c.fillStyle='#16110e';c.fillRect(0,gy,W2,H2-gy);
  const zx=zone();const lg=c.createRadialGradient(zx,gy,0,zx,gy,H2*.7);lg.addColorStop(0,`rgba(255,180,90,${.35+flashG*.3})`);lg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=lg;c.fillRect(0,0,W2,H2);
  c.strokeStyle='rgba(233,163,62,.6)';c.setLineDash([4,4]);c.beginPath();c.moveTo(zx,H2*.22);c.lineTo(zx,gy);c.stroke();c.setLineDash([]);
  c.fillStyle='#2a1d16';c.fillRect(0,gy-H2*.28,zx*.75,H2*.28);c.fillStyle='#b8402e';c.fillRect(0,gy-H2*.33,zx*.8,H2*.05);c.fillStyle='rgba(255,230,190,.9)';c.font=`700 ${Math.max(11,H2*.07)}px "Noto Sans TC",sans-serif`;c.textAlign='center';c.fillText(cfg.own?cfg.name.slice(0,4):'河粉',zx*.38,gy-H2*.13);
  for(const n of notes){const x=zx+(n.t-now)*spd();if(x<-30||x>W2+30)continue;if(n.j===1)continue;const y=gy;const col=n.cop?'#2b3440':n.k[1];c.globalAlpha=n.j===2?.4:1;
   c.fillStyle=col;c.beginPath();c.arc(x,y-H2*.3,H2*.06,0,7);c.fill();c.fillRect(x-H2*.05,y-H2*.24,H2*.1,H2*.22);
   if(n.cop){c.fillStyle='#c9573f';c.fillRect(x-H2*.07,y-H2*.37,H2*.14,H2*.035);c.fillRect(x-H2*.05,y-H2*.4,H2*.1,H2*.04)}
   else{c.fillStyle='#14100e';c.font=`700 ${Math.max(10,H2*.065)}px "Noto Sans TC",sans-serif`;c.fillText(n.k[0],x,y-H2*.28)}
   c.globalAlpha=1;
   if(running&&!n.j&&now-n.t>WIN){n.j=3;if(!n.cop){st.missed++;combo=0}}}
  for(const p of pops){p.y-=40/60;p.a-=.018;c.globalAlpha=Math.max(0,p.a);c.fillStyle=p.bad?'#c9573f':p.g?'#f3c46a':'#e6dfcf';c.font=`700 ${Math.max(13,H2*.09)}px "Noto Sans TC",sans-serif`;c.fillText(p.txt,p.x+40,p.y)}c.globalAlpha=1;pops=pops.filter(p=>p.a>0);
  if(flashR>0){c.fillStyle=`rgba(201,87,63,${flashR*.3})`;c.fillRect(0,0,W2,H2);flashR=Math.max(0,flashR-.04)}flashG=Math.max(0,flashG-.06);
  $('#hkScore').textContent=`${st.hits} 位客人`;$('#hkCombo').textContent=combo>=3?`連續 ${combo}`:'';$('#hkTime').textContent=running?Math.max(0,Math.ceil(cfg.dur-now)):'30';
  if(running&&now>cfg.dur+TRAVEL*.3){running=false;cancelAnimationFrame(raf);done({...st,total,own:cfg.own,pay:cfg.pay,base:cfg.base});return}
  raf=requestAnimationFrame(draw)};
 const key=e=>{if(e.code==='Space'||e.key==='Enter'||e.key==='j'||e.key==='f'){e.preventDefault();e.stopPropagation();if(running)shout();else if(!$('#hkStart').hidden)$('#hkStart').click()}};
 window.addEventListener('keydown',key,true);
 cv.addEventListener('pointerdown',e=>{e.preventDefault();shout()});
 $('#hkShout').addEventListener('pointerdown',e=>{e.preventDefault();shout()});
 $('#hkStart').addEventListener('click',()=>{$('#hkStart').hidden=true;$('#hkShout').hidden=false;t0=performance.now();running=true;fit()});
 miniCleanup=()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener('keydown',key,true)};
 t0=performance.now();draw();$('#hkStart').focus({preventScroll:true});
}

/* 寒流夜 */
function runCold(cfg,done){
 const box=$('#miniIn');let r=0;const P=cfg.people.map(p=>({...p,wall:0,cb:0,bl:0,th:0,out:0}));const log=[];
 P[0].wall=1;P[0].cb=1;
 const used=k=>P.filter(p=>!p.out).reduce((a,p)=>a+p[k],0);
 const lim={wall:cfg.wall,cb:cfg.cardboard,bl:cfg.blanket,th:cfg.thermos};
 const wcol=w=>w>60?'var(--sodium)':w>35?'var(--olive)':w>15?'var(--steel)':'var(--brick)';
 const render=()=>{
  box.innerHTML=`<span class="sect">環河南路橋下 · 寒流夜</span><h2 class="mtitle">${cfg.hours[r]}　氣溫 ${[10,8,6,5][r]}°C</h2>
  <p class="mhelp">每個鐘頭重新分配一次。<b>牆邊</b>擋風（只有 ${cfg.wall} 個位置），<b>紙板</b>墊身體（共 ${cfg.cardboard} 張，一人最多兩張），<b>毯子</b>最保暖（${cfg.blanket} 條），<b>熱水</b>只夠給一個人喝一口。體溫歸零的人，撐不過今晚。老人比較怕冷，喝醉的人一開始不覺得冷。</p>
  <div class="res"><span>牆邊 ${cfg.wall-used('wall')} / ${cfg.wall}</span><span>紙板 ${cfg.cardboard-used('cb')} / ${cfg.cardboard}</span><span>毯子 ${cfg.blanket-used('bl')} / ${cfg.blanket}</span><span>熱水 ${cfg.thermos-used('th')} / ${cfg.thermos}</span></div>
  <div class="ppl">${P.map((p,i)=>`<div class="pp ${p.out?'out':''}"><div class="pph"><b>${p.name}</b><span>${p.out?'失溫，送醫':Math.max(0,Math.round(p.w))+'°'}</span></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,p.w))}%;background:${wcol(p.w)}"></i></div>
   ${p.out?'':`<div class="ctl">
    <button type="button" class="tg2 ${p.wall?'on':''}" data-i="${i}" data-k="wall" aria-pressed="${!!p.wall}">牆邊</button>
    <span class="cbx"><button type="button" class="pm" data-i="${i}" data-k="cb" data-d="-1" aria-label="少一張紙板">−</button>紙板 ${p.cb}<button type="button" class="pm" data-i="${i}" data-k="cb" data-d="1" aria-label="多一張紙板">+</button></span>
    <button type="button" class="tg2 ${p.bl?'on':''}" data-i="${i}" data-k="bl" aria-pressed="${!!p.bl}">毯子</button>
    <button type="button" class="tg2 ${p.th?'on':''}" data-i="${i}" data-k="th" aria-pressed="${!!p.th}">熱水</button></div>`}
   <small>${p.me?'你自己':p.id==='zheng'?'跑船的老人，咳得很重':p.id==='ama'?'撿回收的阿嬤，很瘦':p.id==='feng'?'喝醉了，現在還不覺得冷':p.id==='chang'?'喝了酒，手一直抖':'跟你一樣睡在這裡的老人'}</small></div>`).join('')}</div>
  <div class="clog">${log.slice(-4).map(l=>`<p>${l}</p>`).join('')}</div>
  <div class="mrow"><button class="go" id="cNext">${r<3?`撐到 ${cfg.hours[r+1]}`:'撐到天亮'}</button></div>`;
  box.querySelectorAll('.tg2').forEach(b=>b.addEventListener('click',()=>{const p=P[+b.dataset.i],k=b.dataset.k;if(p[k]){p[k]=0}else{if(k==='th')P.forEach(q=>q.th=0);if(used(k)>=lim[k])return flashRes();p[k]=1}render()}));
  box.querySelectorAll('.pm').forEach(b=>b.addEventListener('click',()=>{const p=P[+b.dataset.i],d=+b.dataset.d;if(d>0&&(p.cb>=2||used('cb')>=lim.cb))return flashRes();p.cb=Math.max(0,p.cb+d);render()}));
  $('#cNext').addEventListener('click',step);
 };
 const flashRes=()=>{const e=box.querySelector('.res');if(e){e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash')}};
 const step=()=>{const lines=[];
  if(r===1){const f=P.find(p=>p.id==='feng'&&!p.out);if(f&&!f.cb&&!f.bl){const v=P.filter(p=>!p.out&&p!==f&&p.cb>0).sort((a,b)=>b.cb-a.cb)[0];if(v){v.cb--;f.cb++;lines.push(`阿峰醒了，冷得發抖，從${v.name==='你'?'你':v.name}身下抽走了一張紙板。`)}}}
  if(r===2)lines.push('風轉向了，牆邊也開始灌風。');
  for(const p of P){if(p.out)continue;let base=cfg.base[r]*p.frail;if(p.drunk)base*=r<2?.6:1.5;const wind=p.wall?(r===2?3:0):6;const prot=Math.min(2,p.cb)*3+p.bl*8;const loss=Math.max(1,base+wind-prot)+(Math.random()*4-2);p.w-=loss;if(p.th)p.w+=10;p.w=Math.min(100,p.w);
   if(p.w<=0){p.out=1;p.wall=p.cb=p.bl=p.th=0;lines.push(p.me?'你的手腳已經沒有感覺了。':`${p.name}不再發抖了。你叫他，他沒有回應。`)}}
  P.forEach(p=>p.th=0);
  if(!lines.length)lines.push(['雨打在帆布上的聲音，一直沒有停。','有人在說夢話。','遠處有救護車的聲音，越來越遠。'][r]||'');
  log.push(`<b>${cfg.hours[r]}</b> ${lines.join(' ')}`);r++;
  if(r>=4||P[0].out){done({people:P.map(p=>({id:p.id,name:p.name,w:p.out?0:Math.round(p.w)}))});return}
  render();
 };
 render();
}


/* ───────── 找工作、找人 ───────── */
const tbar=v=>`<span class="tbar" aria-label="信任 ${Math.round(v)}"><i style="width:${Math.round(v)}%"></i></span>`;
function openDlg(html){$('#dlgIn').innerHTML=html;$('#dlg').hidden=false;$('#dlg').scrollTop=0;const b=$('#dlgIn').querySelector('button:not([disabled])');b&&b.focus({preventScroll:true})}
function closeDlg(){$('#dlg').hidden=true}
function showJobs(loc){const L=G.MAPLOC[loc];const js=G.jobsAt(S,loc);
 openDlg(`<span class="sect">${L.name} · 找工作</span><h2 class="mtitle">這裡缺人</h2>
 <p class="mhelp">正職只能有一份，應徵新的就會辭掉舊的。換工作不會花掉時間，選好之後還是要決定這幾天去哪裡。「不一定有工」的大約一半的日子排不到；「固定班」每天都有。兼差（賣唱、代寫、外送這類）是另外算的，最多兩份，每一份都會多耗一點體力。兼差可以在這裡辭掉；灰色的兼差辭了，以前一起做的人不一定放過你。</p>
 ${S.job&&!S.biz?`<div class="curjob">你現在做的是「${esc(S.job.name)}」，${S.job.income}/天。<button type="button" class="ghost" id="quitJob">辭職</button></div>`:''}
 ${(S.side||[]).filter(G.canQuitGig).map((x,i)=>`<div class="curjob">兼差「${esc(x.name)}」，+${x.inc}/天。<button type="button" class="ghost quitGig" data-i="${i}">不做了</button></div>`).join('')}
 <div class="jobs">${js.map(j=>`<div class="job ${j.current?'cur':''}"><div class="jh"><b>${j.name}</b><span>${j.income}<small>/天</small></span></div><p>${j.desc}</p><div class="jt"><span class="${j.stable?'ok':'no2'}">${j.stable?'固定班':'不一定有工'}</span>${j.meals?'<span class="ok">包餐</span>':''}<span>損耗 ${j.wear>=.15?'高':j.wear>=.09?'中':'低'}</span></div>${j.reqs.length?`<div class="reqs">${j.reqs.map(r=>`<span class="req ${r.ok?'ok':'no'}">${r.ok?'':'✕ '}${r.l}</span>`).join('')}</div>`:''}<button type="button" class="choice2 take" data-k="${j.key}" ${j.ok&&!j.current?'':'disabled'}>${j.current?'正在做':S.job&&!S.biz?'換成這份工作':'去應徵'}</button>${S.job&&!S.biz&&!j.current&&j.ok?`<small class="swap">應徵後會辭掉「${esc(S.job.name)}」</small>`:''}</div>`).join('')}</div>
 <div class="mrow"><button type="button" class="ghost" id="dlgBack">回地圖</button></div>`);
 document.querySelectorAll('#dlgIn .take').forEach(b=>b.addEventListener('click',()=>{if(G.takeJob(S,b.dataset.k)){hud();save();closeDlg();showMap()}}));
 const q=$('#quitJob');q&&q.addEventListener('click',()=>{G.quitJob(S);hud();save();closeDlg();showMap()});
 {const gs=(S.side||[]).filter(G.canQuitGig);document.querySelectorAll('#dlgIn .quitGig').forEach(b=>b.addEventListener('click',()=>{G.quitGig(S,gs[+b.dataset.i].name);hud();save();closeDlg();showMap()}))}
 $('#dlgBack').addEventListener('click',()=>{closeDlg()});
}
function showNpc(id,loc){const p=G.npcsAt(S,loc).find(x=>x.id===id);if(!p)return;const prof=(G.people(S).find(x=>x.name===p.name)||{});
 openDlg(`<span class="sect">${G.MAPLOC[loc].name}</span><h2 class="mtitle">${p.name}</h2>
 ${prof.status?`<p class="mhelp">${esc(prof.status)}</p>`:''}
 <div class="trow"><span>信任</span>${tbar(p.trust)}<b>${Math.round(p.trust)}</b></div>
 <p class="mhelp">去找人會花掉這幾天（${G.CH[S.ch].days} 天）。信任越高，能開口的事越多；借了錢不還，信任會一直掉。</p>
 <div class="acts">${p.acts.map(a=>`<button type="button" class="choice2 act" data-a="${a.key}" ${a.ok?'':'disabled'}>${a.label}${a.ok?'':`<small>${a.why}</small>`}</button>`).join('')}</div>
 <div class="mrow"><button type="button" class="ghost" id="dlgBack">回地圖</button></div>`);
 document.querySelectorAll('#dlgIn .act').forEach(b=>b.addEventListener('click',()=>{const out=G.meet(S,id,b.dataset.a);if(!out)return;closeDlg();$('#map').hidden=true;showResult(out.title,out)}));
 $('#dlgBack').addEventListener('click',()=>{closeDlg()});
}
function showResult(title,out){phase='outcome';save();
 $('#chl').textContent=`${G.CH[S.ch].num} · ${G.CH[S.ch].name}`;$('#title').textContent=title;$('#text').innerHTML='';$('#choices').innerHTML='';$('#upkeep').innerHTML='';$('#story').scrollTop=0;
 floats(out.delta);hud();
 type($('#outcome'),out.text,()=>{if(out.up)$('#upkeep').innerHTML=upText(out.up);const b=document.createElement('button');b.type='button';b.className='go';b.textContent='繼續';b.addEventListener('click',next);$('#choices').appendChild(b);b.focus({preventScroll:true});setTimeout(scrollDown,60)});
}

function showPeople(){
 if(!S)return;const list=G.people(S);
 $('#plist').innerHTML=list.length?list.map(p=>`<div class="pcard ${p.past?'past':''}"><span class="role">${esc(p.role)}</span><h3>${esc(p.name)}</h3><p>${esc(p.status)}</p>${p.trust!=null?`<div class="trow"><span>信任</span>${tbar(p.trust)}<b>${p.trust}</b></div>`:''}</div>`).join(''):'<p class="lede">你還沒有認識誰。在這條街上，這不一定是壞事。</p>';
 $('#people').hidden=false;$('#pClose').focus({preventScroll:true});
}
$('#peopleBtn').addEventListener('click',showPeople);
const ACHK='qiaoxia.ach.v1',METAK='qiaoxia.meta.v1';
const ST={have:'',pawned:'當掉了',lost:'流當',stolen:'被偷了',gone:'不見了',gift:'送人了'};
function showBag(){if(!S)return;const its=G.items(S);
 openDlg(`<span class="sect">背包 · 你身上的東西</span><h2 class="mtitle">NT$ ${S.money.toLocaleString()}</h2>
 <p class="mhelp">缺錢的時候，可以把東西拿去<b>當舖</b>換現金，不會花掉時間。當掉的東西要在 <b>90 天內</b>，多付三成才贖得回來，過期就流當了。睡在外面的時候，東西也可能被偷。在地圖上找人的時候，可以把東西送給對方，信任會大幅增加。</p>
 <div class="bag">${its.map(it=>{const dead=['lost','stolen','gone','gift'].includes(it.status);let btn='';
  if(it.id==='idcard'){btn=it.sellID?`<button type="button" class="choice2 warnb bagact" data-a="sellid">賣給收人頭的人 +3,000</button><small>錢很快，後果很慢</small>`:''}
  else if(it.status==='have')btn=`<button type="button" class="choice2 bagact" data-a="pawn" data-k="${it.id}">當掉 +${it.val.toLocaleString()}</button>`;
  else if(it.status==='pawned')btn=`<button type="button" class="choice2 bagact" data-a="redeem" data-k="${it.id}" ${S.money>=it.cost?'':'disabled'}>贖回 −${it.cost.toLocaleString()}</button><small>${it.due?`期限：第 ${it.due} 天（還有 ${Math.max(0,it.due-S.day)} 天）`:'當票在你身上'}</small>`;
  return `<div class="it ${it.keep?'keep':''} ${dead?'dead':''}"><div><h3>${esc(it.name)}${ST[it.status]?`<span class="st ${it.status}">${ST[it.status]}</span>`:''}</h3><p>${esc(it.desc)}</p></div><div class="ib">${btn}</div></div>`}).join('')}</div>
 <div class="mrow"><button type="button" class="ghost" id="dlgBack">關上背包</button></div>`);
 document.querySelectorAll('#dlgIn .bagact').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a,k=b.dataset.k;const r=a==='pawn'?G.pawnItem(S,k):a==='redeem'?G.redeemItem(S,k):G.sellID(S);if(r!=null){Ambient.sfx&&Ambient.sfx('coin');hud();save();showBag()}}));
 $('#dlgBack').addEventListener('click',closeDlg);
}
$('#bagBtn').addEventListener('click',showBag);
function showGallery(){const got=store.get(DONE)||[],ach=store.get(ACHK)||[];
 const E=Object.entries(G.ENDINGS).sort((a,b)=>b[1].tier-a[1].tier);
 openDlg(`<span class="sect">結局圖鑑 · ${got.length}/${E.length}</span>
 <div class="ends" style="width:100%">${E.map(([k,e])=>`<div class="endrow ${got.includes(k)?'got':''}"><b>${got.includes(k)?e.name:'？？？'}</b>${got.includes(k)?`<span>${e.req}</span>`:`<i>${esc(G.HINT[k]||'')}</i>`}</div>`).join('')}</div>
 <span class="sect">成就 · ${ach.length}/${G.ACH.length}</span>
 <div class="achs">${G.ACH.map(a=>`<div class="ach ${ach.includes(a.id)?'got':'no'}"><b>${ach.includes(a.id)?'':'🔒 '}${a.name}</b><span>${a.desc}</span></div>`).join('')}</div>
 <div class="mrow"><button type="button" class="ghost" id="dlgBack">回去</button></div>`);
 $('#dlgBack').addEventListener('click',closeDlg)}
$('#pClose').addEventListener('click',()=>{$('#people').hidden=true});

function showEnding(key){
 stopTimer();phase='end';
 const got=store.get(DONE)||[];if(!got.includes(key)){got.push(key);store.set(DONE,got)}
 store.del(SAVE);
 const E=G.ENDINGS[key];
 store.set(LAST,{origin:S.origin,oname:G.ORIGINS[S.origin].name,ending:key,day:S.day});
 Scene.set(({councilor:'office',blackgold:'ximen',lizhang:'alley',lost_election:'bridge',indicted:'office',voice:'office',diploma:'office',south:'site',sea:'sea',lost_sea:'sea',dabo:'alley',whitewash:'ximen',jiaotou:'alley',killed:'alley',dead:'hospital',broken:'hospital',home:'room',peer:'office',stall:'alley',cart:'market',foreman:'site',recycler:'yard',tycoon:'site',tycoon_dark:'site',boss:'alley',singer:'ximen',teacher:'office',exonerated:'temple',family_home:'station',father:'room',debtfree:'room',revoked:'office',bankrupt:'bridge'})[key]||'bridge',{season:G.season(S.day),stage:G.stageOf(S),tod:key==='family_home'?'dawn':'dusk',dog:!!S.f.dog,look:{}});
 const epi=G.epilogue(S);
 const meta=store.get(METAK)||{origins:[]};if(!meta.origins.includes(S.origin))meta.origins.push(S.origin);store.set(METAK,meta);
 const ach0=store.get(ACHK)||[];const achNow=G.achCheck(S,key,{got,origins:meta.origins});const achNew=achNow.filter(x=>!ach0.includes(x));const achAll=[...ach0,...achNew];store.set(ACHK,achAll);
 const tps=G.turning(S);
 $('#endIn').innerHTML=`
  <div class="sign"><div><div class="k">第 ${S.day} 天 · ${G.DIFF[S.diff].name} · 結局</div><div class="big">${E.name}</div><div class="s">${E.req}</div></div></div>
  <div class="lede" id="endText"></div>
  <div class="end-body">
   <div>
    ${tps.length?`<h4>三個轉捩點</h4><div class="tps">${tps.map(t=>`<div class="tp"><time>${G.dateStr(t.day)} · 第 ${t.day} 天</time><b>${esc(t.title)}</b><p>你選了「${esc(t.pick)}」。</p>${t.alts.length?`<p class="alt">如果那天，你選的是${t.alts.map(x=>`「${esc(x)}」`).join('，或是')}……</p>`:''}</div>`).join('')}</div><h4 style="margin-top:22px">這兩年</h4>`:'<h4>這兩年</h4>'}
    <ol class="timeline">${S.log.map(l=>`<li><time>${G.dateStr(l.day)} · 第 ${l.day} 天</time>${esc(l.t)}</li>`).join('')}</ol>
    ${epi.length?`<h4 style="margin-top:22px">後來</h4>${epi.map(e=>`<p class="epi">${esc(e)}</p>`).join('')}`:''}
    <h4 style="margin-top:22px">十年後</h4>${G.tenYears(S,key).map(e=>`<p class="epi ten">${esc(e)}</p>`).join('')}
   </div>
   <div>
    <h4>最後的你 · ${G.ORIGINS[S.origin].name}</h4>
    <div class="final">${[['健康',S.hp],['精神',S.mind],['良知',S.con],['人脈',S.rep],['酒癮',S.addict],['存款',S.money]].map(([l,v])=>`<div>${l}<b>${Math.round(v).toLocaleString()}</b></div>`).join('')}</div>
    <p class="epi">這兩年的台北：${S.world.map(k=>G.WORLD[k].name).join('、')}</p>
    <h4>這一輪的成就${achNew.length?` · 新解鎖 ${achNew.length}`:''}</h4>
    <div class="achs" style="margin-bottom:18px">${achNow.length?G.ACH.filter(a=>achNow.includes(a.id)).map(a=>`<div class="ach got ${achNew.includes(a.id)?'new':''}"><b>${a.name}${achNew.includes(a.id)?' · 新':''}</b><span>${a.desc}</span></div>`).join(''):'<p class="epi">這一輪沒有達成任何成就。</p>'}</div>
    <p class="epi">成就總數 ${achAll.length}/${G.ACH.length}</p>
    <h4>所有結局 · ${got.length}/${Object.keys(G.ENDINGS).length}</h4>
    <div class="ends">${Object.entries(G.ENDINGS).sort((a,b)=>b[1].tier-a[1].tier).map(([k,e])=>`<div class="endrow ${got.includes(k)?'got':''} ${k===key?'now':''}"><b>${got.includes(k)?e.name:'？？？'}</b>${got.includes(k)?`<span>${e.req}</span>`:`<i>${esc(G.HINT[k]||'')}</i>`}</div>`).join('')}</div>
   </div>
  </div>
  <p class="gap">下一輩子，這個人可能會出現在你的路上。</p>
  <div class="row-btns"><button class="go" type="button" id="again">再活一次</button></div>`;
 const et=$('#endText');et.innerHTML=paras(G.endingText(S,key)).map(p=>`<p style="margin:0 0 .8em">${esc(p)}</p>`).join('');
 $('#ending').hidden=false;$('#ending').scrollTop=0;
 $('#again').addEventListener('click',()=>{$('#ending').hidden=true;S=null;showIntro()});
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])}

function showIntro(){
 phase='intro';stopTimer();$('#map').hidden=true;$('#mini').hidden=true;$('#dlg').hidden=true;
 const got=store.get(DONE)||[];
 const unlocked=got.some(k=>G.ENDINGS[k]&&G.ENDINGS[k].tier>=4);
 selDiff=store.get(DIFFK)||'street';if(!G.DIFF[selDiff])selDiff='street';
 const renderDiff=()=>{$('#diffs').innerHTML=Object.entries(G.DIFF).map(([k,d])=>`<button type="button" class="diff ${k===selDiff?'on':''}" data-k="${k}" aria-pressed="${k===selDiff}"><b>${d.name}</b><span>${d.desc}</span></button>`).join('');
  document.querySelectorAll('.diff').forEach(b=>b.addEventListener('click',()=>{selDiff=b.dataset.k;store.set(DIFFK,selDiff);renderDiff()}))};
 renderDiff();
 $('#origins').innerHTML=Object.entries(G.ORIGINS).map(([k,o])=>{const lock=o.locked&&!unlocked;return `<button class="origin" type="button" data-k="${k}" ${lock?'disabled':''}><span class="who">${lock?'尚未解鎖':o.who}</span><h3>${o.name}</h3><p>${lock?'達成任何一個四級以上的結局（當老闆、回頭拉人、清白、五金行……）後解鎖。':o.desc}</p>${lock?'':`<span class="trait">${o.trait}</span><span class="st">健康 ${o.st.hp} · 精神 ${o.st.mind} · 良知 ${o.st.con} · 酒癮 ${o.st.addict} · NT$ ${o.st.money}</span>`}</button>`}).join('');
 document.querySelectorAll('.origin').forEach(b=>b.addEventListener('click',()=>start(b.dataset.k)));
 const last=store.get(LAST);
 $('#legacyNote').innerHTML=last&&G.ENDINGS[last.ending]?`上一輩子：「${esc(last.oname)}」，撐了 ${last.day} 天，結局是「${G.ENDINGS[last.ending].name}」。<br>這一輩子，你可能會遇見他。`:'';
 const sv=store.get(SAVE);
 $('#introBtns').innerHTML=sv&&sv.S&&sv.S.v===10?`<button class="ghost" type="button" id="resume">繼續上次：第 ${sv.S.day} 天 · ${G.ORIGINS[sv.S.origin].name} · ${G.DIFF[sv.S.diff].name}</button>`:'';
 if(sv&&sv.S&&sv.S.v===10)$('#resume').addEventListener('click',()=>resume(sv));
 {const ach=store.get(ACHK)||[];$('#collect').innerHTML=`${got.length?`已解鎖結局 ${got.length} / ${Object.keys(G.ENDINGS).length} · 成就 ${ach.length} / ${G.ACH.length}<br>`:''}<button class="ghost" type="button" id="galBtn" style="margin-top:8px">結局圖鑑與成就</button>`;$('#galBtn').addEventListener('click',showGallery)}
 Scene.set('station',{season:'秋',stage:0,tod:'night',look:{bag:1}});
 $('#chl').textContent='';$('#title').textContent='';$('#text').innerHTML='';$('#outcome').innerHTML='';$('#upkeep').innerHTML='';$('#choices').innerHTML='';
 $('#intro').hidden=false;
}
function start(origin){const o=G.ORIGINS[origin];const cards=G.drawCards();
 $('#origins').innerHTML=`<div class="cardpick"><span class="sect">${o.name} · 你身上還帶著什麼？</span><p class="mhelp">每一輪隨機抽三張，選一張帶進遊戲。</p><div class="cards3">${cards.map(k=>{const c=G.CARDS[k];return `<button type="button" class="scard" data-c="${k}"><b>${c.name}</b><span>${c.desc}</span></button>`}).join('')}</div><button type="button" class="ghost" id="cardBack">換一個出身</button></div>`;
 document.querySelectorAll('.scard').forEach(b=>b.addEventListener('click',()=>begin(origin,b.dataset.c)));
 $('#cardBack').addEventListener('click',showIntro);
 const f=document.querySelector('.scard');f&&f.focus({preventScroll:true});$('#intro').scrollTop=$('#origins').offsetTop-40;
}
function begin(origin,card){const last=store.get(LAST);$('#intro').hidden=true;S=G.newState(origin,selDiff,{legacy:last&&G.ENDINGS[last.ending]?last:null});G.applyCard(S,card);hud();next()}
function resume(d){$('#intro').hidden=true;S=d.S;cur=d.cur;hud();
 if(d.phase==='event'&&cur)showEvent(cur);
 else if(d.phase==='chapter')showChapter({ch:S.ch,up:null});
 else if(d.phase==='map')showMap();
 else if(d.phase==='mini'&&d.miniGame)startMini(d.miniGame);
 else next();
}
function save(){if(S)store.set(SAVE,{S,cur,phase,miniGame})}

document.addEventListener('keydown',e=>{
 if(e.target.closest&&e.target.closest('input,textarea'))return;
 if(!$('#people').hidden){if(e.key==='Escape')$('#people').hidden=true;return}
 if(!$('#dlg').hidden){if(e.key==='Escape')closeDlg();return}
 if(!$('#map').hidden||!$('#mini').hidden)return;
 const n=parseInt(e.key,10);
 if(!$('#chapter').hidden){if(n>=1){const b=document.querySelectorAll('#chModes .mode')[n-1];if(b){e.preventDefault();b.click()}}return}
 if(typing&&(e.key===' '||e.key==='Enter')){e.preventDefault();typing.finish();return}
 if(phase==='event'&&n>=1){const b=document.querySelectorAll('#choices .choice')[n-1];if(b&&!b.disabled)b.click()}
});

const SNDK='qiaoxia.sound';
function setSoundBtn(){const on=Ambient.isOn();const b=$('#soundBtn');b.setAttribute('aria-pressed',on);b.querySelector('span').textContent=on?'聲音 開':'聲音 關'}
$('#soundBtn').addEventListener('click',()=>{const on=Ambient.toggle();store.set(SNDK,on);setSoundBtn()});
if(store.get(SNDK)){const once=e=>{if(e.target.closest&&e.target.closest('#soundBtn'))return;document.removeEventListener('pointerdown',once,true);if(!Ambient.isOn()){Ambient.toggle();setSoundBtn()}};document.addEventListener('pointerdown',once,true);$('#soundBtn').querySelector('span').textContent='聲音 點任意處開啟'}

buildHud();
window.claude?.hot?.snapshot?.(()=>({S,cur,phase,miniGame}));
function boot(data){
 data=data||{};
 if(data.S&&data.S.v===10){S=data.S;cur=data.cur;hud();$('#intro').hidden=true;resume(data);return}
 showIntro();
}
window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});
