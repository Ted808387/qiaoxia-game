
/* ───────── 場景動畫 ───────── */
const Scene=(()=>{
 const cv=document.getElementById('scene'),ctx=cv.getContext('2d');
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let W=1,H=1,cur='station',season='秋',stage=0,hat=false,prev=null,fade=1,flash=0,last=performance.now();
 const PAL={
  station:{a:'#0a0e14',b:'#262e39',far:'#111720',g:'#16191d',lamp:'255,180,85'},
  bridge:{a:'#07090c',b:'#1b222b',far:'#0f141a',g:'#121417',lamp:'250,165,70'},
  park:{a:'#080b0d',b:'#1d2828',far:'#0e1414',g:'#121614',lamp:'245,188,105'},
  alley:{a:'#0a080c',b:'#271b22',far:'#130f14',g:'#151214',lamp:'255,150,90'},
  site:{a:'#141822',b:'#4b3b30',far:'#191c22',g:'#1d1b19',lamp:'255,232,190'},
  market:{a:'#0b090b',b:'#30201a',far:'#15100f',g:'#171310',lamp:'255,170,80'},
  room:{a:'#1b1814',b:'#14120f',far:'#0d1117',g:'#1a1713',lamp:'255,200,130'},
  hospital:{a:'#c5cfcd',b:'#97a2a1',far:'#7f8a89',g:'#6b7372',lamp:'235,250,245'},
  temple:{a:'#0c0a0b',b:'#2c1d1a',far:'#130f10',g:'#181312',lamp:'255,170,90'},
  river:{a:'#070a0e',b:'#1b2430',far:'#0e141b',g:'#121517',lamp:'250,180,100'},
  ximen:{a:'#0b090e',b:'#231a2a',far:'#120e16',g:'#151218',lamp:'255,160,200'},
  underpass:{a:'#141716',b:'#1c201e',far:'#111',g:'#1c1e1d',lamp:'220,240,230'},
  sea:{a:'#0a1018',b:'#1e2c3a',far:'#0e1620',g:'#101416',lamp:'255,230,180'},
  office:{a:'#2a2d2b',b:'#2a2d2b',far:'#222',g:'#1c1e1d',lamp:'230,240,235'},
  yard:{a:'#0a0b0d',b:'#22272a',far:'#111417',g:'#18191a',lamp:'255,190,110'}
 };
 const hs=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 let parts=[],walkers=[],cars=[],puffs=[],drips=[],splash=[],GY=null;
 const mk=()=>document.createElement('canvas');const RB=mk(),B1=mk(),B2=mk(),CB=mk();let FX={on:true,slow:0,acc:0,n:0};
 const noise=document.createElement('canvas');noise.width=noise.height=128;
 {const n=noise.getContext('2d'),d=n.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}n.putImageData(d,0,0)}
 let grain=null;
 let tod='night',npc=null,dog=false,wx=null,look={},heroPos={x:0,gy:0,s:0,pose:'stand'},lightning=0;
 const TODK={night:{lamp:1,win:1},dusk:{lamp:.6,win:.6},dawn:{lamp:.35,win:.35},day:{lamp:0,win:.1}};
 let K=TODK.night;
 const SKY={dawn:['#34365a','#d98a6a'],day:['#7d93a6','#c9d1d4'],dusk:['#2a2244','#d8743e']};
 function celestial(t){
  if(tod==='night'){for(let i=0;i<40;i++){const a=.1+.45*hs(i+Math.floor(t/900+i));ctx.fillStyle=`rgba(230,235,245,${(a*.6).toFixed(2)})`;ctx.fillRect(hs(i*3.3)*W,hs(i*7.7)*H*.35,1.2,1.2)}
   const mx=W*.84,my=H*.11,r=Math.max(7,H*.03);const g=ctx.createRadialGradient(mx,my,0,mx,my,r*5);g.addColorStop(0,'rgba(240,235,215,.3)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(mx-r*5,my-r*5,r*10,r*10);ctx.fillStyle='#e9e3cf';ctx.beginPath();ctx.arc(mx,my,r,0,7);ctx.fill();ctx.fillStyle='rgba(180,175,160,.35)';ctx.beginPath();ctx.arc(mx-r*.3,my-r*.2,r*.25,0,7);ctx.arc(mx+r*.35,my+r*.3,r*.18,0,7);ctx.fill()}
  else if(tod==='dawn'||tod==='dusk'){const sx=tod==='dawn'?W*.2:W*.78,sy=H*.48,r=Math.max(12,H*.06);const g=ctx.createRadialGradient(sx,sy,0,sx,sy,r*7);g.addColorStop(0,'rgba(255,200,140,.7)');g.addColorStop(.2,'rgba(255,150,90,.25)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,215,160,.95)';ctx.beginPath();ctx.arc(sx,sy,r,0,7);ctx.fill()}
  else if(tod==='day'){for(let i=0;i<5;i++){const cx=((hs(i)*W+t*.006*(1+i*.3))%(W+220))-110,cy=H*(.05+hs(i+4)*.16);ctx.fillStyle='rgba(255,255,255,.32)';for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(cx+k*18,cy+(k%2)*4,24,9,0,0,7);ctx.fill()}}}
 }
 const NPCS={
  zheng:{pose:'sit',col:'#24272a',o:{cap:'#4a4f55'}},lin:{pose:'stand',col:'#2c3034',o:{vest:1,pony:1}},wang:{pose:'stand',col:'#2e2a28',o:{curly:1,apron:1}},
  chang:{pose:'sit',col:'#2a2622',o:{},stove:1},cai:{pose:'stand',col:'#26282b',o:{gold:1,ember:1}},kai:{pose:'stand',col:'#18191c',o:{ember:1}},
  lily:{pose:'stand',col:'#2c2a2e',o:{pony:1,apron:1},child:1},reporter:{pose:'stand',col:'#2a2d33',o:{camera:1}},girl:{pose:'stand',col:'#2b2d34',o:{pony:1,bag:1}},
  black:{pose:'sit',col:'#1e1f21',o:{}},luo:{pose:'stand',col:'#2b2f2a',o:{vest:2}},officer:{pose:'stand',col:'#22262c',o:{glasses:1,suit:1}},
  brother:{pose:'stand',col:'#1d2026',o:{suit:1,gold:1}},son:{pose:'stand',col:'#2a2e33',o:{cap:'#b98a32'}},sister:{pose:'stand',col:'#2d2b33',o:{pony:1,bag:1}},
  wife:{pose:'stand',col:'#2c2a2a',o:{apron:1,pony:1}},daughter:{pose:'stand',col:'#2c2d33',o:{pony:1}},kid:{pose:'stand',col:'#24272b',o:{}},
  leopard:{pose:'stand',col:'#1c1d1f',o:{ember:1,gold:1}},woman:{pose:'stand',col:'#2c2b30',o:{pony:1}},broker:{pose:'stand',col:'#202326',o:{cap:'#30343a'}},
  drunk:{pose:'sit',col:'#222326',o:{bottle:1}},mom:{pose:'stand',col:'#2e2b2a',o:{curly:1}}
 };
 function dogFig(x,gy,s,t){ctx.save();ctx.translate(x,gy);ctx.scale(s,s);ctx.fillStyle='#121214';ctx.beginPath();ctx.ellipse(0,-9,12,5.5,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(-12,-13,4.5,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-15,-16);ctx.lineTo(-13,-21);ctx.lineTo(-10,-16);ctx.fill();ctx.strokeStyle='#121214';ctx.lineWidth=2.2;ctx.lineCap='round';const w=Math.sin(t/160)*5;ctx.beginPath();ctx.moveTo(11,-10);ctx.lineTo(17,-15+w*.6);ctx.stroke();for(const lx of[-8,-4,5,9]){ctx.beginPath();ctx.moveTo(lx,-5);ctx.lineTo(lx,0);ctx.stroke()}ctx.fillStyle='rgba(255,220,150,.8)';ctx.fillRect(-14,-14,1.4,1.4);ctx.restore()}
 function drawExtras(t,p){const h=heroPos;if(!h.s)return;const s=h.s;
  if(dog)dogFig(h.x-28*s,h.gy,s*.9,t);
  const N=npc&&NPCS[npc];if(!N)return;const nx=Math.min(W-14*s,h.x+(h.pose==='sit'?44:38)*s);
  if(N.stove){ctx.fillStyle='#2b2f33';ctx.fillRect(nx-26*s,h.gy-10*s,16*s,10*s);ctx.fillStyle=`rgba(90,150,255,${(.6+.3*Math.sin(t/90)).toFixed(2)})`;ctx.fillRect(nx-23*s,h.gy-12*s,10*s,2*s);ctx.fillStyle='#3a3d40';ctx.fillRect(nx-27*s,h.gy-20*s,18*s,8*s);if(!RM&&Math.random()<.2)puffs.push({x:nx-18*s,y:h.gy-21*s,a:.25,r:3,steam:1})}
  person(nx+1.2*s,h.gy-.8*s,s*.97,N.pose,t/800+1.7,`rgba(${p.lamp},${(tod==='day'?.2:.4*Math.max(.45,K.lamp)).toFixed(2)})`,{...N.o,dir:-1,rim:1});person(nx,h.gy,s*.97,N.pose,t/800+1.7,N.col,{...N.o,dir:-1});
  if(N.child)person(nx+14*s,h.gy,s*.55,'stand',t/600,'#2a2830',{pony:1,dir:-1});
 }
 function resize(){const r=cv.getBoundingClientRect();const D=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,r.width);H=Math.max(1,r.height);cv.width=Math.round(W*D);cv.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0);grain=ctx.createPattern(noise,'repeat');init()}
 function weather(){if(['room','hospital','office','underpass'].includes(cur))return null;if(wx)return wx;return {冬:'rain',春:'drizzle',秋:'leaf',夏:'dust'}[season]}
 function newP(init){const k=weather();const p={x:Math.random()*W,y:init?Math.random()*H:-12,k};
  if(k==='storm'){p.v=900+Math.random()*300;p.l=16+Math.random()*14}
  else if(k==='rain'){p.v=480+Math.random()*260;p.l=10+Math.random()*12}
  else if(k==='drizzle'){p.v=260+Math.random()*120;p.l=6+Math.random()*6}
  else if(k==='leaf'){p.v=30+Math.random()*30;p.vx=-20-Math.random()*40;p.r=Math.random()*6;p.vr=(Math.random()-.5)*3;p.y=init?Math.random()*H:-10;p.x=init?Math.random()*W:W*Math.random()+W*.3}
  else{p.v=-(6+Math.random()*10);p.y=init?Math.random()*H:H+5;p.a=.1+Math.random()*.25}
  return p}
 function init(){
  const k=weather();const n=k?Math.round((k==='storm'?W*H/1500:k==='rain'?W*H/2600:k==='drizzle'?W*H/5200:k==='leaf'?W*H/26000:W*H/9000)*(RM?.25:1)):0;
  parts=[];for(let i=0;i<n;i++)parts.push(newP(true));
  const wn={station:9,market:7,alley:4,ximen:11,temple:3,underpass:3}[cur]||0;walkers=[];
  for(let i=0;i<wn;i++)walkers.push({x:Math.random()*W,dir:Math.random()<.5?1:-1,sp:16+Math.random()*24,s:.62+Math.random()*.4,ph:Math.random()*6,c:10+Math.floor(Math.random()*12)});
  walkers.sort((a,b)=>a.s-b.s);
  cars=[];for(let i=0;i<7;i++)cars.push({x:Math.random()*W,dir:i%2?1:-1,sp:120+Math.random()*150});
  puffs=[];drips=[];
 }
 function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()}
 function sky(p){const g=ctx.createLinearGradient(0,0,0,H);const c=tod!=='night'&&SKY[tod]?SKY[tod]:[p.a,p.b];g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);if(wx!=='storm')celestial(performance.now())}
 function city(seed,base,maxH,col,t,win,den){let x=-8,i=0;while(x<W+8){const w=22+hs(seed+i*3.17)*62,h=maxH*(.3+hs(seed+i*7.71)*.7);ctx.fillStyle=col;ctx.fillRect(x,base-h,w-1.5,h);const cols=Math.max(1,Math.floor((w-6)/8)),rows=Math.floor((h-6)/11);for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const v=hs(seed*3+i*31.3+r*7.1+c*13.7);if(v>den){const tw=hs(v*91+Math.floor(t/5000+v*20));if(tw>.12){ctx.fillStyle=`rgba(${win},${((.18+.5*v)*K.win).toFixed(2)})`;ctx.fillRect(x+4+c*8,base-h+5+r*11,3,5)}}}x+=w;i++}}
 function ground(gy,col){GY=gy;{const hz=ctx.createLinearGradient(0,gy-H*.2,0,gy);const lc=(PAL[cur]||PAL.bridge).lamp;hz.addColorStop(0,'rgba(0,0,0,0)');hz.addColorStop(1,tod==='day'?'rgba(200,210,215,.10)':`rgba(${lc},${(.07*Math.max(.4,K.lamp)).toFixed(3)})`);ctx.fillStyle=hz;ctx.fillRect(0,gy-H*.2,W,H*.2)}const g=ctx.createLinearGradient(0,gy,0,H);g.addColorStop(0,col);g.addColorStop(1,'#08090a');ctx.fillStyle=g;ctx.fillRect(0,gy,W,H-gy);ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(0,gy,W,1)}
 function lamp(x,gy,h,rgb,t,flick){const top=gy-h;let a=.9*K.lamp;if(flick){const k=hs(Math.floor(t/110));if(k<.07)a=.2}
  ctx.strokeStyle='#08090a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,top);ctx.lineTo(x+18,top);ctx.stroke();
  const cg=ctx.createLinearGradient(0,top,0,gy);cg.addColorStop(0,`rgba(${rgb},${.26*a})`);cg.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(x+12,top+4);ctx.lineTo(x+26,top+4);ctx.lineTo(x+19+h*.42,gy);ctx.lineTo(x+19-h*.42,gy);ctx.closePath();ctx.fill();
  const rg=ctx.createRadialGradient(x+19,top+3,0,x+19,top+3,60);rg.addColorStop(0,`rgba(${rgb},${.95*a})`);rg.addColorStop(.12,`rgba(${rgb},${.32*a})`);rg.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=rg;ctx.fillRect(x-45,top-60,130,120);
  if(a>.15&&!RM){for(let i=0;i<14;i++){const f=hs(i*5.1+x)*.95,py=top+8+((f*h+t*.006*(1+hs(i+x)))%(h-8)),fr=(py-top)/h,px=x+19+(hs(i*2.3+x)-.5)*2*h*.42*fr+Math.sin(t/1300+i)*4;ctx.fillStyle=`rgba(${rgb},${(.5*a*(1-fr*.6)*(.4+.6*Math.abs(Math.sin(t/900+i)))).toFixed(3)})`;ctx.fillRect(px,py,1.4,1.4)}}
  ctx.save();ctx.translate(x+19,gy+4);ctx.scale(1,.2);const pg=ctx.createRadialGradient(0,0,0,0,0,h*.6);pg.addColorStop(0,`rgba(${rgb},${.34*a})`);pg.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=pg;ctx.beginPath();ctx.arc(0,0,h*.6,0,7);ctx.fill();ctx.restore()}
 function person(x,gy,s,pose,ph,col,o={}){
  ctx.save();ctx.translate(x,gy);ctx.scale(s*(o.dir===-1?-1:1),s);if(pose!=='bench'&&!o.rim){ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(pose==='sit'?3:0,0,pose==='sit'?17:12,2.6,0,0,7);ctx.fill()}ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=5;
  let hy=-57;
  if(pose==='walk'){const a=Math.sin(ph)*7;ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(a,-1);ctx.moveTo(0,-26);ctx.lineTo(-a,-1);ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(0,-46);ctx.lineTo(-a*.7,-28);ctx.moveTo(0,-46);ctx.lineTo(a*.7,-28);ctx.stroke();rr(-6,-51,12,27,5);ctx.fill();ctx.beginPath();ctx.arc(0,-57-Math.abs(Math.cos(ph)),6,0,7);ctx.fill()}
  else if(pose==='stand'){const b=Math.sin(ph)*.7;ctx.beginPath();ctx.moveTo(-3,-26);ctx.lineTo(-4,-1);ctx.moveTo(3,-26);ctx.lineTo(4,-1);ctx.stroke();ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(-6,-46+b);ctx.lineTo(-8,-26);ctx.moveTo(6,-46+b);ctx.lineTo(8,-26);ctx.stroke();rr(-7,-51+b,14,27,5);ctx.fill();ctx.beginPath();ctx.arc(0,-58+b,6.5,0,7);ctx.fill();hy=-58+b}
  else if(pose==='sit'){const b=Math.sin(ph)*.6;ctx.beginPath();ctx.moveTo(-2,-5);ctx.lineTo(12,-18);ctx.lineTo(16,-1);ctx.stroke();rr(-10,-34+b,13,30,6);ctx.fill();ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(-2,-28+b);ctx.lineTo(11,-17);ctx.stroke();ctx.beginPath();ctx.arc(-3,-40+b,7.5,0,7);ctx.fill();hy=-40+b}
  else{const b=Math.sin(ph)*.6;ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(11,-22);ctx.lineTo(11,-1);ctx.stroke();rr(-7,-48+b,13,28,5);ctx.fill();ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(1,-42+b);ctx.lineTo(10,-25);ctx.stroke();ctx.beginPath();ctx.arc(1,-55+b,6.5,0,7);ctx.fill();hy=-55+b}
  if(o.hat){ctx.fillStyle='#b98a32';ctx.beginPath();ctx.arc(pose==='sit'?-3:0,hy-1,7.6,Math.PI,0);ctx.fill();ctx.fillRect((pose==='sit'?-3:0)-10,hy-1,20,2.2)}
  {const hx=pose==='sit'?-3:pose==='bench'?1:0,ty=(pose==='sit'?-34:pose==='bench'?-48:-51),tx=pose==='sit'?-10:-7;
  if(o.cap){ctx.fillStyle=o.cap;ctx.beginPath();ctx.arc(hx,hy-1,7,Math.PI,0);ctx.fill();ctx.fillRect(hx,hy-2.5,10,2)}
  if(o.curly){ctx.fillStyle=col;for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(hx-6+k*3,hy-5+(k%2)*2,3.4,0,7);ctx.fill()}}
  if(o.pony){ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(hx-7,hy+3,2.6,6,.4,0,7);ctx.fill()}
  if(o.vest){ctx.fillStyle=o.vest===2?'rgba(200,90,50,.85)':'rgba(214,190,60,.85)';rr(tx+1,ty+3,12,15,3);ctx.fill();ctx.fillStyle='rgba(235,240,240,.9)';ctx.fillRect(tx+1,ty+8,12,1.6);ctx.fillRect(tx+1,ty+13,12,1.6)}
  if(o.apron){ctx.fillStyle='rgba(200,195,180,.5)';ctx.fillRect(tx+2,ty+12,10,15)}
  if(o.suit){ctx.fillStyle='rgba(230,230,235,.7)';ctx.beginPath();ctx.moveTo(hx-2,ty+1);ctx.lineTo(hx,ty+9);ctx.lineTo(hx+2,ty+1);ctx.fill()}
  if(o.collar){ctx.fillStyle='rgba(225,220,205,.55)';ctx.fillRect(hx-3.5,ty,7,2)}
  if(o.gold){ctx.strokeStyle='rgba(235,190,70,.95)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hx,ty+1,4,.2,Math.PI-.2);ctx.stroke()}
  if(o.camera){ctx.fillStyle='#0c0d0f';ctx.fillRect(tx+3,ty+7,9,7);ctx.fillStyle='rgba(140,180,220,.8)';ctx.beginPath();ctx.arc(tx+7.5,ty+10.5,1.8,0,7);ctx.fill()}
  if(o.glasses){ctx.strokeStyle='rgba(200,210,220,.7)';ctx.lineWidth=1;ctx.strokeRect(hx+1,hy-1.5,4,2.5)}
  if(o.ember){const fl=.55+.45*Math.sin(ph*9);ctx.fillStyle=`rgba(255,120,40,${fl.toFixed(2)})`;ctx.beginPath();ctx.arc(hx+8,hy+3,1.7,0,7);ctx.fill()}
  if(o.bag){ctx.fillStyle='rgba(225,225,215,.5)';rr(tx+13,ty+17,8,10,2);ctx.fill()}
  if(o.guitar){ctx.fillStyle='#5a3b22';ctx.beginPath();ctx.ellipse(tx+5,ty+22,7,5.5,-.5,0,7);ctx.fill();ctx.strokeStyle='#3a2716';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx+8,ty+19);ctx.lineTo(tx+22,ty+5);ctx.stroke()}
  if(o.bottle){ctx.fillStyle='rgba(120,160,120,.7)';ctx.fillRect(tx+20,-10,3,9)}}
  ctx.restore();return hy*s}
 function hero(x,gy,s,pose,p,t,floor){
  {const ro={hat,bag:look.bag&&pose!=='bench',guitar:look.guitar&&pose!=='bench',collar:stage>=4,rim:1};const ra=(tod==='day'?.28:.55*Math.max(.45,K.lamp)).toFixed(2);person(x-1.1*s,gy-.6*s,s,pose,t/900,`rgba(${p.lamp},${ra})`,ro);}
  const hc=cur==='hospital'?'#3a4142':stage>=4?'#363c44':'#2a2f35',ho={hat,bag:look.bag&&pose!=='bench',guitar:look.guitar&&pose!=='bench',collar:stage>=4};
  ctx.save();ctx.shadowColor=`rgba(${p.lamp},${(.3*Math.max(.3,K.lamp)).toFixed(2)})`;ctx.shadowBlur=16;person(x,gy,s,pose,t/900,hc,{...ho,rim:1});ctx.restore();
  const hy=person(x,gy,s,pose,t/900,hc,ho);
  heroPos={x,gy:floor??gy,s,pose};
  if(season==='冬'&&cur!=='room'&&cur!=='hospital'&&!RM&&hs(Math.floor(t/2400)+.3)>.2&&(t%2400)<40&&puffs.length<6)puffs.push({x:x+(pose==='sit'?4:8)*s,y:gy+hy,a:.35,r:3});
 }
 function walkersDraw(gy,dt){for(const w of walkers){w.x+=w.dir*w.sp*dt;w.ph+=dt*w.sp*.3;if(w.x>W+30)w.x=-30;if(w.x<-30)w.x=W+30;person(w.x,gy-(1-w.s)*26*heroScale(),w.s*heroScale()*.92,'walk',w.ph,`rgb(${w.c},${w.c+2},${w.c+5})`,{dir:w.dir})}}
 function heroScale(){return Math.min(2.1,Math.max(.8,H/380))}

 const D={
  station(t,p,dt){sky(p);city(11,H*.6,H*.4,p.far,t,'255,210,150',.82);const gy=H*.8,bx=W*.14,bw=W*.72,by=H*.42;
   ctx.fillStyle='#13171c';ctx.fillRect(bx,by,bw,gy-by);ctx.fillStyle='#0e1115';ctx.beginPath();ctx.moveTo(bx-16,by);ctx.lineTo(bx+bw*.17,by-H*.1);ctx.lineTo(bx+bw*.83,by-H*.1);ctx.lineTo(bx+bw+16,by);ctx.closePath();ctx.fill();
   ctx.fillRect(bx+bw*.3,by-H*.1-4,bw*.4,4);
   const n=Math.max(6,Math.floor(bw/34));for(let i=0;i<n;i++){const wx=bx+10+i*(bw-20)/n;ctx.fillStyle=`rgba(255,196,120,${.22+.12*hs(i+Math.floor(t/7000))})`;ctx.fillRect(wx,by+H*.08,(bw-20)/n-8,H*.17)}
   ctx.fillStyle='rgba(255,214,150,.85)';ctx.font=`600 ${Math.max(11,H*.042)}px "Noto Serif TC",serif`;ctx.textAlign='center';ctx.fillText('臺北車站',W/2,by+H*.055);
   ground(gy,p.g);lamp(W*.06,gy,H*.42,p.lamp,t);lamp(W*.88,gy,H*.42,p.lamp,t);walkersDraw(gy+4,dt);hero(W*.3,gy+2,heroScale(),stage===0?'sit':'stand',p,t)},
  bridge(t,p,dt){sky(p);city(5,H*.66,H*.42,p.far,t,'255,200,140',.86);
   ctx.fillStyle='#0b1014';ctx.fillRect(0,H*.66,W,H*.1);for(let i=0;i<46;i++){const x=(hs(i)*W+t*.008*(1+hs(i+3)))%W;const a=.08+.25*hs(i+Math.floor(t/600));ctx.fillStyle=`rgba(255,${180+50*hs(i+1)|0},120,${a.toFixed(2)})`;ctx.fillRect(x,H*.67+hs(i+9)*H*.08,6+hs(i+2)*16,1.2)}
   const gy=H*.84,dy=H*.14,dh=H*.11;
   for(const c of cars){c.x+=c.dir*c.sp*dt;if(c.x>W+40)c.x=-40;if(c.x<-40)c.x=W+40;ctx.fillStyle='#0d0f12';ctx.fillRect(c.x-14,dy-9,28,9);const fx=c.x+c.dir*14;const g=ctx.createRadialGradient(fx,dy-5,0,fx,dy-5,18);g.addColorStop(0,c.dir>0?'rgba(255,240,200,.9)':'rgba(255,60,50,.8)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(fx-18,dy-23,36,36)}
   ctx.fillStyle='#15181b';ctx.fillRect(0,dy,W,dh);ctx.fillStyle='#0c0e10';ctx.fillRect(0,dy+dh*.7,W,dh*.3);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(0,dy,W,1);
   for(const px of[.1,.46,.82]){ctx.fillStyle='#111315';ctx.fillRect(W*px-W*.025,dy+dh,W*.05,gy-dy-dh);ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(W*px-W*.025,dy+dh,2,gy-dy-dh)}
   const sh=ctx.createLinearGradient(0,dy+dh,0,dy+dh+H*.2);sh.addColorStop(0,'rgba(0,0,0,.55)');sh.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sh;ctx.fillRect(0,dy+dh,W,H*.2);
   ground(gy,p.g);
   for(const [cx,cw] of[[.15,.09],[.52,.07],[.86,.1]]){ctx.fillStyle='#3e2f21';ctx.fillRect(W*cx,gy-H*.09,W*cw,H*.09);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(W*(cx+cw*.35),gy-H*.07,W*cw*.3,H*.07);ctx.fillStyle='#1e3245';ctx.beginPath();ctx.moveTo(W*cx-6,gy-H*.09);ctx.lineTo(W*(cx+cw/2),gy-H*.15);ctx.lineTo(W*(cx+cw)+6,gy-H*.09);ctx.closePath();ctx.fill()}
   lamp(W*.64,gy,(gy-dy-dh)*.8,p.lamp,t,true);hero(W*.34,gy+2,heroScale(),stage<=1?'sit':'stand',p,t)},
  park(t,p,dt){sky(p);city(21,H*.64,H*.28,p.far,t,'255,200,150',.9);
   const cx=W*.64,base=H*.64,w=Math.min(W*.42,H*1.1),h=w*.15;ctx.fillStyle='#0c1011';ctx.fillRect(cx-w*.36,base-h,w*.72,h);
   const roof=(y,hw,rh)=>{ctx.beginPath();ctx.moveTo(cx-hw-rh*.9,y-rh*.85);ctx.quadraticCurveTo(cx-hw*.8,y+rh*.1,cx-hw*.55,y);ctx.lineTo(cx+hw*.55,y);ctx.quadraticCurveTo(cx+hw*.8,y+rh*.1,cx+hw+rh*.9,y-rh*.85);ctx.quadraticCurveTo(cx+hw*.6,y-rh*.55,cx+hw*.4,y-rh);ctx.lineTo(cx-hw*.4,y-rh);ctx.quadraticCurveTo(cx-hw*.6,y-rh*.55,cx-hw-rh*.9,y-rh*.85);ctx.fill()};
   ctx.fillStyle='#0a0d0e';roof(base-h,w*.5,h*.6);roof(base-h*1.7,w*.33,h*.5);
   for(let k=0;k<5;k++){const lx=cx-w*.3+k*w*.15,ly=base-h*.75+Math.sin(t/900+k)*1.5;const g=ctx.createRadialGradient(lx,ly,0,lx,ly,14);g.addColorStop(0,'rgba(230,80,50,.9)');g.addColorStop(.3,'rgba(200,60,40,.35)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(lx-14,ly-14,28,28)}
   const gy=H*.84;ground(gy,p.g);
   for(const [tx,th,sd] of[[.08,.5,1],[.2,.42,2],[.92,.46,3]]){const x=W*tx,top=gy-H*th,sw=Math.sin(t/1700+sd)*3;ctx.fillStyle='#090c0b';ctx.fillRect(x-3,top+H*.12,6,gy-top-H*.12);for(let k=0;k<6;k++){ctx.beginPath();ctx.arc(x+sw+(hs(sd*9+k)-.5)*H*.16,top+H*.06+hs(sd+k)*H*.1,H*.06+hs(k+sd*3)*H*.04,0,7);ctx.fill()}}
   const px=W*.42;ctx.fillStyle='#0d1010';ctx.fillRect(px-W*.06,gy-H*.2,4,H*.2);ctx.fillRect(px+W*.06-4,gy-H*.2,4,H*.2);ctx.beginPath();ctx.moveTo(px-W*.09,gy-H*.19);ctx.lineTo(px,gy-H*.29);ctx.lineTo(px+W*.09,gy-H*.19);ctx.fill();
   lamp(W*.74,gy,H*.4,p.lamp,t);hero(W*.36,gy+2,heroScale(),stage===0?'sit':'stand',p,t)},
  alley(t,p,dt){sky(p);const gy=H*.86,n=Math.max(3,Math.ceil(W/170)),bw=W/n;
   for(let i=0;i<n;i++){const x=i*bw,top=H*(.02+hs(i+4)*.1),c=14+Math.floor(hs(i)*8);ctx.fillStyle=`rgb(${c+4},${c},${c+3})`;ctx.fillRect(x,top,bw-2,gy-top);
    const fl=Math.floor((gy-H*.25-top)/(H*.15));for(let f=0;f<fl;f++){const wy=top+H*.04+f*H*.15;for(let k=0;k<2;k++){const wx=x+bw*(.18+k*.42),ww=bw*.26,wh=H*.08;const lit=hs(i*7+f*3+k)>.5;ctx.fillStyle=lit?`rgba(255,${190+(hs(i+f)*40|0)},130,.32)`:'#0b0a0c';ctx.fillRect(wx,wy,ww,wh);ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=1;for(let b=1;b<5;b++){ctx.beginPath();ctx.moveTo(wx+ww*b/5,wy);ctx.lineTo(wx+ww*b/5,wy+wh);ctx.stroke()}
     if(hs(i+f*5+k)>.6){ctx.fillStyle='#232226';ctx.fillRect(wx+ww*.1,wy+wh+3,ww*.8,H*.035);if(!RM&&Math.random()<dt*.6)drips.push({x:wx+ww*.5,y:wy+wh+3+H*.035,v:0})}}}
    const ay=gy-H*.22;ctx.fillStyle='#0a090b';ctx.fillRect(x+6,ay,bw-14,H*.22);const open=hs(i+11)>.35;if(open){const g=ctx.createLinearGradient(0,ay,0,gy);g.addColorStop(0,'rgba(255,190,110,.32)');g.addColorStop(1,'rgba(255,150,80,.06)');ctx.fillStyle=g;ctx.fillRect(x+12,ay+6,bw-26,H*.22-6)}else{ctx.strokeStyle='rgba(255,255,255,.05)';for(let y=ay+4;y<gy;y+=4){ctx.beginPath();ctx.moveTo(x+12,y);ctx.lineTo(x+bw-14,y);ctx.stroke()}}
    ctx.fillStyle='#08070a';ctx.fillRect(x,ay,6,H*.22)}
   const signs=[['旅社','232,92,78'],['當舖','240,170,70'],['茶室','220,90,150'],['便當','240,180,90'],['理容','110,200,190'],['國術','240,170,70']];
   for(let i=0;i<n;i++){const [txt,rgb]=signs[i%signs.length];const sx=i*bw+bw*.86,sy=H*.22+hs(i+2)*H*.12,sw=Math.max(18,H*.07),sh=sw*2.6;let a=.9;const k=hs(Math.floor(t/(140+i*30))+i);if(k<.08)a=.15;else if(k<.14)a=.5;
    ctx.fillStyle='#0c0b0d';ctx.fillRect(sx,sy,sw,sh);ctx.save();ctx.shadowColor=`rgba(${rgb},${a})`;ctx.shadowBlur=16;ctx.strokeStyle=`rgba(${rgb},${a})`;ctx.lineWidth=1.5;ctx.strokeRect(sx+2,sy+2,sw-4,sh-4);ctx.fillStyle=`rgba(${rgb},${a})`;ctx.font=`700 ${sw*.62}px "Noto Sans TC",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt[0],sx+sw/2,sy+sh*.3);ctx.fillText(txt[1],sx+sw/2,sy+sh*.7);ctx.restore()}
   ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=1.2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(0,H*(.12+k*.04));ctx.quadraticCurveTo(W/2,H*(.2+k*.05)+Math.sin(t/2000+k)*2,W,H*(.1+k*.045));ctx.stroke()}
   for(const d of drips){d.v+=900*dt;d.y+=d.v*dt;ctx.fillStyle='rgba(170,190,210,.6)';ctx.fillRect(d.x,d.y,1.2,4)}drips=drips.filter(d=>d.y<gy);
   ground(gy,p.g);walkersDraw(gy+4,dt);hero(W*.3,gy+2,heroScale(),stage===0?'sit':'stand',p,t)},
  site(t,p,dt){sky(p);city(33,H*.72,H*.3,p.far,t,'255,210,160',.88);const gy=H*.86;
   const x0=W*.06,x1=W*.5,fl=5,fh=(gy-H*.24)/fl;ctx.strokeStyle='#3a3d42';ctx.lineWidth=3;for(let f=0;f<=fl;f++){ctx.beginPath();ctx.moveTo(x0,gy-f*fh);ctx.lineTo(x1,gy-f*fh);ctx.stroke()}
   for(let c=0;c<=4;c++){const x=x0+(x1-x0)*c/4;ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy-fl*fh);ctx.stroke()}
   ctx.fillStyle='rgba(70,120,90,.22)';ctx.fillRect(x0,gy-fl*fh,(x1-x0)*.55,fl*fh);ctx.strokeStyle='rgba(120,170,140,.12)';ctx.lineWidth=1;for(let y=gy-fl*fh;y<gy;y+=6){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+(x1-x0)*.55,y);ctx.stroke()}
   const mx=W*.72,mt=H*.1;ctx.strokeStyle='#5a4d3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx-6,gy);ctx.lineTo(mx-6,mt);ctx.moveTo(mx+6,gy);ctx.lineTo(mx+6,mt);ctx.stroke();ctx.lineWidth=1;for(let y=mt;y<gy;y+=14){ctx.beginPath();ctx.moveTo(mx-6,y);ctx.lineTo(mx+6,y+14);ctx.stroke()}
   ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.16,mt);ctx.lineTo(mx+W*.12,mt);ctx.stroke();ctx.fillStyle='#3a3229';ctx.fillRect(mx+W*.08,mt,W*.05,H*.05);
   const tx=W*.3+Math.sin(t/6000)*W*.08,ang=Math.sin(t/1500)*.06,len=H*.34;const hx=tx+Math.sin(ang)*len,hy=mt+Math.cos(ang)*len;ctx.strokeStyle='#2a2622';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx,mt);ctx.lineTo(hx,hy);ctx.stroke();ctx.fillStyle='#b8902f';ctx.fillRect(hx-5,hy,10,6);ctx.fillStyle='#2b2724';ctx.fillRect(hx-W*.05,hy+10,W*.1,4);ctx.strokeStyle='#2b2724';ctx.beginPath();ctx.moveTo(hx,hy+6);ctx.lineTo(hx-W*.05,hy+10);ctx.moveTo(hx,hy+6);ctx.lineTo(hx+W*.05,hy+10);ctx.stroke();
   if(Math.floor(t/700)%2){const g=ctx.createRadialGradient(mx,mt-4,0,mx,mt-4,12);g.addColorStop(0,'rgba(255,40,30,.95)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(mx-12,mt-16,24,24)}
   ground(gy,p.g);ctx.fillStyle='#3a2a20';for(let k=0;k<12;k++)ctx.fillRect(W*.56+k*3,gy-6-k%3*2,W*.14,2);
   lamp(W*.9,gy,H*.5,p.lamp,t);hero(W*.42,gy+2,heroScale(),'stand',p,t)},
  market(t,p,dt){sky(p);city(44,H*.56,H*.3,p.far,t,'255,190,140',.85);const gy=H*.86,n=Math.max(3,Math.round(W/190)),sw=W/n;const cols=['#4d2722','#4c3d24','#283633'];
   for(let i=0;i<n;i++){const x=i*sw,top=H*.38;const g=ctx.createRadialGradient(x+sw/2,top+H*.12,0,x+sw/2,top+H*.12,sw*.7);g.addColorStop(0,'rgba(255,175,90,.35)');g.addColorStop(1,'rgba(255,140,60,0)');ctx.fillStyle=g;ctx.fillRect(x-sw*.2,top,sw*1.4,gy-top);
    ctx.fillStyle=cols[i%3];ctx.beginPath();ctx.moveTo(x+6,top+H*.06);ctx.lineTo(x+sw*.15,top);ctx.lineTo(x+sw*.85,top);ctx.lineTo(x+sw-6,top+H*.06);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x+6,top+H*.06,sw-12,4);
    ctx.fillStyle='#120e0c';ctx.fillRect(x+12,gy-H*.16,sw-24,H*.16);ctx.fillStyle='rgba(255,200,130,.15)';ctx.fillRect(x+12,gy-H*.16,sw-24,2);
    for(let b=0;b<5;b++){const bx=x+sw*(.2+b*.15),by=top+H*.08+Math.sin(t/900+b+i)*1.5+Math.sin(b/4*Math.PI)*6;const g2=ctx.createRadialGradient(bx,by,0,bx,by,10);g2.addColorStop(0,'rgba(255,220,160,.95)');g2.addColorStop(.3,'rgba(255,180,90,.4)');g2.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g2;ctx.fillRect(bx-10,by-10,20,20)}
    if(i===1&&!RM&&Math.random()<dt*14)puffs.push({x:x+sw*.5+(Math.random()-.5)*20,y:gy-H*.17,a:.22,r:5+Math.random()*4,steam:1})}
   ground(gy,p.g);walkersDraw(gy+4,dt);hero(W*.22,gy+2,heroScale(),'stand',p,t)},
  room(t,p,dt){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#211d18');g.addColorStop(1,'#16130f');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.02)';for(let x=0;x<W;x+=14){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
   const wx=W*.12,wy=H*.18,ww=Math.min(W*.3,H*.7),wh=H*.42;ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();const sg=ctx.createLinearGradient(0,wy,0,wy+wh);sg.addColorStop(0,'#0b0f15');sg.addColorStop(1,'#1d2530');ctx.fillStyle=sg;ctx.fillRect(wx,wy,ww,wh);
    for(let i=0;i<14;i++){const lx=wx+hs(i+3)*ww,ly=wy+wh*.4+hs(i+7)*wh*.6;ctx.fillStyle=`rgba(255,200,140,${(.2+.5*hs(i+Math.floor(t/4000))).toFixed(2)})`;ctx.fillRect(lx,ly,2,3)}
    if(season==='冬'||season==='春'){ctx.strokeStyle='rgba(170,190,210,.4)';ctx.lineWidth=1;for(let i=0;i<30;i++){const rx=wx+hs(i)*ww,ry=wy+((hs(i+5)*wh+t*.35*(1+hs(i)))%wh);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+9);ctx.stroke()}}
   ctx.restore();ctx.strokeStyle='#0d0b09';ctx.lineWidth=5;ctx.strokeRect(wx,wy,ww,wh);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.stroke();
   ctx.fillStyle='#d9cfb8';ctx.fillRect(wx+ww+W*.06,H*.24,W*.05,H*.13);ctx.fillStyle='#b8402e';ctx.fillRect(wx+ww+W*.06,H*.24,W*.05,H*.025);
   const gy=H*.86;ctx.fillStyle='#120f0c';ctx.fillRect(0,gy,W,H-gy);
   const bx=W*.55,bw=W*.4;ctx.fillStyle='#2b2620';ctx.fillRect(bx,gy-H*.16,bw,H*.12);ctx.fillStyle='#3c352c';ctx.fillRect(bx,gy-H*.18,bw,H*.03);ctx.fillStyle='#0e0c0a';ctx.fillRect(bx,gy-H*.04,6,H*.04);ctx.fillRect(bx+bw-6,gy-H*.04,6,H*.04);
   if(hat){ctx.fillStyle='#b98a32';ctx.beginPath();ctx.arc(bx+bw+W*.0-20,H*.36,9,Math.PI,0);ctx.fill()}
   const lx=W*.6+Math.sin(t/1300)*4,ly=H*.32;ctx.strokeStyle='#0b0a08';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W*.6,0);ctx.lineTo(lx,ly);ctx.stroke();
   const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,H*.9);lg.addColorStop(0,`rgba(${p.lamp},.5)`);lg.addColorStop(.05,`rgba(${p.lamp},.22)`);lg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,230,180,.95)';ctx.beginPath();ctx.arc(lx,ly,4,0,7);ctx.fill();
   hero(bx+bw*.2,gy-H*.16,heroScale(),'bench',p,t,gy)},
  yard(t,p,dt){sky(p);city(55,H*.6,H*.3,p.far,t,'255,200,150',.88);const gy=H*.86,fy=H*.46;
   ctx.fillStyle='#1b1e21';ctx.fillRect(0,fy,W,gy-fy);ctx.fillStyle='rgba(255,255,255,.035)';for(let x=0;x<W;x+=7)ctx.fillRect(x,fy,1.5,gy-fy);
   ctx.fillStyle='rgba(165,48,38,.75)';ctx.font=`700 ${Math.max(12,H*.06)}px "Noto Sans TC",sans-serif`;ctx.textAlign='center';ctx.fillText('高價收購',W*.72,fy+H*.1);
   const cols=['#3b3127','#2e3134','#3a3a30','#40352a'];for(let k=0;k<7;k++){const bx=W*(.04+k*.07),bh=H*(.08+hs(k+3)*.05),bw=W*.065;for(let j=0;j<1+(k%3);j++){ctx.fillStyle=cols[(k+j)%4];ctx.fillRect(bx,gy-bh*(j+1),bw-3,bh-2);ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx,gy-bh*(j+1)+bh*.35);ctx.lineTo(bx+bw-3,gy-bh*(j+1)+bh*.35);ctx.moveTo(bx,gy-bh*(j+1)+bh*.7);ctx.lineTo(bx+bw-3,gy-bh*(j+1)+bh*.7);ctx.stroke()}}
   const sx=W*.62,sw=W*.2;ctx.fillStyle='#2a2c2e';ctx.fillRect(sx,gy-6,sw,6);ctx.fillStyle='#111';ctx.fillRect(sx+sw+8,gy-H*.2,W*.05,H*.08);ctx.fillRect(sx+sw+8+W*.022,gy-H*.12,3,H*.12);
   const wv=(80+hs(Math.floor(t/1200))*90).toFixed(1);ctx.save();ctx.shadowColor='rgba(255,60,40,.9)';ctx.shadowBlur=8;ctx.fillStyle='rgba(255,70,50,.95)';ctx.font=`500 ${Math.max(10,H*.04)}px "IBM Plex Mono",monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(wv,sx+sw+8+W*.025,gy-H*.16);ctx.restore();
   ground(gy,p.g);
   const dx=W*.9,wag=Math.sin(t/180)*4;ctx.fillStyle='#0c0c0d';ctx.beginPath();ctx.ellipse(dx,gy-5,14,6,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(dx-13,gy-9,5,0,7);ctx.fill();ctx.strokeStyle='#0c0c0d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(dx+13,gy-6);ctx.lineTo(dx+20,gy-10+wag);ctx.stroke();
   const lx=W*.5+Math.sin(t/1400)*3,ly=H*.36;ctx.strokeStyle='#08090a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,H*.3);ctx.quadraticCurveTo(W*.25,H*.36,lx,ly);ctx.quadraticCurveTo(W*.75,H*.36,W,H*.3);ctx.stroke();
   const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,H*.6);lg.addColorStop(0,`rgba(${p.lamp},.45)`);lg.addColorStop(.06,`rgba(${p.lamp},.18)`);lg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,220,170,.95)';ctx.beginPath();ctx.arc(lx,ly,3.5,0,7);ctx.fill();
   hero(W*.46,gy+2,heroScale(),stage<=1?'sit':'stand',p,t)},
  hospital(t,p,dt){ctx.fillStyle='#a9b4b2';ctx.fillRect(0,0,W,H);const vx=W*.55,vy=H*.42;
   ctx.fillStyle='#c7d0ce';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(vx+W*.08,vy-H*.06);ctx.lineTo(vx-W*.08,vy-H*.06);ctx.closePath();ctx.fill();
   ctx.fillStyle='#7d8786';ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W,H);ctx.lineTo(vx+W*.08,vy+H*.08);ctx.lineTo(vx-W*.08,vy+H*.08);ctx.closePath();ctx.fill();
   ctx.fillStyle='#93a09e';ctx.fillRect(vx-W*.08,vy-H*.06,W*.16,H*.14);
   for(let k=0;k<5;k++){const f=1-k/5,cy=vy-H*.06-(H*.42)*f*f*.9,w=W*.12*f+W*.02;let a=.95;if(k===2&&hs(Math.floor(t/80))<.15)a=.3;ctx.fillStyle=`rgba(245,255,252,${a})`;ctx.fillRect(vx-w/2,Math.max(2,cy),w,Math.max(2,6*f))}
   for(let k=0;k<3;k++){const f=1-k/3.2;ctx.fillStyle='#6e7a8a';const dx=vx-W*.08-(vx-W*.08)*f*.9,dh=H*.3*f;ctx.fillRect(dx,vy+H*.08-dh,W*.05*f,dh)}
   const gy=H*.88;ctx.fillStyle='#4e5857';ctx.fillRect(W*.14,gy-H*.12,W*.22,H*.03);ctx.fillRect(W*.15,gy-H*.09,4,H*.09);ctx.fillRect(W*.34,gy-H*.09,4,H*.09);
   hero(W*.2,gy-H*.12,heroScale(),'bench',p,t,gy)},
  temple(t,p,dt){sky(p);city(66,H*.62,H*.22,p.far,t,'255,200,150',.9);const gy=H*.86,cx=W*.58,w=Math.min(W*.8,H*1.9);
   ctx.fillStyle='#160f0d';ctx.fillRect(cx-w*.38,H*.5,w*.76,gy-H*.5);
   const ig=ctx.createLinearGradient(0,H*.53,0,gy);ig.addColorStop(0,'rgba(255,150,70,.3)');ig.addColorStop(1,'rgba(255,120,50,.06)');ctx.fillStyle=ig;ctx.fillRect(cx-w*.36,H*.53,w*.72,gy-H*.53);
   for(let k=0;k<6;k++){const x=cx-w*.33+k*w*.128;ctx.fillStyle='#2a0f0b';ctx.fillRect(x,H*.53,w*.03,gy-H*.53)}
   const roof=(y,hw,rh)=>{ctx.beginPath();ctx.moveTo(cx-hw-rh*1.4,y-rh*1.2);ctx.quadraticCurveTo(cx-hw*.7,y+rh*.2,cx-hw*.5,y);ctx.lineTo(cx+hw*.5,y);ctx.quadraticCurveTo(cx+hw*.7,y+rh*.2,cx+hw+rh*1.4,y-rh*1.2);ctx.quadraticCurveTo(cx+hw*.55,y-rh*.6,cx+hw*.35,y-rh);ctx.lineTo(cx-hw*.35,y-rh);ctx.quadraticCurveTo(cx-hw*.55,y-rh*.6,cx-hw-rh*1.4,y-rh*1.2);ctx.fill()};
   ctx.fillStyle='#0b0a0a';roof(H*.53,w*.46,H*.07);roof(H*.39,w*.3,H*.06);
   ctx.fillStyle='rgba(150,110,70,.55)';ctx.beginPath();ctx.arc(cx,H*.39-H*.08,H*.018,0,7);ctx.fill();
   for(let k=0;k<7;k++){const lx=cx-w*.3+k*w*.1,ly=H*.565+Math.sin(t/1000+k)*1.2;const g=ctx.createRadialGradient(lx,ly,0,lx,ly,16);g.addColorStop(0,'rgba(255,90,50,.95)');g.addColorStop(.35,'rgba(220,60,40,.4)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(lx-16,ly-16,32,32);ctx.fillStyle='rgba(255,140,90,.9)';ctx.beginPath();ctx.ellipse(lx,ly,4,5.5,0,0,7);ctx.fill()}
   ground(gy,p.g);
   const bx=W*.18;ctx.fillStyle='#1d1a16';ctx.fillRect(bx-W*.04,gy-H*.1,W*.08,H*.08);ctx.fillRect(bx-W*.05,gy-H*.11,W*.1,H*.015);ctx.fillRect(bx-W*.025,gy-H*.02,W*.05,H*.02);
   const em=ctx.createRadialGradient(bx,gy-H*.1,0,bx,gy-H*.1,34);em.addColorStop(0,'rgba(255,140,60,.6)');em.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=em;ctx.fillRect(bx-34,gy-H*.1-34,68,68);
   if(!RM&&Math.random()<dt*12)puffs.push({x:bx+(Math.random()-.5)*W*.05,y:gy-H*.11,a:.24,r:4+Math.random()*3,steam:1});
   const sc=heroScale();person(W*.72,gy,sc*.85,'stand',t/700,'#141518',{});person(W*.8,gy,sc*.8,'stand',t/650+2,'#17181b',{curly:1});
   walkersDraw(gy+4,dt);hero(W*.34,gy+2,sc,stage===0?'sit':'stand',p,t)},
  river(t,p,dt){sky(p);const wy=H*.6;city(77,wy,H*.26,p.far,t,'255,205,150',.86);
   const by=H*.42;ctx.fillStyle='#0d1013';ctx.fillRect(0,by,W,H*.03);for(let k=0;k<6;k++)ctx.fillRect(k*W/5-4,by,8,wy-by);
   for(let i=0;i<14;i++){const sp=(i%2?1:-1)*(.04+hs(i+2)*.05);let x=(hs(i)*W+t*sp)%W;if(x<0)x+=W;ctx.fillStyle=i%2?'rgba(255,240,200,.9)':'rgba(255,70,60,.85)';ctx.fillRect(x,by-2,3,2)}
   const g=ctx.createLinearGradient(0,wy,0,H*.8);g.addColorStop(0,tod==='day'?'#3d5466':'#0e141b');g.addColorStop(1,'#080b0f');ctx.fillStyle=g;ctx.fillRect(0,wy,W,H*.2);
   for(let i=0;i<70;i++){const x=hs(i*1.7)*W,y=wy+4+hs(i*2.3)*H*.17;const a=(.06+.22*Math.abs(Math.sin(t/700+i)))*(tod==='day'?.8:K.win+.2);ctx.fillStyle=tod==='day'?`rgba(230,240,245,${a.toFixed(3)})`:`rgba(255,${190+(hs(i)*50|0)},130,${a.toFixed(3)})`;ctx.fillRect(x+Math.sin(t/900+i)*3,y,8+hs(i+5)*18,1)}
   const gy=H*.88;ctx.fillStyle='#14181a';ctx.fillRect(0,H*.8,W,gy-H*.8);ctx.fillStyle='#1d2420';for(let i=0;i<W;i+=4){const h=4+hs(i)*8+Math.sin(t/800+i*.1)*1.5;ctx.fillRect(i,H*.8-h,2,h)}
   for(let i=0;i<2;i++){const x=(t*.02+i*W*.6)%(W+60)-30,y=H*.3+Math.sin(t/600+i)*6;ctx.strokeStyle='rgba(20,22,24,.8)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-6,y-3*Math.sin(t/150+i));ctx.lineTo(x,y);ctx.lineTo(x+6,y-3*Math.sin(t/150+i));ctx.stroke()}
   ground(gy,p.g);lamp(W*.82,gy,H*.38,p.lamp,t);hero(W*.4,gy+2,heroScale(),stage===0?'sit':'stand',p,t)},
  ximen(t,p,dt){sky(p);const gy=H*.86;const n=Math.max(4,Math.ceil(W/120)),bw=W/n;
   for(let i=0;i<n;i++){const x=i*bw,top=H*(.05+hs(i+9)*.15);ctx.fillStyle=`rgb(${16+i%3*3},14,${20+i%2*4})`;ctx.fillRect(x,top,bw-2,gy-top)}
   const sx=W*.3,sy=H*.1,sw=W*.36,sh=H*.22;const hue=(t/40)%360;ctx.fillStyle=`hsla(${hue},70%,45%,.78)`;ctx.fillRect(sx,sy,sw,sh);ctx.fillStyle='rgba(0,0,0,.18)';for(let y=sy;y<sy+sh;y+=3)ctx.fillRect(sx,y,sw,1);
   ctx.fillStyle='rgba(255,255,255,.85)';ctx.font=`700 ${Math.max(10,sh*.22)}px "Noto Sans TC",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(['今晚首映','全館八折','街頭藝人','夜貓快樂'][Math.floor(t/3000)%4],sx+sw/2,sy+sh/2);
   const sg=ctx.createRadialGradient(sx+sw/2,sy+sh/2,0,sx+sw/2,sy+sh/2,sw);sg.addColorStop(0,`hsla(${hue},80%,55%,.22)`);sg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sg;ctx.fillRect(sx-sw/2,sy-sh,sw*2,sh*3);
   const words=['電影','刺青','唱歌','服飾','鞋','藥妝','拉麵','古著'];const cl=['255,80,140','90,200,255','255,190,60','160,255,140','255,110,80'];
   for(let i=0;i<n;i++){const s2=Math.max(16,H*.06),txt=words[i%words.length],rgb=cl[i%cl.length];const x=i*bw+bw*.12,y=H*.4+hs(i)*H*.1,h2=s2*txt.length+8;let a=.9;const k=hs(Math.floor(t/(120+i*40))+i*3);if(k<.06)a=.2;
    ctx.save();ctx.shadowColor=`rgba(${rgb},${a})`;ctx.shadowBlur=14;ctx.strokeStyle=`rgba(${rgb},${a})`;ctx.lineWidth=1.5;ctx.strokeRect(x,y,s2,h2);ctx.fillStyle=`rgba(${rgb},${a})`;ctx.font=`700 ${s2*.6}px "Noto Sans TC",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';[...txt].forEach((c,j)=>ctx.fillText(c,x+s2/2,y+4+s2*.5+j*s2));ctx.restore()}
   ground(gy,p.g);const rg=ctx.createLinearGradient(0,gy,0,H);rg.addColorStop(0,`hsla(${hue},70%,50%,.16)`);rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.fillRect(0,gy,W,H-gy);
   walkersDraw(gy+4,dt);hero(W*.5,gy+2,heroScale(),'stand',p,t)},
  underpass(t,p,dt){ctx.fillStyle='#1a1d1c';ctx.fillRect(0,0,W,H);const vx=W*.5,vy=H*.46,ex=W*.12,ey=H*.1;
   ctx.fillStyle='#262a28';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(vx-ex,vy-ey);ctx.lineTo(vx-ex,vy+ey);ctx.lineTo(0,H);ctx.fill();ctx.beginPath();ctx.moveTo(W,0);ctx.lineTo(vx+ex,vy-ey);ctx.lineTo(vx+ex,vy+ey);ctx.lineTo(W,H);ctx.fill();
   ctx.fillStyle='#141716';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(vx+ex,vy-ey);ctx.lineTo(vx-ex,vy-ey);ctx.fill();
   ctx.fillStyle='#202322';ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W,H);ctx.lineTo(vx+ex,vy+ey);ctx.lineTo(vx-ex,vy+ey);ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;for(let k=1;k<10;k++){const f=k/10,lx=f*(vx-ex),ty=f*(vy-ey),by2=H-f*(H-vy-ey);ctx.beginPath();ctx.moveTo(lx,ty);ctx.lineTo(lx,by2);ctx.moveTo(W-lx,ty);ctx.lineTo(W-lx,by2);ctx.stroke()}
   const eg=ctx.createRadialGradient(vx,vy,0,vx,vy,W*.2);eg.addColorStop(0,'rgba(220,230,220,.35)');eg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=eg;ctx.fillRect(vx-ex,vy-ey,ex*2,ey*2);
   for(let k=0;k<5;k++){const f=1-k/5,y=(vy-ey)*(1-f*.9),w=W*.2*f+W*.03;let a=.95;if(k===1&&hs(Math.floor(t/90))<.22)a=.12;ctx.fillStyle=`rgba(230,245,235,${a})`;ctx.fillRect(vx-w/2,y,w,Math.max(1.5,4*f));const g=ctx.createRadialGradient(vx,y,0,vx,y,w);g.addColorStop(0,`rgba(210,240,225,${(.2*a).toFixed(3)})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(vx-w,y-w*.5,w*2,w)}
   const pc=['rgba(190,70,60,.45)','rgba(70,120,170,.45)','rgba(200,170,70,.45)'];for(let k=0;k<3;k++){const f=.2+k*.2;const x=f*(vx-ex),y=H*.32+f*H*.05;ctx.fillStyle=pc[k];ctx.fillRect(x,y,W*.09*(1-f*.8),H*.2*(1-f*.6))}
   const gy=H*.92,sc=heroScale();person(W*.8,gy,sc*.95,'sit',t/400,'#151716',{});ctx.strokeStyle='#3a2a1a';ctx.lineWidth=2*sc;ctx.beginPath();ctx.moveTo(W*.8+10*sc,gy-8*sc);ctx.lineTo(W*.8+12*sc,gy-40*sc);ctx.stroke();ctx.strokeStyle='rgba(230,220,200,.5)';ctx.lineWidth=1;const bw2=Math.sin(t/120)*6*sc;ctx.beginPath();ctx.moveTo(W*.8+2*sc+bw2,gy-24*sc);ctx.lineTo(W*.8+22*sc+bw2,gy-24*sc);ctx.stroke();
   walkersDraw(gy,dt);hero(W*.28,gy,sc,stage===0?'sit':'stand',p,t)},
  sea(t,p,dt){sky(p);const hy=H*.55;ctx.fillStyle=tod==='day'?'#2b4558':'#14202b';ctx.fillRect(0,hy,W,H-hy);
   for(let r=0;r<14;r++){const y=hy+Math.pow(r/14,1.6)*(H*.35),amp=1+r*.5;ctx.strokeStyle=`rgba(210,225,235,${(.05+r*.013).toFixed(3)})`;ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<=W;x+=8){const yy=y+Math.sin(x*.02+t/(900-r*30)+r)*amp;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy)}ctx.stroke()}
   if(tod!=='night'){const sx=tod==='dawn'?W*.2:tod==='dusk'?W*.78:W*.6;for(let i=0;i<20;i++){ctx.fillStyle=`rgba(255,210,150,${(.28-i*.012).toFixed(3)})`;ctx.fillRect(sx-10-Math.sin(t/400+i)*6,hy+i*H*.015,20+Math.sin(t/300+i)*8,1.5)}}
   ctx.fillStyle='#0b0e10';ctx.beginPath();ctx.moveTo(W*.68,hy+1);ctx.quadraticCurveTo(W*.85,hy-H*.08,W,hy-H*.1);ctx.lineTo(W,hy+1);ctx.fill();const lx=W*.9,ly=hy-H*.22;ctx.fillStyle='#d8d4c8';ctx.fillRect(lx-4,ly,8,H*.13);ctx.fillStyle='#b8402e';ctx.fillRect(lx-4,ly+H*.03,8,H*.015);
   ctx.save();ctx.translate(lx,ly);ctx.rotate(Math.PI+Math.sin(t/1400)*.7);const bg=ctx.createLinearGradient(0,0,W*.6,0);bg.addColorStop(0,`rgba(255,240,200,${tod==='day'?.08:.32})`);bg.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*.6,-H*.05);ctx.lineTo(W*.6,H*.05);ctx.fill();ctx.restore();
   for(let i=0;i<3;i++){const x=(t*.025+i*W*.4)%(W+60)-30,y=H*(.2+i*.06)+Math.sin(t/700+i)*5;ctx.strokeStyle='rgba(30,32,36,.75)';ctx.lineWidth=1.5;const f=Math.sin(t/140+i)*3;ctx.beginPath();ctx.moveTo(x-7,y-f);ctx.lineTo(x,y);ctx.lineTo(x+7,y-f);ctx.stroke()}
   const gy=H*.9;ctx.fillStyle='#0d0f10';ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,gy-H*.03);ctx.quadraticCurveTo(W*.3,gy-H*.06,W*.6,gy);ctx.lineTo(W,gy+H*.02);ctx.lineTo(W,H);ctx.fill();
   for(let i=0;i<8;i++){const x=hs(i)*W*.9,y=gy-H*.02+hs(i+1)*H*.03;const a=.15+.3*Math.abs(Math.sin(t/600+i));ctx.fillStyle=`rgba(230,240,245,${a.toFixed(2)})`;ctx.beginPath();ctx.ellipse(x,y,10+hs(i+3)*14,2,0,0,7);ctx.fill()}
   hero(W*.34,gy-H*.03,heroScale(),'stand',p,t)},
  office(t,p,dt){ctx.fillStyle='#2a2d2b';ctx.fillRect(0,0,W,H);
   const wx2=W*.6,wy2=H*.1,ww=Math.min(W*.32,H*.75),wh=H*.36;const c=SKY[tod]||['#0b0f15','#1d2530'];const g=ctx.createLinearGradient(0,wy2,0,wy2+wh);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fillRect(wx2,wy2,ww,wh);
   ctx.fillStyle='rgba(30,32,34,.7)';for(let y=wy2;y<wy2+wh;y+=7)ctx.fillRect(wx2,y,ww,3.2);ctx.strokeStyle='#1a1c1b';ctx.lineWidth=4;ctx.strokeRect(wx2,wy2,ww,wh);
   ctx.fillStyle='#4a3a2a';ctx.fillRect(W*.06,H*.12,W*.3,H*.26);const nc=['#d9d2bd','#c9b77a','#b7c7c9','#d6a99a'];for(let k=0;k<7;k++){ctx.fillStyle=nc[k%4];ctx.save();ctx.translate(W*.08+(k%4)*W*.07,H*.14+Math.floor(k/4)*H*.11);ctx.rotate((hs(k)-.5)*.15);ctx.fillRect(0,0,W*.055,H*.08);ctx.restore()}
   const fl=hs(Math.floor(t/100))<.04?.3:1;ctx.fillStyle=`rgba(235,245,240,${fl})`;ctx.fillRect(W*.3,4,W*.4,4);const lg=ctx.createRadialGradient(W*.5,8,0,W*.5,8,H*.9);lg.addColorStop(0,`rgba(225,240,235,${(.22*fl).toFixed(3)})`);lg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
   const gy=H*.88;ctx.fillStyle='#1c1e1d';ctx.fillRect(0,gy,W,H-gy);
   const dx=W*.48,dw=W*.44,dy=gy-H*.2;ctx.fillStyle='#3b3a35';ctx.fillRect(dx,dy,dw,H*.03);ctx.fillStyle='#2c2b27';ctx.fillRect(dx+6,dy+H*.03,6,gy-dy-H*.03);ctx.fillRect(dx+dw-12,dy+H*.03,6,gy-dy-H*.03);
   ctx.fillStyle='#101214';ctx.fillRect(dx+dw*.58,dy-H*.13,dw*.28,H*.11);ctx.fillStyle=`rgba(140,190,230,${(.5+.1*Math.sin(t/700)).toFixed(3)})`;ctx.fillRect(dx+dw*.6,dy-H*.12,dw*.24,H*.09);ctx.fillStyle='#101214';ctx.fillRect(dx+dw*.71,dy-H*.02,4,H*.02);
   ctx.fillStyle='#d8d2c0';for(let k=0;k<4;k++)ctx.fillRect(dx+dw*.1+k,dy-4-k*3,dw*.2,3);
   const cx=W*.26;ctx.fillStyle='#1a1b1d';ctx.fillRect(cx-W*.04,gy-H*.12,W*.09,H*.025);ctx.fillRect(cx-W*.035,gy-H*.1,4,H*.1);ctx.fillRect(cx+W*.045,gy-H*.1,4,H*.1);
   hero(cx-W*.01,gy-H*.12,heroScale(),'bench',p,t,gy)},
 };

 function sz(c,w,h){if(c.width!==w||c.height!==h){c.width=w;c.height=h}return c.getContext('2d')}
 function reflect(t,DP){const gy=Math.round(GY*DP),hD=cv.height-gy;if(hD<4)return;
  const out=['room','hospital','office','underpass'].includes(cur);if(out)return;const w=weather();const wet=w==='rain'||w==='storm'?1:w==='drizzle'?.7:0;
  let a=(tod==='night'?.26:tod==='day'?.10:.18)+wet*.16;
  const r=sz(RB,cv.width,hD);r.globalCompositeOperation='copy';r.drawImage(cv,0,Math.max(0,gy-hD),cv.width,Math.min(hD,gy),0,0,cv.width,Math.min(hD,gy));
  r.globalCompositeOperation='destination-in';const m=r.createLinearGradient(0,0,0,hD);m.addColorStop(0,'rgba(0,0,0,0)');m.addColorStop(.55,'rgba(0,0,0,.35)');m.addColorStop(1,'rgba(0,0,0,1)');r.fillStyle=m;r.fillRect(0,0,cv.width,hD);r.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;const st=Math.max(2,Math.round(3*DP)),amp=(1.2+wet*2.2)*DP;
  for(let y=0;y<hD;y+=st){const sy=hD-y-st;const dx=Math.sin(t/(380-wet*120)+y*.09/DP)*amp*(.3+y/hD);ctx.drawImage(RB,0,Math.max(0,sy),cv.width,st,dx,gy+y,cv.width,st)}
  ctx.restore()}
 function splashes(t,dt){const w=weather();if(!GY||!['rain','storm','drizzle'].includes(w)||RM)return;
  const rate={storm:70,rain:38,drizzle:14}[w]*(W/800);let n=rate*dt;while(n>0){if(Math.random()<n)splash.push({x:Math.random()*W,y:GY+3+Math.pow(Math.random(),1.4)*(H-GY-3),r:0,a:.5});n--}
  for(const s of splash){s.r+=dt*(18+ (s.y-GY)*.2);s.a-=dt*1.6;const k=.4+(s.y-GY)/(H-GY);ctx.strokeStyle=`rgba(190,205,220,${Math.max(0,s.a*.6).toFixed(3)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(s.x,s.y,Math.max(0,s.r*k),Math.max(0,s.r*k*.28),0,0,7);ctx.stroke()}
  splash=splash.filter(s=>s.a>0)}
 function post(t,DP){const cw=cv.width,ch=cv.height;
  /* 光暈：縮小兩次再放大，用 screen 疊回去 */
  const bw=Math.max(8,cw>>2),bh=Math.max(8,ch>>2),b1=sz(B1,bw,bh);b1.imageSmoothingEnabled=true;b1.globalCompositeOperation='copy';b1.drawImage(cv,0,0,bw,bh);b1.globalCompositeOperation='multiply';b1.drawImage(B1,0,0);b1.drawImage(B1,0,0);
  const cw2=Math.max(4,cw>>4),ch2=Math.max(4,ch>>4),b2=sz(B2,cw2,ch2);b2.imageSmoothingEnabled=true;b2.globalCompositeOperation='copy';b2.drawImage(B1,0,0,cw2,ch2);
  const bright=cur==='hospital'?0:tod==='day'?.25:cur==='office'?.3:.9;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;
  if(bright){ctx.globalCompositeOperation='screen';ctx.globalAlpha=bright;ctx.drawImage(B2,0,0,cw,ch);ctx.globalAlpha=bright*.55;ctx.drawImage(B1,0,0,cw,ch)}
  /* 鏡頭：很慢的推近與漂移 */
  if(!RM){ctx.globalCompositeOperation='copy';ctx.globalAlpha=1;const c=sz(CB,cw,ch);c.globalCompositeOperation='copy';c.drawImage(cv,0,0);
  const z=1.035+.012*Math.sin(t/23000),ox=Math.sin(t/31000)*cw*.008,oy=Math.sin(t/27000+1)*ch*.005;
  ctx.translate(cw/2+ox,ch/2+oy);ctx.scale(z,z);ctx.drawImage(CB,-cw/2,-ch/2)}
  ctx.restore();ctx.setTransform(DP,0,0,DP,0,0)}
 function frame(now){
  if(!document.hidden)requestAnimationFrame(frame);
  const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;const t=now;
  const p=PAL[cur]||PAL.bridge;GY=null;
  (D[cur]||D.bridge)(t,p,dt);
  drawExtras(t,p);
  const DP=cv.width/W;if(FX.on&&GY)reflect(t,DP);
  if(tod!=='night'&&!['hospital','room','office','underpass'].includes(cur)){ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle={day:'rgba(105,118,128,.30)',dawn:'rgba(120,80,85,.16)',dusk:'rgba(125,72,50,.16)'}[tod]||'rgba(0,0,0,0)';ctx.fillRect(0,0,W,H);ctx.restore()}
  for(const q of parts){
   if(q.k==='rain'||q.k==='drizzle'||q.k==='storm'){const sl=q.k==='storm'?.45:.12;q.y+=q.v*dt;q.x-=q.v*dt*sl;ctx.strokeStyle=q.k==='storm'?'rgba(180,198,218,.45)':q.k==='rain'?'rgba(170,190,212,.38)':'rgba(170,190,212,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.l*sl,q.y+q.l);ctx.stroke()}
   else if(q.k==='leaf'){q.y+=q.v*dt;q.x+=q.vx*dt+Math.sin(t/500+q.r)*.4;q.r+=q.vr*dt;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.r);ctx.fillStyle='rgba(150,108,58,.75)';ctx.beginPath();ctx.ellipse(0,0,4,2,0,0,7);ctx.fill();ctx.restore()}
   else{q.y+=q.v*dt;q.x+=Math.sin(t/1400+q.y*.02)*.2;ctx.fillStyle=`rgba(255,214,160,${q.a})`;ctx.fillRect(q.x,q.y,1.6,1.6)}
   if(q.y>H+20||q.y<-30||q.x<-30){Object.assign(q,newP(false));if(q.k==='storm')q.x=Math.random()*W*1.5}
  }
  for(const f of puffs){f.y-=(f.steam?22:10)*dt;f.x+=(f.steam?Math.sin(t/400+f.r)*.3:6*dt);f.r+=(f.steam?8:5)*dt;f.a-=(f.steam?.12:.18)*dt;ctx.fillStyle=`rgba(220,225,230,${Math.max(0,f.a).toFixed(3)})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.fill()}
  puffs=puffs.filter(f=>f.a>0);
  splashes(t,dt);
  if(wx==='storm'&&!RM&&Math.random()<dt*.22)lightning=1
  if(lightning>0){ctx.fillStyle=`rgba(225,232,255,${(lightning*.42).toFixed(3)})`;ctx.fillRect(0,0,W,H);lightning=Math.max(0,lightning-dt*3.2)}
  const tint={冬:'rgba(70,100,150,.10)',夏:'rgba(200,120,40,.07)',春:'rgba(110,150,120,.05)',秋:'rgba(160,110,60,.05)'}[season];
  if(cur!=='hospital'&&tint){ctx.fillStyle=tint;ctx.fillRect(0,0,W,H)}
  if(FX.on)post(t,DP);
  const vg=ctx.createRadialGradient(W/2,H*.55,Math.min(W,H)*.3,W/2,H*.55,Math.max(W,H)*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,cur==='hospital'||tod==='day'?'rgba(0,0,0,.35)':'rgba(0,0,0,.62)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(grain){ctx.save();ctx.globalAlpha=.055;ctx.translate((Math.random()*128)|0,(Math.random()*128)|0);ctx.fillStyle=grain;ctx.fillRect(-128,-128,W+256,H+256);ctx.restore()}
  if(prev&&fade<1){fade=Math.min(1,fade+dt/.9);ctx.save();ctx.globalAlpha=1-fade;ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(prev,0,0);ctx.restore();const Dp=cv.width/W;ctx.setTransform(Dp,0,0,Dp,0,0)}
  if(flash>0){flash=Math.max(0,flash-dt*1.6);ctx.fillStyle=`rgba(170,30,20,${(flash*.35).toFixed(3)})`;ctx.fillRect(0,0,W,H)}
  if(FX.on){FX.acc+=dt;FX.n++;if(FX.n>=90){if(FX.acc/FX.n>.028)FX.slow++;else FX.slow=Math.max(0,FX.slow-1);if(FX.slow>=3)FX.on=false;FX.acc=0;FX.n=0}}
 }
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){last=performance.now();requestAnimationFrame(frame)}});
 new ResizeObserver(resize).observe(cv);
 resize();requestAnimationFrame(frame);
 return {
  set(id,o){const nt=o.tod||'night',nw=o.weather||null;const changed=id!==cur||o.season!==season||nt!==tod||nw!==wx;
   if(changed&&cv.width>2){prev=document.createElement('canvas');prev.width=cv.width;prev.height=cv.height;prev.getContext('2d').drawImage(cv,0,0);fade=0}
   cur=id;season=o.season;stage=o.stage;hat=!!o.hat;tod=nt;K=TODK[tod]||TODK.night;wx=nw;npc=o.npc||null;dog=!!o.dog;look=o.look||{};heroPos={x:0,gy:0,s:0,pose:'stand'};if(changed)init();window.__amb&&window.__amb.update(id,{season:o.season,tod:nt,weather:nw})},
  hit(){flash=1}
 };
})();


/* ───────── 環境音（全部即時合成，不載入任何音檔） ───────── */
const Ambient=(()=>{
 let ac=null,master=null,verb=null,on=false,active=null,NB={};
 function nbuf(type){const len=ac.sampleRate*4,b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);let l=0,b0=0,b1=0,b2=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;if(type==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.5}else if(type==='pink'){b0=.99765*b0+w*.099046;b1=.963*b1+w*.2965164;b2=.57*b2+w*1.0526913;d[i]=(b0+b1+b2+w*.1848)*.11}else d[i]=w}
  return b}
 function init(){
  ac=new (window.AudioContext||window.webkitAudioContext)();
  master=ac.createGain();master.gain.value=2.2;const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;master.connect(comp);comp.connect(ac.destination);
  verb=ac.createConvolver();const len=ac.sampleRate*2.6,ir=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}verb.buffer=ir;verb.connect(master);
  NB={white:nbuf('white'),pink:nbuf('pink'),brown:nbuf('brown')};
 }
 function Scape(wet){const g=ac.createGain();g.gain.value=0;g.connect(master);const s=ac.createGain();s.gain.value=wet||0;g.connect(s);s.connect(verb);
  const timers=[];let alive=true;
  const api={out:g,
   every(fn,min,max){const tick=()=>{if(!alive)return;fn();timers.push(setTimeout(tick,min+Math.random()*(max-min)))};timers.push(setTimeout(tick,Math.random()*max*.6))},
   fadeIn(v){g.gain.setTargetAtTime(v,ac.currentTime,.8)},
   stop(){alive=false;timers.forEach(clearTimeout);g.gain.setTargetAtTime(0,ac.currentTime,.6);setTimeout(()=>{try{g.disconnect();s.disconnect()}catch(e){}},2600)}};
  return api}
 function env(dest,t,a,peak,dec){const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);g.connect(dest);return g}
 function tone(dest,freq,type,t,a,peak,dec){const o=ac.createOscillator();o.type=type;o.frequency.value=freq;const g=env(dest,t,a,peak,dec);o.connect(g);o.start(t);o.stop(t+a+dec+.05);return o}
 function burst(dest,type,ft,freq,q,t,a,peak,dec,sweep){const s=ac.createBufferSource();s.buffer=NB[type];const f=ac.createBiquadFilter();f.type=ft;f.frequency.value=freq;f.Q.value=q;if(sweep)f.frequency.exponentialRampToValueAtTime(sweep,t+a+dec);const g=env(dest,t,a,peak,dec);s.connect(f);f.connect(g);s.start(t,Math.random()*2);s.stop(t+a+dec+.1)}
 /* 背景音樂：慢的鋼琴分解和弦，整局同一首，不隨場景切換 */
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function key(dest,m,t,v){const f=hz(m);[[1,1,3.2],[2,.32,2.2],[3,.12,1.4],[4,.05,.9]].forEach(([h,a,d],i)=>tone(dest,f*h*(1+(Math.random()-.5)*.0016),i?'sine':'triangle',t,.006,v*a,d*(m<48?1.4:1)))}
 const BARS=[[41,[53,57,60,64]],[40,[52,55,59,62]],[38,[50,53,57,60]],[36,[48,52,55,59]],[45,[57,60,64,67]],[41,[53,57,60,64]],[43,[55,59,62,67]],[36,[48,52,55,60]]];
 const ARP=[0,1,2,3,2,1,2,3],STEP=.55;
 function piano(sc,v){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;lp.connect(sc.out);let n=0;
  sc.every(()=>{const [bass,ch]=BARS[Math.floor(n/8)%BARS.length],k=n%8,t=ac.currentTime+.05;
   if(k===0)key(lp,bass,t,v*.9);
   if(!(k===7&&Math.random()<.5))key(lp,ch[ARP[k]],t,v*(k%4===0?.75:.55));
   if((k===0||k===4)&&Math.random()<.3)key(lp,ch[Math.floor(Math.random()*4)]+12,t+STEP*.5,v*.45);
   n++},STEP*1000,STEP*1000)}
 function build(){if(active)return;const sc=Scape(.3);piano(sc,.03);sc.fadeIn(1);active=sc}
 return {
  update(){if(on)build()},
  toggle(){if(!ac){try{init()}catch(e){return false}}on=!on;if(on){ac.resume();build()}else if(active){active.stop();active=null}return on},
  isOn:()=>on,
  sfx(name){if(!on||!ac)return;const t=ac.currentTime;
   if(name==='ding'){tone(master,1320,'sine',t,.005,.12,.25);tone(master,1980,'sine',t+.06,.005,.08,.3)}
   else if(name==='buzz'){tone(master,140,'square',t,.005,.08,.35)}
   else if(name==='clunk'){burst(master,'brown','lowpass',400,1,t,.002,.35,.25);tone(master,180,'sine',t,.002,.2,.3)}
   else if(name==='coin'){tone(master,1760,'triangle',t,.002,.08,.12);tone(master,2350,'triangle',t+.07,.002,.07,.2)}}
 };
})();

window.__amb=Ambient;
