# 橋下一年 — 開發說明（給接手的 Claude）

台灣萬華背景的文字 RPG：街友兩年內往上爬，寫實、殘酷、抉擇有後果。玩家說繁體中文（台灣用語），所有遊戲文字都用繁體中文、台灣口語。

## 檔案

- `index.html`：**唯一的正式檔案**。單一 HTML，沒有後端、沒有外部函式庫（只載入 Google Fonts）。全部在瀏覽器裡跑，存檔放 localStorage。
- `tests/`：Node 模擬和 Playwright 瀏覽器測試。
- `history/ext*.js`：歷次擴充的原始片段，僅供參考，已經全部合進 index.html。

已發布的版本：claude.ai Artifact「橋下一年」（`https://claude.ai/artifact/XRKMqwTc3sZoq4d3cZ1XZc`）。從別的對話更新時，要帶這個 URL 發布，否則會變成新的頁面。

## index.html 的結構

1. `<style>`：CSS 變數在 `:root`（深色、鈉燈色系），版面是左邊動畫、右邊帳本＋劇情。手機版（≤860px）上下排。
2. `<script id="logic">`：遊戲邏輯 IIFE `G`，最後 `if(typeof module!=='undefined')module.exports=G`，所以可以直接被 Node `require`。
3. 第二個 `<script>`：`Scene`（Canvas 程序繪圖的 15 個場景＋後製光暈/倒影/鏡頭）、`Ambient`（WebAudio 即時合成環境音）、UI（HUD、事件、地圖、小遊戲、背包、圖鑑、結局）。

## 邏輯的寫法（重要）

- 擴充方式是在 IIFE 結尾 `return {…}` 之前**追加區塊**，用「重新指派函式」的方式包裝舊函式，例如：
  `{const A0=apply;apply=function(S,r){const out=A0(S,r); …; return out}}`
  被包過的函式：apply、choose、upkeep、advance、view、meet、npcsAt、epilogue2、endingText3、tenYears、legacyText、takeJob、quitJob、people。
- 事件：`EV[id]={scene,tod,title,text,ch:[{t,req,show,r}]}`。`r` 可以是物件或 `(S,R)=>物件`。結果欄位：hp/mind/con/rep/addict/money/heat、set（旗標）、job、house、log、days、noIncome、addInc（兼差）、trust:{npc:數值}、next、end。
- 章節流程 `PLAN`（6 章），`ins(ch,afterId,...ids)` 插入事件；`FILL` 是隨機填充事件（可帶 loc 出現在地圖）；`FATES` 是 NPC 自己的命運；節慶 `FEST` 依日期觸發。
- 狀態 `S`：存檔版本 `S.v=10`，存檔鍵 `qiaoxia.save.v10`。**改結構時要相容舊存檔**（用 lazy init，例如 `invOf(S)`），不要隨便升版本號，玩家的進度會不見。
- 其他 localStorage 鍵：`qiaoxia.endings.v1`（已解鎖結局）、`qiaoxia.last.v1`（前世）、`qiaoxia.ach.v1`（成就）、`qiaoxia.meta.v1`（玩過的出身）、`qiaoxia.diff`。

## 系統一覽

出身 5 種（退休老師需解鎖）、難度 3 種、開局卡、世界狀態、生活方針；經濟（臨時工約一半日子有工、房租、伙食、被偷、意外支出）；正職一份＋兼差最多兩份；生意 5 種×3 階；貸款（銀行/錢莊/阿凱）；黑道路線、政治路線、社福路線、補校、離開台北；萬華地圖 9 個地點、找工作、找人（信任）；小遊戲 3 個；背包與當舖（傳家物、90 天流當、被偷、賣身分證）；成就 19 個；結局 37 個（含提示）；轉捩點回顧；十年後；前世。

## 修改後一定要做的檢查

```
cd tests
node extract.js                 # 從 index.html 抽出 logic.js
node sim16.js rand              # 6000 輪隨機玩，err 必須是 0
node sim16.js gang              # 專走黑道
node econ4.js ./logic.js 600 street   # 謹慎玩家的經濟曲線，看有沒有變太簡單或太難
npm i playwright && node shot4.js     # 瀏覽器完整玩一輪（需要 Chromium；可用環境變數 CHROME 指定路徑）
node scshot.js out              # 15 個場景截圖（先 mkdir out）
```

平衡參考值（改動前後要比對）：謹慎玩家在「街頭」難度死亡率約 0%、第六章開始時身價中位數約 50 萬；隨機玩的結局分布不應有大幅跳動。

## 寫作原則

- 選項要難選：沒有明顯的最佳解，好心常常有代價，壞事常常有甜頭。
- 劇情前後要一致：寫新事件時，檢查角色是否還在（例如阿凱被抓 `kaiGone`/`kaiJail`、老鄭死亡 `zhengFate==='dead'`）、玩家是否已經有房子（`housed(S)`）。
- 不要讓錢變得太好賺，玩家明確說過不要數字型的債務系統。
