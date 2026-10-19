const G=require(process.argv[2]||'./logic.js');
const ORS=['debt','excon','injury','family','teacher'];
function greedy(S,id){const v=G.view(S,id);let best=0,bv=-1e18;v.choices.forEach((c,i)=>{if(!c.ok)return;const T=JSON.parse(JSON.stringify(S));const r=G.choose(T,id,i,()=>.5);if(!r||r.mini)return;const sc=-T.heat*1e6+T.money+T.hp*900+T.mind*700+(T.house?3000:0)+(T.biz?50000:0);if(sc>bv){bv=sc;best=i}});return best}
const snaps={},ends={};const N=+process.argv[3]||600;let deaths=0;
for(let r=0;r<N;r++){const S=G.newState(ORS[r%5],process.argv[4]||'street');S.mode='normal';
 while(true){const a=G.advance(S);if(a.type==='end'){ends[a.key]=(ends[a.key]||0)+1;if(a.key==='dead'||a.key==='broken')deaths++;break}
  if(a.type==='chapter'){(snaps[a.ch]=snaps[a.ch]||[]).push(S.money);S.mode=process.argv[5]||'normal';continue}
  let id=a.id;if(a.type==='map'){const info=G.mapInfo(S).filter(x=>x.open);const y=info.find(x=>x.key==='yard');if(Math.random()<.3){G.finishMini(S,'scale',G.simMini(S,'scale'));continue}id=G.visit(S,info[Math.floor(Math.random()*info.length)].key)}
  const i=greedy(S,id);const res=G.choose(S,id,i);if(res&&res.mini)G.finishMini(S,res.mini,G.simMini(S,res.mini))}
 (snaps.end=snaps.end||[]).push(S.money)}
const med=a=>{a=a.slice().sort((x,y)=>x-y);return a[a.length>>1]};const p=(a,q)=>{a=a.slice().sort((x,y)=>x-y);return a[Math.floor(a.length*q)]};
for(const k in snaps)console.log('start ch',k,'median',med(snaps[k]),'p25',p(snaps[k],.25),'p75',p(snaps[k],.75));
console.log(JSON.stringify(ends),'deaths',(deaths/N*100).toFixed(0)+'%');
