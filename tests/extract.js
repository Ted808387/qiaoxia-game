// 從 index.html 抽出遊戲邏輯，存成 tests/logic.js，給 Node 模擬用
const fs=require('fs'),path=require('path');
const h=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const a=h.indexOf('<script id="logic">')+'<script id="logic">'.length,b=h.indexOf('</script>',a);
fs.writeFileSync(path.join(__dirname,'logic.js'),h.slice(a,b));console.log('logic.js',b-a,'bytes');
