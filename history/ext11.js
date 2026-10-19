
/* ═════════ 修正：阿凱被帶走以後，事件不要再讓他出現 ═════════ */
const KG=S=>F(S,'kaiGone');
const KAIFIX=[
 ['阿凱說，大家在等你一句話。','阿凱{GONE}以後，接手管人的是阿虎。他說，大家在等你一句話。'],
 ['最後只剩下阿凱，然後阿凱也不見了。','{SENT}，就沒有人會替你擋了。最後，連阿虎也不見了。'],
 ['華西街現在是阿凱的。他每年託人送一條菸進來，從來沒有來看過你。','華西街現在是阿虎的。他每年託人送一條菸進來，從來沒有來看過你。'],
 ['阿凱一直在你身邊。你不知道他在等什麼。','阿凱{OUT}，去了中南部。他沒有再找過你，你也沒有找他。'],
 ['阿凱在一次火拼裡受了傷，現在在三重開計程車。','阿凱{OUT}，在三重開計程車。有一次你坐上他的車，你們一路都沒有說話。'],
 ['你燒了一整晚。阿凱說你太膽小。','你燒了一整晚。阿虎說你太膽小。'],
 ['他們撤回了。你沒問阿凱用了什麼方法。','他們撤回了。你沒問阿虎用了什麼方法。'],
 ['阿凱在人群裡跟你招手，強哥承包了今年的普渡攤位；','強哥的人承包了今年的普渡攤位；'],
 ['他身邊那個拿著扇子、一直在講電話的人，你認得，是阿凱的手下。','他身邊那個拿著扇子、一直在講電話的人，你認得，是三重的人。'],
 ['阿凱的手下擋在你們中間','三重的人擋在你們中間']
];
function noKai(S,t){if(!KG(S)||typeof t!=='string')return t;const j=F(S,'kaiJail');for(const [a,b] of KAIFIX)t=t.split(a).join(b.replace('{GONE}',j?'進去':'帶著人走了').replace('{SENT}',j?'你把阿凱送進去以後':'阿凱帶著人走了以後').replace('{OUT}',j?'出獄以後':'離開萬華以後'));return t}
{const c=EV.b6_betray.ch.find(x=>/把阿凱的帳交給警察/.test(x.t));const r0=c.r;c.r=typeof r0==='function'?(S,R)=>{const r=r0(S,R);return {...r,set:{...(r.set||{}),kaiJail:1}}}:{...r0,set:{...(r0.set||{}),kaiJail:1}}}
{const V0=view;view=function(S,id){const v=V0(S,id);if(KG(S)){v.text=noKai(S,v.text);v.choices.forEach(c=>c.t=noKai(S,c.t))}return v}}
{const C2=choose;choose=function(S,id,i,R){const kg=KG(S);const out=C2(S,id,i,R);if(out&&out.text&&kg)out.text=noKai(S,out.text);return out}}
{const E3=endingText3;endingText3=function(S,key){return noKai(S,E3(S,key))}}
{const T0=tenYears;tenYears=function(S,key){return T0(S,key).map(x=>noKai(S,x))}}
{const E2=epilogue2;epilogue2=function(S){return E2(S).map(x=>noKai(S,x))}}
/* 阿凱不在了，就不能再「透過阿凱」或「幫阿凱」做事 */
{const c=EV.s_recruit.ch.find(x=>/透過阿凱/.test(x.t));const s0=c.show;c.show=S=>!KG(S)&&(!s0||s0(S))}
{const c=EV.fest_ghost.ch.find(x=>/幫阿凱/.test(x.t));const s0=c.show;c.show=S=>!KG(S)&&s0(S)}
{const f=FILL.find(x=>x.id==='lk_lin_kai');const c0=f.cond;f.cond=S=>!KG(S)&&c0(S)}
