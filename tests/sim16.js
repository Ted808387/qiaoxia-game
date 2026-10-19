const G=require(process.env.LG||'./logic.js');
const ORS=Object.keys(G.ORIGINS),DF=Object.keys(G.DIFF),MD=Object.keys(G.MODES),EN=Object.keys(G.ENDINGS);
let err=0;const ach={};let tpc=0;const cnt={},seen=new Set();let meets=0,jobs=0;
const pol=process.argv[2]||'rand';
for(let r=0;r<6000;r++){const o=ORS[r%ORS.length],d=pol==='gang'?'street':DF[r%3];const S=G.newState(o,d,{legacy:r%4?null:{origin:'debt',oname:'x',ending:EN[r%EN.length],day:300}});G.applyCard(S,G.drawCards()[0]);let n=0;
 try{while(n<400){const a=G.advance(S);
  if(a.type==='end'){cnt[a.key]=(cnt[a.key]||0)+1;const t=G.endingText(S,a.key);if(!t||/undefined/.test(t))throw 'endtext '+a.key;G.epilogue(S);G.people(S);const ty=G.tenYears(S,a.key);if(G.achCheck){const ac=G.achCheck(S,a.key,{got:[],origins:[]});ac.forEach(x=>ach[x]=(ach[x]||0)+1);const tp=G.turning(S);tpc+=tp.length;G.items(S)}if(ty.some(x=>!x||/undefined/.test(x)))throw 'ten '+a.key;break}
  if(G.items&&Math.random()<.15){const it=G.items(S);const p=it.find(x=>x.status==='have'&&!x.fixed);if(p&&S.money<500)G.pawnItem(S,p.id);const q=it.find(x=>x.status==='pawned');if(q&&S.money>q.cost+3000)G.redeemItem(S,q.id);if(Math.random()<.01)G.sellID(S)}
  if(a.type==='chapter'){S.mode=MD[Math.floor(Math.random()*5)];continue}
  let id=a.id;
  if(a.type==='map'){const info=G.mapInfo(S).filter(x=>x.open);const L=info[Math.floor(Math.random()*info.length)];
   const js=G.jobsAt(S,L.key).filter(j=>j.ok);if(js.length&&Math.random()<.3){G.takeJob(S,js[Math.floor(Math.random()*js.length)].key);jobs++}
   const ppl=G.npcsAt(S,L.key);if(ppl.length&&Math.random()<.35){const p=ppl[0];const ac=p.acts.filter(x=>x.ok);const x=ac[Math.floor(Math.random()*ac.length)];const res=G.meet(S,p.id,x.key);if(!res)throw 'meet null';meets++;n++;continue}
   if(L.mini&&Math.random()<.25){G.finishMini(S,L.mini.game,G.simMini(S,L.mini.game));n++;continue}
   id=G.visit(S,L.key)}
  const v=G.view(S,id);seen.add(id);if(!v.text)throw 'empty '+id;
  const ok=v.choices.map((c,i)=>c.ok?i:-1).filter(i=>i>=0);
  let i=ok[Math.floor(Math.random()*ok.length)];
  if(pol==='gang'){const g=ok.find(k=>/強哥|阿龍|跟他走|收帳|接手強哥|照規矩|拒絕|開戰|談判|議員|幫他買票|用自己的錢|錢莊|接$/.test(v.choices[k].t)&&!/頂下來|汙點/.test(v.choices[k].t));if(g!=null)i=g}
  const res=G.choose(S,id,i);if(!res)throw 'null '+id;if(res.mini)G.finishMini(S,res.mini,G.simMini(S,res.mini));n++}
  if(n>=400)throw 'loop'}catch(e){err++;if(err<5)console.log(o,e,e.stack&&e.stack.split('\n').slice(1,3).join('|'))}}
console.log(pol,'err',err,'meets/run',(meets/6000).toFixed(1),'jobs/run',(jobs/6000).toFixed(1));console.log(JSON.stringify(cnt));
console.log('ach',JSON.stringify(ach),'tp/run',(tpc/6000).toFixed(2));console.log('unseen',Object.keys(G.EV).filter(k=>!seen.has(k)).join(','));
