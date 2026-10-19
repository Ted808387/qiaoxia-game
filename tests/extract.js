// 把 js/logic.js 複製成 tests/logic.js，給 Node 模擬用
const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'..','js','logic.js'),'utf8');
fs.writeFileSync(path.join(__dirname,'logic.js'),s);console.log('logic.js',s.length,'bytes');
